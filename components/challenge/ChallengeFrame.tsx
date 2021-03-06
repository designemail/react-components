import React, { MutableRefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useConfig } from '../../index';
import { getChallengeURL, handleEvent, normalizeSelectOptions } from './challengeHelper';

const ERROR_TIMEOUT_MS = 10000;
const CHALLENGE_TIMEOUT_MS = 7000;

export type ChallengeResult = { [key: string]: string } | undefined;

export interface ChallengeRef {
    getChallenge: () => Promise<ChallengeResult>;
}

export interface Props
    extends Omit<React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>, 'onClick'> {
    challengeRef: MutableRefObject<ChallengeRef | undefined>;
    children: React.ReactNode;
    src: string;
    className?: string;
    innerClassName?: string;
    bodyClassName?: string;
    title?: string;
    type: number;
    onError?: () => void;
    onLoaded?: () => void;
}
const ChallengeFrame = ({
    type,
    onLoaded,
    onError,
    title,
    children,
    className,
    bodyClassName = '',
    innerClassName = '',
    challengeRef,
    src,
    ...rest
}: Props) => {
    const config = useConfig();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const renderDivRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

    const targetOrigin = useMemo(() => {
        return new URL(src).origin;
    }, [src]);

    useLayoutEffect(() => {
        renderDivRef.current = document.createElement('DIV') as HTMLDivElement;

        let error = false;
        const handleError = () => {
            error = true;
            onError?.();
        };
        let errorTimeout = window.setTimeout(handleError, ERROR_TIMEOUT_MS);

        const challengeUrlSrc = getChallengeURL(config.API_URL, type).toString();
        const styleSrcs = [...document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')].map((x) => {
            return new URL(x.href, window.location.origin).toString();
        });
        const scriptSrcs = [challengeUrlSrc];
        let challengeError = false;

        let challengeResolve: (data: { [key: string]: string }) => void;

        const assetsTotal = scriptSrcs.length + styleSrcs.length;
        let assetsLoaded = 0;

        const handleInitDone = () => {
            clearTimeout(errorTimeout);
            setIsLoaded(true);
            onLoaded?.();
        };

        const handleAssetLoaded = () => {
            if (++assetsLoaded === assetsTotal) {
                handleInitDone();
            }
        };

        const handleAssetError = (src: string) => {
            if (src === challengeUrlSrc) {
                challengeError = true;
                // Treat the challenge misloading as ok
                handleAssetLoaded();
                return;
            }
            // Otherwise it's a CSS error and a hard failure
            handleError();
        };

        const cb = (event: MessageEvent) => {
            const contentWindow = iframeRef.current?.contentWindow;
            if (error || !contentWindow || event.origin !== targetOrigin || event.source !== contentWindow) {
                return;
            }

            const eventData = event.data;
            const eventDataType = eventData?.type;
            const eventDataPayload = eventData?.payload;

            if (eventDataType === 'init') {
                if (!contentWindow) {
                    handleError();
                    return;
                }

                clearTimeout(errorTimeout);
                errorTimeout = window.setTimeout(handleError, ERROR_TIMEOUT_MS);

                contentWindow.postMessage(
                    {
                        type: 'load',
                        payload: {
                            styles: styleSrcs,
                            scripts: scriptSrcs,
                            bodyClassName,
                        },
                    },
                    targetOrigin
                );
            }

            if (eventDataType === 'rect' && eventDataPayload?.height !== undefined && iframeRef.current) {
                iframeRef.current.style.height = `${eventDataPayload.height}px`;
            }

            if (eventDataType === 'onload') {
                handleAssetLoaded();
            }

            if (eventDataType === 'onerror') {
                handleAssetError(eventDataPayload);
            }

            if (eventDataType === 'event') {
                handleEvent(renderDivRef.current, eventDataPayload);
            }

            if (eventDataType === 'child.message.data') {
                const messageData = eventData.data;
                if (!messageData) {
                    return;
                }
                challengeResolve?.({
                    [messageData.id]: messageData.fingerprint,
                });
            }
        };

        challengeRef.current = {
            getChallenge: () => {
                return new Promise((resolve, reject) => {
                    if (challengeError) {
                        return resolve();
                    }
                    const contentWindow = iframeRef.current?.contentWindow;
                    if (!contentWindow) {
                        return reject(new Error('No iframe available'));
                    }
                    challengeResolve = resolve;
                    contentWindow.postMessage(
                        {
                            type: 'env.loaded',
                            data: {
                                targetOrigin: window.location.origin,
                            },
                        },
                        targetOrigin
                    );
                    contentWindow.postMessage(
                        {
                            type: 'submit.broadcast',
                        },
                        targetOrigin
                    );
                    window.setTimeout(() => {
                        reject(new Error('Challenge timeout'));
                    }, CHALLENGE_TIMEOUT_MS);
                });
            },
        };

        window.addEventListener('message', cb);
        return () => {
            window.removeEventListener('message', cb);
        };
    }, []);

    useLayoutEffect(() => {
        const contentWindow = iframeRef.current?.contentWindow;
        const renderEl = renderDivRef.current;
        if (!renderEl || !contentWindow || !isLoaded) {
            return;
        }
        renderEl.className = innerClassName;
        ReactDOM.render(children as any, renderEl, () => {
            normalizeSelectOptions(renderEl);
            contentWindow.postMessage(
                {
                    type: 'html',
                    payload: renderEl.outerHTML,
                },
                targetOrigin
            );
        });
    }, [isLoaded, children, iframeRef.current]);

    return (
        <iframe
            {...rest}
            src={src}
            ref={iframeRef}
            title={title}
            className={className}
            sandbox="allow-scripts allow-same-origin allow-popups"
        />
    );
};

export default ChallengeFrame;

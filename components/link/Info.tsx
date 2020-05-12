import React, { useState } from 'react';

import { generateUID, classnames } from '../../helpers/component';
import Icon from '../icon/Icon';
import { usePopper, Popper, usePopperAnchor } from '../popper';
import useRightToLeft from '../../containers/rightToLeft/useRightToLeft';

interface Props {
    originalPlacement?: 'top' | 'bottom' | 'left' | 'right';
    url?: string;
    title?: string;
    buttonClass?: string;
    scrollContainerClass?: string;
}
const Info = ({
    url,
    title = undefined,
    originalPlacement = 'top',
    scrollContainerClass = 'main',
    buttonClass = 'inline-flex color-currentColor flex-item-noshrink',
    ...rest
}: Props) => {
    const [uid] = useState(generateUID('tooltip'));

    const { isRTL } = useRightToLeft();
    const rtlAdjustedPlacement = originalPlacement.includes('right')
        ? originalPlacement.replace('right', 'left')
        : originalPlacement.replace('left', 'right');

    const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
    const { anchorRef, open, close, isOpen } = usePopperAnchor<HTMLButtonElement>();
    const { position, placement } = usePopper({
        popperEl,
        anchorEl: anchorRef?.current,
        isOpen,
        originalPlacement: isRTL ? rtlAdjustedPlacement : originalPlacement,
        scrollContainerClass
    });

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        url && window.open(url);
    };

    return (
        <>
            <button
                tabIndex={-1}
                className={buttonClass}
                onClick={handleClick}
                ref={anchorRef}
                onMouseEnter={open}
                onMouseLeave={close}
                onFocus={open}
                onBlur={close}
                aria-describedby={uid}
                type="button"
            >
                <Icon className="icon-16p color-primary" name="info" {...rest} />
            </button>
            {title && isOpen ? (
                <Popper
                    divRef={setPopperEl}
                    id={uid}
                    isOpen={isOpen}
                    style={position}
                    className={classnames(['tooltip', `tooltip--${placement}`])}
                >
                    {title}
                </Popper>
            ) : null}
        </>
    );
};

export default Info;

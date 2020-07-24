import React, { useState, useRef, useEffect } from 'react';
import { c } from 'ttag';
import { Link, SettingsTitle, useUser, useConfig, useSubscription, useOrganization, useUserSettings } from '../..';
import { hasMailPlus } from 'proton-shared/lib/helpers/subscription';
import { APPS } from 'proton-shared/lib/constants';

import SummarySection from './SummarySection';
import IndexSection from './IndexSection';

interface Props {
    title: string;
    pages: SettingsConfig[];
    children?: React.ReactNode;
}

const OverviewLayout = ({ title, pages, children }: Props) => {
    const mainAreaRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState<number>(0);
    const { APP_NAME } = useConfig();
    const [user] = useUser();
    const [userSettings = {}] = useUserSettings();
    const [organization = {}] = useOrganization();
    const [subscription = {}] = useSubscription();
    const { isFree } = user;

    useEffect(() => {
        if (mainAreaRef.current) {
            mainAreaRef.current.scrollTop = 0;
        }
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    return (
        <div className="flex flex-item-fluid ondesktop-h100 ontablet-flex-column flex-nowrap">
            <div
                ref={mainAreaRef}
                onScroll={handleScroll}
                className="relative flex-nowrap flex-item-fluid bg-global-highlight ondesktop-h100 scroll-if-needed"
            >
                <SettingsTitle onTop={!scrollTop}>{title}</SettingsTitle>
                <div className="container-section-sticky pt0">
                    <div className="flex onmobile-flex-column pb2">
                        <div className="flex-item-fluid">
                            {children ? (
                                <section className="overview-grid-item overview-grid-item--full bordered-container bg-white-dm tiny-shadow-container p2 mb1-5">
                                    {children}
                                </section>
                            ) : null}
                            <IndexSection pages={pages} />
                        </div>
                    </div>
                </div>
            </div>
            <aside className="context-bar ondesktop-h100 scroll-if-needed p2">
                <SummarySection
                    user={user}
                    userSettings={userSettings}
                    subscription={subscription}
                    organization={organization}
                />
                {hasMailPlus(subscription) ? (
                    <div className="bg-pm-blue-gradient color-white rounded aligncenter p1 mt2 relative">
                        <p className="mt0 mb1">
                            {c('Info')
                                .t`Upgrade to a paid plan with multi-user support to add more users to your organization.`}
                        </p>
                        <div>
                            <Link
                                className="pm-button--transparent inbl increase-surface-click"
                                to="/subscription"
                                external={APP_NAME !== APPS.PROTONACCOUNT}
                            >
                                {c('Action').t`Upgrade`}
                            </Link>
                        </div>
                    </div>
                ) : null}
                {isFree ? (
                    <div className="bg-pm-blue-gradient color-white rounded aligncenter p1 mt2 relative">
                        <p className="mt0 mb1">
                            {c('Info')
                                .t`Upgrade to a paid plan to unlock premium features and increase your storage space.`}
                        </p>
                        <div>
                            <Link
                                className="pm-button--transparent inbl increase-surface-click"
                                to="/subscription"
                                external={APP_NAME !== APPS.PROTONACCOUNT}
                            >
                                {c('Action').t`Upgrade`}
                            </Link>
                        </div>
                    </div>
                ) : null}
            </aside>
        </div>
    );
};

export default OverviewLayout;

import React, { Ref } from 'react';
import { classnames, TopBanners } from '../../index';

interface Props {
    containerRef?: Ref<HTMLDivElement>;
    header: React.ReactNode;
    sidebar: React.ReactNode;
    children: React.ReactNode;
    isBlurred?: boolean;
    hasTopBanners?: boolean;
}

const PrivateAppContainer = ({
    header,
    sidebar,
    children,
    hasTopBanners = true,
    isBlurred = false,
    containerRef,
}: Props) => {
    return (
        <div
            className={classnames([
                'content-container flex flex-column flex-nowrap no-scroll',
                isBlurred && 'filter-blur',
            ])}
            ref={containerRef}
        >
            {hasTopBanners ? <TopBanners /> : null}
            <div className="content flex-item-fluid flex flex-column flex-nowrap reset4print">
                {header}
                <div className="flex flex-item-fluid flex-nowrap">
                    {sidebar}
                    <div className="main flex flex-column flex-nowrap flex-item-fluid">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default PrivateAppContainer;

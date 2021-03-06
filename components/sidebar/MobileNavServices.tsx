import React from 'react';
import { APPS } from 'proton-shared/lib/constants';

import { useActiveBreakpoint, useConfig } from '../../index';

interface Props {
    children: React.ReactNode;
}
const MobileNavServices = ({ children }: Props) => {
    const { isNarrow } = useActiveBreakpoint();
    const { APP_NAME } = useConfig();

    if (!isNarrow || APP_NAME === APPS.PROTONVPN_SETTINGS) {
        return null;
    }

    return <nav className="p1 flex flex-row flex-spacearound flex-item-noshrink bg-global-grey">{children}</nav>;
};

export default MobileNavServices;

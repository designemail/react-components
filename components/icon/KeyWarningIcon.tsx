import React from 'react';
import { getEmailMismatchWarning } from 'proton-shared/lib/keys/publicKeys';

import { OpenPGPKey } from 'pmcrypto';
import { classnames, Icon, Tooltip } from '../../index';

interface Props {
    publicKey: OpenPGPKey;
    emailAddress: string;
    isInternal: boolean;
    className?: string;
}
const KeyWarningIcon = ({ publicKey, emailAddress, isInternal, className }: Props) => {
    if (!emailAddress) {
        return null;
    }
    const icon = <Icon name="attention" className={classnames([className, 'color-global-attention'])} />;
    const warning = getEmailMismatchWarning(publicKey, emailAddress, isInternal);

    if (!warning.length) {
        return null;
    }

    return <Tooltip title={warning[0]}>{icon}</Tooltip>;
};

export default KeyWarningIcon;

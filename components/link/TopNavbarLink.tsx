import React from 'react';

import { Icon } from '../../index';
import AppLink, { Props as LinkProps } from './AppLink';

export interface Props extends LinkProps {
    text: string;
    icon: string;
}

const TopNavbarLink = ({ icon, text, ...rest }: Props) => {
    return (
        <AppLink className="topnav-link" {...rest}>
            <Icon className="topnav-icon mr0-5 flex-item-centered-vert" name={icon} />
            <span className="navigation-title topnav-linkText">{text}</span>
        </AppLink>
    );
};

export default TopNavbarLink;

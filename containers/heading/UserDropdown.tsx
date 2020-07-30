import React, { useState } from 'react';
import { c } from 'ttag';
import {
    useUser,
    useAuthentication,
    useModals,
    usePopperAnchor,
    useApi,
    Icon,
    Dropdown,
    Toggle,
    DonateModal,
    generateUID,
    PrimaryButton,
    useConfig,
    useLoading,
    Link,
} from '../../';
import { revoke } from 'proton-shared/lib/api/auth';
import { APPS, CLIENT_TYPES } from 'proton-shared/lib/constants';

import UserDropdownButton from './UserDropdownButton';
import { ToggleState } from '../../components/toggle/Toggle';

const { VPN } = CLIENT_TYPES;

enum Theme {
    Normal,
    Dark,
}

const UserDropdown = ({ ...rest }) => {
    const { APP_NAME, CLIENT_TYPE } = useConfig();
    const api = useApi();
    const [user] = useUser();
    const { logout } = useAuthentication();
    const { createModal } = useModals();
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor<HTMLButtonElement>();
    const [theme, setTheme] = useState(Theme.Normal);
    const [loading, withLoading] = useLoading();

    const handleSupportUsClick = () => {
        createModal(<DonateModal />);
        close();
    };

    const handleLogout = () => {
        api(revoke()); // Kick off the revoke request, but don't care for the result.
        logout();
        close();
    };

    const handleThemeToggle = async () => {
        const newTheme = theme === Theme.Normal ? Theme.Dark : Theme.Normal;
        // TODO Add API call
        setTheme(newTheme);
    };

    return (
        <div className="flex" data-cy-header="userDropdown">
            <UserDropdownButton {...rest} user={user} buttonRef={anchorRef} isOpen={isOpen} onClick={toggle} />
            <Dropdown
                id={uid}
                className="userDropdown"
                isOpen={isOpen}
                noMaxSize={true}
                anchorRef={anchorRef}
                autoClose={false}
                onClose={close}
                originalPlacement="bottom-right"
            >
                <ul className="unstyled mt0 mb0">
                    {CLIENT_TYPE === VPN || APP_NAME === APPS.PROTONACCOUNT ? null : (
                        <li>
                            <Link
                                external={APP_NAME !== APPS.PROTONMAIL_SETTINGS}
                                className="w100 flex flex-nowrap dropDown-item-link nodecoration pl1 pr1 pt0-5 pb0-5"
                                to="/settings"
                            >
                                <Icon className="mt0-25 mr0-5" name="settings-master" />
                                {c('Action').t`Account settings`}
                            </Link>
                        </li>
                    )}
                    <li>
                        <a
                            className="w100 flex flex-nowrap dropDown-item-link nodecoration pl1 pr1 pt0-5 pb0-5"
                            href="https://shop.protonmail.com"
                            // eslint-disable-next-line react/jsx-no-target-blank
                            target="_blank"
                        >
                            <Icon className="mt0-25 mr0-5" name="shop" />
                            {c('Action').t`Proton shop`}
                        </a>
                    </li>
                    <li className="dropDown-item">
                        <button
                            type="button"
                            className="w100 flex underline-hover dropDown-item-link pl1 pr1 pt0-5 pb0-5 alignleft"
                            onClick={handleSupportUsClick}
                        >
                            <Icon className="mt0-25 mr0-5" name="donate" />
                            {c('Action').t`Support us`}
                        </button>
                    </li>
                    <li className="dropDown-item">
                        <div className="pl1 pr1 pt0-5 pb0-5 w100 flex flex-nowrap flex-spacebetween flex-items-center">
                            <label htmlFor="theme-toggle" className="mr1">{c('Action').t`Display mode`}</label>
                            <Toggle
                                id="theme-toggle"
                                checked={theme === Theme.Dark}
                                loading={loading}
                                onChange={() => withLoading(handleThemeToggle())}
                                label={(key: ToggleState) => {
                                    const alt = key === ToggleState.on ? c('Toggle button').t`Normal` : c('Toggle button').t`Dark`;
                                    return (
                                        <span className="pm-toggle-label-text">
                                            <Icon name={key === ToggleState.on ? 'crescent-moon' : 'half-moon'} alt={alt} className="pm-toggle-label-img" />
                                        </span>
                                    );
                                }}
                            />
                        </div>
                    </li>
                    <li className="dropDown-item pt0-5 pb0-5 pl1 pr1 flex">
                        <PrimaryButton
                            className="w100 aligncenter navigationUser-logout"
                            onClick={handleLogout}
                            data-cy-header-user-dropdown="logout"
                        >
                            {c('Action').t`Logout`}
                        </PrimaryButton>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};

export default UserDropdown;

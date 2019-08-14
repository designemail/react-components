import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Link } from 'react-router-dom';
import {
    useUser,
    useOrganization,
    useAuthentication,
    useModals,
    usePopperAnchor,
    useApi,
    Icon,
    Dropdown,
    BugModal,
    DonateModal,
    generateUID,
    PrimaryButton
} from 'react-components';
import { revoke } from 'proton-shared/lib/api/auth';
import { APPS } from 'proton-shared/lib/constants';

import UserDropdownButton from './UserDropdownButton';

const { PROTONMAIL_SETTINGS, PROTONVPN_SETTINGS } = APPS;

const UserDropdown = ({ currentApp = '', ...rest }) => {
    const api = useApi();
    const [user] = useUser();
    const { DisplayName, Email } = user;
    const [{ Name: organizationName } = {}] = useOrganization();
    const { logout } = useAuthentication();
    const { createModal } = useModals();
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, toggle, close } = usePopperAnchor();

    const handleBugReportClick = () => {
        createModal(<BugModal />);
    };

    const handleSupportUsClick = () => {
        createModal(<DonateModal />);
    };

    const handleLogout = () => {
        api(revoke()); // Kick off the revoke request, but don't care for the result.
        logout();
    };

    return (
        <div className="userDropdown" data-cy-header="userDropdown">
            <UserDropdownButton {...rest} user={user} buttonRef={anchorRef} isOpen={isOpen} onClick={toggle} />
            <Dropdown id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} originalPlacement="bottom-right">
                <ul className="unstyled mt0-5 mb0-5">
                    <li className="dropDown-item pt0-5 pb0-5 pl1 pr1 flex flex-column">
                        <strong title={DisplayName} className="ellipsis mw100 capitalize">
                            {DisplayName}
                        </strong>
                        {Email ? (
                            <span title={Email} className="ellipsis mw100">
                                {Email}
                            </span>
                        ) : null}
                        {organizationName ? (
                            <span title={organizationName} className="ellipsis mw100">
                                {organizationName}
                            </span>
                        ) : null}
                    </li>
                    {currentApp === PROTONVPN_SETTINGS ? null : (
                        <li className="dropDown-item pl1 pr1">
                            {currentApp === PROTONMAIL_SETTINGS ? (
                                <Link
                                    to="/settings"
                                    className="w100 flex flex-nowrap color-global-grey nodecoration pt0-5 pb0-5"
                                >
                                    <Icon className="mt0-25 mr0-5 fill-currentColor" name="settings" />
                                    {c('Action').t`Settings`}
                                </Link>
                            ) : (
                                <a
                                    className="w100 flex flex-nowrap color-global-grey nodecoration pt0-5 pb0-5"
                                    href="/settings"
                                >
                                    <Icon className="mt0-25 mr0-5 fill-currentColor" name="settings" />
                                    {c('Action').t`Settings`}
                                </a>
                            )}
                        </li>
                    )}
                    <li className="dropDown-item pl1 pr1">
                        <a
                            className="w100 flex flex-nowrap color-global-grey nodecoration pt0-5 pb0-5"
                            href={
                                currentApp === PROTONVPN_SETTINGS
                                    ? 'https://protonvpn.com/support/'
                                    : 'https://protonmail.com/support/'
                            }
                            // eslint-disable-next-line react/jsx-no-target-blank
                            target="_blank"
                        >
                            <Icon className="mt0-25 mr0-5 fill-currentColor" name="what-is-this" />
                            {c('Action').t`I have a question`}
                        </a>
                    </li>
                    <li className="dropDown-item pl1 pr1">
                        <button
                            type="button"
                            className="w100 flex underline-hover pt0-5 pb0-5 alignleft"
                            onClick={handleBugReportClick}
                        >
                            <Icon className="mt0-25 mr0-5 fill-currentColor" name="report-bug" />
                            {c('Action').t`Report bug`}
                        </button>
                    </li>
                    <li className="dropDown-item pl1 pr1">
                        <a
                            className="w100 flex flex-nowrap color-global-grey nodecoration pt0-5 pb0-5"
                            href="https://shop.protonmail.com"
                            // eslint-disable-next-line react/jsx-no-target-blank
                            target="_blank"
                        >
                            <Icon className="mt0-25 mr0-5 fill-currentColor" name="shop" />
                            {c('Action').t`Proton shop`}
                        </a>
                    </li>
                    <li className="dropDown-item pl1 pr1">
                        <button
                            type="button"
                            className="w100 flex underline-hover pt0-5 pb0-5 alignleft"
                            onClick={handleSupportUsClick}
                        >
                            <Icon className="mt0-25 mr0-5 fill-currentColor" name="donate" />
                            {c('Action').t`Support us`}
                        </button>
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

UserDropdown.propTypes = {
    currentApp: PropTypes.string
};

export default UserDropdown;

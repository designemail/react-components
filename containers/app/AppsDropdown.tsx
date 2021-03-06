import React from 'react';
import { c } from 'ttag';
import { APPS, FEATURE_FLAGS } from 'proton-shared/lib/constants';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';

import humanSize from 'proton-shared/lib/helpers/humanSize';

import { useUser } from '../../hooks/useUser';
import useConfig from '../config/useConfig';
import Link from '../../components/link/Link';
import Icon from '../../components/icon/Icon';
import SimpleDropdown from '../../components/dropdown/SimpleDropdown';
import Meter from '../../components/progress/Meter';

const { PROTONMAIL, PROTONCONTACTS, PROTONCALENDAR, PROTONDRIVE } = APPS;

const AppsDropdown = () => {
    const [user] = useUser();
    const { APP_NAME } = useConfig();
    const { UsedSpace, MaxSpace } = user;
    const spacePercentage = Math.round((UsedSpace * 100) / MaxSpace);
    const spaceHuman = `${humanSize(UsedSpace)} / ${humanSize(MaxSpace)}`;

    const apps = [
        {
            appNames: [PROTONMAIL],
            icon: 'protonmail',
            title: 'ProtonMail',
            link: '/inbox',
        },
        { appNames: [PROTONCONTACTS], icon: 'protoncontacts', title: 'ProtonContacts', link: '/contacts' },
        {
            appNames: [PROTONCALENDAR],
            icon: 'protoncalendar',
            title: 'ProtonCalendar',
            link: '/calendar',
        },
        FEATURE_FLAGS.includes('drive') && {
            appNames: [PROTONDRIVE],
            icon: 'protondrive',
            title: 'ProtonDrive',
            link: '/drive',
        },
    ].filter(isTruthy);

    return (
        <SimpleDropdown
            hasCaret={false}
            content={<Icon name="more" className="appsDropdown-button-icon flex-item-noshrink" />}
            className="appsDropdown-button"
            dropdownClassName="appsDropdown-container"
            originalPlacement="bottom-right"
            title={c('Apps dropdown').t`Proton applications`}
        >
            <ul className="appsDropdown-list unstyled m0 scroll-if-needed">
                {apps.map(({ appNames = [], icon, title, link }, index) => {
                    const isCurrent = appNames.includes(APP_NAME);
                    const key = `${index}`;
                    return (
                        <li className="dropDown-item appsDropdown-item" key={key}>
                            <Link
                                to={link}
                                className="appsDropdown-link big m0 p1 pt0-75 pb0-75 flex flex-nowrap flex-items-center"
                                external={!isCurrent}
                                title={c('Apps dropdown').t`Go to ${title}`}
                            >
                                <Icon name={icon} size={20} className="mr0-5" />
                                <span>{title}</span>
                            </Link>
                        </li>
                    );
                })}
                <li className="dropDown-item appsDropdown-item">
                    <Link
                        to="/settings/subscription"
                        external
                        className="appsDropdown-link big m0 bl p1 pt0-75 pb0-25"
                        title={c('Apps dropdown').t`Add storage space`}
                    >
                        <span className="flex flex-nowrap flex-items-center">
                            <Icon name="user-storage" size={20} className="mr0-5" />
                            <span>{c('Apps dropdown').t`Storage capacity`}</span>
                        </span>
                        <div className="ml1-5">
                            <Meter className="is-thin bl mt0-25" value={spacePercentage} />
                            <div className="smaller m0 opacity-50">{spaceHuman}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </SimpleDropdown>
    );
};

export default AppsDropdown;

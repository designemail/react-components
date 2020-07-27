import React from 'react';
import { c, msgid } from 'ttag';
import { useConfig, Icon, Href, Link } from 'react-components';
import { UserModel, UserSettings, Organization, Subscription, Plan } from 'proton-shared/lib/interfaces';
import { getInitial } from 'proton-shared/lib/helpers/string';
import { getPlan } from 'proton-shared/lib/helpers/subscription';
import { PLAN_SERVICES, APPS, PLANS } from 'proton-shared/lib/constants';

const flags = require.context('design-system/assets/img/shared/flags/4x3', true, /.svg$/);
const flagsMap = flags.keys().reduce((acc, key) => {
    acc[key] = () => flags(key);
    return acc;
}, {});

const getFlagSvg = (abbreviation: string) => {
    const key = `./${abbreviation.toLowerCase()}.svg`;
    if (!flagsMap[key]) {
        return;
    }
    return flagsMap[key]().default;
};

interface Props {
    user: UserModel;
    userSettings: UserSettings;
    organization: Organization;
    subscription: Subscription;
}

const SummarySection = ({ user, userSettings, organization, subscription }: Props) => {
    const { APP_NAME, LOCALES = {} } = useConfig();
    const { Locale } = userSettings;
    const abbreviation = Locale.slice(-2);
    const { Email, DisplayName, Name, canPay, isAdmin } = user;
    const { UsedMembers = 0, UsedDomains = 0, MaxMembers = 0, MaxDomains = 0 } = organization;
    const initials = getInitial(DisplayName || Name || undefined);
    const vpnPlan = getPlan(subscription, PLAN_SERVICES.VPN);
    const mailPlan = getPlan(subscription, PLAN_SERVICES.MAIL);

    const getPlanTitle = ({ Title, Name }: Plan, service: string) => {
        if (Name === PLANS.VISIONARY) {
            // For visionary plan, Title equals "Visionary"
            return `${service} Visionary`;
        }
        if (Title) {
            return Title;
        }
        return `${service} Free`;
    };

    return (
        <div className="bordered-container bg-white-dm tiny-shadow-container p2">
            <div className="mb2 aligncenter">
                <span className="dropDown-logout-initials rounded p0-25 mb0-5 inline-flex bg-global-grey color-white">
                    <span className="dropDown-logout-text center">{initials}</span>
                </span>
                <h3 className="mb0-5">{DisplayName || Name}</h3>
                {organization.Name ? <p className="mt0 mb0-5">{organization.Name}</p> : null}
                <p className="mt0 mb0">{Email}</p>
            </div>
            {canPay ? (
                <div className="mb1">
                    <strong className="bl mb0-5">{c('Title').t`Plans`}</strong>
                    <ul className="unstyled mt0 mb0">
                        <li>
                            <Icon name="protonvpn" className="mr0-5" />
                            {getPlanTitle(vpnPlan, 'ProtonVPN')}
                        </li>
                        <li>
                            <Icon name="protonmail" className="mr0-5" />
                            {getPlanTitle(mailPlan, 'ProtonMail')}
                        </li>
                    </ul>
                </div>
            ) : null}
            <div className="mb1">
                <strong className="bl mb0-5">{c('Title').t`Default language`}</strong>
                <ul className="unstyled mt0 mb0">
                    <li className="flex flex-nowrap flex-items-center">
                        <img width={20} className="mr0-5" src={getFlagSvg(abbreviation)} alt={LOCALES[Locale]} />
                        {LOCALES[Locale]}
                    </li>
                </ul>
            </div>
            {isAdmin && APP_NAME !== APPS.PROTONACCOUNT ? (
                <div className="mb1">
                    <strong className="bl mb0-5">{c('Title').t`Your organization`}</strong>
                    <ul className="unstyled mt0 mb0">
                        <li>
                            {c('Organization attribute').ngettext(
                                msgid`${UsedMembers}/${MaxMembers} active user`,
                                `${UsedMembers}/${MaxMembers} active users`,
                                UsedMembers
                            )}
                        </li>
                        <li>
                            {c('Organization attribute').ngettext(
                                msgid`${UsedDomains}/${MaxDomains} custom domain`,
                                `${UsedDomains}/${MaxDomains} custom domains`,
                                UsedMembers
                            )}
                        </li>
                    </ul>
                </div>
            ) : null}
            {APP_NAME === APPS.PROTONACCOUNT ? (
                <div className="mb1">
                    <strong className="bl mb0-5">{c('Title').t`Application settings`}</strong>
                    <ul className="unstyled mt0 mb0">
                        <li>
                            <Icon name="protonmail" className="mr0-5" />
                            <Href target="_self">{c('Link').t`ProtonMail settings`}</Href>
                        </li>
                        <li>
                            <Icon name="protoncalendar" className="mr0-5" />
                            <Href target="_self">{c('Link').t`ProtonCalendar settings`}</Href>
                        </li>
                        <li>
                            <Icon name="protoncontacts" className="mr0-5" />
                            <Href target="_self">{c('Link').t`ProtonContacts settings`}</Href>
                        </li>
                        <li>
                            <Icon name="protondrive" className="mr0-5" />
                            <Href target="_self">{c('Link').t`ProtonDrive settings`}</Href>
                        </li>
                    </ul>
                </div>
            ) : null}
            {APP_NAME === APPS.PROTONACCOUNT ? null : (
                <div className="mb1">
                    <Link to={canPay ? '/subscription' : '/account'} external={true}>{c('Link')
                        .t`Manage account`}</Link>
                </div>
            )}
        </div>
    );
};

export default SummarySection;
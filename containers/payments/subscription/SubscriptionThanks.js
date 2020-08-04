import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { PrimaryButton, useConfig, Href } from 'react-components';
import { APPS, PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';
import mailLandscapeSvg from 'design-system/assets/img/pm-images/landscape.svg';
import vpnLandscapeSvg from 'design-system/assets/img/pv-images/landscape.svg';
import appStoreSvg from 'design-system/assets/img/shared/app-store.svg';
import playStoreSvg from 'design-system/assets/img/shared/play-store.svg';

const SubscriptionThanks = ({ method = '', onClose }) => {
    const { APP_NAME } = useConfig();
    const isVPN = APP_NAME === APPS.PROTONVPN_SETTINGS;

    return (
        <>
            <p className="aligncenter mb1">
                {[PAYMENT_METHOD_TYPES.CASH, PAYMENT_METHOD_TYPES.BITCOIN].includes(method)
                    ? c('Info').t`Your account will be updated once the payment is cleared.`
                    : c('Info').t`Your account has been successfully updated.`}
            </p>
            <p className="aligncenter mb2">{c('Info')
                .t`Download your favorite app today and take privacy with you everywhere you go.`}</p>
            <div className="aligncenter mb2">
                <img src={isVPN ? vpnLandscapeSvg : mailLandscapeSvg} alt="landscape" />
            </div>
            <div className="mb2 aligncenter">
                <Href
                    url={
                        isVPN
                            ? 'https://play.google.com/store/apps/details?id=ch.protonvpn.android'
                            : 'https://play.google.com/store/apps/details?id=ch.protonmail.android'
                    }
                    className="mr2"
                >
                    <img width="150" src={playStoreSvg} alt="Play Store" />
                </Href>
                <Href
                    url={
                        isVPN
                            ? 'https://itunes.apple.com/us/app/protonvpn-fast-secure-vpn/id1437005085'
                            : 'https://apps.apple.com/app/protonmail-encrypted-email/id979659905'

                    }
                >
                    <img width="150" src={appStoreSvg} alt="App Store" />
                </Href>
            </div>
            <div className="aligncenter mb2">
                <PrimaryButton onClick={onClose}>{c('Action').t`Close`}</PrimaryButton>
            </div>
        </>
    );
};

SubscriptionThanks.propTypes = {
    method: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default SubscriptionThanks;

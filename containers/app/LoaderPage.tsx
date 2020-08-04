import React from 'react';
import { c } from 'ttag';
import { APPS } from 'proton-shared/lib/constants';
import useConfig from '../config/useConfig';
import FullLoader from '../../components/loader/FullLoader';
import TextLoader from '../../components/loader/TextLoader';

interface Props {
    text?: string;
    loaderClassName?: string;
}

const LoaderPage = ({ text, loaderClassName = 'color-global-light' }: Props) => {
    const { APP_NAME } = useConfig();
    const appName = APP_NAME === APPS.PROTONVPN_SETTINGS ? 'ProtonVPN' : 'ProtonMail';
    return (
        <div className="centered-absolute aligncenter">
            <FullLoader className={loaderClassName} size={200} />
            <TextLoader>{text || c('Info').t`Loading ${appName}`}</TextLoader>
        </div>
    );
};

export default LoaderPage;

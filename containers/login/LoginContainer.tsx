import React from 'react';
import { c } from 'ttag';
import { Link } from 'react-router-dom';
import { SupportDropdown } from 'react-components';

import LoginForm from './LoginForm';
import SignLayout from '../signup/SignLayout';
import ProtonLogo from '../../components/logo/ProtonLogo';
import OneAccountIllustration from '../illustration/OneAccountIllustration';

interface Props {
    onLogin: () => void;
}

const LoginContainer = ({ onLogin }: Props) => {
    const signupLink = (
        <Link key="signupLink" className="nodecoration" to="/signup">{c('Link').t`Create an account`}</Link>
    );
    return (
        <SignLayout
            title={c('Title').t`Sign in`}
            center={<ProtonLogo />}
            right={
                <SupportDropdown noCaret={true} className="link" content={c('Action').t`Need help?`}>{c('Action')
                    .t`Need help?`}</SupportDropdown>
            }
            aside={<OneAccountIllustration />}
        >
            <LoginForm onLogin={onLogin} />
            <div className="mb2 alignright">{c('Info').jt`New to Proton? ${signupLink}`}</div>
        </SignLayout>
    );
};

export default LoginContainer;
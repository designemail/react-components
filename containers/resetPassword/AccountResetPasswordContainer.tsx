import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import { c } from 'ttag';
import * as H from 'history';
import isTruthy from 'proton-shared/lib/helpers/isTruthy';
import { Link } from 'react-router-dom';

import { Alert, GenericError, Label, PasswordInput, PrimaryButton, ConfirmModal, useModals } from '../../index';
import useResetPassword, { STEPS } from './useResetPassword';
import { OnLoginArgs } from '../login/interface';
import ResetUsernameInput from './ResetUsernameInput';
import ResetPasswordEmailInput from './ResetPasswordEmailInput';
import ResetPasswordPhoneInput from './ResetPasswordPhoneInput';
import ResetTokenInput from './ResetTokenInput';
import { Props as AccountPublicLayoutProps } from '../signup/AccountPublicLayout';
import BackButton from '../signup/BackButton';
import SignupLabelInputRow from '../signup/SignupLabelInputRow';
import SignupSubmitRow from '../signup/SignupSubmitRow';
import Tabs from '../../components/tabs/Tabs';
import Href from '../../components/link/Href';
import InlineLinkButton from '../../components/button/InlineLinkButton';
import RequestNewCodeModal from '../api/humanVerification/RequestNewCodeModal';

interface Props {
    onLogin: (args: OnLoginArgs) => void;
    history: H.History;
    Layout: FunctionComponent<AccountPublicLayoutProps>;
}

const AccountResetPasswordContainer = ({ onLogin, history, Layout }: Props) => {
    const {
        loading,
        state,
        handleRequestRecoveryMethods,
        handleRequest,
        handleValidateResetToken,
        handleNewPassword,
        gotoStep,
        setUsername,
        setEmail,
        setPhone,
        setPassword,
        setConfirmPassword,
        setToken
    } = useResetPassword({ onLogin });
    const { createModal } = useModals();
    const hasModal = useRef<boolean>(false);
    const [tabIndex, setTabIndex] = useState(0);

    const { step, username, email, phone, password, confirmPassword, token, methods } = state;

    let handleBack = () => history.push('/login');

    useEffect(() => {
        if (tabIndex) {
            setEmail('');
        } else {
            setPhone('');
        }
    }, [tabIndex]);

    if (step === STEPS.REQUEST_RECOVERY_METHODS) {
        return (
            <Layout title={c('Title').t`Enter Proton Account`} left={<BackButton onClick={handleBack} />}>
                <form
                    className="signup-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRequestRecoveryMethods();
                    }}
                >
                    <p>{c('Info').t`Enter the Proton Account that you would like to reset the password for.`}</p>
                    <SignupLabelInputRow
                        label={<Label htmlFor="username">{c('Label').t`Email or username`}</Label>}
                        input={
                            <ResetUsernameInput
                                id="username"
                                value={username}
                                setValue={setUsername}
                                placeholder={c('Label').t`Email or username`}
                            />
                        }
                    />
                    <SignupSubmitRow>
                        <PrimaryButton
                            className="pm-button--large flex-item-noshrink onmobile-w100"
                            disabled={!username}
                            loading={loading}
                            type="submit"
                        >{c('Action').t`Next`}</PrimaryButton>
                    </SignupSubmitRow>
                </form>
            </Layout>
        );
    }

    if (step === STEPS.NO_RECOVERY_METHODS) {
        return (
            <Layout title={c('Title').t`No recovery method`} left={<BackButton onClick={handleBack} />}>
                <form className="signup-form">
                    <p>{c('Info').t`Unfortunately there is no recovery method saved for this account.`}</p>
                    <SignupSubmitRow>
                        <Href url="https://protonmail.com/support-form" target="_self">{c('Action')
                            .t`Contact support`}</Href>
                        <Link
                            to="/login"
                            className="pm-button--primary pm-button--large flex-item-noshrink onmobile-w100"
                        >{c('Action').t`Return to login`}</Link>
                    </SignupSubmitRow>
                </form>
            </Layout>
        );
    }

    if (step === STEPS.REQUEST_RESET_TOKEN) {
        handleBack = () => gotoStep(STEPS.REQUEST_RECOVERY_METHODS);
        const tabs = [
            (methods?.includes('email') || methods?.includes('login')) && {
                title: c('Recovery method').t`Email`,
                method: 'email',
                content: (
                    <SignupLabelInputRow
                        label={<Label htmlFor="email">{c('Label').t`Recovery email`}</Label>}
                        input={<ResetPasswordEmailInput value={email} setValue={setEmail} id="email" />}
                    />
                )
            },
            methods?.includes('sms') && {
                title: c('Recovery method').t`Phone number`,
                method: 'sms',
                content: (
                    <SignupLabelInputRow
                        label={<Label htmlFor="phone">{c('Label').t`Recovery phone`}</Label>}
                        input={<ResetPasswordPhoneInput value={phone} setValue={setPhone} id="phone" />}
                    />
                )
            }
        ].filter(isTruthy);
        const recoveryTitle =
            tabs[tabIndex].method === 'email'
                ? c('Title').t`Enter recovery email`
                : c('Title').t`Enter recovery phone number`;
        const recoveryMethodText =
            tabs[tabIndex].method === 'email' ? c('Recovery method').t`email` : c('Recovery method').t`phone number`;
        return (
            <Layout title={recoveryTitle} left={<BackButton onClick={handleBack} />}>
                <form
                    className="signup-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRequest();
                    }}
                >
                    <p>{c('Info').t`We will send a password reset code to your recovery ${recoveryMethodText}.`}</p>
                    <Tabs tabs={tabs} value={tabIndex} onChange={setTabIndex} />
                    <SignupSubmitRow>
                        <InlineLinkButton onClick={() => gotoStep(STEPS.VALIDATE_RESET_TOKEN)}>{c('Action')
                            .t`I already have a code`}</InlineLinkButton>
                        <PrimaryButton
                            className="pm-button--large onmobile-w100"
                            disabled={!email && !phone}
                            loading={loading}
                            type="submit"
                        >{c('Action').t`Reset password`}</PrimaryButton>
                    </SignupSubmitRow>
                </form>
            </Layout>
        );
    }

    if (step === STEPS.VALIDATE_RESET_TOKEN) {
        const subTitle = email
            ? c('Info')
                  .t`Enter the recovery code that was sent to ${email}. If you don’t find the email in your inbox, pleas check your spam folder.`
            : c('Info').t`Enter the verification code that was sent to your phone number: ${phone}.`;
        handleBack = () =>
            gotoStep(methods?.includes('login') ? STEPS.REQUEST_RECOVERY_METHODS : STEPS.REQUEST_RESET_TOKEN);
        const handleSubmit = async () => {
            await new Promise((resolve, reject) => {
                createModal(
                    <ConfirmModal
                        title={c('Title').t`Confirm reset password`}
                        confirm={c('Action').t`Confirm password reset`}
                        onConfirm={resolve}
                        onClose={reject}
                    >
                        <Alert type="warning">
                            <p className="mt0">{c('Info')
                                .t`Resetting your password means that you will no longer be able to read your encrypted data unless you know your old password.`}</p>
                            <p className="mt0 mb0">{c('Info')
                                .t`If you know your password and would like to change it, please log into your account first and change your password after logging in.`}</p>
                        </Alert>
                    </ConfirmModal>
                );
            });
            await handleValidateResetToken(STEPS.NEW_PASSWORD);
        };
        return (
            <Layout title={c('Title').t`Enter recovery code`} left={<BackButton onClick={handleBack} />}>
                <form
                    className="signup-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (hasModal.current) {
                            return;
                        }
                        hasModal.current = true;
                        handleSubmit()
                            .then(() => (hasModal.current = false))
                            .catch(() => (hasModal.current = false));
                    }}
                >
                    <p>{subTitle}</p>
                    <SignupLabelInputRow
                        label={<Label htmlFor="reset-token">{c('Label').t`Recovery code`}</Label>}
                        input={<ResetTokenInput id="reset-token" value={token} setValue={setToken} />}
                    />
                    <InlineLinkButton
                        disabled={loading}
                        onClick={() =>
                            createModal(
                                <RequestNewCodeModal
                                    onEdit={handleBack}
                                    onResend={handleRequest}
                                    email={email}
                                    phone={phone}
                                />
                            )
                        }
                    >{c('Action').t`Did not receive a code?`}</InlineLinkButton>
                    <SignupSubmitRow>
                        <PrimaryButton
                            className="pm-button--large onmobile-w100"
                            disabled={!token}
                            loading={loading}
                            type="submit"
                        >{c('Action').t`Reset password`}</PrimaryButton>
                    </SignupSubmitRow>
                </form>
            </Layout>
        );
    }

    if (step === STEPS.NEW_PASSWORD) {
        handleBack = () => gotoStep(STEPS.VALIDATE_RESET_TOKEN);
        return (
            <Layout title={c('Title').t`Reset password`} left={<BackButton onClick={handleBack} />}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleNewPassword();
                    }}
                >
                    <div className="flex">
                        <SignupLabelInputRow
                            className="flex-item-fluid"
                            label={<Label htmlFor="new-password">{c('Label').t`Password`}</Label>}
                            input={
                                <PasswordInput
                                    id="new-password"
                                    autoFocus
                                    value={password}
                                    placeholder={c('Placeholder').t`Choose a new password`}
                                    onChange={({ target }) => setPassword(target.value)}
                                    required
                                />
                            }
                        />
                        <SignupLabelInputRow
                            className="flex-item-fluid"
                            label={<Label htmlFor="confirm-password">{c('Label').t`Confirm`}</Label>}
                            input={
                                <PasswordInput
                                    id="confirm-password"
                                    value={confirmPassword}
                                    placeholder={c('Password').t`Confirm new password`}
                                    onChange={({ target }) => setConfirmPassword(target.value)}
                                    error={
                                        password !== confirmPassword ? c('Error').t`Passwords do not match` : undefined
                                    }
                                    required
                                />
                            }
                        />
                    </div>
                    <SignupSubmitRow>
                        <PrimaryButton
                            disabled={!password || password !== confirmPassword}
                            loading={loading}
                            type="submit"
                        >{c('Action').t`Change password`}</PrimaryButton>
                    </SignupSubmitRow>
                </form>
            </Layout>
        );
    }

    if (step === STEPS.ERROR) {
        return <GenericError />;
    }

    throw new Error('Unknown step');
};

export default AccountResetPasswordContainer;

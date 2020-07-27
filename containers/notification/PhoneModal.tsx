import React, { useState } from 'react';
import {
    AuthModal,
    FormModal,
    ConfirmModal,
    Alert,
    Row,
    Label,
    IntlTelInput,
    Field,
    useLoading,
    useModals,
    useNotifications,
    useEventManager,
} from '../..';
import { c } from 'ttag';
import { updatePhone } from 'proton-shared/lib/api/settings';

interface Props {
    phone: string;
    hasReset: boolean;
    onClose?: () => void;
}

const PhoneModal = ({ phone, hasReset, onClose, ...rest }: Props) => {
    const [input, setInput] = useState(phone);
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const { call } = useEventManager();

    const handleChange = (status: any, value: any, countryData: any, number: string) => setInput(number);

    const handleSubmit = async () => {
        if (!input && hasReset) {
            await new Promise((resolve, reject) => {
                createModal(
                    <ConfirmModal title={c('Title').t`Confirm phone number`} onConfirm={resolve} onClose={reject}>
                        <Alert type="warning">
                            {c('Warning')
                                .t`By deleting this phone number, you will no longer be able to recover your account.`}
                            <br />
                            <br />
                            {c('Warning').t`Are you sure you want to delete the phone number?`}
                        </Alert>
                    </ConfirmModal>
                );
            });
        }

        await new Promise((resolve, reject) => {
            createModal(<AuthModal onClose={reject} onSuccess={resolve} config={updatePhone({ Phone: input })} />);
        });

        await call();
        createNotification({ text: c('Success').t`Phone number updated` });
        onClose?.();
    };

    return (
        <FormModal
            loading={loading}
            onClose={onClose}
            onSubmit={() => withLoading(handleSubmit())}
            title={c('Title').t`Update recovery phone number`}
            {...rest}
        >
            <Row>
                <Label htmlFor="phoneInput">{c('Label').t`Phone number`}</Label>
                <Field>
                    <IntlTelInput
                        id="phoneInput"
                        containerClassName="w100"
                        inputClassName="w100"
                        onPhoneNumberChange={handleChange}
                        value={input}
                        autoFocus={true}
                        dropdownContainer="body"
                        required
                    />
                </Field>
            </Row>
        </FormModal>
    );
};

export default PhoneModal;

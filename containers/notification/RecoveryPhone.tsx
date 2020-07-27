import React from 'react';
import { c } from 'ttag';
import { PrimaryButton, Field } from '../..';

interface Props {
    phone: string | null;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RecoveryPhone = ({ phone, onClick }: Props) => {
    return (
        <>
            <Field>
                <div className="ellipsis" title={phone ? phone : ''}>
                    {phone || c('Info').t`Not set`}
                </div>
            </Field>
            <div className="ml1 onmobile-ml0">
                <PrimaryButton onClick={onClick}>{c('Action').t`Edit`}</PrimaryButton>
            </div>
        </>
    );
};

export default RecoveryPhone;

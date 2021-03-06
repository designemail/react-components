import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    DowngradeModal,
    LossLoyaltyModal,
    useApi,
    useUser,
    useNotifications,
    useLoading,
    useModals,
    useEventManager,
    useOrganization,
    useSubscription,
} from 'react-components';
import { c } from 'ttag';
import { deleteSubscription } from 'proton-shared/lib/api/payments';
import { isLoyal, hasCovid } from 'proton-shared/lib/helpers/organization';

const DOWNGRADING_ID = 'downgrading-notification';

const UnsubscribeButton = ({ className, children }) => {
    const [user] = useUser();
    const [organization] = useOrganization();
    const [subscription] = useSubscription();
    const { createNotification, hideNotification } = useNotifications();
    const { createModal } = useModals();
    const api = useApi();
    const { call } = useEventManager();
    const [loading, withLoading] = useLoading();

    const handleUnsubscribe = async () => {
        createNotification({
            type: 'info',
            text: c('State').t`Downgrading your account, please wait`,
            id: DOWNGRADING_ID,
            expiration: 99999,
        });
        try {
            await api(deleteSubscription());
            await call();
            createNotification({ text: c('Success').t`You have successfully unsubscribed` });
        } finally {
            hideNotification(DOWNGRADING_ID);
        }
    };

    const handleClick = async () => {
        if (user.isFree) {
            return createNotification({ type: 'error', text: c('Info').t`You already have a free account` });
        }

        await new Promise((resolve, reject) => {
            createModal(<DowngradeModal user={user} onConfirm={resolve} onClose={reject} />);
        });

        if (isLoyal(organization) || hasCovid(organization)) {
            await new Promise((resolve, reject) => {
                createModal(
                    <LossLoyaltyModal
                        organization={organization}
                        subscription={subscription}
                        user={user}
                        onConfirm={resolve}
                        onClose={reject}
                    />
                );
            });
        }

        return handleUnsubscribe();
    };

    return (
        <Button loading={loading} className={className} onClick={() => withLoading(handleClick())}>
            {children}
        </Button>
    );
};

UnsubscribeButton.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default UnsubscribeButton;

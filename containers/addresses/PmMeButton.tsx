import React from 'react';
import { c } from 'ttag';
import { setupAddress } from 'proton-shared/lib/api/addresses';
import {
    UnlockModal,
    PrimaryButton,
    useApi,
    useAddresses,
    useLoading,
    useEventManager,
    useOrganization,
    useOrganizationKey,
    useModals,
    useNotifications,
    usePremiumDomains,
} from '../../index';
import CreateMissingKeysAddressModal from './missingKeys/CreateMissingKeysAddressModal';

const PmMeButton = () => {
    const [loading, withLoading] = useLoading();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const api = useApi();
    const { call } = useEventManager();
    const [addresses, loadingAddresses] = useAddresses();
    const [premiumDomains, loadingPremiumDomains] = usePremiumDomains();
    const [organization, loadingOrganization] = useOrganization();
    const [organizationKey, loadingOrganizationKey] = useOrganizationKey(organization);
    const isLoadingDependencies =
        loadingAddresses || loadingPremiumDomains || loadingOrganization || loadingOrganizationKey;
    const [Domain = ''] = premiumDomains || [];

    const createPremiumAddress = async () => {
        const [{ DisplayName = '', Signature = '' } = {}] = addresses || [];
        await new Promise((resolve, reject) => {
            createModal(<UnlockModal onClose={() => reject()} onSuccess={resolve} />);
        });
        const { Address } = await api(
            setupAddress({
                Domain,
                DisplayName: DisplayName || '', // DisplayName can be null
                Signature: Signature || '', // Signature can be null
            })
        );
        await call();
        createNotification({ text: c('Success').t`Premium address created` });
        createModal(<CreateMissingKeysAddressModal organizationKey={organizationKey} addresses={[Address]} />);
    };

    return (
        <PrimaryButton
            disabled={isLoadingDependencies || !Domain}
            loading={loading}
            onClick={() => withLoading(createPremiumAddress())}
        >
            {c('Action').t`Activate`}
        </PrimaryButton>
    );
};

export default PmMeButton;

import React, { useState, useEffect } from 'react';
import { c } from 'ttag';
import {
    Alert,
    CurrencySelector,
    CycleSelector,
    DowngradeModal,
    LossLoyaltyModal,
    MozillaInfoPanel,
    useSubscription,
    useOrganization,
    Loader,
    usePlans,
    useApi,
    useUser,
    useModals,
    useEventManager,
    useNotifications,
    useConfig,
    useLoading,
} from 'react-components';

import { checkSubscription, deleteSubscription } from 'proton-shared/lib/api/payments';
import { CYCLE, DEFAULT_CURRENCY, DEFAULT_CYCLE, PLAN_SERVICES, APPS } from 'proton-shared/lib/constants';
import {
    getPlans,
    isBundleEligible,
    getPlan,
    switchPlan,
    getPlanIDs,
    clearPlanIDs,
} from 'proton-shared/lib/helpers/subscription';
import { isLoyal, hasCovid } from 'proton-shared/lib/helpers/organization';

import NewSubscriptionModal from './subscription/NewSubscriptionModal';
import MailSubscriptionTable from './subscription/MailSubscriptionTable';
import VpnSubscriptionTable from './subscription/VpnSubscriptionTable';

const PlansSection = () => {
    const { call } = useEventManager();
    const { APP_NAME } = useConfig();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const [user] = useUser();
    const [loading, withLoading] = useLoading();
    const [subscription = {}, loadingSubscription] = useSubscription();
    const [organization = {}, loadingOrganization] = useOrganization();
    const [plans = [], loadingPlans] = usePlans();
    const api = useApi();
    const isVPN = APP_NAME === APPS.PROTONVPN_SETTINGS;
    const { Name } =
        getPlan(subscription, isVPN ? PLAN_SERVICES.VPN : PLAN_SERVICES.MAIL) || {};

    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const [cycle, setCycle] = useState(DEFAULT_CYCLE);
    const bundleEligible = isBundleEligible(subscription);
    const { CouponCode, Plans = [] } = subscription;
    const names = getPlans(subscription)
        .map(({ Title }) => Title)
        .join(c('Separator, spacing is important').t` and `);

    const handleUnsubscribe = async () => {
        await api(deleteSubscription());
        await call();
        createNotification({ text: c('Success').t`You have successfully unsubscribed` });
    };

    const handleOpenModal = async () => {
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
                        subscription={subscription}
                        organization={organization}
                        user={user}
                        onConfirm={resolve}
                        onClose={reject}
                    />
                );
            });
        }
        return handleUnsubscribe();
    };

    const handleModal = async (planID = '', expanded = false) => {
        if (!planID) {
            handleOpenModal();
            return;
        }

        const couponCode = CouponCode || undefined; // From current subscription; CouponCode can be null
        const plansIDs = switchPlan({
            planIDs: getPlanIDs(subscription),
            plans,
            planID,
            service: isVPN ? PLAN_SERVICES.VPN : PLAN_SERVICES.MAIL,
            organization,
        });
        const { Coupon } = await withLoading(
            api(
                checkSubscription({
                    PlanIDs: clearPlanIDs(plansIDs),
                    Currency: currency,
                    Cycle: cycle,
                    CouponCode: couponCode,
                })
            )
        );

        const coupon = Coupon ? Coupon.Code : undefined; // Coupon can equals null

        createModal(
            <NewSubscriptionModal
                expanded={expanded}
                planIDs={plansIDs}
                coupon={coupon}
                currency={currency}
                cycle={cycle}
            />
        );
    };

    useEffect(() => {
        if (loadingPlans || loadingSubscription) {
            return;
        }
        const [{ Currency } = {}] = plans;
        setCurrency(subscription.Currency || Currency);
        setCycle(subscription.Cycle || DEFAULT_CYCLE);
    }, [loadingSubscription, loadingPlans]);

    if (subscription.isManagedByMozilla) {
        return <MozillaInfoPanel />;
    }

    if (loadingSubscription || loadingPlans || loadingOrganization) {
        return <Loader />;
    }

    return (
        <>
            <div className="flex flew-nowrap onmobile-flex-column">
                <Alert
                    className="flex-item-fluid"
                    learnMore="https://protonmail.com/support/knowledge-base/paid-plans/"
                >
                    {bundleEligible ? (
                        <div>{c('Info')
                            .t`Get 20% bundle discount when you purchase ProtonMail and ProtonVPN together.`}</div>
                    ) : null}
                    {Plans.length ? <div>{c('Info').t`You are currently subscribed to ${names}.`}</div> : null}
                </Alert>
                <div className="flex-noMinChildren flex-nowrap">
                    <CycleSelector
                        cycle={cycle}
                        onSelect={setCycle}
                        className="mr1 wauto"
                        options={[
                            { text: c('Billing cycle option').t`Monthly`, value: CYCLE.MONTHLY },
                            { text: c('Billing cycle option').t`Annually SAVE 20%`, value: CYCLE.YEARLY },
                            { text: c('Billing cycle option').t`Two years SAVE 33%`, value: CYCLE.TWO_YEARS },
                        ]}
                    />
                    <CurrencySelector currency={currency} onSelect={setCurrency} className="wauto" />
                </div>
            </div>
            {isVPN ? (
                <VpnSubscriptionTable
                    plans={plans}
                    planNameSelected={Name}
                    cycle={cycle}
                    currency={currency}
                    onSelect={handleModal}
                    disabled={loading}
                />
            ) : (
                <MailSubscriptionTable
                    plans={plans}
                    planNameSelected={Name}
                    cycle={cycle}
                    currency={currency}
                    onSelect={handleModal}
                    disabled={loading}
                />
            )}
        </>
    );
};

export default PlansSection;

import React from 'react';
import { c } from 'ttag';
import { updateThemeType } from 'proton-shared/lib/api/settings';
import { PROTON_THEMES, ThemeTypes } from 'proton-shared/lib/themes/themes';

import { useUserSettings, useEventManager, useApi, useLoading, Alert, ThemeCards, useNotifications } from '../..';

const availableThemes = [PROTON_THEMES.DEFAULT, PROTON_THEMES.DARK];

const ThemesSection = () => {
    const api = useApi();
    const { createNotification } = useNotifications();
    const [{ ThemeType }] = useUserSettings();
    const { call } = useEventManager();
    const [loading, withLoading] = useLoading();

    const themes = availableThemes.map(({ identifier, getI18NLabel, src }) => {
        return { identifier, label: getI18NLabel(), src };
    });

    const handleChangeTheme = async (newThemeIdentifier: ThemeTypes) => {
        await api(updateThemeType(newThemeIdentifier));
        await call();
        createNotification({ text: c('Success').t`Theme saved` });
    };

    return (
        <>
            <Alert>{c('Info').t`Choose the look and feel of your mailbox.`}</Alert>
            <Alert type="warning">{c('Info').t`Selecting another mode will override your current mode.`}</Alert>
            <ThemeCards
                list={themes}
                themeIdentifier={ThemeType}
                onChange={(identifier) => withLoading(handleChangeTheme(identifier))}
                disabled={loading}
            />
        </>
    );
};

export default ThemesSection;

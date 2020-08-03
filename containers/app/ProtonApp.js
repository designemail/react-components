import React, { useState, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import createAuthentication from 'proton-shared/lib/authenticationStore';
import createCache from 'proton-shared/lib/helpers/cache';
import { formatUser, UserModel } from 'proton-shared/lib/models/userModel';
import { STATUS } from 'proton-shared/lib/models/cache';
import createSecureSessionStorage from 'proton-shared/lib/createSecureSessionStorage';
import { MAILBOX_PASSWORD_KEY, UID_KEY } from 'proton-shared/lib/constants';

import CompatibilityCheck from './CompatibilityCheck';
import Icons from '../../components/icon/Icons';
import useInstance from '../../hooks/useInstance';
import ConfigProvider from '../config/Provider';
import NotificationsProvider from '../notifications/Provider';
import ModalsProvider from '../modals/Provider';
import ApiProvider from '../api/ApiProvider';
import CacheProvider from '../cache/Provider';
import AuthenticationProvider from '../authentication/Provider';
import RightToLeftProvider from '../rightToLeft/Provider';
import { setTmpEventID } from './loadEventID';
import clearKeyCache from './clearKeyCache';
import { PreventLeaveProvider } from '../../hooks/usePreventLeave';
import { getLocalID } from './authHelper';
import { getPersistedSession } from 'proton-shared/lib/authentication/session';

/** @type any */
const ProtonApp = ({ config, children }) => {
    const authentication = useInstance(() =>
        createAuthentication(createSecureSessionStorage([MAILBOX_PASSWORD_KEY, UID_KEY]))
    );
    const cacheRef = useRef();
    const [UID, setUID] = useState(() => {
        const uid = authentication.getUID();
        if (uid) {
            return uid;
        }
        const localID = getLocalID(window.location.pathname);
        if (localID === undefined) {
            return;
        }
        const persistedSession = getPersistedSession(localID);
        if (!persistedSession?.UID) {
            return;
        }
        authentication.setTmpPersistedSession(persistedSession);
        return persistedSession.UID;

    });
    const tempDataRef = useRef({});

    if (!cacheRef.current) {
        cacheRef.current = createCache();
    }

    const handleLogin = useCallback(({ UID: newUID, EventID, keyPassword, User, LocalID: newLocalID }) => {
        authentication.setUID(newUID);
        authentication.setPassword(keyPassword);
        authentication.setLocalID(newLocalID);

        const oldCache = cacheRef.current;
        if (oldCache) {
            oldCache.clear();
            oldCache.clearListeners();
        }
        const cache = createCache();

        // If the user was received from the login call, pre-set it directly.
        User &&
            cache.set(UserModel.key, {
                value: formatUser(User),
                status: STATUS.RESOLVED,
            });

        setTmpEventID(cache, EventID);

        cacheRef.current = cache;

        setUID(newUID);
    }, []);

    const handleLogout = useCallback(() => {
        authentication.setUID();
        authentication.setPassword();

        tempDataRef.current = {};

        const oldCache = cacheRef.current;
        if (oldCache) {
            clearKeyCache(oldCache);
            oldCache.clear();
            oldCache.clearListeners();
        }

        cacheRef.current = createCache();

        setUID();
    }, []);

    const authenticationValue = useMemo(() => {
        if (!UID) {
            return {
                login: handleLogin,
            };
        }
        return {
            UID,
            ...authentication,
            login: handleLogin,
            logout: handleLogout,
        };
    }, [UID]);

    return (
        <ConfigProvider config={config}>
            <CompatibilityCheck>
                <Icons />
                <RightToLeftProvider>
                    <Router>
                        <React.Fragment key={UID}>
                            <PreventLeaveProvider>
                                <NotificationsProvider>
                                    <ModalsProvider>
                                        <ApiProvider UID={UID} config={config} onLogout={handleLogout}>
                                            <AuthenticationProvider store={authenticationValue}>
                                                <CacheProvider cache={cacheRef.current}>{children}</CacheProvider>
                                            </AuthenticationProvider>
                                        </ApiProvider>
                                    </ModalsProvider>
                                </NotificationsProvider>
                            </PreventLeaveProvider>
                        </React.Fragment>
                    </Router>
                </RightToLeftProvider>
            </CompatibilityCheck>
        </ConfigProvider>
    );
};

ProtonApp.propTypes = {
    config: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default ProtonApp;

import React from 'react';
import Notification from './Notification';
import { NotificationOptions } from './interfaces';

interface Props {
    notifications: NotificationOptions[];
    removeNotification: (id: number) => void;
    hideNotification: (id: number) => void;
}
const NotificationsContainer = ({ notifications, removeNotification, hideNotification }: Props) => {
    const list = notifications.map(({ id, type, text, isClosing, disableAutoClose }) => {
        return (
            <Notification
                key={id}
                isClosing={isClosing}
                type={type}
                onClick={disableAutoClose ? undefined : () => hideNotification(id)}
                onExit={() => removeNotification(id)}
            >
                {text}
            </Notification>
        );
    });

    return <div className="notifications-container flex flex-column flex-items-center">{list}</div>;
};

export default NotificationsContainer;

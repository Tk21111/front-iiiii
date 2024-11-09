// features/notifications/Notification.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    const token = useSelector(selectCurrentToken)

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3500?token=${token}');
        ws.onmessage = (event) => {
            const notification = event.data;
            setNotifications((prev) => [...prev, notification]);
        };

        return () => ws.close();
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;

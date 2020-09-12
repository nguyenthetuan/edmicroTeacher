import React, { useEffect } from 'react'
import PushNotification from 'react-native-push-notification'
import messaging from '@react-native-firebase/messaging';
import { requestNotifications } from 'react-native-permissions';

const registerForPushNotificationsAsync = async () => {
    try {
        if (!await messaging().isRegisteredForRemoteNotifications) {
            await messaging().registerForRemoteNotifications();
        }
        await messaging().requestPermission();
        await requestNotifications(['alert', 'badge', 'sound']);
        const fcmToken = await messaging().getToken();
        console.log("fcmToken", fcmToken);
    } catch (error) {
        console.log(error);
        // alert(error)
    }
};

const ConfigNotification = () => {
    useEffect(() => {
        // config();
        registerForPushNotificationsAsync();
        PushNotification.configure({
            onNotification: function (notification) {
                console.log('REMOTE NOTIFICATION ==>', notification)
                // process the notification here
            },
            // Android only: GCM or FCM Sender ID
            senderID: '826468171337',
            popInitialNotification: true,
            requestPermissions: true
        })
    }, [])
    return null
}
export default ConfigNotification
import React, {useEffect} from 'react';
import {useHistory} from 'react-router';
import {PushNotifications} from '@capacitor/push-notifications';
import {useAppSelector} from '../../app/hook';
import {selectUser, setFcmToken} from '../../features/user/userSlice';
import userAPIs from '../../api/user';
import {isPlatform} from '@ionic/core';
import {fetchToken, onMessageListener} from '../../services/firebase';
import {useIonToast} from '@ionic/react';
import {MessagePayload} from 'firebase/messaging';
import { useDispatch } from 'react-redux';

type Props = {};

const PushNotification = (props: Props) => {
  // Controls:
  const router = useHistory();
  const [presentToast, dismissToast] = useIonToast();

  // Redux:
  const user = useAppSelector(selectUser);
  const dispatch = useDispatch()

  useEffect(() => {
    if (user.identity) {
      if (isPlatform('capacitor')) {
        registerNotifications();
        addListeners();
      } else {
        // WEB:
        fetchToken(async (token) => {
          updateUserFCMToken(token);
          dispatch(setFcmToken(token))
        });
        try {
          onMessageListener((payload) => {
            console.log("Noti: ", payload);
            presentToast({
              header: payload.notification?.title,
              message: payload.notification?.body,
              duration: 3000,
              color: 'light',
              mode: 'ios',
              position: 'top',
            });
          });
        } catch (e) {
          console.log('failed: ', e);
        }
      }
    }
  }, [user]);

  const updateUserFCMToken = async (token: string) => {
    try {
      await userAPIs.appToken(token);
    } catch (e) {
      console.log('Error add apptoken for user: ', e);
    }
  };

  const addListeners = async () => {
    await PushNotifications.removeAllListeners();

    await PushNotifications.addListener('registration', async (token) => {
      console.info('Registration token: ', token.value);
      updateUserFCMToken(token.value);
      dispatch(setFcmToken(token.value));
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
      presentToast({
        header: notification?.title,
        message: notification?.body,
        duration: 3000,
        color: 'light',
        mode: 'ios',
        position: 'top',
      });
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification.notification.data);
      if (notification.notification.data.url) {
        router.push(notification.notification.data.url);
      }
    });
  };

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
    await PushNotifications.removeAllListeners();
    await PushNotifications.register();
  };

  const getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  };

  return <></>;
};

export default PushNotification;

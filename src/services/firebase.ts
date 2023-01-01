// Import the functions you need from the SDKs you need
import {isPlatform} from '@ionic/core';
import {initializeApp} from 'firebase/app';
import {getMessaging, getToken, onMessage, isSupported, Messaging, MessagePayload} from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA_k1mqmdzmKeaRJTVsMvSHeBZY4VpVep4',
  authDomain: 'push-notification-a9505.firebaseapp.com',
  projectId: 'push-notification-a9505',
  storageBucket: 'push-notification-a9505.appspot.com',
  messagingSenderId: '146925385123',
  appId: '1:146925385123:web:d167dde6a53df07fb61616',
  measurementId: 'G-2GL6ZGJQJ6',
};

const checkIfBrowserSupportFCM = async () => {
  const isSupportFCM = await isSupported();
  if (isSupportFCM) messaging = getMessaging();
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var messaging = {} as Messaging;
checkIfBrowserSupportFCM();

const fetchToken = async (onGetTokenSuccess: (token: string) => void) => {
  const myFCMServiceWorker = await navigator.serviceWorker.register('/1CXAPP/firebase-messaging-sw.js', {
    scope: '/1CXAPP/firebase-cloud-messaging-push-scope',
  });
  return getToken(messaging, {
    vapidKey: process.env.REACT_APP_FCM_VAPID_KEY,
    serviceWorkerRegistration: myFCMServiceWorker,
  })
    .then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log('Current token retrieved: ', currentToken);
        onGetTokenSuccess(currentToken);
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
};

const onMessageListener = (callback: (msg: MessagePayload) => void) => {
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

export {app, messaging, fetchToken, onMessageListener};

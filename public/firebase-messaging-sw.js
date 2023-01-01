self.importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
self.importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyA_k1mqmdzmKeaRJTVsMvSHeBZY4VpVep4",
  authDomain: "push-notification-a9505.firebaseapp.com",
  projectId: "push-notification-a9505",
  storageBucket: "push-notification-a9505.appspot.com",
  messagingSenderId: "146925385123",
  appId: "1:146925385123:web:d167dde6a53df07fb61616",
  measurementId: "G-2GL6ZGJQJ6"
}

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  // self.registration.showNotification(notificationTitle,
  //   notificationOptions);
});

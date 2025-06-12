importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDZKrZA67bB-Z4_anj0G6v0MFqQwFF2q5s",
  authDomain: "fms-sample-79335.firebaseapp.com",
  projectId: "fms-sample-79335",
  messagingSenderId: "737594140295",
  appId:  "1:737594140295:web:b3c0482a7608f7a6073a22",
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.data.title || 'Default Title';
  const notificationOptions = {
    body: payload.data.body || 'Default body',
    icon: payload.data.icon || '/default-icon.png',
    data: {
      click_action: payload.data.click_action || '/',
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.navigate(event.notification.data.click_action);
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.click_action);
      }
    })
  );
});
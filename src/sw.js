// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
if ('function' === typeof importScripts) {
    importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js');
  }
  firebase.initializeApp({
    messagingSenderId: "599896184843"
  });
  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = firebase.messaging();
  self.addEventListener('push', function (event) {
    
    var payload = event.data ? event.data.text() : 'no payload';
      const promiseChain = self.registration.showNotification(payload.data.title,{
          body: payload.data.message    
});
      //Ensure the toast notification is displayed before exiting this functi$
      event.waitUntil(promiseChain);
  
});
  messaging.setBackgroundMessageHandler(payload => {
  
    const notificationTitle = payload.data.title
    const notificationOptions = {
      body: payload.data.message
    };
    //Show the notification :)
   return  self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });
  self.addEventListener('notificationclose', (e) => {
    console.log('Closed notification: ' + e);
  });
  self.addEventListener('notificationclick', event => {
    const rootUrl = new URL('/', location).href;
    event.notification.close();
    // Enumerate windows, and call window.focus(), or open a new one.
    event.waitUntil(
      clients.matchAll().then(matchedClients => {
        for (let client of matchedClients) {
          if (client.url === rootUrl) {
            return client.focus();
          }
	}
	return clients.openWindow("/");
      })
    );
  });
  
  /* Serve cached content when offline */
  self.addEventListener('fetch', function(e) {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  });
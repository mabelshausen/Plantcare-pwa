"use strict"

self.addEventListener("install", function(e) {
    console.log("Performing service worker install ...");
});

self.addEventListener("fetch", function(e) {
    e.respondWith(fetch(e.request)
        .catch(function() {
            return new Response("<h1>Content not available</h1>", {headers : {"Content-Type": "text/html"}});
        }));
});

self.addEventListener("push", function(e) {
    const data = e.data.json();
    const msg = `${data["plant"]} needs to be watered!`;

    self.registration.showNotification(msg, { showTrigger: new TimeStampTrigger(data["timestamp"]) });
});
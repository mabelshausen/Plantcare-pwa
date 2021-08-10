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
    let msg = e.data.text();
    self.registration.showNotification(msg);
});
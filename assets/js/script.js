"use strict"

const store = localforage.createInstance({name: "plantcare"});
const baseUrl = "http://192.168.0.172:8000/api/";
const notificationsUrl = "http://localhost:8001/";
const publicKey = 'BIuCnGhIL7_peUkT7MTVcjYn97MqSR3ye-7_c6p3McLP0Sg9g3Z1IU_Nrl8sdUh081AgGSI7SdbP57u-dqRy6XE';

document.addEventListener("DOMContentLoaded", init);

function getPlants() {
    store.getItem("plants").then(function(plants) {
        plants === null ? downloadPlants() : fillPlantList(plants);
    });
}

function downloadPlants() {
    fetch(baseUrl + "plants")
    .then(response => response.json())
    .then(function(res) {
        store.setItem("plants", res);
        fillPlantList(res);
    });
}

function getRooms() {
    store.getItem("rooms").then(function(rooms) {
        if (rooms === null) downloadRooms();
    });
}

function downloadRooms() {
    fetch(baseUrl + "rooms")
    .then(response => response.json())
    .then(function(res) {
        store.setItem("rooms", res);
    });
}

function fillPlantList(plants) {
    const plantlist = document.getElementById("plantlist");

    plants.forEach(function(plant) {
        var listItem = document.createElement("li");
        plantlist.append(listItem);
        listItem.addEventListener("click", function(ev) {
            navigatePlantDetail(plant.id);
        });

        var plantName = document.createElement("div");
        plantName.appendChild(document.createTextNode(plant.name));

        var waterIn = document.createElement("div");
        waterIn.appendChild(document.createTextNode(nextWatering(plant)));

        listItem.appendChild(plantName);
        listItem.appendChild(waterIn);
    });
}

function nextWatering(plant) {
    const timeDiff = (new Date()) - (new Date(plant.lastWatered));
    const hoursSinceLastWatering = Math.ceil(timeDiff / (1000 * 60 * 60));
    const  maxHoursBetweenWaterings = plant.waterFreq * 24 

    if (maxHoursBetweenWaterings > hoursSinceLastWatering) {
        return `Water in: ${maxHoursBetweenWaterings - hoursSinceLastWatering} hours`;
    } else {
        return "Water now!"
    }
}

function navigatePlantDetail(plantId) {
    window.location = `plantDetail.html?id=${plantId}`;
}

function navigatePlantForm() {
    window.location = "plantForm.html";
}

function init() {
    registerServiceWorker();

    getPlants();
    getRooms();

    document.getElementById("add").addEventListener("click", function(ev) {
        navigatePlantForm();
    });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("/sw.js").then(function(res) {
            console.log("Successfully registered service worker with scope:", res.scope);
            registerForNotifications();
        }).catch(function(err) {
            console.log("Error registering service worker:", err);
        });
    }
}

function registerForNotifications() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            registerPush();
        } else {
            console.log("Notification permission not granted.");
        }
    });
}

function registerPush() {
    let subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
    };

    navigator.serviceWorker.ready.then(reg => {
        return reg.pushManager.subscribe(subscribeOptions);
    }).then(sub => {
        registerSubscription(sub);
    });
}

function registerSubscription(sub) {
    fetch(notificationsUrl + "register", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sub) 
    });
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
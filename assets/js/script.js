"use strict"

const store = localforage.createInstance({name: "plantcare"});
const baseUrl = "http://192.168.0.172:8000/api/";

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
        }).catch(function(err) {
            console.log("Error registering service worker:", err);
        });
    }
}
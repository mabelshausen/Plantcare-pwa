"use strict"

const store = localforage.createInstance({name: "plantcare"});
const baseUrl = "http://192.168.0.172:8000/api/plants/";
const notificationsUrl = "http://localhost:8001/";
var plant;

document.addEventListener("DOMContentLoaded", init);

function fillPlantDetails() {
    const plantName = document.getElementById("plantName");
    const plantSciName = document.getElementById("plantSciName");
    const plantAge = document.getElementById("plantAge");
    const plantWaterFreq = document.getElementById("plantWaterFreq");
    const plantLastWatered = document.getElementById("plantLastWatered");
    const room = document.getElementById("room");

    plantName.appendChild(document.createTextNode(plant.name));
    plantSciName.appendChild(document.createTextNode(plant.sciName));
    plantAge.appendChild(document.createTextNode(`${plant.age} years old`));
    plantWaterFreq.appendChild(document.createTextNode(`Water every ${plant.waterFreq} days`));
    plantLastWatered.appendChild(document.createTextNode(`Last watered on ${new Date(plant.lastWatered).toLocaleDateString()}`));

    store.getItem("rooms").then(function(rooms) {
        room.appendChild(document.createTextNode(`Room: ${rooms[rooms.findIndex(r => r.id == plant.room_id)].name}`));
    });
}

function waterPlant() {
    var oldWaterTime = plant.lastWatered;
    plant.lastWatered = new Date().toISOString();

    fetch(baseUrl + plant.id, {
        method: "PUT",
        body: JSON.stringify(plant),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    }).then(() => {
        store.getItem("plants").then(function(plants) {
            var index = plants.findIndex(p => p.id  == plant.id);
            plants[index] = plant;
            store.setItem("plants", plants);
        });

        document.getElementById("plantLastWatered").textContent = `Last watered on ${new Date(plant.lastWatered).toLocaleDateString()}`;
    }).then(() => {
        fetch(notificationsUrl + "water", {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({plant: plant.name, timestamp: nextWatering()})
        });
    })
    .catch((error) => {
        console.error("Error:", error);
        plant.lastWatered = oldWaterTime;
    });
}

function nextWatering() {
    return new Date() + (plant.waterFreq * 60 * 60 * 1000);
}

function deletePlant() {
    fetch(baseUrl + plant.id, {
        method: "DELETE"
    }).then(() => {
        store.getItem("plants").then(function(plants) {
            var index = plants.findIndex(p => p.id  == plant.id);
            plants.splice(index, 1);
            store.setItem("plants", plants);
        });

        window.location = "index.html";
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function navigatePlantEdit(plantId) {
    window.location = `plantForm.html?id=${plantId}`;
}

function init() {
    const plantId = (new URLSearchParams(window.location.search)).get('id');

    store.getItem("plants").then(function(plants) {
        plant = plants.find(p => p.id == plantId);
    }).then(function() {
        fillPlantDetails();
    });

    document.getElementById("water").addEventListener("click", function(ev) {
        waterPlant();
    });
    document.getElementById("edit").addEventListener("click", function(ev) {
        navigatePlantEdit(plantId);
    });
    document.getElementById("delete").addEventListener("click", function(ev) {
        deletePlant(plantId);
    });
}
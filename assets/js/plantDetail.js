"use strict"

const store = localforage.createInstance({name: "plantcare"});
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

function navigatePlantEdit(plantId) {
    window.location = `plantForm.html?id=${plantId}`;
}

function navigatePlantDelete(plantId) {
    window.location = `deletePlant.html?id=${plantId}`;
}

function init() {
    const plantId = (new URLSearchParams(window.location.search)).get('id');

    store.getItem("plants").then(function(plants) {
        plant = plants.find(p => p.id == plantId);
    }).then(function() {
        fillPlantDetails();
    });

    document.getElementById("edit").addEventListener("click", function(ev) {
        navigatePlantEdit(plantId);
    });
    document.getElementById("delete").addEventListener("click", function(ev) {
        navigatePlantDelete(plantId);
    });
}
"use strict"

const store = localforage.createInstance({name: "plantcare"});
const baseUrl = "http://192.168.0.172:8000/api/plants/";
var plant;

document.addEventListener("DOMContentLoaded", init);

function fillPlantDetails() {
    const plantName = document.getElementById("plantName");
    const plantSciName = document.getElementById("plantSciName");
    const plantAge = document.getElementById("plantAge");
    const plantWaterFreq = document.getElementById("plantWaterFreq");
    const plantLastWatered = document.getElementById("plantLastWatered");

    plantName.appendChild(document.createTextNode(plant.name));
    plantSciName.appendChild(document.createTextNode(plant.sciName));
    plantAge.appendChild(document.createTextNode(`${plant.age} years old`));
    plantWaterFreq.appendChild(document.createTextNode(`Water every ${plant.waterFreq} days`));
    plantLastWatered.appendChild(document.createTextNode(`Last watered on ${new Date(plant.lastWatered).toLocaleDateString()}`));
}

function init() {
    const plantId = (new URLSearchParams(window.location.search)).get('id');
    store.getItem("plants").then(function(plants) {
        plant = plants.find(p => p.id == plantId);
    }).then(function() {
        fillPlantDetails();
    });
}
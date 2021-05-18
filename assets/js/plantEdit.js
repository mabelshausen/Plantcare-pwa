"use strict"

const store = localforage.createInstance({name: "plantcare"});
const baseUrl = "http://192.168.0.172:8000/api/plants/";
var plant;
var isEdit;

document.addEventListener("DOMContentLoaded", init);

function fillPlantForm() {
    document.getElementById("name").setAttribute("value", plant.name);
    document.getElementById("sciName").setAttribute("value", plant.sciName);
    document.getElementById("age").setAttribute("value", plant.age);
    document.getElementById("waterFreq").setAttribute("value", plant.waterFreq);
}

function savePlant() {
    
}

function navigateBack() {
    if (isEdit) {
        window.location  = `plantDetail.html?id=${plant.id}`;
    } else {
        window.location  = "index.html";
    }
}

function init() {
    const plantId = (new URLSearchParams(window.location.search)).get('id');
    isEdit = (plantId !== null);

    if (isEdit) {
        store.getItem("plants").then(function(plants) {
            plant = plants.find(p => p.id == plantId);
        }).then(function() {
            fillPlantForm();
        });
    }

    document.getElementById("form").addEventListener("submit", function(ev) {
        ev.preventDefault();
        savePlant();
    });
    document.getElementById("cancel").addEventListener("click", function(ev) {
        navigateBack();
    });
}
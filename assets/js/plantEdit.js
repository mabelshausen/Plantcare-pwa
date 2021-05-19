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
    const form = document.getElementById('form');

    plant.name = form.elements['name'].value;
    plant.sciName = form.elements['sciName'].value;
    plant.age = form.elements['age'].value;
    plant.waterFreq = form.elements['waterFreq'].value

    console.log(JSON.stringify(plant));
    if (isEdit) {
        editPlant();
    } else {
        postPlant();
    }
}

function editPlant() {
    fetch(baseUrl + plant.id, {
        method: "PUT",
        body: JSON.stringify(plant),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        store.getItem("plants").then(function(plants) {
            var index = plants.findIndex(p => p.id  == plant.id);
            plants[index] = plant;
            store.setItem("plants", plants);
        });

        window.location = `plantDetail.html?id=${plant.id}`;
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function postPlant() {
    plant.lastWatered = new Date().toISOString();
    plant.room_id = 1;

    fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(plant),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })
    .then(respone => respone.json())
    .then(res => {
        plant.id = res;

        store.getItem("plants").then(function(plants) {
            plants.push(plant);
            store.setItem("plants", plants);
        });

        window.location = `plantDetail.html?id=${plant.id}`;
    })
    .catch((error) => {
        console.error("Error:", error);
    });
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
    } else {
        plant = {};
    }

    document.getElementById("form").addEventListener("submit", function(ev) {
        ev.preventDefault();
        savePlant();
    });
    document.getElementById("cancel").addEventListener("click", function(ev) {
        navigateBack();
    });
}
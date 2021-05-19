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
    var select = document.getElementById("room_id");
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value == plant.room_id) {
            select.options[i].selected = true;
            break;
        }

    }
}

function savePlant() {
    const form = document.getElementById('form');

    plant.name = form.elements['name'].value;
    plant.sciName = form.elements['sciName'].value;
    plant.age = form.elements['age'].value;
    plant.waterFreq = form.elements['waterFreq'].value;
    plant.room_id = form.elements['room_id'].value;

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

function fillSelect() {
    var select = document.getElementById("room_id");
    store.getItem("rooms").then(function(rooms) {
        rooms.forEach(room => {
            var el = document.createElement("option");
            el.textContent = room.name;
            el.value = room.id;
            select.appendChild(el);
        });
    });
}

function init() {
    const plantId = (new URLSearchParams(window.location.search)).get('id');
    isEdit = (plantId !== null);

    fillSelect();

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
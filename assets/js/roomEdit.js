"use strict"

const store = localforage.createInstance({name: "plantcare"});
const baseUrl = "http://192.168.0.172:8000/api/rooms/";
var room;
var isEdit;

document.addEventListener("DOMContentLoaded", init);

function fillRoomForm() {
    document.getElementById("name").setAttribute("value", room.name);
}

function saveRoom() {
    const form = document.getElementById('form');

    room.name = form.elements['name'].value;

    if (isEdit) {
        editRoom();
    } else {
        postRoom();
    }
}

function editRoom() {
    fetch(baseUrl + room.id, {
        method: "PUT",
        body: JSON.stringify(room),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        store.getItem("rooms").then(function(rooms) {
            var index = rooms.findIndex(r => r.id  == room.id);
            rooms[index] = room;
            store.setItem("rooms", rooms);
        });

        window.location = "rooms.html";
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function postRoom() {
    fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(room),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })
    .then(respone => respone.json())
    .then(res => {
        room.id = res;

        store.getItem("rooms").then(function(rooms) {
            rooms.push(room);
            store.setItem("rooms", rooms);
        });

        window.location = "rooms.html";
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function navigateBack() {
    window.location = "rooms.html";
}

function init() {
    const roomId = (new URLSearchParams(window.location.search)).get('id');
    isEdit = (roomId !== null);

    if (isEdit) {
        store.getItem("rooms").then(function(rooms) {
            room = rooms.find(r => r.id == roomId);
        }).then(function() {
            fillRoomForm();
        });
    } else {
        room = {};
    }

    document.getElementById("form").addEventListener("submit", function(ev) {
        ev.preventDefault();
        saveRoom();
    });
    document.getElementById("cancel").addEventListener("click", function(ev) {
        navigateBack();
    });
}
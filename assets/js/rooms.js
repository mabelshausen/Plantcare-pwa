"use strict"

const store = localforage.createInstance({name: "plantcare"});

document.addEventListener("DOMContentLoaded", init);

function getRooms() {
    store.getItem("rooms").then(function(rooms) {
        fillRoomList(rooms);
    });
}

function fillRoomList(rooms) {
    const roomList = document.getElementById("roomList");
    rooms.forEach(room => {
        var roomName = document.createElement("h4");
        roomName.textContent = room.name;
        roomList.appendChild(roomName);

        var plantList = document.createElement("ul");
        roomList.appendChild(plantList);

        store.getItem("plants").then(function(plants) {
            var roomPlants = plants.filter(p => p.room_id == room.id);

            roomPlants.forEach(plant => {
                var plantListItem = document.createElement("li");
                plantList.appendChild(plantListItem);

                plantListItem.addEventListener("click", function(ev) {
                    navigatePlantDetail(plant.id);
                });

                var plantName = document.createElement("div");
                plantName.appendChild(document.createTextNode(plant.name));
                plantListItem.appendChild(plantName);
            });
        });
    });
}

function navigatePlantDetail(plantId) {
    window.location = `plantDetail.html?id=${plantId}`;
}

function init() {
    getRooms();
}
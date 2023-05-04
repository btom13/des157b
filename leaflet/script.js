(function () {
  "use strict";
  var map = L.map("map").setView([38.55, -121.74], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  var davis = L.circle([38.55, -121.74], {
    color: "red",
    fillColor: "red",
    fillOpacity: 0.1,
    radius: 4500,
  }).addTo(map);
  var campus = L.circle([38.538, -121.76], {
    color: "green",
    fillColor: "green",
    fillOpacity: 0.3,
    radius: 1000,
  }).addTo(map);

  var downtown = L.circle([38.543, -121.742], {
    color: "blue",
    fillColor: "blue",
    fillOpacity: 0.3,
    radius: 700,
  }).addTo(map);

  var popup = L.popup();

  campus.on("click", (e) => {
    popup.setLatLng(e.latlng).setContent("This is UC Davis").openOn(map);
  });
  downtown.on("click", (e) => {
    popup.setLatLng(e.latlng).setContent("This is downtown Davis").openOn(map);
  });
  davis.on("click", (e) => {
    popup.setLatLng(e.latlng).setContent("This is Davis").openOn(map);
  });
})();

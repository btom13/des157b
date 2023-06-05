(async () => {
  // const canvas = document.getElementById("compass");
  // const ctx = canvas.getContext("2d");
  // canvas.width = 300;
  // canvas.height = 300;
  // const centerX = canvas.width / 2;
  // const centerY = canvas.height / 2;
  // const compassAngle = 45;
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.beginPath();
  // ctx.arc(centerX, centerY, 130, 0, 2 * Math.PI);
  // ctx.lineWidth = 4;
  // ctx.strokeStyle = "#333";
  // ctx.stroke();
  // ctx.beginPath();
  // ctx.moveTo(centerX, centerY);
  // const endX = centerX + Math.sin(compassAngle * (Math.PI / 180)) * 100;
  // const endY = centerY - Math.cos(compassAngle * (Math.PI / 180)) * 100;
  // ctx.lineTo(endX, endY);
  // ctx.lineWidth = 2;
  // ctx.strokeStyle = "red";
  // ctx.stroke();
  // ctx.beginPath();
  // ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
  // ctx.fillStyle = "black";
  // ctx.fill();
  // ctx.font = "16px Arial";
  // ctx.fillStyle = "#333";
  // ctx.textAlign = "center";
  // ctx.fillText(`Angle: ${compassAngle}°`, centerX, centerY + 80);

  const img = document.querySelector("#img");
  const guess = document.querySelector("#guess");
  const dialog = document.querySelector("dialog");
  const dialogText = document.querySelector("p");
  const but = document.querySelector("#dialog-click");
  let total_score = 0;
  const m = L.map("map").setView([38.5382, -121.7617], 14);
  // https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
  function meters(lat1, lon1, lat2, lon2) {
    // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
    var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
  }
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 12,
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(m);
  let position;

  function onMapClick(e) {
    if (position) {
      m.removeLayer(position);
    }
    guess.classList.remove("not-chosen");
    position = L.circle(e.latlng, {
      color: "black",
      fillColor: "#000",
      fillOpacity: 0.5,
      radius: 10,
    }).addTo(m);
  }

  m.on("click", onMapClick);

  const map = document.querySelector("#map");
  const maximize = document.querySelector(".fa-compress");
  maximize.addEventListener("click", () => {
    map.classList.toggle("max");
    maximize.classList.toggle("fa-compress");
    maximize.classList.toggle("fa-maximize");
  });

  const locations = await fetch("./images/location.json");
  const data = await locations.json();
  const images = Object.keys(data);
  const image_arr = [];
  let location, circle;
  while (image_arr.length < 5) {
    const random = Math.floor(Math.random() * images.length);
    if (!image_arr.includes(images[random])) {
      image_arr.push(images[random]);
    }
  }
  let current = 0;
  img.alt = "image of davis";

  function next() {
    img.src = `./images/${image_arr[current]}`;
    location = data[image_arr[current]];
    guess.classList.add("not-chosen");
    current++;
    if (position) m.removeLayer(position);
    if (circle) m.removeLayer(circle);
  }
  but.addEventListener("click", (e) => {
    if (current === 4) {
      guess.classList.add("not-chosen");
      if (position) m.removeLayer(position);
      if (circle) m.removeLayer(circle);
      setTimeout(() => {
        dialogText.textContent = `You scored ${total_score} points!`;
        dialog.show();
        but.style.display = "none";
      }, 10);
      return;
    }
    next();
  });
  guess.addEventListener("click", () => {
    if (guess.classList.contains("not-chosen")) return;
    const lat = position._latlng.lat;
    const lng = position._latlng.lng;
    const distance = Math.sqrt(
      Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2)
    );
    const score = Math.min(
      100,
      Math.max(0, Math.round(120 * (1 - distance / 0.01)))
    );
    circle = L.circle([location.lat, location.lng], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 10,
    }).addTo(m);
    dialogText.textContent = `You were ${Math.round(
      meters(lat, lng, location.lat, location.lng),
      2
    )} meters away. You scored ${score} points.`;
    total_score += score;
    dialog.show();
  });
  next();
})();

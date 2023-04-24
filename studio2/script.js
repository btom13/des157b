(() => {
  "use strict";

  let a = fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      const dat = document.getElementById("data");
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const val = data[key];
          const pair = document.createElement("div");
          const time = document.createElement("h1");
          time.innerHTML = key;
          const cats = document.createElement("h2");
          cats.innerHTML = val;
          pair.classList.add("datum");
          pair.appendChild(time);
          pair.appendChild(cats);
          dat.appendChild(pair);
        }
      }
    });

  // .then((data) => data);
  // console.log(a);
})();

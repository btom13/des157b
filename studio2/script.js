(() => {
  "use strict";
  const acceleration = -1;
  const body = document.querySelector("body");

  class Cat {
    constructor(x = undefined, y = undefined, vx = undefined, vy = undefined) {
      this.x = Math.round(Math.random() * (body.offsetWidth - 100) + 50);
      this.y = Math.round(Math.random() * (body.offsetHeight - 600) + 350);
      this.vx = Math.round(Math.random() * 20 - 10);
      this.vy = Math.round(Math.random() * 10 + 5);
      this.bounce = 0;
      this.obj = document.createElement("div");
      this.obj.className = "cat";
      this.obj.innerHTML = "This is a cat";
      this.obj.style.bottom = this.y + "px";
      this.obj.style.left = this.x + "px";
      body.appendChild(this.obj);
    }
    update(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt + (1 / 2) * dt * dt * acceleration;
      if (this.y < 0) {
        if (this.bounce < 2) {
          this.bounce += 1;
          this.vy *= -0.8;
          this.x += this.vx * dt;
          this.y += this.vy * dt + (1 / 2) * dt * dt * acceleration;
        }
      }
      if (this.x < 0 || this.x > body.offsetWidth - this.obj.offsetWidth) {
        this.vx *= -1;
        this.x += this.vx * dt;
        this.y += this.vy * dt + (1 / 2) * dt * dt * acceleration;
      }
      // console.log(this.obj.offsetHeight);
      if (this.y < 0 - this.obj.offsetHeight) return this.delete();
      this.vy = this.vy + acceleration * dt;
      this.obj.style.bottom = this.y + "px";
      this.obj.style.left = this.x + "px";
    }
    delete() {
      this.obj.remove();
      return -1;
    }
  }
  const arr = [];
  // arr.push(new Cat());
  // arr.push(new Cat());
  // arr.push(new Cat());
  // arr.push(new Cat());
  arr.forEach((element, index) => {
    let interval = setInterval(() => {
      if (element.update(0.1) == -1) {
        clearInterval(interval);
        arr.splice(index, 1);
      }
    }, 1);
  });

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
          pair.onclick = () => {
            const a = [];
            for (let i = 0; i < parseInt(val); i++) {
              a.push(new Cat());
            }
            a.forEach((element, index) => {
              let interval = setInterval(() => {
                if (element.update(0.1) == -1) {
                  clearInterval(interval);
                  arr.splice(index, 1);
                }
              }, 1);
            });
          };
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

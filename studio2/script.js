(() => {
  "use strict";
  const acceleration = -1;
  const body = document.querySelector("#cat-div");

  class Cat {
    constructor(x = undefined, y = undefined, vx = undefined, vy = undefined) {
      this.bounce = 0;
      this.obj = document.createElement("div");
      this.obj.className = "cat";
      this.obj.innerHTML = "This is a cat";
      this.x = Math.round(
        Math.random() * (body.offsetWidth - 100) + this.obj.offsetWidth
      );
      this.y = Math.round(Math.random() * (body.offsetHeight - 600) + 350);
      this.vx = Math.round(Math.random() * 20 - 10);
      this.vy = Math.round(Math.random() * 10 + 5);
      this.obj.style.bottom = this.y + "px";
      this.obj.style.left = this.x + "px";
      this.held = 0;
      this.mdown = this.mousedown.bind(this);
      this.mup = this.mouseup.bind(this);
      this.obj.addEventListener("mousedown", this.mdown);
      body.appendChild(this.obj);
    }

    mouseup(event) {
      this.held = 0;
      body.removeEventListener("mousemove", this.dragger);
      window.removeEventListener("mouseup", this.mup);
      let dt = Date.now() - this.pastTime[1];
      if (dt == 0) {
        return;
      }
      this.vx = ((this.x - this.pastx[1]) / dt) * 10;
      this.vy = ((this.y - this.pasty[1]) / dt) * 10;
    }

    mousedown(event) {
      this.pastx = [this.x, this.x];
      this.pasty = [this.y, this.y];
      let date = Date.now();
      this.pastTime = [date, date];

      this.vx = 0;
      this.vy = 0;
      this.held = 1;
      this.relativeX = event.layerX;
      this.relativeY = event.layerY;
      this.dragger = this.drag.bind(this);
      window.addEventListener("mouseup", this.mup);
      body.addEventListener("mousemove", this.dragger);
    }

    drag(event) {
      this.pastTime[1] = this.pastTime[0];
      this.pastx[1] = this.pastx[0];
      this.pasty[1] = this.pasty[0];
      this.pastTime[0] = Date.now();
      this.pastx[0] = this.x;
      this.pasty[0] = this.y;
      this.x = event.clientX - this.relativeX;
      this.y =
        body.offsetHeight -
        (event.clientY - this.relativeY) -
        this.obj.offsetHeight;
      if (this.x < 0) this.x = 0;
      if (this.x > body.offsetWidth - this.obj.offsetWidth)
        this.x = body.offsetWidth - this.obj.offsetWidth;
      if (this.y < 0) this.y = 0;
      if (this.y > body.offsetHeight - this.obj.offsetHeight)
        this.y = body.offsetHeight - this.obj.offsetHeight;
      this.obj.style.bottom = this.y + "px";
      this.obj.style.left = this.x + "px";
    }

    update(dt) {
      if (this.held) {
        return;
      }
      this.x += this.vx * dt;
      this.y += this.vy * dt + (1 / 2) * dt * dt * acceleration;

      // floor collison
      if (this.y < 0) {
        if (this.bounce < 2) {
          this.bounce += 1;
          this.vy *= -0.9;
          this.x += this.vx * dt;
          this.y += this.vy * dt + (1 / 2) * dt * dt * acceleration;
        }
      }

      // ceiling collision
      if (this.y > body.offsetHeight - this.obj.offsetHeight) {
        this.vy *= -1;
        this.x += this.vx * dt;
        this.y += this.vy * dt + (1 / 2) * dt * dt * acceleration;
      }

      // wall collision
      if (this.x < 0 || this.x > body.offsetWidth - this.obj.offsetWidth) {
        this.vx *= -1;
        this.x += this.vx * dt;
        this.y += this.vy * dt + (1 / 2) * dt * dt * acceleration;
      }

      // if it goes offscreen, delete it
      if (this.y < 0 - this.obj.offsetHeight) return this.delete();
      // change y velocity
      this.vy = this.vy + acceleration * dt;
      this.obj.style.bottom = this.y + "px";
      this.obj.style.left = this.x + "px";
    }

    // delete html element
    delete() {
      this.obj.remove();
      return -1;
    }
  }
  const arr = [];

  let a = fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      const dat = document.getElementById("data");
      for (const key in data) {
        console.log(key);
        if (Object.hasOwnProperty.call(data, key)) {
          const val = data[key];
          const pair = document.createElement("div");
          const time = document.createElement("h2");
          time.innerHTML = key;
          const cats = document.createElement("h3");
          cats.innerHTML = val;
          pair.onclick = () => {
            const a = [];
            for (let i = 0; i < parseInt(val); i++) {
              a.push(new Cat());
            }
            a.forEach((element) => {
              arr.push(element);
            });
            a.forEach((element, index) => {
              let interval = setInterval(() => {
                if (element.update(0.1) == -1) {
                  clearInterval(interval);
                  a.splice(index, 1);
                  arr.splice(arr.indexOf(element), 1);
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
})();

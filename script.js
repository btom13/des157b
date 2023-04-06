function change_banner(banner) {
  if (banner.width < 1100) {
    console.log(banner);
  }
}

(function () {
  "use strict";
  const button = document.querySelector("button");
  const body = document.querySelector("body");
  const banner = document.querySelector("#banner");
  const sections = document.querySelectorAll("section");
  const ban = document.getElementById("banner");
  let mode = "dark";
  addEventListener("resize", (event) => {
    let width = event.target.innerWidth;
    if (width < 1200) {
    }
    change_banner(getComputedStyle(ban));
    // console.log(event.target);
  });

  button.addEventListener("click", function () {
    if (mode === "dark") {
      body.classList.add("switch");
      banner.classList.add("switch");
      button.classList.add("switch");
      for (const section of sections) {
        section.classList.add("switch");
      }
      mode = "light";
    } else {
      body.classList.remove("switch");
      banner.classList.remove("switch");
      button.classList.remove("switch");
      for (const section of sections) {
        section.classList.remove("switch");
      }
      mode = "dark";
    }
  });
})();

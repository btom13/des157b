(() => {
  ("use strict");
  const restart = document.querySelector(".fa-rotate-left");
  const Cross = document.querySelector("#Cross");
  const F2L = document.querySelector("#F2L");
  const OLL = document.querySelector("#OLL");
  const PLL = document.querySelector("#PLL");
  const vid = document.querySelector("#video");
  let times = [0, 2.44, 12.26, 14.21, 17.09];
  let objs = [Cross, F2L, OLL, PLL];
  vid.ontimeupdate = (event) => {
    let time = event.target.currentTime;
    for (let i = 0; i < objs.length; i++) {
      if (times[i] < time && time < times[i + 1]) {
        objs[i].classList.add("show");
      } else {
        objs[i].classList.remove("show");
      }
    }
  };
  for (let i = 0; i < objs.length; i++) {
    objs[i].addEventListener("click", () => {
      restart.style.display = "none";
      vid.currentTime = times[i];
      vid.play();
    });
  }

  // restart.sty("display", "block");
  // console.log((restart.style.display = "block"));
  restart.addEventListener("click", () => {
    restart.style.display = "none";
    vid.currentTime = 0;
    vid.play();
  });
  vid.addEventListener("ended", () => {
    restart.style.display = "block";
  });
  // restart.addEventListener("click", function () {
  //   if (!document.fullscreenElement) {
  //     document.documentElement.requestFullscreen();
  //   } else {
  //     document.exitFullscreen();
  //   }
  // });
})();

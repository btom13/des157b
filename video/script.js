(() => {
  ("use strict");
  const restart = document.querySelector(".fa-rotate-left");
  const Cross = document.querySelector("#Cross");
  const F2L = document.querySelector("#F2L");
  const OLL = document.querySelector("#OLL");
  const PLL = document.querySelector("#PLL");
  const vid = document.querySelector("#video");
  let times = [0, 2440, 12260, 14210, 17090];
  let objs = [Cross, F2L, OLL, PLL];
  vid.ontimeupdate = (l) => {
    let time = l.timeStamp;
    for (let i = 0; i < objs.length; i++) {
      if (times[i] < time && time < times[i + 1]) {
        objs[i].classList.add("show");
      } else {
        objs[i].classList.remove("show");
      }
    }
  };
  vid.addEventListener("ended", () => {});
  restart.addEventListener("click", function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
})();

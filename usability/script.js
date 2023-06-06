(() => {
  let r = document.querySelector(":root");
  inner = document.querySelectorAll(".inner");
  inner.forEach((i) => {
    i.addEventListener("mouseover", () => {
      setTimeout(() => {
        r.style.setProperty("--hover", "true");
      }, 1);
    });
    i.addEventListener("mouseout", () => {
      r.style.setProperty("--hover", "false");
    });
  });
})();

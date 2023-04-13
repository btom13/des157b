(function () {
  ("use strict");
  const body = document.querySelector("body");
  const banner = document.querySelector("#banner");
  const sections = document.querySelectorAll("section");
  const equations = document.querySelectorAll(".equation");
  const theorems = document.querySelectorAll(".theorem");
  const bannerText = document.querySelector("h2");
  const name = document.querySelector("#name");
  const topics = document.querySelectorAll("h3");
  const links = document.querySelectorAll("a");
  const numbers = document.querySelector("#numbers");
  const abc = document.querySelector("#abc");
  let mode = "dark";
  // making sure there aren't any transitions on refresh
  window.onload = function () {
    setTimeout(() => {
      document.querySelectorAll(".delayed-transition").forEach(function (el) {
        el.classList.remove("delayed-transition");
      });
      topics.forEach(function (el) {
        el.style.transition = "color 1s";
      });
      links.forEach(function (el) {
        el.style.transition = "color 1s";
      });
    }, 50);
  };

  // randomly moves around elements within the banner and fades them in and out
  function animate(elements) {
    // checks if two rectangles overlap
    function overlaps(rect1, rect2) {
      const banner_rect = banner.getBoundingClientRect();
      if (
        rect1.right < rect2.left - banner_rect.left ||
        rect1.left > rect2.right - banner_rect.left ||
        rect1.bottom < rect2.top - banner_rect.top ||
        rect1.top > rect2.bottom - banner_rect.top
      ) {
        return false;
      }
      return true;
    }

    // looks for an open position within the banner to display the element
    // if there is none found within 20 tries, returns 0, 0
    function getRandomPosition(el) {
      const text = bannerText.getBoundingClientRect();
      let left, top;
      let overlap = true;
      let times = 0;
      while (overlap) {
        left = Math.floor(
          Math.random() * (banner.offsetWidth - el.offsetWidth)
        );
        top = Math.floor(
          Math.random() * (banner.offsetHeight - el.offsetHeight - 10)
        );

        const newRect = {
          left: left,
          right: left + el.offsetWidth,
          top: top,
          bottom: top + el.offsetHeight,
        };
        overlap = false;
        // loops through every other element to make sure they don't overlap
        elements.forEach((el2) => {
          if (el !== el2) {
            const rect2 = el2.getBoundingClientRect();
            if (overlaps(newRect, rect2) || overlaps(newRect, text)) {
              overlap = true;
            }
          }
        });
        if (times == 20) {
          return { left: 0, top: 0 };
        }
        times++;
      }
      return { left, top };
    }

    // finds a random position for the element, then calls fadeElement
    function animateElement(el) {
      const startPosition = getRandomPosition(el);
      el.style.left = startPosition.left + "px";
      el.style.top = startPosition.top + "px";

      // shows the element, then hides the element after some amount of time,
      // then finds a new position for the element after a while, then calls fade element again
      function fadeElement() {
        if (el.style.left != "0px" || el.style.top != "0px")
          el.classList.add("seen");

        setTimeout(() => {
          if (el.style.left != "0px" || el.style.top != "0px")
            el.classList.remove("seen");

          setTimeout(() => {
            const newPosition = getRandomPosition(el);

            el.style.left = newPosition.left + "px";
            el.style.top = newPosition.top + "px";

            fadeElement();
          }, Math.random() * 2000 + 8000);
        }, Math.random() * 3000 + 2000);
      }

      fadeElement();
    }

    let num = -1; // number to display almost immediately
    // starts the animation loop for each element
    elements.forEach((el) => {
      setTimeout(
        () => {
          animateElement(el);
        },
        num < 0 ? Math.random() * 1000 : num * 1500
      );
      num++;
    });
  }
  animate(equations);
  animate(theorems);

  numbers.addEventListener("click", function () {
    if (mode === "dark") {
      body.classList.add("switch");
      banner.classList.add("switch");
      for (const section of sections) {
        section.classList.add("switch");
      }
      for (const eq of equations) {
        eq.classList.add("switch");
      }
      for (const theorem of theorems) {
        theorem.classList.add("switch");
      }
      for (const link of links) {
        link.classList.add("switch");
      }
      bannerText.classList.add("switch");
      name.classList.add("switch");
      for (const topic of topics) {
        topic.classList.add("switch");
      }
      numbers.classList.add("switch");
      abc.classList.add("switch");

      mode = "light";
    } else {
      body.classList.remove("switch");
      banner.classList.remove("switch");
      for (const section of sections) {
        section.classList.remove("switch");
      }
      for (const eq of equations) {
        eq.classList.remove("switch");
      }
      for (const theorem of theorems) {
        theorem.classList.remove("switch");
      }
      for (const link of links) {
        link.classList.remove("switch");
      }
      bannerText.classList.remove("switch");
      name.classList.remove("switch");
      for (const topic of topics) {
        topic.classList.remove("switch");
      }
      numbers.classList.remove("switch");
      abc.classList.remove("switch");
      mode = "dark";
    }
  });
})();

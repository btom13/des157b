function MultiRezGrid() {
  const dropBoxes = document.querySelectorAll(".dropBox");
  const dropZones = document.querySelectorAll(".dropzone");

  // let startPos = null;

  function onMove(event) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
      y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform =
      "translate(" + x + "px, " + y + "px)";

    // update the position attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }

  function onDragStart(event) {
    // if (!startPos) {
    //   const rect = event.target.getBoundingClientRect();
    //   // record center point when starting the very first a drag
    //   startPos = {
    //     x: rect.left + rect.width / 2,
    //     y: rect.top + rect.height / 2,
    //     range: Infinity,
    //   };
    // }
  }

  dropBoxes.forEach((dropBox) => {
    interact(dropBox).draggable({
      inertia: false,
      onmove: onMove,
      onstart: onDragStart,
      onend: function (event) {
        const x = parseFloat(event.target.getAttribute("data-x"));
        console.log(x);
      },
    });
  });

  function onDragEnter(event) {
    const dropRect = event.target.getBoundingClientRect(),
      dropCenter = {
        x: dropRect.left + dropRect.width / 2,
        y: dropRect.top + dropRect.height / 2,
        range: Infinity,
      };
    event.target.classList.add("drop-target");
    event.relatedTarget.classList.add("can-drop");
  }

  function onDragLeave(event) {
    event.target.classList.remove("drop-target");
    event.relatedTarget.classList.remove("can-drop");
  }

  dropZones.forEach((dropZone) => {
    interact(dropZone).dropzone({
      accept: ".dropBox",
      overlap: "center",
      ondragenter: onDragEnter,
      ondragleave: onDragLeave,
    });
  });
}

// Initialize the MultiRezGrid
MultiRezGrid();

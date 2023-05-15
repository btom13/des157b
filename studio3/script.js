(() => {
  let container = document.querySelector(".grid-container");
  const rows = 10;
  const cols = 10;
  const timestep = 500;
  const robots = [];
  const objects = [robots];
  const registers = ["eax", "ebx", "ecx"];

  let robotTexts = 0;

  function isPositiveInteger(string) {
    const number = Number(string);
    return Number.isInteger(number) && number > 0;
  }
  function isInteger(string) {
    const number = Number(string);
    return Number.isInteger(number);
  }

  function createRobotText() {
    const robotText = document.createElement("div");
    robotText.classList.add("robot-text");
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-solid", "fa-square-minus");
    const h1 = document.createElement("h1");
    h1.innerText = "Bot " + (robotTexts + 1);
    const text_div = document.createElement("div");
    text_div.classList.add("text-div");
    const textarea = document.createElement("textarea");
    textarea.setAttribute("spellcheck", "false");
    robotText.appendChild(icon);
    robotText.appendChild(h1);
    const line_numbers = document.createElement("div");
    line_numbers.classList.add("line-numbers");
    const line_number1 = document.createElement("div");
    line_number1.classList.add("line-number");
    line_number1.innerText = "1";
    line_numbers.appendChild(line_number1);
    const line_number2 = document.createElement("div");
    line_number2.classList.add("line-number");
    line_number2.innerText = "2";
    line_numbers.appendChild(line_number2);
    text_div.appendChild(line_numbers);
    text_div.appendChild(textarea);
    robotText.appendChild(text_div);
    robotTexts++;
    document.querySelector(".instructions").appendChild(robotText);
    return robotText;
  }

  class Robot {
    constructor(
      gridContainer,
      row = 0,
      col = 0,
      color = "white",
      direction = 0
    ) {
      this.originalRow = row;
      this.originalCol = col;
      this.originalDirection = direction;
      this.element = document.createElement("i");
      this.element.classList.add("fa-solid", "fa-robot");
      gridContainer.appendChild(this.element);
      this.container = gridContainer;
      this.row = row;
      this.col = col;
      this.element.style.color = color;
      this.direction = direction;
      this.robotText = createRobotText();
      this.registers = {};
      for (let i = 0; i < registers.length; i++) {
        this.registers[registers[i]] = new Long(0, 0, true);
      }
      this.equality = false;
      this.running = false;
      this.current_line = 0;

      this.updatePosition();
    }
    reset() {
      this.running = false;
      this.current_line = 0;
      this.row = this.originalRow;
      this.col = this.originalCol;
      this.rotate(this.originalDirection - this.direction);
      this.direction = this.originalDirection;
      this.equality = false;
      for (let i = 0; i < registers.length; i++) {
        this.registers[registers[i]] = new Long(0, 0, true);
      }
      this.removeHighlight();
      this.updatePosition();
    }

    async parseText() {
      const lines = this.robotText
        .querySelector("textarea")
        .value.toLowerCase()
        .split("\n");

      // check if every line is valid
      for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
        if (lines[i].length === 0) continue;
        const line = lines[i].split(" ");

        if (line.length === 0) continue;
        if (line[0][0] === "#") continue;
        // check if the last character is a semicolon
        if (lines[i][lines[i].length - 1] !== ";") {
          return ["Semicolon expected", i + 1];
        }
        line[line.length - 1] = line[line.length - 1].slice(0, -1);
        switch (line[0]) {
          case "nop":
            if (line.length !== 1) {
              return ["Unexpected number of arguments", i + 1];
            }
            break;
          case "walk":
            if (line.length !== 2) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (!isPositiveInteger(line[1])) {
              return [
                "Error parsing argument, positive integer expected",
                i + 1,
              ];
            }
            break;
          case "turn":
            if (line.length !== 2) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (
              line[1] !== "left" &&
              line[1] !== "right" &&
              line[1] !== "around"
            ) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;
          case "move":
            if (line.length !== 3) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (
              !registers.includes(line[1]) &&
              (!registers.includes(line[2]) || !isPositiveInteger(line[2]))
            ) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;
          case "add":
            if (line.length !== 3) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (
              !registers.includes(line[1]) &&
              (!registers.includes(line[2]) || !isPositiveInteger(line[2]))
            ) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;
          case "sub":
            if (line.length !== 3) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (
              !registers.includes(line[1]) &&
              (!registers.includes(line[2]) || !isPositiveInteger(line[2]))
            ) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;
          case "mul":
            if (line.length !== 3) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (
              !registers.includes(line[1]) &&
              (!registers.includes(line[2]) || !isPositiveInteger(line[2]))
            ) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;
          case "div":
            if (line.length !== 3) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (
              !registers.includes(line[1]) &&
              (!registers.includes(line[2]) || !isPositiveInteger(line[2]))
            ) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;

          case "cmp":
            if (line.length !== 3) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (
              !registers.includes(line[1]) &&
              (!registers.includes(line[2]) || !isPositiveInteger(line[2]))
            ) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;
          case "jmp":
            if (line.length !== 2) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (!isInteger(line[1])) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;
          case "jne":
            if (line.length !== 2) {
              return ["Unexpected number of arguments", i + 1];
            }
            if (!isInteger(line[1])) {
              return ["Error parsing argument, unexpected value", i + 1];
            }
            break;
          default:
            return ["Unexpected command", i + 1];
        }
      }
      return false;
    }

    updateHighlight() {
      const line_numbers = this.robotText.querySelectorAll(".line-number");
      if (this.line_number) {
        this.line_number.style.backgroundColor = "";
      }
      if (this.current_line >= line_numbers.length - 1) return;
      line_numbers[this.current_line].style.backgroundColor = "red";
      this.line_number = line_numbers[this.current_line];
    }

    removeHighlight() {
      if (this.line_number) {
        this.line_number.style.backgroundColor = "";
      }
    }

    run() {
      // run the code
      const lines = this.robotText
        .querySelector("textarea")
        .value.toLowerCase()
        .split("\n");
      lines.push("");
      this.running = true;
      this.current_line = 0;
      function loop() {
        if (this.current_line >= lines.length) {
          this.running = false;
          this.removeHighlight();
          return;
        }
        if (this.running === false) return;
        if (lines[this.current_line].length === 0) {
          this.updateHighlight();
          this.current_line++;
          func();
          return;
        }
        const line = lines[this.current_line].split(" ");

        if (line.length === 0) {
          this.updateHighlight();
          this.current_line++;
          func();
          return;
        }
        if (line[0][0] === "#") {
          this.updateHighlight();
          this.current_line++;
          func();
          return;
        }
        line[line.length - 1] = line[line.length - 1].slice(0, -1);
        switch (line[0]) {
          case "nop":
            break;
          // consider allowing registers to be used as arguments
          case "walk":
            this.moveForward(parseInt(line[1]));
            break;
          case "turn":
            switch (line[1]) {
              case "left":
                this.rotate(-1);
                break;
              case "right":
                this.rotate(1);
                break;
              case "around":
                this.rotate(2);
                break;
            }
            break;
          // if the second argument is a register, move its value to the first argument
          // otherwise, move the second argument to the first argument
          case "move":
            if (registers.includes(line[2])) {
              this.registers[line[1]] = this.registers[line[2]];
            } else {
              this.registers[line[1]] = new Long(parseInt(line[2]), 0, true);
            }
            break;
          case "add":
            if (registers.includes(line[2])) {
              this.registers[line[1]] = this.registers[line[1]].add(
                this.registers[line[2]]
              );
            } else {
              this.registers[line[1]] = this.registers[line[1]].add(
                parseInt(line[2])
              );
            }
            break;
          case "sub":
            if (registers.includes(line[2])) {
              this.registers[line[1]] = this.registers[line[1]].subtract(
                this.registers[line[2]]
              );
            } else {
              this.registers[line[1]] = this.registers[line[1]].subtract(
                parseInt(line[2])
              );
            }
            break;
          case "mul":
            if (registers.includes(line[2])) {
              this.registers[line[1]] = this.registers[line[1]].multiply(
                this.registers[line[2]]
              );
            } else {
              this.registers[line[1]] = this.registers[line[1]].multiply(
                parseInt(line[2])
              );
            }
            break;
          case "div":
            if (registers.includes(line[2])) {
              this.registers[line[1]] = this.registers[line[1]].divide(
                this.registers[line[2]]
              );
            } else {
              this.registers[line[1]] = this.registers[line[1]].divide(
                parseInt(line[2])
              );
            }
            break;
          case "cmp":
            if (registers.includes(line[2])) {
              this.equality =
                this.registers[line[1]].low == this.registers[line[2]].low;
            } else {
              this.equality = this.registers[line[1]].low == parseInt(line[2]);
            }
            break;
          case "jmp":
            if (this.equality) {
              this.updateHighlight();
              this.current_line += parseInt(line[1]);
              runCode();
              return;
            }
            break;
          case "jne":
            if (!this.equality) {
              this.updateHighlight();
              this.current_line += parseInt(line[1]);
              runCode();
              return;
            }
            break;
        }
        this.updateHighlight();
        this.current_line++;
        runCode();
        return;
      }
      const func = loop.bind(this);
      function runCode() {
        setTimeout(func, timestep);
      }
      runCode();
    }

    rotate(num) {
      this.direction = (this.direction + num) % 4;
      if (this.direction < 0) this.direction += 4;

      this.element.style.transform = `translate(-50%, -50%) rotate(${
        this.direction * 90
      }deg)`;
    }

    moveForward(num) {
      switch (this.direction) {
        case 0:
          for (let i = 0; i < num; i++) {
            this.moveUp();
          }
          break;
        case 1:
          for (let i = 0; i < num; i++) {
            this.moveRight();
          }
          break;
        case 2:
          for (let i = 0; i < num; i++) {
            this.moveDown();
          }
          break;
        case 3:
          for (let i = 0; i < num; i++) {
            this.moveLeft();
          }
          break;
      }
    }

    moveUp() {
      if (this.row > 0) {
        for (let i = 0; i < objects.length; i++) {
          for (let j = 0; j < objects[i].length; j++) {
            if (
              objects[i][j].row === this.row - 1 &&
              objects[i][j].col === this.col
            ) {
              return;
            }
          }

          this.row--;
          this.updatePosition();
        }
      }
    }

    moveDown() {
      if (this.row < rows - 1) {
        for (let i = 0; i < objects.length; i++) {
          for (let j = 0; j < objects[i].length; j++) {
            if (
              objects[i][j].row === this.row + 1 &&
              objects[i][j].col === this.col
            ) {
              return;
            }
          }
        }

        this.row++;
        this.updatePosition();
      }
    }

    moveLeft() {
      if (this.col > 0) {
        for (let i = 0; i < objects.length; i++) {
          for (let j = 0; j < objects[i].length; j++) {
            if (
              objects[i][j].row === this.row &&
              objects[i][j].col === this.col - 1
            ) {
              return;
            }
          }
        }

        this.col--;
        this.updatePosition();
      }
    }

    moveRight() {
      if (this.col < cols - 1) {
        for (let i = 0; i < objects.length; i++) {
          for (let j = 0; j < objects[i].length; j++) {
            if (
              objects[i][j].row === this.row &&
              objects[i][j].col === this.col + 1
            ) {
              return;
            }
          }
        }
        this.col++;
        this.updatePosition();
      }
    }

    updatePosition() {
      this.container.style.gridRow = this.row + 1;
      this.container.style.gridColumn = this.col + 1;
    }
  }

  for (let i = 0; i < rows * cols; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    container.appendChild(gridItem);
  }

  function onMove(event) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
      y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform =
      "translate(calc(" + x + "px - 50%), calc(" + y + "px - 50%))";

    // update the position attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }
  const gridItems = document.querySelectorAll(".grid-item");
  const gameArea = document.querySelector("#game-area");
  const sidebar = document.querySelector("#sidebar");

  function make_bot() {
    const bot = document.createElement("i");
    bot.style.position = "absolute";
    bot.classList.add("fa-solid");
    bot.classList.add("fa-robot");
    bot.classList.add("draggable");
    bot.setAttribute("data-x", 0);
    bot.setAttribute("data-y", 0);
    bot.style.top = "10%";
    bot.style.left = "50%";
    bot.setAttribute("data-clicked", 0);

    gameArea.appendChild(bot);
    interact(bot).draggable({
      inertia: false,
      onstart: function (event) {
        if (event.target.getAttribute("data-clicked") == 0) {
          event.target.setAttribute("data-clicked", 1);
          make_bot();
        }
      },
      onmove: onMove,
    });
  }

  make_bot();
  interact(sidebar).dropzone({
    accept: ".fa-robot",
    overlap: "center",
    ondrop: function (event) {
      gameArea.appendChild(event.relatedTarget);
      event.relatedTarget.remove();
    },
  });

  interact(gameArea).dropzone({
    accept: ".fa-robot",
    overlap: "center",
    ondrop: function (event) {
      gameArea.appendChild(event.relatedTarget);
      event.relatedTarget.remove();
    },
  });

  gridItems.forEach((gridItem, index) => {
    interact(gridItem).dropzone({
      accept: ".fa-robot",
      overlap: "center",
      ondragenter: function (event) {
        // console.log(event.relatedTarget);
        gridItem.classList.add("drop-target");
        event.relatedTarget.classList.add("can-drop");
        event.relatedTarget.setAttribute("data-row", Math.floor(index / cols));
        event.relatedTarget.setAttribute("data-col", index % cols);
      },
      ondragleave: function (event) {
        gridItem.classList.remove("drop-target");
        event.relatedTarget.classList.remove("can-drop");
      },
      ondrop: function (event) {
        gridItem.appendChild(event.relatedTarget);
        gridItem.classList.remove("drop-target");
        event.relatedTarget.style.top = "50%";
        event.relatedTarget.style.position = "relative";
        event.relatedTarget.classList.remove("can-drop");
        event.relatedTarget.style.webkitTransform =
          event.relatedTarget.style.transform = `translate(-50%, -50%)`;
        event.relatedTarget.setAttribute("data-x", 0);
        event.relatedTarget.setAttribute("data-y", 0);
      },
    });
    // console.log(gridItem, index);
  });

  robots.push(
    new Robot(document.querySelectorAll(".grid-item")[robots.length], 2, 2)
  );

  robots.push(
    new Robot(
      document.querySelectorAll(".grid-item")[robots.length],
      5,
      5,
      "red"
    )
  );
  robots[1].robotText
    .querySelector(".text-div")
    .querySelector("textarea").value =
    "# moves 3 into\n# eax variable\nmove eax 3;\nwalk 1;\nturn left;\n# eax += 1\nadd eax 1;\n# if eax != 10\ncmp eax 10;\n# go back 7\njne -7;\n# should stop\n# after 7\n# moves\n";
  const lineNumbers = robots[1].robotText
    .querySelector(".text-div")
    .querySelector(".line-numbers");
  let html = "";
  for (let i = 0; i < 14 + 1; i++) {
    html += `<div class="line-number">${i + 1}</div>`;
  }
  lineNumbers.innerHTML = html;
  async function run_bots() {
    // wait for all bots to parse text
    let promise = await Promise.all(
      robots.map((robot) => {
        return robot.parseText();
      })
    );
    // run all bots if all bots have parsed text and they all return false
    // otherwise log the errors if they exist
    if (promise.every((val) => val === false)) {
      robots.forEach((robot) => {
        robot.reset();
        robot.run();
      });
    } else {
      promise.forEach((val, index) => {
        if (val !== false) {
          console.log(`Robot ${index + 1}: ${val[0]} on line ${val[1]}`);
        }
      });
    }
  }
  function reset() {
    for (let i = 0; i < robots.length; i++) {
      robots[i].reset();
    }
  }

  document.querySelector(".fa-play").addEventListener("click", run_bots);
  document.querySelector(".fa-stop").addEventListener("click", reset);
  const inputBox = document.querySelectorAll("textarea");
  inputBox.forEach((e) => {
    e.addEventListener("input", () => {
      const lines = e.value.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > 14) {
          const truncatedLine = lines[i].substring(0, 14);
          lines[i] = truncatedLine;
        }
      }
      e.value = lines.join("\n");

      const lineNumbers = e.parentElement.querySelector(".line-numbers");
      let html = "";
      for (let i = 0; i < lines.length + 1; i++) {
        html += `<div class="line-number">${i + 1}</div>`;
      }
      lineNumbers.innerHTML = html;
    });
    e.addEventListener("scroll", () => {
      const lineNumbers = e.parentElement.querySelector(".line-numbers");
      lineNumbers.scrollTop = e.scrollTop;
    });
  });
})();

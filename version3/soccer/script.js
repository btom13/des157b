const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const goalWidth = 40;
const canvasWidth = 1200 - goalWidth * 2;
const canvasHeight = 700;
canvas.width = canvasWidth + goalWidth * 2;
canvas.height = canvasHeight;

const balls = [];
let background = "orange";

class Ball {
  constructor(x, y, dx, dy, radius, color, actualBall) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.actualBall = actualBall;
    this.originaly = y;
  }
}

class Goal {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.score = 0;
  }
}

function addBall(x, y, dx, dy, radius, color, actualBall) {
  balls.push(new Ball(x, y, dx, dy, radius, color, actualBall));
}

// current keys pressed
const keys = {};

document.addEventListener("keydown", function (event) {
  keys[event.code] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.code] = false;
});
const aiBox = document.getElementById("ai-box");

const goalHeight = canvasHeight / 3;
const goalColor = "gray";
const leftGoal = new Goal(
  0,
  canvasHeight / 3,
  goalWidth,
  goalHeight,
  goalColor
);
const rightGoal = new Goal(
  canvasWidth + goalWidth,
  canvasHeight / 3,
  goalWidth,
  goalHeight,
  goalColor
);

// game loop
function update(cont = true) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // left ai
  let ai_velocity = 3;
  if (balls[2].y < balls[4].y - 3) {
    balls[2].dy = ai_velocity;
  } else if (balls[2].y > balls[4].y + 3) {
    balls[2].dy = -ai_velocity;
  } else {
    balls[2].dy = 0;
  }
  if (balls[2].x < balls[4].x) {
    if (Math.abs(balls[2].y - balls[4].y) < 150) {
      balls[2].dy *= -1.4;
    }
  }
  // right ai
  ai_velocity = 4;
  if (balls[3].y < balls[4].y - 3) {
    balls[3].dy = ai_velocity;
  } else if (balls[3].y > balls[4].y + 3) {
    balls[3].dy = -ai_velocity;
  } else {
    balls[3].dy = 0;
  }
  if (balls[3].x < balls[4].x) {
    if (Math.abs(balls[3].y - balls[4].y) < 150) {
      balls[3].dy *= -1.4;
    }
  }
  // player movement
  if (!aiBox.checked) {
    if (keys["KeyW"]) {
      balls[1].dy = -6;
    } else if (keys["KeyS"]) {
      balls[1].dy = 6;
    } else {
      balls[1].dy = 0;
    }
    if (keys["KeyW"] && keys["KeyS"]) {
      balls[1].dy = 0;
    }

    if (keys["ArrowUp"]) {
      balls[0].dy = -6;
    } else if (keys["ArrowDown"]) {
      balls[0].dy = 6;
    } else {
      balls[0].dy = 0;
    }
    if (keys["ArrowUp"] && keys["ArrowDown"]) {
      balls[0].dy = 0;
    }
  } else {
    // left ai
    let ai_velocity = 3;
    if (balls[0].y < balls[4].y - 3) {
      balls[0].dy = ai_velocity;
    } else if (balls[0].y > balls[4].y + 3) {
      balls[0].dy = -ai_velocity;
    } else {
      balls[0].dy = 0;
    }
    if (balls[0].x > balls[4].x) {
      if (Math.abs(balls[0].y - balls[4].y) < 150) {
        balls[0].dy *= -1.4;
      }
    }
    // right ai
    ai_velocity = 4;
    if (balls[1].y < balls[4].y - 3) {
      balls[1].dy = ai_velocity;
    } else if (balls[1].y > balls[4].y + 3) {
      balls[1].dy = -ai_velocity;
    } else {
      balls[1].dy = 0;
    }
    if (balls[1].x > balls[4].x) {
      if (Math.abs(balls[1].y - balls[4].y) < 150) {
        balls[1].dy *= -1.4;
      }
    }
  }

  // goal detection
  if (balls[4].x - balls[4].radius <= goalWidth) {
    if (
      balls[4].y >= leftGoal.y &&
      balls[4].y <= leftGoal.y + leftGoal.height
    ) {
      rightGoal.score++;
      resetBalls();
    }
  } else if (balls[4].x + balls[4].radius - goalWidth >= canvasWidth) {
    if (
      balls[4].y >= rightGoal.y &&
      balls[4].y <= rightGoal.y + rightGoal.height
    ) {
      leftGoal.score++;

      resetBalls();
    }
  }

  // ball movement
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Check for collision with the walls
    if (
      ball.x + ball.radius - goalWidth >= canvasWidth ||
      ball.x - ball.radius <= goalWidth
    ) {
      ball.dx = -ball.dx;
    }

    if (ball.y + ball.radius > canvas.height) {
      if (ball.dy > 0) ball.dy = -ball.dy;
    }
    if (ball.y - ball.radius < 0) {
      if (ball.dy < 0) ball.dy = -ball.dy;
    }

    // dheck for collision with other balls
    if (ball.actualBall) {
      for (let j = 0; j < balls.length; j++) {
        if (i !== j) {
          const otherBall = balls[j];
          const distance = Math.sqrt(
            Math.pow(ball.x - otherBall.x, 2) +
              Math.pow(ball.y - otherBall.y, 2)
          );

          if (distance <= ball.radius + otherBall.radius) {
            // calculate new velocities using conservation of momentum
            const vxTotal = ball.dx - otherBall.dx;
            const vyTotal = ball.dy - otherBall.dy;
            const xDist = otherBall.x - ball.x;
            const yDist = otherBall.y - ball.y;
            let initial_magnitude = Math.sqrt(
              Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2)
            );
            // cap the velocity of the ball
            if (initial_magnitude == 0) {
              initial_magnitude = 5;
            }
            if (initial_magnitude > 20)
              initial_magnitude = Math.max(initial_magnitude / 1.18, 20);
            if (initial_magnitude > 60) initial_magnitude = 60;

            if (xDist * vxTotal + yDist * vyTotal >= 0) {
              const angle = -Math.atan2(
                otherBall.y - ball.y,
                otherBall.x - ball.x
              );

              // calculate new velocities after collision
              const u1 = rotate(ball.dx, ball.dy, angle);
              const u2 = rotate(otherBall.dx, otherBall.dy, angle);
              const v1 = { x: u2.x, y: u1.y };
              const v2 = { x: u1.x, y: u2.y };

              const vFinal1 = rotate(v1.x, v1.y, -angle);
              // increase the speed of the ball after each collision
              vFinal1.x *=
                (initial_magnitude /
                  Math.sqrt(vFinal1.x ** 2 + vFinal1.y ** 2)) *
                1.2;
              vFinal1.y *=
                (initial_magnitude /
                  Math.sqrt(vFinal1.x ** 2 + vFinal1.y ** 2)) *
                1.2;
              ball.dx = vFinal1.x;
              if (Math.abs(ball.dx) < 1) {
                if (ball.dx < 0) {
                  ball.dx = -1;
                } else {
                  ball.dx = 1;
                }
              }
              ball.dy = vFinal1.y;
            }
          }
        }
      }
    }

    // keeping the ball in the canvas
    if (ball.x - ball.radius < goalWidth) {
      ball.x = ball.radius + goalWidth;
    } else if (ball.x + ball.radius - goalWidth > canvasWidth) {
      ball.x = canvasWidth - ball.radius + goalWidth;
    }

    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
    } else if (ball.y + ball.radius > canvas.height) {
      ball.y = canvas.height - ball.radius;
    }

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  }

  // Draw the goals
  ctx.fillStyle = leftGoal.color;
  ctx.fillRect(leftGoal.x, leftGoal.y, leftGoal.width, leftGoal.height);
  ctx.fillStyle = rightGoal.color;
  ctx.fillRect(rightGoal.x, rightGoal.y, rightGoal.width, rightGoal.height);
  ctx.fillStyle = background;
  ctx.fillRect(
    leftGoal.x,
    canvas.height - leftGoal.y,
    leftGoal.width,
    canvas.height - leftGoal.height * 2
  );
  ctx.fillRect(
    leftGoal.x,
    0,
    leftGoal.width,
    canvas.height - leftGoal.height * 2
  );

  ctx.fillRect(
    rightGoal.x,
    canvas.height - rightGoal.y,
    rightGoal.width,
    canvas.height - rightGoal.height * 2
  );
  ctx.fillRect(
    rightGoal.x,
    0,
    rightGoal.width,
    canvas.height - rightGoal.height * 2
  );

  // Draw the score
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText(leftGoal.score, 20, 40);
  ctx.fillText(rightGoal.score, canvasWidth + goalWidth + 6, 40);
  if (cont) requestAnimationFrame(update);
}

// reset the position of the balls
function resetBalls() {
  let dx = Math.random() * 8 - 4;
  if (dx > -2 && dx < 2) {
    if (dx < 0) {
      dx += -2;
    } else {
      dx += 2;
    }
  }
  balls[4].x = canvasWidth / 2;
  balls[4].y = canvasHeight / 2;
  balls[4].dx = dx;
  balls[4].dy = Math.sqrt(25 - dx ** 2) * (Math.random() < 0.5 ? -1 : 1);
  for (let i = 0; i < balls.length - 1; i++) {
    balls[i].y = balls[i].originaly;
  }
}

function rotate(dx, dy, angle) {
  const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
  const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
  return { x: rotatedX, y: rotatedY };
}

addBall(canvasWidth / 4 + 120, canvasHeight / 2, 0, 0, 30, "blue", false);
addBall(canvasWidth / 4 - 120, canvasHeight / 2, 0, 0, 30, "blue", false);

addBall((canvasWidth * 3) / 4 - 120, canvasHeight / 2, 0, 0, 30, "red", false);
addBall((canvasWidth * 3) / 4 + 120, canvasHeight / 2, 0, 0, 30, "red", false);

let dx = Math.random() * 8 - 4;
if (dx > -2 && dx < 2) {
  if (dx < 0) {
    dx += -2;
  } else {
    dx += 2;
  }
}
addBall(
  canvasWidth / 2,
  canvasHeight / 2,
  dx,
  Math.sqrt(25 - dx ** 2) * (Math.random() < 0.5 ? -1 : 1),
  40,
  "white",
  true
);
const dialogClick = document.getElementById("dialog-click");
dialogClick.addEventListener("click", () => {
  update();
});
update(false);

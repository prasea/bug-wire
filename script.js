let board, context;
let boardWidth = 1000; // canvas width
let boardHeight = 500; // canvas height

let wires = [
  { x: boardWidth / 5 }, // first wire position 200
  { x: 2 * (boardWidth / 5) }, // second wire position 400
  { x: 3 * (boardWidth / 5) }, // third wire position 600
  { x: 4 * (boardWidth / 5) } // fourth wire position 800
];


board = document.getElementById("board");
context = board.getContext("2d");
board.height = boardHeight;
board.width = boardWidth;

const backGround = new Image();
backGround.src = "img/bg.png";
const bugImage = document.createElement('img');
bugImage.src = "img/bug.png";


let bugWidth = 30; // bug width
let bugHeight = 30; // bug height

let bugX = wires[2].x; // Initialize bug position to the middle wire in x-axis
let bugY = boardHeight; // fixed position of bug in y-axis


function moveBug(direction) {
  // Determine the current wire index of bug
  let bugWireIndex;
  wires.forEach((wire, index) => {
    if (wire.x === bugX) {
      bugWireIndex = index;
    }
  });

  // Move the bug to the next or previous wire
  bugWireIndex += direction;

  // Constraining the bug within bugWireIndex[0,3]
  if (bugWireIndex > 3)
    bugWireIndex = 3
  if (bugWireIndex < 0)
    bugWireIndex = 0

  // Update bug position based on the selected wire
  bugX = wires[bugWireIndex].x;
}

window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowRight":
      moveBug(1); // Move the bug to the right
      break;
    case "ArrowLeft":
      moveBug(-1); // Move the bug to the left
      break;
  }
});

// obstacles
let obstacleWidth = 15;
let obstacleHeight = 15;
let obstacleSpeed = 3; // movement of obstacle
let obstacleGenerationInterval = 900;
let obstacles = [];
const obstacleImage = new Image();
obstacleImage.src = "img/crow.png";


// function to  create a new obstacle 
function createNewObstacle() {
  let randomWireIndex = Math.floor(Math.random() * wires.length);
  let obstacleX = wires[randomWireIndex].x;
  let obstacleY = 0;
  return { x: obstacleX, y: obstacleY }
}

let obstacleInterval = setInterval(function () {
  obstacles.push(createNewObstacle());
}, obstacleGenerationInterval);


// draw crow as obstacles
function drawObstacles() {
  for (let obstacle of obstacles) {
    context.drawImage(
      obstacleImage,
      obstacle.x - obstacleWidth / 2,
      obstacle.y - obstacleHeight / 2,
      obstacleWidth,
      obstacleHeight
    );
  }
  updateObstacles();
}

// function to update obstacle position
function updateObstacles() {
  for (let obstacle of obstacles) {
    obstacle.y += obstacleSpeed;
  }
}
let myScore = 0;
function updateScore() {
  if (obstacles.length > 0 && obstacles[0].y > boardHeight) {
    myScore += 1; // Increase the score for every obstacle passed
    // Update the score in the HTML
    document.getElementById("score").textContent = myScore;

    // Remove the passed obstacle
    obstacles.shift();
  }
}

// Function to check collision between two rectangles
function areColliding(rect1, rect2) {
  if (rect1.x - rect1.width / 2 < rect2.x + rect2.width / 2 &&
    rect1.x + rect1.width / 2 > rect2.x - rect2.width / 2 &&
    rect1.y - rect1.height / 2 < rect2.y + rect2.height / 2 &&
    rect1.y + rect1.height / 2 > rect2.y - rect2.height / 2
  ) {
    return true
  }
}

// check collision
function checkCollision() {
  const bugRect = {
    x: bugX,
    y: bugY - bugHeight,
    width: bugWidth,
    height: bugHeight,
  };

  for (let obstacle of obstacles) {
    const obstacleRect = {
      x: obstacle.x - obstacleWidth / 2,
      y: obstacle.y - obstacleHeight / 2,
      width: obstacleWidth,
      height: obstacleHeight,
    };
    if (areColliding(bugRect, obstacleRect)) {
      gameOver();
      return true; // Collision detected
    }
  }

  return false; // No collision detected
}
function gameOver() {
  alert("Game over");
  obstacles = [];
  myScore = 0;
  document.getElementById('score').textContent = 0
}


function drawWires() {
  // Draw wires
  context.fillStyle = "#000";
  for (let wire of wires) {
    context.fillRect(wire.x - 1.5, 0, 3, board.height);
  }
}
function drawBug() {
  context.drawImage(
    bugImage,
    bugX - bugWidth / 2,
    bugY - bugHeight,
    bugWidth,
    bugHeight
  );

}
function draw() {
  context.drawImage(backGround, 0, 0, board.width, board.height);
  drawWires();
  drawBug();
  drawObstacles();
}

function animate() {
  context.clearRect(0, 0, board.width, board.height);
  draw()
  if (!checkCollision()) {
    updateScore();
  }
  requestAnimationFrame(animate);
}
animate();

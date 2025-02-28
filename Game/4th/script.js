// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let gameRunning = false;
let gamePaused = false;
let score = 0;

// Ship properties
const ship = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 20,
  speed: 7,
  dx: 0
};

// Arrays for bullets and invaders
const bullets = [];
const invaders = [];
const rows = 5;
const cols = 11;
const invWidth = 40;
const invHeight = 20;
const invPadding = 15;
const invOffsetTop = 30;
const invOffsetLeft = 30;
let invadersDx = 1;

// UI elements
const overlay = document.getElementById('overlay');
const menu = document.getElementById('menu');
const gameOverScreen = document.getElementById('gameOverScreen');
const pauseScreen = document.getElementById('pauseScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const resumeButton = document.getElementById('resumeButton');
const finalScoreSpan = document.getElementById('finalScore');

// Event listeners for UI buttons
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
resumeButton.addEventListener('click', resumeGame);

// Keyboard controls
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
  if (!gameRunning) return;
  
  if (e.key === 'ArrowRight') {
    ship.dx = ship.speed;
  } else if (e.key === 'ArrowLeft') {
    ship.dx = -ship.speed;
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    shoot();
  } else if (e.key.toLowerCase() === 'p') {
    togglePause();
  }
}

function keyUp(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    ship.dx = 0;
  }
}

// Create invaders grid
function createInvaders() {
  invaders.length = 0; // Reset the invaders array
  for (let row = 0; row < rows; row++) {
    invaders[row] = [];
    for (let col = 0; col < cols; col++) {
      const x = invOffsetLeft + col * (invWidth + invPadding);
      const y = invOffsetTop + row * (invHeight + invPadding);
      invaders[row][col] = { x, y, status: 1 }; // status 1 means alive
    }
  }
}

// Draw the player ship
function drawShip() {
  ctx.fillStyle = '#00ff00'; // Green ship
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Update the ship's position
function moveShip() {
  ship.x += ship.dx;
  if (ship.x < 0) ship.x = 0;
  if (ship.x + ship.width > canvas.width) {
    ship.x = canvas.width - ship.width;
  }
}

// Draw invaders
function drawInvaders() {
  invaders.forEach(row => {
    row.forEach(invader => {
      if (invader.status === 1) {
        ctx.fillStyle = '#ff0000'; // Red invaders
        ctx.fillRect(invader.x, invader.y, invWidth, invHeight);
      }
    });
  });
}

// Move invaders horizontally and vertically
function moveInvaders() {
  let edgeReached = false;
  invaders.forEach(row => {
    row.forEach(invader => {
      if (invader.status === 1) {
        invader.x += invadersDx;
        if (invader.x + invWidth > canvas.width || invader.x < 0) {
          edgeReached = true;
        }
      }
    });
  });
  if (edgeReached) {
    invadersDx *= -1;
    invaders.forEach(row => {
      row.forEach(invader => {
        invader.y += invHeight; // Move down when changing direction
      });
    });
  }
}

// Fire a bullet from the center of the ship
function shoot() {
  bullets.push({
    x: ship.x + ship.width / 2 - 2.5,
    y: ship.y,
    width: 5,
    height: 10,
    dy: -7 // Bullet moves upward
  });
}

// Draw bullets
function drawBullets() {
  ctx.fillStyle = '#ffffff'; // White bullets
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Move bullets and remove off-screen ones
function moveBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y += bullets[i].dy;
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
    }
  }
}

// Check collisions between bullets and invaders
function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    for (let r = 0; r < invaders.length; r++) {
      for (let c = 0; c < invaders[r].length; c++) {
        const invader = invaders[r][c];
        if (invader.status === 1 &&
            bullet.x < invader.x + invWidth &&
            bullet.x + bullet.width > invader.x &&
            bullet.y < invader.y + invHeight &&
            bullet.y + bullet.height > invader.y) {
          invader.status = 0; // Invader destroyed
          bullets.splice(i, 1); // Remove bullet
          score += 10;
          break;
        }
      }
    }
  }
}

// Check if any invader has reached the ship (game over)
function checkGameOver() {
  for (const row of invaders) {
    for (const invader of row) {
      if (invader.status === 1 && invader.y + invHeight >= ship.y) {
        gameOver();
        return;
      }
    }
  }
}

// Draw the current score on the canvas
function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText("Score: " + score, 10, 20);
}

// Clear the canvas and redraw game objects
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  drawInvaders();
  drawBullets();
  drawScore();
}

// Update game objects (movement and collision)
function update() {
  moveShip();
  moveInvaders();
  moveBullets();
  checkCollisions();
  checkGameOver();
}

// Main game loop
function loop() {
  if (!gamePaused && gameRunning) {
    draw();
    update();
  }
  requestAnimationFrame(loop);
}

// Start the game
function startGame() {
  gameRunning = true;
  gamePaused = false;
  score = 0;
  ship.x = canvas.width / 2 - ship.width / 2;
  bullets.length = 0;
  createInvaders();
  // Hide overlay and show canvas
  overlay.classList.add('hidden');
}

// Restart the game from the game over screen
function restartGame() {
  gameOverScreen.classList.add('hidden');
  startGame();
}

// End the game
function gameOver() {
  gameRunning = false;
  finalScoreSpan.textContent = score;
  overlay.classList.remove('hidden');
  // Show game over screen and hide other overlays
  menu.classList.add('hidden');
  pauseScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
}

// Toggle pause state
function togglePause() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  if (gamePaused) {
    pauseScreen.classList.remove('hidden');
  } else {
    pauseScreen.classList.add('hidden');
  }
}

// Resume the game from pause
function resumeGame() {
  gamePaused = false;
  pauseScreen.classList.add('hidden');
}

// Start the loop
loop();

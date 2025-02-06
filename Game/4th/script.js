// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player ship properties
const ship = {
    x: canvas.width / 2 - 25, // Center horizontally
    y: canvas.height - 50,    // Position above bottom
    width: 50,
    height: 20,
    speed: 7,
    dx: 0 // Change in position
};

// Array to hold bullets
const bullets = [];

// Invaders array and properties
const invaders = [];
const rows = 5;       // Number of rows
const cols = 11;      // Number of columns
const invWidth = 40;
const invHeight = 20;
const invPadding = 15;
const invOffsetTop = 30;
const invOffsetLeft = 30;
let invadersDx = 1;   // Invaders' horizontal movement

// Keyboard controls
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Key down handler
function keyDown(e) {
    if (e.key === 'ArrowRight') {
        ship.dx = ship.speed; // Move right
    } else if (e.key === 'ArrowLeft') {
        ship.dx = -ship.speed; // Move left
    } else if (e.key === ' ') {
        shoot(); // Fire bullet
    }
}

// Key up handler
function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        ship.dx = 0; // Stop moving
    }
}

// Create invaders grid
function createInvaders() {
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

// Move the player ship
function moveShip() {
    ship.x += ship.dx;

    // Keep ship within canvas
    if (ship.x < 0) ship.x = 0;
    if (ship.x + ship.width > canvas.width)
        ship.x = canvas.width - ship.width;
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

// Move invaders
function moveInvaders() {
    let edgeReached = false;

    invaders.forEach(row => {
        row.forEach(invader => {
            if (invader.status === 1) {
                invader.x += invadersDx;

                // Check for edge collision
                if (invader.x + invWidth > canvas.width || invader.x < 0) {
                    edgeReached = true;
                }
            }
        });
    });

    // If edge reached, move down and reverse direction
    if (edgeReached) {
        invadersDx *= -1; // Reverse direction
        invaders.forEach(row => {
            row.forEach(invader => {
                invader.y += invHeight; // Move down
            });
        });
    }
}

// Shoot a bullet
function shoot() {
    bullets.push({
        x: ship.x + ship.width / 2 - 2.5,
        y: ship.y,
        width: 5,
        height: 10,
        dy: -7 // Move up
    });
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = '#ffffff'; // White bullets
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Move bullets
function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y += bullet.dy;
        // Remove bullets off-screen
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Check for collisions
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        invaders.forEach(row => {
            row.forEach((invader, iIndex) => {
                if (invader.status === 1) {
                    if (
                        bullet.x < invader.x + invWidth &&
                        bullet.x + bullet.width > invader.x &&
                        bullet.y < invader.y + invHeight &&
                        bullet.y + bullet.height > invader.y
                    ) {
                        // Invader hit
                        invader.status = 0;
                        bullets.splice(bIndex, 1); // Remove bullet
                    }
                }
            });
        });
    });
}

// Check for game over
function checkGameOver() {
    invaders.forEach(row => {
        row.forEach(invader => {
            if (
                invader.status === 1 &&
                invader.y + invHeight >= ship.y
            ) {
                alert('Game Over!');
                document.location.reload();
            }
        });
    });
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    drawShip();
    drawInvaders();
    drawBullets();
}

// Update game objects
function update() {
    moveShip();
    moveInvaders();
    moveBullets();
    checkCollisions();
    checkGameOver();
}

// Game loop
function loop() {
    draw();
    update();
    requestAnimationFrame(loop);
}

// Start the game
createInvaders();
loop();

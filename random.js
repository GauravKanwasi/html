const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = '#000';

const ctx = canvas.getContext('2d');

// Create gradient background
let gradient = ctx.createRadialGradient(
  canvas.width / 2, canvas.height / 2, 0,
  canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
);
gradient.addColorStop(0, '#000b');
gradient.addColorStop(1, '#000');

// Enhanced Star class with colors
class Star {
  constructor() {
    this.reset();
    this.size = Math.random() * 2 + 0.5;
    this.twinkleSpeed = Math.random() * 0.05 + 0.01;
    this.alpha = Math.random();
    this.alphaChange = this.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
    this.hue = Math.random() * 30 + (Math.random() < 0.1 ? 200 : 0);
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  }

  update() {
    this.alpha += this.alphaChange;
    
    if (this.alpha > 1 || this.alpha < 0.3) {
      this.alphaChange *= -1;
    }
  }

  draw() {
    ctx.fillStyle = `hsla(${this.hue}, 50%, 80%, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Shooting Star class
class ShootingStar {
  constructor() {
    this.reset();
    this.trail = [];
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.angle = Math.PI/3 + Math.random() * Math.PI/3;
    this.speed = Math.random() * 15 + 10;
    this.alpha = 1;
    this.length = 10 + Math.random() * 10;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.length) this.trail.shift();

    this.alpha -= 0.008;
    
    if (this.alpha <= 0 || this.x > canvas.width + 50 || this.y > canvas.height + 50) {
      this.reset();
    }
  }

  draw() {
    ctx.strokeStyle = `hsla(200, 100%, 90%, ${this.alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.trail[0].x, this.trail[0].y);
    this.trail.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.stroke();
  }
}

// Create star array
const stars = Array.from({ length: 300 }, () => new Star());
const shootingStars = Array.from({ length: 3 }, () => new ShootingStar());

// Resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
  );
  gradient.addColorStop(0, '#000b');
  gradient.addColorStop(1, '#000');
  stars.forEach(star => star.reset());
});

// Animation loop
function animate() {
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.update();
    star.draw();
  });

  shootingStars.forEach(star => {
    star.update();
    star.draw();
  });

  requestAnimationFrame(animate);
}

animate();
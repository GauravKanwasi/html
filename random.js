<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Starfield</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background: #000;
            font-family: 'Arial', sans-serif;
        }
        
        .controls {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 100;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 10px;
            color: white;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .control-group {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .control-group label {
            min-width: 100px;
            font-size: 12px;
        }
        
        input[type="range"] {
            width: 120px;
        }
        
        button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 11px;
        }
        
        button:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .stats {
            position: fixed;
            top: 20px;
            right: 20px;
            color: rgba(255, 255, 255, 0.7);
            font-family: monospace;
            font-size: 12px;
            background: rgba(0, 0, 0, 0.5);
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <canvas id="starfield"></canvas>
    
    <div class="controls">
        <div class="control-group">
            <label>Stars:</label>
            <input type="range" id="starCount" min="100" max="1000" value="400">
            <span id="starCountValue">400</span>
        </div>
        <div class="control-group">
            <label>Speed:</label>
            <input type="range" id="speed" min="0.1" max="3" step="0.1" value="1">
            <span id="speedValue">1.0</span>
        </div>
        <div class="control-group">
            <label>Nebula:</label>
            <input type="range" id="nebula" min="0" max="100" value="30">
            <span id="nebulaValue">30</span>
        </div>
        <div class="control-group">
            <button id="toggleParticles">Toggle Particles</button>
            <button id="toggleNebula">Toggle Nebula</button>
        </div>
    </div>
    
    <div class="stats">
        <div>FPS: <span id="fps">0</span></div>
        <div>Objects: <span id="objectCount">0</span></div>
    </div>

    <script>
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
        
        // Configuration
        let config = {
            starCount: 400,
            shootingStarsCount: 5,
            particlesEnabled: true,
            nebulaEnabled: true,
            speedMultiplier: 1,
            nebulaIntensity: 30
        };
        
        // Performance tracking
        let fps = 0;
        let frameCount = 0;
        let lastTime = performance.now();
        
        // Resize canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createGradients();
        }
        
        // Create gradients
        let backgroundGradient, nebulaGradient;
        function createGradients() {
            // Enhanced background gradient
            backgroundGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
            );
            backgroundGradient.addColorStop(0, '#001122');
            backgroundGradient.addColorStop(0.3, '#000811');
            backgroundGradient.addColorStop(0.7, '#000408');
            backgroundGradient.addColorStop(1, '#000000');
            
            // Nebula gradient
            nebulaGradient = ctx.createRadialGradient(
                canvas.width * 0.3, canvas.height * 0.4, 0,
                canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.8
            );
            nebulaGradient.addColorStop(0, 'rgba(64, 0, 128, 0.1)');
            nebulaGradient.addColorStop(0.3, 'rgba(32, 0, 64, 0.05)');
            nebulaGradient.addColorStop(0.6, 'rgba(16, 0, 32, 0.02)');
            nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        
        // Enhanced Star class
        class Star {
            constructor() {
                this.reset();
                this.size = Math.random() * 2.5 + 0.3;
                this.twinkleSpeed = Math.random() * 0.03 + 0.005;
                this.alpha = Math.random() * 0.8 + 0.2;
                this.alphaChange = this.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
                
                // Star color variety
                const colorType = Math.random();
                if (colorType < 0.6) {
                    this.hue = Math.random() * 20 + 200; // Blue-white stars
                } else if (colorType < 0.8) {
                    this.hue = Math.random() * 15 + 40; // Yellow stars
                } else if (colorType < 0.9) {
                    this.hue = Math.random() * 20 + 10; // Orange stars
                } else {
                    this.hue = Math.random() * 10 + 0; // Red stars
                }
                
                this.brightness = Math.random() * 60 + 40;
                this.saturation = Math.random() * 50 + 25;
                
                // Depth for parallax effect
                this.depth = Math.random() * 0.8 + 0.2;
                this.originalSize = this.size;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
            
            update() {
                this.alpha += this.alphaChange * config.speedMultiplier;
                
                if (this.alpha > 1 || this.alpha < 0.1) {
                    this.alphaChange *= -1;
                }
                
                // Subtle drift
                this.x += (Math.random() - 0.5) * 0.02 * config.speedMultiplier;
                this.y += (Math.random() - 0.5) * 0.02 * config.speedMultiplier;
                
                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
                
                // Size variation based on depth
                this.size = this.originalSize * this.depth;
            }
            
            draw() {
                const intensity = this.alpha * this.depth;
                
                // Star glow effect
                if (this.size > 1.5) {
                    const glowSize = this.size * 3;
                    const glowGradient = ctx.createRadialGradient(
                        this.x, this.y, 0,
                        this.x, this.y, glowSize
                    );
                    glowGradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity * 0.8})`);
                    glowGradient.addColorStop(0.2, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity * 0.3})`);
                    glowGradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, 0)`);
                    
                    ctx.fillStyle = glowGradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Main star
                ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Cross pattern for bright stars
                if (this.size > 2 && intensity > 0.7) {
                    ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity * 0.5})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(this.x - this.size * 2, this.y);
                    ctx.lineTo(this.x + this.size * 2, this.y);
                    ctx.moveTo(this.x, this.y - this.size * 2);
                    ctx.lineTo(this.x, this.y + this.size * 2);
                    ctx.stroke();
                }
            }
        }
        
        // Enhanced Shooting Star class
        class ShootingStar {
            constructor() {
                this.reset();
                this.trail = [];
                this.particles = [];
            }
            
            reset() {
                this.x = Math.random() * canvas.width - 100;
                this.y = -50 - Math.random() * 100;
                this.angle = Math.PI/4 + Math.random() * Math.PI/4;
                this.speed = Math.random() * 12 + 8;
                this.alpha = 1;
                this.length = 15 + Math.random() * 25;
                this.hue = Math.random() * 60 + 180; // Blue to cyan range
                this.brightness = Math.random() * 30 + 70;
                this.size = Math.random() * 2 + 1;
            }
            
            update() {
                this.x += Math.cos(this.angle) * this.speed * config.speedMultiplier;
                this.y += Math.sin(this.angle) * this.speed * config.speedMultiplier;
                
                this.trail.push({ 
                    x: this.x, 
                    y: this.y, 
                    alpha: this.alpha,
                    time: performance.now()
                });
                
                // Remove old trail points
                const currentTime = performance.now();
                this.trail = this.trail.filter(point => currentTime - point.time < 1000);
                
                if (this.trail.length > this.length) this.trail.shift();
                
                // Create particles
                if (config.particlesEnabled && Math.random() < 0.3) {
                    this.particles.push(new Particle(this.x, this.y, this.hue));
                }
                
                // Update particles
                this.particles = this.particles.filter(particle => {
                    particle.update();
                    return particle.alpha > 0;
                });
                
                this.alpha -= 0.005;
                
                if (this.alpha <= 0 || this.x > canvas.width + 100 || this.y > canvas.height + 100) {
                    this.reset();
                }
            }
            
            draw() {
                // Draw trail with gradient
                if (this.trail.length > 1) {
                    for (let i = 0; i < this.trail.length - 1; i++) {
                        const current = this.trail[i];
                        const next = this.trail[i + 1];
                        const trailAlpha = (i / this.trail.length) * this.alpha;
                        
                        ctx.strokeStyle = `hsla(${this.hue}, 80%, ${this.brightness}%, ${trailAlpha})`;
                        ctx.lineWidth = this.size * (i / this.trail.length + 0.2);
                        ctx.beginPath();
                        ctx.moveTo(current.x, current.y);
                        ctx.lineTo(next.x, next.y);
                        ctx.stroke();
                    }
                }
                
                // Draw head with glow
                const headGradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 4
                );
                headGradient.addColorStop(0, `hsla(${this.hue}, 100%, 90%, ${this.alpha})`);
                headGradient.addColorStop(0.3, `hsla(${this.hue}, 80%, ${this.brightness}%, ${this.alpha * 0.6})`);
                headGradient.addColorStop(1, `hsla(${this.hue}, 60%, ${this.brightness}%, 0)`);
                
                ctx.fillStyle = headGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw particles
                this.particles.forEach(particle => particle.draw());
            }
        }
        
        // Particle class for shooting star debris
        class Particle {
            constructor(x, y, hue) {
                this.x = x + (Math.random() - 0.5) * 10;
                this.y = y + (Math.random() - 0.5) * 10;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.alpha = Math.random() * 0.8 + 0.2;
                this.decay = Math.random() * 0.02 + 0.01;
                this.size = Math.random() * 1.5 + 0.5;
                this.hue = hue + (Math.random() - 0.5) * 60;
            }
            
            update() {
                this.x += this.vx * config.speedMultiplier;
                this.y += this.vy * config.speedMultiplier;
                this.alpha -= this.decay;
                this.size *= 0.99;
            }
            
            draw() {
                ctx.fillStyle = `hsla(${this.hue}, 70%, 80%, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Initialize arrays
        let stars = [];
        let shootingStars = [];
        
        function initializeStars() {
            stars = Array.from({ length: config.starCount }, () => new Star());
            shootingStars = Array.from({ length: config.shootingStarsCount }, () => new ShootingStar());
        }
        
        // Control handlers
        function setupControls() {
            const starCountSlider = document.getElementById('starCount');
            const speedSlider = document.getElementById('speed');
            const nebulaSlider = document.getElementById('nebula');
            const toggleParticles = document.getElementById('toggleParticles');
            const toggleNebula = document.getElementById('toggleNebula');
            
            starCountSlider.addEventListener('input', (e) => {
                config.starCount = parseInt(e.target.value);
                document.getElementById('starCountValue').textContent = config.starCount;
                initializeStars();
            });
            
            speedSlider.addEventListener('input', (e) => {
                config.speedMultiplier = parseFloat(e.target.value);
                document.getElementById('speedValue').textContent = config.speedMultiplier.toFixed(1);
            });
            
            nebulaSlider.addEventListener('input', (e) => {
                config.nebulaIntensity = parseInt(e.target.value);
                document.getElementById('nebulaValue').textContent = config.nebulaIntensity;
            });
            
            toggleParticles.addEventListener('click', () => {
                config.particlesEnabled = !config.particlesEnabled;
                toggleParticles.textContent = config.particlesEnabled ? 'Disable Particles' : 'Enable Particles';
            });
            
            toggleNebula.addEventListener('click', () => {
                config.nebulaEnabled = !config.nebulaEnabled;
                toggleNebula.textContent = config.nebulaEnabled ? 'Disable Nebula' : 'Enable Nebula';
            });
        }
        
        // Resize handler
        window.addEventListener('resize', resizeCanvas);
        
        // Animation loop
        function animate(currentTime) {
            // Calculate FPS
            frameCount++;
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                document.getElementById('fps').textContent = fps;
            }
            
            // Clear canvas with enhanced background
            ctx.fillStyle = backgroundGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw nebula effect
            if (config.nebulaEnabled && config.nebulaIntensity > 0) {
                ctx.globalAlpha = config.nebulaIntensity / 100;
                ctx.fillStyle = nebulaGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
            }
            
            // Update and draw stars
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            
            // Update and draw shooting stars
            shootingStars.forEach(star => {
                star.update();
                star.draw();
            });
            
            // Update object count
            const totalParticles = shootingStars.reduce((sum, star) => sum + star.particles.length, 0);
            document.getElementById('objectCount').textContent = stars.length + shootingStars.length + totalParticles;
            
            requestAnimationFrame(animate);
        }
        
        // Initialize
        resizeCanvas();
        initializeStars();
        setupControls();
        animate(performance.now());
    </script>
</body>
</html>

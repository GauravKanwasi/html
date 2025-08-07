<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultimate Starfield Experience - Enhanced</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background: #000;
            font-family: 'Courier New', monospace;
            cursor: none;
        }
        .controls {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 100;
            background: rgba(0, 20, 40, 0.9);
            padding: 20px;
            border-radius: 15px;
            color: #00ffff;
            backdrop-filter: blur(15px);
            border: 2px solid rgba(0, 255, 255, 0.3);
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
            min-width: 280px;
            transition: all 0.3s ease;
        }
        .controls:hover {
            background: rgba(0, 30, 60, 0.95);
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
        }
        .control-section {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid rgba(0, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(0, 255, 255, 0.05);
        }
        .section-title {
            color: #ffffff;
            font-weight: bold;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
        }
        .control-group {
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .control-group label {
            min-width: 90px;
            font-size: 11px;
            color: #00dddd;
        }
        input[type="range"] {
            width: 100px;
            accent-color: #00ffff;
        }
        .value-display {
            min-width: 40px;
            text-align: right;
            font-size: 11px;
            color: #ffffff;
        }
        button {
            background: linear-gradient(145deg, rgba(0, 100, 150, 0.3), rgba(0, 150, 200, 0.3));
            border: 1px solid rgba(0, 255, 255, 0.5);
            color: #00ffff;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 10px;
            font-family: inherit;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.2s ease;
        }
        button:hover {
            background: linear-gradient(145deg, rgba(0, 150, 200, 0.4), rgba(0, 200, 255, 0.4));
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }
        button:active {
            transform: scale(0.95);
        }
        /* --- Enhanced Toggle Button Styles --- */
        .toggle-btn-on {
            background: linear-gradient(145deg, rgba(0, 150, 100, 0.4), rgba(0, 255, 150, 0.4)) !important;
            border-color: rgba(0, 255, 150, 0.8) !important;
            color: #00ff99 !important;
            font-weight: bold;
        }
        .toggle-btn-off {
            background: linear-gradient(145deg, rgba(100, 0, 0, 0.3), rgba(200, 50, 50, 0.3)) !important;
            border-color: rgba(255, 50, 50, 0.5) !important;
            color: #ff5555 !important;
        }
        /* --- End Enhanced Toggle Button Styles --- */
        .stats {
            position: fixed;
            top: 20px;
            right: 20px;
            color: #00ffff;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            background: rgba(0, 20, 40, 0.9);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(0, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            min-width: 150px;
        }
        .stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            padding: 2px 0;
            border-bottom: 1px solid rgba(0, 255, 255, 0.1);
        }
        .stat-label {
            color: #00dddd;
        }
        .stat-value {
            color: #ffffff;
            font-weight: bold;
        }
        .crosshair {
            position: fixed;
            pointer-events: none;
            z-index: 1000;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(0, 255, 255, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        .crosshair::before, .crosshair::after {
            content: '';
            position: absolute;
            background: rgba(0, 255, 255, 0.8);
        }
        .crosshair::before {
            width: 2px;
            height: 8px;
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
        }
        .crosshair::after {
            height: 2px;
            width: 8px;
            left: -4px;
            top: 50%;
            transform: translateY(-50%);
        }
    </style>
</head>
<body>
    <canvas id="starfield"></canvas>
    <div class="crosshair"></div>
    <div class="controls">
        <div class="control-section">
            <div class="section-title">Universe Settings</div>
            <div class="control-group">
                <label>Stars:</label>
                <input type="range" id="starCount" min="200" max="2000" value="800">
                <span class="value-display" id="starCountValue">800</span>
            </div>
            <div class="control-group">
                <label>Galaxies:</label>
                <input type="range" id="galaxyCount" min="0" max="5" value="2">
                <span class="value-display" id="galaxyCountValue">2</span>
            </div>
             <div class="control-group">
                <label>Quality:</label>
                <input type="range" id="quality" min="1" max="5" value="3">
                <span class="value-display" id="qualityValue">3</span>
            </div>
            <div class="control-group">
                <label>Speed:</label>
                <input type="range" id="speed" min="0.1" max="5" step="0.1" value="1.5">
                <span class="value-display" id="speedValue">1.5</span>
            </div>
        </div>
        <div class="control-section">
            <div class="section-title">Phenomena</div>
            <div class="control-group">
                <label>Nebulae:</label>
                <input type="range" id="nebula" min="0" max="100" value="40">
                <span class="value-display" id="nebulaValue">40</span>
            </div>
            <div class="control-group">
                <label>Pulsars:</label>
                <input type="range" id="pulsarCount" min="0" max="8" value="3">
                <span class="value-display" id="pulsarCountValue">3</span>
            </div>
            <div class="control-group">
                <label>Black Holes:</label>
                <input type="range" id="blackHoleCount" min="0" max="3" value="1">
                <span class="value-display" id="blackHoleCountValue">1</span>
            </div>
        </div>
        <div class="control-section">
            <div class="section-title">Effects</div>
            <div class="control-group">
                <button id="toggleWarp">Warp Drive: OFF</button>
                <button id="toggleGravity">Gravity: ON</button>
            </div>
            <div class="control-group">
                <button id="toggleParticles">Particles: ON</button>
                <button id="toggleMusic">Audio: OFF</button>
            </div>
            <div class="control-group">
                <button id="supernovaButton">Trigger Supernova</button>
                 <button id="resetButton">Reset</button> <!-- Reset Button -->
            </div>
        </div>
    </div>
    <div class="stats">
        <div class="stat-row">
            <span class="stat-label">FPS:</span>
            <span class="stat-value" id="fps">0</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Objects:</span>
            <span class="stat-value" id="objectCount">0</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Temperature:</span>
            <span class="stat-value" id="temperature">2.7K</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Distance:</span>
            <span class="stat-value" id="distance">0 ly</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Velocity:</span>
            <span class="stat-value" id="velocity">0 c</span>
        </div>
    </div>
    <script>
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        // --- Default Configuration ---
        const DEFAULT_CONFIG = {
            starCount: 800,
            galaxyCount: 2,
            pulsarCount: 3,
            blackHoleCount: 1,
            shootingStarsCount: 8,
            particlesEnabled: true,
            gravityEnabled: true,
            warpDrive: false,
            audioEnabled: false,
            speedMultiplier: 1.5,
            nebulaIntensity: 40,
            cosmicBackground: 2.7,
            quality: 3 // 1: Low, 5: High
        };
        // --- End Default Configuration ---
        // Advanced configuration
        let config = {...DEFAULT_CONFIG}; // Start with defaults

        // --- Object Pools ---
        const meteorParticlePool = [];
        const supernovaPool = [];

        function getMeteorParticle(x, y, hue, composition) {
            if (meteorParticlePool.length > 0) {
                const particle = meteorParticlePool.pop();
                particle.reset(x, y, hue, composition);
                return particle;
            }
            return new MeteorParticle(x, y, hue, composition);
        }

        function returnMeteorParticle(particle) {
            if (meteorParticlePool.length < 500) { // Limit pool size
                 meteorParticlePool.push(particle);
            }
            // If pool is full, let it be garbage collected
        }

        function getSupernova(x, y) {
            if (supernovaPool.length > 0) {
                const sn = supernovaPool.pop();
                sn.reset(x, y);
                return sn;
            }
            return new Supernova(x, y);
        }

        function returnSupernova(supernova) {
             if (supernovaPool.length < 20) { // Limit pool size
                 supernovaPool.push(supernova);
             }
             // If pool is full, let it be garbage collected
        }
        // --- End Object Pools ---

        // Performance and stats
        let fps = 0, frameCount = 0, lastTime = performance.now();
        let totalDistance = 0;
        let mouse = { x: 0, y: 0, isMoving: false };
        let audioContext = null;
        let warpSound = null;
        let lastMouseTime = 0;
        let userHasInteracted = false; // For audio autoplay policy
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.isMoving = true;
            lastMouseTime = performance.now();
            document.querySelector('.crosshair').style.left = e.clientX + 'px';
            document.querySelector('.crosshair').style.top = e.clientY + 'px';
            userHasInteracted = true; // Set on first interaction
        });
        // Reset mouse movement flag after a short delay
        setInterval(() => {
            const now = performance.now();
            if (now - lastMouseTime > 100) { // 100ms threshold
                mouse.isMoving = false;
            }
        }, 50);

        // Audio setup (respects autoplay policy)
        function initAudio() {
            if (audioContext || !userHasInteracted) return; // Prevent re-init or init before interaction
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                // Create warp drive sound
                const createWarpSound = () => {
                    if (!audioContext) return;
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 2);
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 2);
                };
                warpSound = createWarpSound;
            } catch (e) {
                console.log('Audio not supported or initialization failed:', e);
                config.audioEnabled = false; // Disable if init fails
                updateToggleButton('toggleMusic', false);
            }
        }
        // Canvas setup
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createGradients();
        }
        // Advanced gradients
        let backgroundGradient, nebulaGradients = [], galaxyGradients = [];
        function createGradients() {
            // Cosmic microwave background
            backgroundGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
            );
            backgroundGradient.addColorStop(0, '#001a2e');
            backgroundGradient.addColorStop(0.2, '#000f1a');
            backgroundGradient.addColorStop(0.5, '#000a0f');
            backgroundGradient.addColorStop(0.8, '#000408');
            backgroundGradient.addColorStop(1, '#000000');
            // Multiple nebula gradients
            nebulaGradients = [];
            for (let i = 0; i < 3; i++) {
                const centerX = Math.random() * canvas.width;
                const centerY = Math.random() * canvas.height;
                const radius = Math.random() * canvas.width * 0.6 + canvas.width * 0.4;
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                const hue = Math.random() * 60 + (i * 120);
                gradient.addColorStop(0, `hsla(${hue}, 70%, 40%, 0.15)`);
                gradient.addColorStop(0.3, `hsla(${hue}, 60%, 30%, 0.08)`);
                gradient.addColorStop(0.6, `hsla(${hue}, 50%, 20%, 0.04)`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                // Add properties for independent animation
                nebulaGradients.push({
                    gradient,
                    rotation: Math.random() * Math.PI * 2,
                    offsetX: (Math.random() - 0.5) * 0.2,
                    offsetY: (Math.random() - 0.5) * 0.2,
                    depth: Math.random() * 0.5 + 0.5 // Parallax depth
                });
            }
            // Galaxy gradients
            galaxyGradients = [];
            for (let i = 0; i < config.galaxyCount; i++) {
                const centerX = Math.random() * canvas.width;
                const centerY = Math.random() * canvas.height;
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
                gradient.addColorStop(0, 'rgba(255, 220, 150, 0.3)');
                gradient.addColorStop(0.1, 'rgba(200, 180, 120, 0.2)');
                gradient.addColorStop(0.3, 'rgba(100, 120, 180, 0.1)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                galaxyGradients.push({
                    gradient,
                    x: centerX,
                    y: centerY,
                    rotation: 0,
                    rotationSpeed: (Math.random() - 0.5) * 0.001,
                    depth: Math.random() * 0.3 + 0.7 // Parallax depth for galaxies
                });
            }
        }
        // Enhanced Star class with spectral classification
        class Star {
            constructor() {
                this.reset();
                // Stellar classification (O, B, A, F, G, K, M)
                const stellarClass = Math.random();
                if (stellarClass < 0.0001) { // O-type
                    this.hue = 220;
                    this.size = Math.random() * 3 + 2;
                    this.temperature = 30000;
                } else if (stellarClass < 0.001) { // B-type
                    this.hue = 200;
                    this.size = Math.random() * 2.5 + 1.5;
                    this.temperature = 15000;
                } else if (stellarClass < 0.01) { // A-type
                    this.hue = 180;
                    this.size = Math.random() * 2 + 1;
                    this.temperature = 8000;
                } else if (stellarClass < 0.05) { // F-type
                    this.hue = Math.random() * 20 + 50;
                    this.size = Math.random() * 1.5 + 0.8;
                    this.temperature = 6500;
                } else if (stellarClass < 0.2) { // G-type (Sun-like)
                    this.hue = Math.random() * 15 + 45;
                    this.size = Math.random() * 1.2 + 0.6;
                    this.temperature = 5500;
                } else if (stellarClass < 0.5) { // K-type
                    this.hue = Math.random() * 20 + 20;
                    this.size = Math.random() * 1 + 0.5;
                    this.temperature = 4000;
                } else { // M-type (Red dwarfs)
                    this.hue = Math.random() * 15 + 0;
                    this.size = Math.random() * 0.8 + 0.3;
                    this.temperature = 3000;
                }
                this.originalSize = this.size;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.alpha = Math.random() * 0.7 + 0.3;
                this.alphaChange = this.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
                this.depth = Math.random() * 0.9 + 0.1; // For parallax
                this.brightness = 70 + (this.temperature / 500);
                this.saturation = Math.min(100, this.temperature / 200);
                // Proper motion (slightly more varied)
                this.vx = (Math.random() - 0.5) * 0.02;
                this.vy = (Math.random() - 0.5) * 0.02;
                // Binary star system
                this.isBinary = Math.random() < 0.1;
                if (this.isBinary) {
                    this.binaryAngle = Math.random() * Math.PI * 2;
                    this.binarySpeed = Math.random() * 0.02 + 0.01;
                    this.binaryDistance = Math.random() * 3 + 2;
                }
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
            update() {
                // Twinkling
                this.alpha += this.alphaChange * config.speedMultiplier;
                if (this.alpha > 1 || this.alpha < 0.2) {
                    this.alphaChange *= -1;
                }
                // Proper motion
                this.x += this.vx * config.speedMultiplier;
                this.y += this.vy * config.speedMultiplier;
                // Warp effect
                if (config.warpDrive) {
                    this.x += (this.x - canvas.width / 2) * 0.002 * config.speedMultiplier;
                    this.y += (this.y - canvas.height / 2) * 0.002 * config.speedMultiplier;
                    this.size = this.originalSize * (1 + Math.random() * 0.5);
                } else {
                    this.size = this.originalSize * this.depth;
                }
                // Gravity effects from black holes
                if (config.gravityEnabled) {
                    blackHoles.forEach(bh => {
                        const dx = bh.x - this.x;
                        const dy = bh.y - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < bh.eventHorizon * 5) {
                            const force = bh.mass / (dist * dist) * 0.00001;
                            this.x += dx * force;
                            this.y += dy * force;
                        }
                    });
                }
                // Mouse Gravity (only if mouse is near and not moving fast)
                if (config.gravityEnabled && !mouse.isMoving) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distSq = dx * dx + dy * dy;
                    const maxDist = 150;
                    if (distSq < maxDist * maxDist) {
                         const dist = Math.sqrt(distSq);
                         const force = 0.05 * (1 - dist / maxDist); // Stronger closer
                         this.x += dx * force * 0.01 * config.speedMultiplier;
                         this.y += dy * force * 0.01 * config.speedMultiplier;
                    }
                }
                // Binary star orbital motion
                if (this.isBinary) {
                    this.binaryAngle += this.binarySpeed * config.speedMultiplier;
                }
                // Wrap around edges (with parallax)
                const parallaxOffset = 100 * (1 - this.depth); // Closer objects wrap sooner
                if (this.x < -parallaxOffset) this.x = canvas.width + parallaxOffset;
                if (this.x > canvas.width + parallaxOffset) this.x = -parallaxOffset;
                if (this.y < -parallaxOffset) this.y = canvas.height + parallaxOffset;
                if (this.y > canvas.height + parallaxOffset) this.y = -parallaxOffset;
            }
            draw() {
                const intensity = this.alpha * this.depth;
                let drawX = this.x;
                let drawY = this.y;
                // Draw binary companion
                if (this.isBinary) {
                    const companionX = this.x + Math.cos(this.binaryAngle) * this.binaryDistance;
                    const companionY = this.y + Math.sin(this.binaryAngle) * this.binaryDistance;
                    ctx.fillStyle = `hsla(${this.hue + 30}, ${this.saturation}%, ${this.brightness * 0.7}%, ${intensity * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(companionX, companionY, this.size * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                }
                // Enhanced glow for bright stars
                if (this.size > 1.5) {
                    const glowSize = this.size * (config.warpDrive ? 6 : 4);
                    const glowGradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowSize);
                    glowGradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity})`);
                    glowGradient.addColorStop(0.1, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity * 0.6})`);
                    glowGradient.addColorStop(0.3, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity * 0.2})`);
                    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = glowGradient;
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, glowSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                // Main star
                ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity})`;
                ctx.beginPath();
                ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
                ctx.fill();
                // Diffraction spikes for bright stars
                if (this.size > 2 && intensity > 0.6) {
                    ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${intensity * 0.4})`;
                    ctx.lineWidth = 0.5;
                    const spikeLength = this.size * 3;
                    ctx.beginPath();
                    // Horizontal spike
                    ctx.moveTo(drawX - spikeLength, drawY);
                    ctx.lineTo(drawX + spikeLength, drawY);
                    // Vertical spike
                    ctx.moveTo(drawX, drawY - spikeLength);
                    ctx.lineTo(drawX, drawY + spikeLength);
                    // Diagonal spikes for very bright stars
                    if (this.size > 2.5) {
                        ctx.moveTo(drawX - spikeLength * 0.7, drawY - spikeLength * 0.7);
                        ctx.lineTo(drawX + spikeLength * 0.7, drawY + spikeLength * 0.7);
                        ctx.moveTo(drawX - spikeLength * 0.7, drawY + spikeLength * 0.7);
                        ctx.lineTo(drawX + spikeLength * 0.7, drawY - spikeLength * 0.7);
                    }
                    ctx.stroke();
                }
            }
        }
        // Pulsar class
        class Pulsar {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.pulseSpeed = Math.random() * 0.1 + 0.05;
                this.pulse = 0;
                this.beamAngle = Math.random() * Math.PI * 2;
                this.beamSpeed = Math.random() * 0.02 + 0.01;
                this.size = Math.random() * 2 + 1;
                this.hue = 180 + Math.random() * 40;
            }
            update() {
                this.pulse += this.pulseSpeed * config.speedMultiplier;
                this.beamAngle += this.beamSpeed * config.speedMultiplier;
            }
            draw() {
                const intensity = (Math.sin(this.pulse) + 1) / 2;
                // Draw pulsar beam
                if (intensity > 0.8) {
                    ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${intensity * 0.6})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    const beamLength = 200;
                    ctx.lineTo(
                        this.x + Math.cos(this.beamAngle) * beamLength,
                        this.y + Math.sin(this.beamAngle) * beamLength
                    );
                    ctx.lineTo(
                        this.x + Math.cos(this.beamAngle + Math.PI) * beamLength,
                        this.y + Math.sin(this.beamAngle + Math.PI) * beamLength
                    );
                    ctx.stroke();
                }
                // Draw pulsar core
                const glowGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 8);
                glowGradient.addColorStop(0, `hsla(${this.hue}, 100%, 90%, ${intensity})`);
                glowGradient.addColorStop(0.3, `hsla(${this.hue}, 80%, 70%, ${intensity * 0.5})`);
                glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // Black Hole class
        class BlackHole {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.mass = Math.random() * 100 + 50;
                this.eventHorizon = this.mass / 10;
                this.accretionDisk = [];
                this.rotation = 0;
                // Create accretion disk particles
                for (let i = 0; i < 50; i++) {
                    const angle = (i / 50) * Math.PI * 2;
                    const radius = this.eventHorizon * (2 + Math.random() * 3);
                    this.accretionDisk.push({
                        angle: angle,
                        radius: radius,
                        speed: 0.02 / (radius * 0.1),
                        brightness: Math.random()
                    });
                }
            }
            update() {
                this.rotation += 0.01 * config.speedMultiplier;
                // Update accretion disk
                this.accretionDisk.forEach(particle => {
                    particle.angle += particle.speed * config.speedMultiplier;
                    particle.brightness += (Math.random() - 0.5) * 0.02;
                    particle.brightness = Math.max(0.1, Math.min(1, particle.brightness));
                });
            }
            draw() {
                // Draw accretion disk
                this.accretionDisk.forEach(particle => {
                    const x = this.x + Math.cos(particle.angle) * particle.radius;
                    const y = this.y + Math.sin(particle.angle) * particle.radius * 0.3; // Flattened disk
                    const temperature = 5000 + (this.eventHorizon * 2 - particle.radius) * 100;
                    let hue = 30;
                    if (temperature > 8000) hue = 200;
                    else if (temperature > 6000) hue = 60;
                    ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${particle.brightness * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.fill();
                });
                // Draw gravitational lensing effect
                const lensGradient = ctx.createRadialGradient(
                    this.x, this.y, this.eventHorizon,
                    this.x, this.y, this.eventHorizon * 3
                );
                lensGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
                lensGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
                lensGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = lensGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.eventHorizon * 3, 0, Math.PI * 2);
                ctx.fill();
                // Event horizon
                ctx.strokeStyle = 'rgba(255, 100, 0, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.eventHorizon, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        // Supernova class
        class Supernova {
            constructor(x, y) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * canvas.height;
                this.age = 0;
                this.maxAge = 300;
                this.shockwaveRadius = 0;
                this.brightness = 1;
                this.particles = [];
                this.hue = Math.random() * 60 + 30; // Yellow to red spectrum
                this.reset(x, y); // Initialize particles
            }
            reset(x, y) {
                 this.x = x || Math.random() * canvas.width;
                 this.y = y || Math.random() * canvas.height;
                 this.age = 0;
                 this.shockwaveRadius = 0;
                 this.brightness = 1;
                 this.particles = [];
                 this.hue = Math.random() * 60 + 30;
                 // Create explosion particles
                 const particleCount = 50 + config.quality * 10; // Scale particles with quality
                 for (let i = 0; i < particleCount; i++) {
                     const angle = (i / particleCount) * Math.PI * 2;
                     const speed = Math.random() * 5 + 2;
                     this.particles.push({
                         x: this.x,
                         y: this.y,
                         vx: Math.cos(angle) * speed,
                         vy: Math.sin(angle) * speed,
                         life: 1,
                         decay: Math.random() * 0.02 + 0.005,
                         size: Math.random() * 3 + 1,
                         hue: this.hue + (Math.random() - 0.5) * 40
                     });
                 }
            }
            update() {
                this.age += config.speedMultiplier;
                this.shockwaveRadius = (this.age / this.maxAge) * 300;
                this.brightness = Math.max(0, 1 - (this.age / this.maxAge));
                // Update particles
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const particle = this.particles[i];
                    particle.x += particle.vx * config.speedMultiplier;
                    particle.y += particle.vy * config.speedMultiplier;
                    particle.life -= particle.decay;
                    particle.size *= 0.995;
                    if (particle.life <= 0) {
                         returnMeteorParticle(this.particles.splice(i, 1)[0]); // Return to pool
                    }
                }
            }
            draw() {
                if (this.age > this.maxAge) return;
                // Draw shockwave
                ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${this.brightness * 0.5})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.shockwaveRadius, 0, Math.PI * 2);
                ctx.stroke();
                // Draw core explosion
                const coreGradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.shockwaveRadius * 0.3
                );
                coreGradient.addColorStop(0, `hsla(${this.hue + 60}, 100%, 90%, ${this.brightness})`);
                coreGradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 70%, ${this.brightness * 0.6})`);
                coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = coreGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.shockwaveRadius * 0.3, 0, Math.PI * 2);
                ctx.fill();
                // Draw particles
                this.particles.forEach(particle => {
                    ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.life})`;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
            isDead() {
                return this.age > this.maxAge && this.particles.length === 0;
            }
        }
        // Enhanced Shooting Star with realistic physics
        class ShootingStar {
            constructor() {
                this.reset();
                this.trail = [];
                this.particles = [];
                this.composition = Math.random(); // Iron, rocky, icy
            }
            reset() {
                // Entry from random edge
                const edge = Math.floor(Math.random() * 4);
                switch(edge) {
                    case 0: // Top
                        this.x = Math.random() * canvas.width;
                        this.y = -50;
                        break;
                    case 1: // Right
                        this.x = canvas.width + 50;
                        this.y = Math.random() * canvas.height;
                        break;
                    case 2: // Bottom
                        this.x = Math.random() * canvas.width;
                        this.y = canvas.height + 50;
                        break;
                    case 3: // Left
                        this.x = -50;
                        this.y = Math.random() * canvas.height;
                        break;
                }
                // Realistic meteor velocities (11-72 km/s scaled)
                const targetX = Math.random() * canvas.width;
                const targetY = Math.random() * canvas.height;
                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                this.speed = Math.random() * 20 + 10;
                this.vx = (dx / distance) * this.speed;
                this.vy = (dy / distance) * this.speed;
                this.alpha = 1;
                this.length = 20 + Math.random() * 30;
                this.size = Math.random() * 3 + 1;
                // Color based on composition
                if (this.composition < 0.3) { // Iron meteor
                    this.hue = Math.random() * 20 + 40; // Yellow-orange
                } else if (this.composition < 0.7) { // Rocky meteor
                    this.hue = Math.random() * 30 + 10; // Orange-red
                } else { // Icy meteor
                    this.hue = Math.random() * 40 + 180; // Blue-white
                }
                this.brightness = Math.random() * 30 + 70;
                this.trail = []; // Clear trail on reset
            }
            update() {
                // Atmospheric friction simulation
                const atmosphericDrag = 0.98;
                this.vx *= atmosphericDrag;
                this.vy *= atmosphericDrag;
                this.x += this.vx * config.speedMultiplier;
                this.y += this.vy * config.speedMultiplier;
                // Add trail point
                this.trail.push({
                    x: this.x,
                    y: this.y,
                    alpha: this.alpha,
                    time: performance.now()
                });
                // Remove old trail points (optimized)
                const currentTime = performance.now();
                let removeCount = 0;
                for (let i = 0; i < this.trail.length; i++) {
                    if (currentTime - this.trail[i].time >= 800) {
                        removeCount++;
                    } else {
                        break; // Stop at first valid point
                    }
                }
                if (removeCount > 0) {
                    this.trail.splice(0, removeCount);
                }
                // Limit trail length based on quality
                const maxTrailLength = 10 + config.quality * 5;
                if (this.trail.length > maxTrailLength) this.trail.shift();

                // Create sparks and particles
                if (config.particlesEnabled && Math.random() < 0.4) {
                    // Use object pool
                    const particle = getMeteorParticle(this.x, this.y, this.hue, this.composition);
                    this.particles.push(particle);
                }
                // Update particles
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const particle = this.particles[i];
                    particle.update();
                    if (particle.alpha <= 0) {
                        returnMeteorParticle(this.particles.splice(i, 1)[0]); // Return to pool
                    }
                }
                // Atmospheric burnup
                this.alpha -= 0.003;
                this.size *= 0.998;
                // Reset if off screen or burned up
                if (this.alpha <= 0 || this.x < -100 || this.x > canvas.width + 100 ||
                    this.y < -100 || this.y > canvas.height + 100) {
                    // Return particles to pool before reset
                    this.particles.forEach(p => returnMeteorParticle(p));
                    this.particles = [];
                    this.reset();
                }
            }
            draw() {
                // Draw ionization trail
                if (this.trail.length > 1) {
                    for (let i = 0; i < this.trail.length - 1; i++) {
                        const current = this.trail[i];
                        const next = this.trail[i + 1];
                        const trailAlpha = (i / this.trail.length) * this.alpha;
                        const width = this.size * (i / this.trail.length + 0.1);
                        // Multiple trail layers for realism
                        ctx.strokeStyle = `hsla(${this.hue}, 100%, 90%, ${trailAlpha})`;
                        ctx.lineWidth = width;
                        ctx.beginPath();
                        ctx.moveTo(current.x, current.y);
                        ctx.lineTo(next.x, next.y);
                        ctx.stroke();
                        // Outer glow
                        ctx.strokeStyle = `hsla(${this.hue}, 60%, 50%, ${trailAlpha * 0.3})`;
                        ctx.lineWidth = width * 3;
                        ctx.beginPath();
                        ctx.moveTo(current.x, current.y);
                        ctx.lineTo(next.x, next.y);
                        ctx.stroke();
                    }
                }
                // Draw meteor head with atmospheric heating effect
                const headGradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 6
                );
                headGradient.addColorStop(0, `hsla(${this.hue + 30}, 100%, 95%, ${this.alpha})`);
                headGradient.addColorStop(0.3, `hsla(${this.hue}, 90%, ${this.brightness}%, ${this.alpha * 0.8})`);
                headGradient.addColorStop(0.6, `hsla(${this.hue - 20}, 70%, 60%, ${this.alpha * 0.4})`);
                headGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = headGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 6, 0, Math.PI * 2);
                ctx.fill();
                // Draw particles
                this.particles.forEach(particle => particle.draw());
            }
        }
        // Meteor particle debris
        class MeteorParticle {
            constructor(x, y, hue, composition) {
                this.reset(x, y, hue, composition);
            }
            reset(x, y, hue, composition) {
                 this.x = x + (Math.random() - 0.5) * 8;
                 this.y = y + (Math.random() - 0.5) * 8;
                 this.vx = (Math.random() - 0.5) * 4;
                 this.vy = (Math.random() - 0.5) * 4 + Math.random() * 2; // Gravity effect
                 this.alpha = Math.random() * 0.8 + 0.2;
                 this.decay = Math.random() * 0.02 + 0.01;
                 this.size = Math.random() * 2 + 0.5;
                 this.hue = hue + (Math.random() - 0.5) * 40;
                 this.composition = composition;
                 this.spin = Math.random() * 0.2;
                 this.angle = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.vx * config.speedMultiplier;
                this.y += this.vy * config.speedMultiplier;
                this.vy += 0.05; // Gravity
                this.alpha -= this.decay;
                this.size *= 0.99;
                this.angle += this.spin;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                // Different shapes based on composition
                if (this.composition < 0.3) { // Iron - angular fragments
                    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha})`;
                    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                } else if (this.composition < 0.7) { // Rocky - irregular
                    ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size * 0.7, 0);
                    ctx.lineTo(0, this.size);
                    ctx.lineTo(-this.size * 0.7, 0);
                    ctx.closePath();
                    ctx.fill();
                } else { // Icy - round with glow
                    const iceGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                    iceGradient.addColorStop(0, `hsla(${this.hue}, 90%, 90%, ${this.alpha})`);
                    iceGradient.addColorStop(1, `hsla(${this.hue}, 60%, 70%, ${this.alpha * 0.3})`);
                    ctx.fillStyle = iceGradient;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        // --- Comet Class ---
        class Comet {
            constructor() {
                this.reset();
                this.trail = [];
            }
            reset() {
                const edge = Math.floor(Math.random() * 4);
                switch(edge) {
                    case 0: this.x = Math.random() * canvas.width; this.y = -100; break;
                    case 1: this.x = canvas.width + 100; this.y = Math.random() * canvas.height; break;
                    case 2: this.x = Math.random() * canvas.width; this.y = canvas.height + 100; break;
                    case 3: this.x = -100; this.y = Math.random() * canvas.height; break;
                }
                const targetX = Math.random() * canvas.width;
                const targetY = Math.random() * canvas.height;
                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                this.speed = Math.random() * 1 + 0.5; // Slower than meteors
                this.vx = (dx / distance) * this.speed;
                this.vy = (dy / distance) * this.speed;
                this.size = Math.random() * 2 + 1;
                this.hue = Math.random() * 40 + 180; // Blue-ish
                this.alpha = Math.random() * 0.5 + 0.3;
                this.tailLength = 50 + Math.random() * 100;
                this.trail = [];
            }
            update() {
                this.x += this.vx * config.speedMultiplier;
                this.y += this.vy * config.speedMultiplier;
                this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
                if (this.trail.length > this.tailLength) this.trail.shift();

                if (this.x < -200 || this.x > canvas.width + 200 ||
                    this.y < -200 || this.y > canvas.height + 200) {
                    this.reset();
                }
            }
            draw() {
                 if (this.trail.length > 1) {
                    ctx.beginPath();
                    for (let i = 0; i < this.trail.length; i++) {
                        const point = this.trail[i];
                        const pointAlpha = (i / this.trail.length) * this.alpha * 0.5;
                        ctx.globalAlpha = pointAlpha;
                        ctx.fillStyle = `hsla(${this.hue + i * 0.5}, 70%, 80%, ${pointAlpha})`;
                        const pointSize = (i / this.trail.length) * this.size * 0.5;
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.globalAlpha = 1.0;
                 }
                 ctx.fillStyle = `hsla(${this.hue}, 90%, 95%, ${this.alpha})`;
                 ctx.beginPath();
                 ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                 ctx.fill();
            }
        }
        // --- End Comet Class ---

        // --- Asteroid Belt Class ---
        class Asteroid {
            constructor(beltRadius, beltWidth) {
                this.beltRadius = beltRadius;
                this.beltWidth = beltWidth;
                this.angle = Math.random() * Math.PI * 2;
                this.distance = beltRadius + (Math.random() - 0.5) * beltWidth;
                this.size = Math.random() * 1.5 + 0.5;
                this.speed = (Math.random() - 0.5) * 0.005 + 0.002; // Slow orbital speed
                this.hue = Math.random() * 20 + 30; // Brownish
                this.brightness = Math.random() * 30 + 40;
                this.alpha = Math.random() * 0.6 + 0.2;
            }
            update(centerX, centerY) {
                 this.angle += this.speed * config.speedMultiplier;
                 this.x = centerX + Math.cos(this.angle) * this.distance;
                 this.y = centerY + Math.sin(this.angle) * this.distance * 0.1; // Flattened orbit
            }
            draw() {
                ctx.fillStyle = `hsla(${this.hue}, 30%, ${this.brightness}%, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // --- End Asteroid Belt Class ---

        // Cosmic dust and particles (with parallax)
        class CosmicDust {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 0.5 + 0.1;
                this.alpha = Math.random() * 0.3 + 0.1;
                this.hue = Math.random() * 30 + 40;
                this.depth = Math.random() * 0.8 + 0.2; // Parallax depth
            }
            update() {
                 // Apply parallax based on depth
                 const parallaxFactor = 1 - this.depth;
                 this.x += this.vx * config.speedMultiplier * parallaxFactor;
                 this.y += this.vy * config.speedMultiplier * parallaxFactor;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = `hsla(${this.hue}, 40%, 60%, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // Initialize all cosmic objects
        let stars = [];
        let shootingStars = [];
        let comets = []; // Add comets array
        let asteroids = []; // Add asteroids array
        let pulsars = [];
        let blackHoles = [];
        let supernovas = [];
        let cosmicDust = [];
        function initializeUniverse() {
            stars = Array.from({ length: config.starCount }, () => new Star());
            shootingStars = Array.from({ length: config.shootingStarsCount }, () => new ShootingStar());
            comets = Array.from({ length: 2 }, () => new Comet()); // Initialize comets
            // Initialize asteroid belt
            const beltRadius = Math.min(canvas.width, canvas.height) * 0.4;
            const beltWidth = beltRadius * 0.1;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const asteroidCount = 100 + config.quality * 50; // Scale with quality
            asteroids = Array.from({ length: asteroidCount }, () => new Asteroid(beltRadius, beltWidth));
            pulsars = Array.from({ length: config.pulsarCount }, () => new Pulsar());
            blackHoles = Array.from({ length: config.blackHoleCount }, () => new BlackHole());
            // Adjust cosmic dust based on quality
            const dustCount = 100 + config.quality * 50;
            cosmicDust = Array.from({ length: dustCount }, () => new CosmicDust());
        }
        // --- Utility to update toggle button styles ---
        function updateToggleButton(buttonId, isActive) {
             const button = document.getElementById(buttonId);
             if (isActive) {
                 button.classList.add('toggle-btn-on');
                 button.classList.remove('toggle-btn-off');
             } else {
                 button.classList.add('toggle-btn-off');
                 button.classList.remove('toggle-btn-on');
             }
        }
        // --- End Utility ---

        // Control system
        function setupControls() {
            // Star controls
            const starCountSlider = document.getElementById('starCount');
            const starCountValue = document.getElementById('starCountValue');
            starCountSlider.addEventListener('input', (e) => {
                config.starCount = parseInt(e.target.value);
                starCountValue.textContent = config.starCount;
                stars = Array.from({ length: config.starCount }, () => new Star());
            });
            starCountSlider.dispatchEvent(new Event('input')); // Initial update

            const galaxyCountSlider = document.getElementById('galaxyCount');
            const galaxyCountValue = document.getElementById('galaxyCountValue');
            galaxyCountSlider.addEventListener('input', (e) => {
                config.galaxyCount = parseInt(e.target.value);
                galaxyCountValue.textContent = config.galaxyCount;
                createGradients(); // Recreate gradients for new galaxy count
            });
            galaxyCountSlider.dispatchEvent(new Event('input'));

            // --- Quality Control ---
            const qualitySlider = document.getElementById('quality');
            const qualityValue = document.getElementById('qualityValue');
            qualitySlider.addEventListener('input', (e) => {
                config.quality = parseInt(e.target.value);
                qualityValue.textContent = config.quality;
                // Reinitialize objects that depend on quality
                const dustCount = 100 + config.quality * 50;
                cosmicDust = Array.from({ length: dustCount }, () => new CosmicDust());
                
                const asteroidCount = 100 + config.quality * 50;
                const beltRadius = Math.min(canvas.width, canvas.height) * 0.4;
                const beltWidth = beltRadius * 0.1;
                asteroids = Array.from({ length: asteroidCount }, () => new Asteroid(beltRadius, beltWidth));
            });
            qualitySlider.dispatchEvent(new Event('input'));
            // --- End Quality Control ---

            const speedSlider = document.getElementById('speed');
            const speedValue = document.getElementById('speedValue');
            speedSlider.addEventListener('input', (e) => {
                config.speedMultiplier = parseFloat(e.target.value);
                speedValue.textContent = config.speedMultiplier.toFixed(1);
            });
            speedSlider.dispatchEvent(new Event('input'));

            // Phenomena controls
            const nebulaSlider = document.getElementById('nebula');
            const nebulaValue = document.getElementById('nebulaValue');
            nebulaSlider.addEventListener('input', (e) => {
                config.nebulaIntensity = parseInt(e.target.value);
                nebulaValue.textContent = config.nebulaIntensity;
            });
            nebulaSlider.dispatchEvent(new Event('input'));

            const pulsarCountSlider = document.getElementById('pulsarCount');
            const pulsarCountValue = document.getElementById('pulsarCountValue');
            pulsarCountSlider.addEventListener('input', (e) => {
                config.pulsarCount = parseInt(e.target.value);
                pulsarCountValue.textContent = config.pulsarCount;
                pulsars = Array.from({ length: config.pulsarCount }, () => new Pulsar());
            });
            pulsarCountSlider.dispatchEvent(new Event('input'));

            const blackHoleCountSlider = document.getElementById('blackHoleCount');
            const blackHoleCountValue = document.getElementById('blackHoleCountValue');
            blackHoleCountSlider.addEventListener('input', (e) => {
                config.blackHoleCount = parseInt(e.target.value);
                blackHoleCountValue.textContent = config.blackHoleCount;
                blackHoles = Array.from({ length: config.blackHoleCount }, () => new BlackHole());
            });
            blackHoleCountSlider.dispatchEvent(new Event('input'));

            // Effect toggles
            document.getElementById('toggleWarp').addEventListener('click', (e) => {
                config.warpDrive = !config.warpDrive;
                e.target.textContent = `Warp Drive: ${config.warpDrive ? 'ON' : 'OFF'}`;
                updateToggleButton('toggleWarp', config.warpDrive);
                if (config.warpDrive && config.audioEnabled && warpSound) {
                    initAudio(); // Ensure audio is initialized
                    warpSound();
                }
            });
            updateToggleButton('toggleWarp', config.warpDrive); // Initial state

            document.getElementById('toggleGravity').addEventListener('click', (e) => {
                config.gravityEnabled = !config.gravityEnabled;
                e.target.textContent = `Gravity: ${config.gravityEnabled ? 'ON' : 'OFF'}`;
                updateToggleButton('toggleGravity', config.gravityEnabled);
            });
            updateToggleButton('toggleGravity', config.gravityEnabled);

            document.getElementById('toggleParticles').addEventListener('click', (e) => {
                config.particlesEnabled = !config.particlesEnabled;
                e.target.textContent = `Particles: ${config.particlesEnabled ? 'ON' : 'OFF'}`;
                updateToggleButton('toggleParticles', config.particlesEnabled);
            });
            updateToggleButton('toggleParticles', config.particlesEnabled);

            document.getElementById('toggleMusic').addEventListener('click', (e) => {
                config.audioEnabled = !config.audioEnabled;
                e.target.textContent = `Audio: ${config.audioEnabled ? 'ON' : 'OFF'}`;
                updateToggleButton('toggleMusic', config.audioEnabled);
                if (config.audioEnabled) {
                    initAudio(); // Initialize only when turned on and user has interacted
                }
            });
            updateToggleButton('toggleMusic', config.audioEnabled);

            document.getElementById('supernovaButton').addEventListener('click', () => {
                const x = mouse.x || canvas.width / 2;
                const y = mouse.y || canvas.height / 2;
                // Use object pool
                const supernova = getSupernova(x, y);
                supernovas.push(supernova);
            });

            // --- Reset Button ---
            document.getElementById('resetButton').addEventListener('click', () => {
                 // Reset config to defaults
                 config = {...DEFAULT_CONFIG};
                 // Update all sliders and values
                 starCountSlider.value = config.starCount;
                 starCountValue.textContent = config.starCount;
                 galaxyCountSlider.value = config.galaxyCount;
                 galaxyCountValue.textContent = config.galaxyCount;
                 qualitySlider.value = config.quality;
                 qualityValue.textContent = config.quality;
                 speedSlider.value = config.speedMultiplier;
                 speedValue.textContent = config.speedMultiplier.toFixed(1);
                 nebulaSlider.value = config.nebulaIntensity;
                 nebulaValue.textContent = config.nebulaIntensity;
                 pulsarCountSlider.value = config.pulsarCount;
                 pulsarCountValue.textContent = config.pulsarCount;
                 blackHoleCountSlider.value = config.blackHoleCount;
                 blackHoleCountValue.textContent = config.blackHoleCount;

                 // Update toggle buttons
                 updateToggleButton('toggleWarp', config.warpDrive);
                 updateToggleButton('toggleGravity', config.gravityEnabled);
                 updateToggleButton('toggleParticles', config.particlesEnabled);
                 updateToggleButton('toggleMusic', config.audioEnabled);
                 document.getElementById('toggleWarp').textContent = `Warp Drive: ${config.warpDrive ? 'ON' : 'OFF'}`;
                 document.getElementById('toggleGravity').textContent = `Gravity: ${config.gravityEnabled ? 'ON' : 'OFF'}`;
                 document.getElementById('toggleParticles').textContent = `Particles: ${config.particlesEnabled ? 'ON' : 'OFF'}`;
                 document.getElementById('toggleMusic').textContent = `Audio: ${config.audioEnabled ? 'ON' : 'OFF'}`;

                 // Reinitialize universe
                 createGradients();
                 initializeUniverse();
            });
            // --- End Reset Button ---
        }
        // Resize handler
        window.addEventListener('resize', resizeCanvas);
        // Main animation loop
        function animate(currentTime) {
            // FPS calculation
            frameCount++;
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                // Update stats
                document.getElementById('fps').textContent = fps;
                document.getElementById('temperature').textContent = (config.cosmicBackground + Math.random() * 0.2).toFixed(1) + 'K';
                totalDistance += config.speedMultiplier * 0.1;
                document.getElementById('distance').textContent = totalDistance.toFixed(1) + ' ly';
                document.getElementById('velocity').textContent = (config.warpDrive ? config.speedMultiplier * 2 : config.speedMultiplier * 0.1).toFixed(2) + ' c';
            }
            // Clear with cosmic background
            ctx.fillStyle = backgroundGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw galaxies with parallax
            galaxyGradients.forEach(galaxy => {
                galaxy.rotation += galaxy.rotationSpeed * config.speedMultiplier;
                ctx.save();
                // Apply parallax: galaxies move slower than stars
                const parallaxX = (mouse.x - canvas.width / 2) * (1 - galaxy.depth) * 0.02;
                const parallaxY = (mouse.y - canvas.height / 2) * (1 - galaxy.depth) * 0.02;
                ctx.translate(galaxy.x + parallaxX, galaxy.y + parallaxY);
                ctx.rotate(galaxy.rotation);
                ctx.fillStyle = galaxy.gradient;
                ctx.fillRect(-300, -300, 600, 600);
                ctx.restore();
            });
            // Draw nebulae with parallax, intensity, and independent animation
            if (config.nebulaIntensity > 0) {
                ctx.globalAlpha = config.nebulaIntensity / 100;
                nebulaGradients.forEach(nebula => {
                    nebula.rotation += 0.0005 * config.speedMultiplier;
                    // Slowly drift nebula centers
                    nebula.offsetX += (Math.random() - 0.5) * 0.0001 * config.speedMultiplier;
                    nebula.offsetY += (Math.random() - 0.5) * 0.0001 * config.speedMultiplier;
                    ctx.save();
                    // Apply parallax: nebulae move even slower
                    const parallaxX = (mouse.x - canvas.width / 2) * (1 - nebula.depth) * 0.01;
                    const parallaxY = (mouse.y - canvas.height / 2) * (1 - nebula.depth) * 0.01;
                    ctx.translate(
                        canvas.width / 2 + parallaxX + canvas.width * nebula.offsetX,
                        canvas.height / 2 + parallaxY + canvas.height * nebula.offsetY
                    );
                    ctx.rotate(nebula.rotation);
                    ctx.fillStyle = nebula.gradient;
                    ctx.fillRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
                    ctx.restore();
                });
                ctx.globalAlpha = 1;
            }
            // Update and draw cosmic dust (parallax already in update)
            cosmicDust.forEach(dust => {
                dust.update();
                dust.draw();
            });
            // Update and draw black holes
            blackHoles.forEach(bh => {
                bh.update();
                bh.draw();
            });
            // Update and draw stars
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            // Update and draw pulsars
            pulsars.forEach(pulsar => {
                pulsar.update();
                pulsar.draw();
            });
            // Update and draw comets
            comets.forEach(comet => {
                comet.update();
                comet.draw();
            });
             // Update and draw asteroids
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            asteroids.forEach(asteroid => {
                asteroid.update(centerX, centerY);
                asteroid.draw();
            });
            // Update and draw shooting stars
            shootingStars.forEach(star => {
                star.update();
                star.draw();
            });
            // Update and draw supernovas
            for (let i = supernovas.length - 1; i >= 0; i--) {
                 const supernova = supernovas[i];
                 supernova.update();
                 supernova.draw();
                 if (supernova.isDead()) {
                      returnSupernova(supernovas.splice(i, 1)[0]); // Return to pool
                 }
            }
            // Calculate total objects
            const totalParticles = shootingStars.reduce((sum, star) => sum + star.particles.length, 0) +
                                 supernovas.reduce((sum, sn) => sum + sn.particles.length, 0);
            document.getElementById('objectCount').textContent =
                stars.length + shootingStars.length + comets.length + asteroids.length + pulsars.length + blackHoles.length +
                supernovas.length + cosmicDust.length + totalParticles;
            requestAnimationFrame(animate);
        }
        // Initialize everything
        resizeCanvas();
        initializeUniverse();
        setupControls();
        animate(performance.now());
    </script>
</body>
</html>

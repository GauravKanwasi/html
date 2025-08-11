// DOM Elements
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const generateButton = document.getElementById('generateButton');
const saveButton = document.getElementById('saveButton');
const historyButton = document.getElementById('historyButton');
const numShapes = document.getElementById('numShapes');
const shapeSize = document.getElementById('shapeSize');
const numShapesValue = document.getElementById('numShapesValue');
const shapeSizeValue = document.getElementById('shapeSizeValue');
const colorOption = document.getElementById('colorOption');
const shapeColor = document.getElementById('shapeColor');
const bgColor = document.getElementById('bgColor');
const shapeType = document.getElementById('shapeType');
const filterOption = document.getElementById('filterOption');
const loading = document.getElementById('loading');
const historyContainer = document.getElementById('historyContainer');
const historyImages = document.getElementById('historyImages');
const notification = document.getElementById('notification');
const presetButtons = document.querySelectorAll('.preset-button');
const modeButtons = document.querySelectorAll('.mode-button');

// History array to store generated images
let imageHistory = [];
let currentMode = 'normal';

// Initialize
updateNumShapesValue();
updateShapeSizeValue();
generateImage();

// Event Listeners
generateButton.addEventListener('click', generateImage);
saveButton.addEventListener('click', saveImage);
historyButton.addEventListener('click', toggleHistory);
numShapes.addEventListener('input', updateNumShapesValue);
shapeSize.addEventListener('input', updateShapeSizeValue);
colorOption.addEventListener('change', function() {
    if (this.value === 'custom') {
        shapeColor.style.display = 'block';
    } else {
        shapeColor.style.display = 'block';
    }
});

// Preset buttons
presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        applyPreset(button.dataset.preset);
    });
});

// Mode buttons
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentMode = button.dataset.mode;
        generateImage();
    });
});

// Update value displays
function updateNumShapesValue() {
    numShapesValue.textContent = numShapes.value;
}

function updateShapeSizeValue() {
    shapeSizeValue.textContent = shapeSize.value;
}

// Apply preset configurations
function applyPreset(preset) {
    switch(preset) {
        case 'abstract':
            numShapes.value = 100;
            shapeSize.value = 40;
            shapeType.value = 'all';
            colorOption.value = 'random';
            bgColor.value = '#ffffff';
            filterOption.value = 'none';
            break;
        case 'geometric':
            numShapes.value = 75;
            shapeSize.value = 60;
            shapeType.value = 'rectangles';
            colorOption.value = 'vibrant';
            bgColor.value = '#f8f9fa';
            filterOption.value = 'none';
            break;
        case 'organic':
            numShapes.value = 150;
            shapeSize.value = 30;
            shapeType.value = 'circles';
            colorOption.value = 'pastel';
            bgColor.value = '#ffffff';
            filterOption.value = 'blur';
            break;
        case 'minimal':
            numShapes.value = 20;
            shapeSize.value = 80;
            shapeType.value = 'triangles';
            colorOption.value = 'monochrome';
            bgColor.value = '#ffffff';
            filterOption.value = 'grayscale';
            break;
    }
    
    updateNumShapesValue();
    updateShapeSizeValue();
    generateImage();
}

// Toggle history display
function toggleHistory() {
    if (historyContainer.style.display === 'block') {
        historyContainer.style.display = 'none';
        historyButton.innerHTML = '<i class="fas fa-history"></i> History';
    } else {
        historyContainer.style.display = 'block';
        historyButton.innerHTML = '<i class="fas fa-times"></i> Close History';
        renderHistory();
    }
}

// Render history images
function renderHistory() {
    historyImages.innerHTML = '';
    if (imageHistory.length === 0) {
        historyImages.innerHTML = '<p style="width:100%; text-align:center; padding:20px; color:#666;">No images in history yet</p>';
        return;
    }
    
    imageHistory.forEach((imgData, index) => {
        const img = document.createElement('img');
        img.src = imgData;
        img.classList.add('history-image');
        img.title = `Image ${index + 1}`;
        img.addEventListener('click', () => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            const imgElement = new Image();
            imgElement.src = imgData;
            imgElement.onload = () => {
                tempCtx.drawImage(imgElement, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(tempCanvas, 0, 0);
            };
        });
        historyImages.appendChild(img);
    });
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Generate image
function generateImage() {
    // Show loading indicator
    loading.style.display = 'flex';
    
    // Simulate processing time for better UX
    setTimeout(() => {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set background color
        const backgroundColor = bgColor.value;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Get controls values
        const numShapesVal = parseInt(numShapes.value);
        const shapeSizeVal = parseInt(shapeSize.value);
        const colorOptionVal = colorOption.value;
        const shapeColorVal = shapeColor.value;
        const shapeTypeVal = shapeType.value;
        const filterOptionVal = filterOption.value;

        // Apply filter if selected
        if (filterOptionVal !== 'none') {
            ctx.filter = getFilterValue(filterOptionVal);
        } else {
            ctx.filter = 'none';
        }

        // Draw shapes based on mode
        switch(currentMode) {
            case 'normal':
                drawNormalMode(numShapesVal, shapeSizeVal, colorOptionVal, shapeColorVal, shapeTypeVal);
                break;
            case 'symmetric':
                drawSymmetricMode(numShapesVal, shapeSizeVal, colorOptionVal, shapeColorVal, shapeTypeVal);
                break;
            case 'fractal':
                drawFractalMode(numShapesVal, shapeSizeVal, colorOptionVal, shapeColorVal, shapeTypeVal);
                break;
            case 'particle':
                drawParticleMode(numShapesVal, shapeSizeVal, colorOptionVal, shapeColorVal, shapeTypeVal);
                break;
            case 'watercolor':
                drawWatercolorMode(numShapesVal, shapeSizeVal, colorOptionVal, shapeColorVal, shapeTypeVal);
                break;
        }

        // Reset filter
        ctx.filter = 'none';
        
        // Hide loading indicator
        loading.style.display = 'none';
        
        // Add to history
        addToHistory();
    }, 300);
}

// Get filter value
function getFilterValue(filter) {
    switch(filter) {
        case 'blur': return 'blur(2px)';
        case 'sepia': return 'sepia(80%)';
        case 'grayscale': return 'grayscale(100%)';
        case 'invert': return 'invert(100%)';
        case 'saturate': return 'saturate(150%)';
        case 'brightness': return 'brightness(120%)';
        default: return 'none';
    }
}

// Add current image to history
function addToHistory() {
    const dataURL = canvas.toDataURL('image/png');
    imageHistory.unshift(dataURL);
    if (imageHistory.length > 16) {
        imageHistory.pop();
    }
}

// Generate a color based on the selected option
function generateColor(option) {
    switch(option) {
        case 'random':
            return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        case 'pastel':
            return `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
        case 'vibrant':
            return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
        case 'warm':
            return `hsl(${Math.floor(Math.random() * 60) + 15}, 100%, 50%)`;
        case 'cool':
            return `hsl(${Math.floor(Math.random() * 180) + 180}, 100%, 50%)`;
        case 'complementary':
            const hue = Math.floor(Math.random() * 360);
            return `hsl(${hue}, 100%, 50%)`;
        case 'monochrome':
            const gray = Math.floor(Math.random() * 256);
            return `rgb(${gray}, ${gray}, ${gray})`;
        case 'gradient':
            // This will be handled separately
            return null;
        default:
            return shapeColor.value;
    }
}

// Draw normal mode
function drawNormalMode(numShapes, shapeSize, colorOption, shapeColor, shapeType) {
    for (let i = 0; i < numShapes; i++) {
        drawRandomShape(ctx, canvas, shapeSize, colorOption, shapeColor, shapeType);
    }
}

// Draw symmetric mode
function drawSymmetricMode(numShapes, shapeSize, colorOption, shapeColor, shapeType) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < numShapes; i++) {
        const angle = (i / numShapes) * Math.PI * 2;
        const distance = Math.random() * Math.min(canvas.width, canvas.height) / 2;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        drawShapeAtPosition(ctx, x, y, shapeSize, colorOption, shapeColor, shapeType);
        
        // Draw mirrored shape
        const mirroredX = centerX - (x - centerX);
        drawShapeAtPosition(ctx, mirroredX, y, shapeSize, colorOption, shapeColor, shapeType);
    }
}

// Draw fractal mode
function drawFractalMode(numShapes, shapeSize, colorOption, shapeColor, shapeType) {
    function drawFractal(x, y, size, depth) {
        if (depth <= 0) return;
        
        drawShapeAtPosition(ctx, x, y, size, colorOption, shapeColor, shapeType);
        
        // Draw smaller fractals
        const newSize = size * 0.6;
        const offset = size * 0.7;
        
        drawFractal(x - offset, y, newSize, depth - 1);
        drawFractal(x + offset, y, newSize, depth - 1);
        drawFractal(x, y - offset, newSize, depth - 1);
        drawFractal(x, y + offset, newSize, depth - 1);
    }
    
    for (let i = 0; i < numShapes / 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        drawFractal(x, y, shapeSize, 3);
    }
}

// Draw particle mode
function drawParticleMode(numShapes, shapeSize, colorOption, shapeColor, shapeType) {
    for (let i = 0; i < numShapes; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * shapeSize * 0.5;
        
        ctx.beginPath();
        ctx.fillStyle = generateColor(colorOption) || shapeColor;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw watercolor mode
function drawWatercolorMode(numShapes, shapeSize, colorOption, shapeColor, shapeType) {
    ctx.globalAlpha = 0.1;
    
    for (let i = 0; i < numShapes; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = shapeSize * (0.8 + Math.random() * 0.4);
        
        drawShapeAtPosition(ctx, x, y, size, colorOption, shapeColor, shapeType);
    }
    
    ctx.globalAlpha = 1.0;
}

// Draw shape at specific position
function drawShapeAtPosition(ctx, x, y, size, colorOption, shapeColor, shapeType) {
    let shapeTypeNum;
    
    // Determine shape type based on selection
    if (shapeType === 'all') {
        shapeTypeNum = Math.floor(Math.random() * 10);
    } else {
        switch(shapeType) {
            case 'circles': shapeTypeNum = 0; break;
            case 'rectangles': shapeTypeNum = 1; break;
            case 'lines': shapeTypeNum = 2; break;
            case 'triangles': shapeTypeNum = 3; break;
            case 'stars': shapeTypeNum = 4; break;
            case 'hexagons': shapeTypeNum = 5; break;
            case 'hearts': shapeTypeNum = 6; break;
            case 'crescents': shapeTypeNum = 7; break;
            case 'spirals': shapeTypeNum = 8; break;
            case 'polygons': shapeTypeNum = 9; break;
        }
    }

    ctx.beginPath();
    
    // Set color based on option
    let color;
    if (colorOption === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`);
        color = gradient;
    } else if (colorOption === 'complementary') {
        const hue = Math.floor(Math.random() * 360);
        const compHue = (hue + 180) % 360;
        color = Math.random() > 0.5 ? 
            `hsl(${hue}, 100%, 50%)` : 
            `hsl(${compHue}, 100%, 50%)`;
    } else {
        color = generateColor(colorOption);
    }
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // Draw shape based on type
    switch(shapeTypeNum) {
        case 0: // Circle
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            break;
        case 1: // Rectangle
            ctx.rect(x - size/2, y - size/2, size, size);
            break;
        case 2: // Line
            const endX = x + (Math.random() * 100 - 50);
            const endY = y + (Math.random() * 100 - 50);
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            break;
        case 3: // Triangle
            ctx.moveTo(x, y - size/2);
            ctx.lineTo(x - size/2, y + size/2);
            ctx.lineTo(x + size/2, y + size/2);
            ctx.closePath();
            break;
        case 4: // Star
            const points = 5;
            const outerRadius = size / 2;
            const innerRadius = outerRadius / 2;
            const angle = Math.PI / points;
            ctx.moveTo(x + outerRadius, y);
            for (let i = 1; i <= points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const currentAngle = i * angle;
                ctx.lineTo(x + radius * Math.cos(currentAngle), y + radius * Math.sin(currentAngle));
            }
            ctx.closePath();
            break;
        case 5: // Hexagon
            ctx.moveTo(x + size/2, y);
            for (let i = 1; i <= 6; i++) {
                const angle = i * Math.PI / 3;
                ctx.lineTo(x + size/2 * Math.cos(angle), y + size/2 * Math.sin(angle));
            }
            ctx.closePath();
            break;
        case 6: // Heart
            ctx.moveTo(x, y + size/4);
            ctx.bezierCurveTo(
                x, y, 
                x + size/2, y, 
                x + size/2, y + size/4
            );
            ctx.bezierCurveTo(
                x + size/2, y, 
                x + size, y, 
                x + size, y + size/4
            );
            ctx.bezierCurveTo(
                x + size, y + size/2, 
                x + size/2, y + size, 
                x + size/2, y + size
            );
            ctx.bezierCurveTo(
                x + size/2, y + size, 
                x, y + size/2, 
                x, y + size/4
            );
            ctx.closePath();
            break;
        case 7: // Crescent
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.arc(x + size/4, y, size/2, 0, Math.PI * 2);
            ctx.globalCompositeOperation = 'source-over';
            break;
        case 8: // Spiral
            const turns = 3;
            const segments = 50;
            ctx.moveTo(x, y);
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2 * turns;
                const spiralSize = (i / segments) * size;
                const spiralX = x + Math.cos(angle) * spiralSize;
                const spiralY = y + Math.sin(angle) * spiralSize;
                ctx.lineTo(spiralX, spiralY);
            }
            break;
        case 9: // Polygon
            const sides = Math.floor(Math.random() * 5) + 5; // 5-9 sides
            ctx.moveTo(x + size/2, y);
            for (let i = 1; i <= sides; i++) {
                const angle = i * 2 * Math.PI / sides;
                ctx.lineTo(x + size/2 * Math.cos(angle), y + size/2 * Math.sin(angle));
            }
            ctx.closePath();
            break;
    }

    // Fill and stroke the shape
    if (shapeTypeNum !== 2) { // Not for lines
        ctx.fill();
    }
    ctx.stroke();
}

// Draw random shape (original function)
function drawRandomShape(ctx, canvas, size, colorOption, shapeColor, shapeType) {
    let shapeTypeNum;
    
    // Determine shape type based on selection
    if (shapeType === 'all') {
        shapeTypeNum = Math.floor(Math.random() * 10);
    } else {
        switch(shapeType) {
            case 'circles': shapeTypeNum = 0; break;
            case 'rectangles': shapeTypeNum = 1; break;
            case 'lines': shapeTypeNum = 2; break;
            case 'triangles': shapeTypeNum = 3; break;
            case 'stars': shapeTypeNum = 4; break;
            case 'hexagons': shapeTypeNum = 5; break;
            case 'hearts': shapeTypeNum = 6; break;
            case 'crescents': shapeTypeNum = 7; break;
            case 'spirals': shapeTypeNum = 8; break;
            case 'polygons': shapeTypeNum = 9; break;
        }
    }

    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);

    ctx.beginPath();
    
    // Set color based on option
    let color;
    if (colorOption === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`);
        color = gradient;
    } else if (colorOption === 'complementary') {
        const hue = Math.floor(Math.random() * 360);
        const compHue = (hue + 180) % 360;
        color = Math.random() > 0.5 ? 
            `hsl(${hue}, 100%, 50%)` : 
            `hsl(${compHue}, 100%, 50%)`;
    } else {
        color = generateColor(colorOption);
    }
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // Draw shape based on type
    switch(shapeTypeNum) {
        case 0: // Circle
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            break;
        case 1: // Rectangle
            ctx.rect(x, y, size, size);
            break;
        case 2: // Line
            const endX = x + Math.floor(Math.random() * 100) - 50;
            const endY = y + Math.floor(Math.random() * 100) - 50;
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            break;
        case 3: // Triangle
            ctx.moveTo(x, y);
            ctx.lineTo(x + size, y);
            ctx.lineTo(x + size / 2, y + size);
            ctx.closePath();
            break;
        case 4: // Star
            const points = 5;
            const outerRadius = size / 2;
            const innerRadius = outerRadius / 2;
            const angle = Math.PI / points;
            ctx.moveTo(x + outerRadius, y);
            for (let i = 1; i <= points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const currentAngle = i * angle;
                ctx.lineTo(x + radius * Math.cos(currentAngle), y + radius * Math.sin(currentAngle));
            }
            ctx.closePath();
            break;
        case 5: // Hexagon
            ctx.moveTo(x + size/2, y);
            for (let i = 1; i <= 6; i++) {
                const angle = i * Math.PI / 3;
                ctx.lineTo(x + size/2 + size/2 * Math.cos(angle), y + size/2 + size/2 * Math.sin(angle));
            }
            ctx.closePath();
            break;
        case 6: // Heart
            ctx.moveTo(x, y + size/4);
            ctx.bezierCurveTo(
                x, y, 
                x + size/2, y, 
                x + size/2, y + size/4
            );
            ctx.bezierCurveTo(
                x + size/2, y, 
                x + size, y, 
                x + size, y + size/4
            );
            ctx.bezierCurveTo(
                x + size, y + size/2, 
                x + size/2, y + size, 
                x + size/2, y + size
            );
            ctx.bezierCurveTo(
                x + size/2, y + size, 
                x, y + size/2, 
                x, y + size/4
            );
            ctx.closePath();
            break;
        case 7: // Crescent
            ctx.arc(x, y, size/2, 0, Math.PI * 2);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.arc(x + size/4, y, size/2, 0, Math.PI * 2);
            ctx.globalCompositeOperation = 'source-over';
            break;
        case 8: // Spiral
            const turns = 3;
            const segments = 50;
            ctx.moveTo(x, y);
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2 * turns;
                const spiralSize = (i / segments) * size;
                const spiralX = x + Math.cos(angle) * spiralSize;
                const spiralY = y + Math.sin(angle) * spiralSize;
                ctx.lineTo(spiralX, spiralY);
            }
            break;
        case 9: // Polygon
            const sides = Math.floor(Math.random() * 5) + 5; // 5-9 sides
            ctx.moveTo(x + size/2, y);
            for (let i = 1; i <= sides; i++) {
                const angle = i * 2 * Math.PI / sides;
                ctx.lineTo(x + size/2 * Math.cos(angle), y + size/2 * Math.sin(angle));
            }
            ctx.closePath();
            break;
    }

    // Fill and stroke the shape
    if (shapeTypeNum !== 2) { // Not for lines
        ctx.fill();
    }
    ctx.stroke();
}

// Save image
function saveImage() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'advanced_artistic_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Image saved successfully!');
}

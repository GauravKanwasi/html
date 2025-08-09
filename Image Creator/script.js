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

// History array to store generated images
let imageHistory = [];

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

// Update value displays
function updateNumShapesValue() {
    numShapesValue.textContent = numShapes.value;
}

function updateShapeSizeValue() {
    shapeSizeValue.textContent = shapeSize.value;
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

        // Draw random shapes
        for (let i = 0; i < numShapesVal; i++) {
            drawRandomShape(ctx, canvas, shapeSizeVal, colorOptionVal, shapeColorVal, shapeTypeVal);
        }

        // Reset filter
        ctx.filter = 'none';
        
        // Hide loading indicator
        loading.style.display = 'none';
        
        // Add to history
        addToHistory();
    }, 500);
}

// Get filter value
function getFilterValue(filter) {
    switch(filter) {
        case 'blur': return 'blur(2px)';
        case 'sepia': return 'sepia(80%)';
        case 'grayscale': return 'grayscale(100%)';
        case 'invert': return 'invert(100%)';
        default: return 'none';
    }
}

// Add current image to history
function addToHistory() {
    const dataURL = canvas.toDataURL('image/png');
    imageHistory.unshift(dataURL);
    if (imageHistory.length > 12) {
        imageHistory.pop();
    }
}

// Draw random shape
function drawRandomShape(ctx, canvas, size, colorOption, shapeColor, shapeType) {
    let shapeTypeNum;
    
    // Determine shape type based on selection
    if (shapeType === 'all') {
        shapeTypeNum = Math.floor(Math.random() * 8);
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
        }
    }

    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);

    ctx.beginPath();
    
    // Set color based on option
    let color;
    if (colorOption === 'random') {
        color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    } else if (colorOption === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
        gradient.addColorStop(1, `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
        color = gradient;
    } else if (colorOption === 'monochrome') {
        const gray = Math.floor(Math.random() * 256);
        color = `rgb(${gray}, ${gray}, ${gray})`;
    } else {
        color = shapeColor;
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
    link.download = 'random_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Image saved successfully!');
}

document.getElementById('generateButton').addEventListener('click', generateImage);
document.getElementById('saveButton').addEventListener('click', saveImage);

document.getElementById('numShapes').addEventListener('input', updateNumShapesValue);
document.getElementById('shapeSize').addEventListener('input', updateShapeSizeValue);
document.getElementById('colorOption').addEventListener('change', toggleColorInput);

function updateNumShapesValue() {
    document.getElementById('numShapesValue').textContent = document.getElementById('numShapes').value;
}

function updateShapeSizeValue() {
    document.getElementById('shapeSizeValue').textContent = document.getElementById('shapeSize').value;
}

function toggleColorInput() {
    const colorOption = document.getElementById('colorOption').value;
    const shapeColorInput = document.getElementById('shapeColor');
    if (colorOption === 'custom') {
        shapeColorInput.style.display = 'block';
    } else {
        shapeColorInput.style.display = 'none';
    }
}

function generateImage() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate a random background color
    const backgroundColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get controls values
    const numShapes = parseInt(document.getElementById('numShapes').value);
    const shapeSize = parseInt(document.getElementById('shapeSize').value);
    const colorOption = document.getElementById('colorOption').value;
    const shapeColor = document.getElementById('shapeColor').value;

    // Draw random shapes
    for (let i = 0; i < numShapes; i++) {
        drawRandomShape(ctx, canvas, shapeSize, colorOption, shapeColor);
    }
}

function drawRandomShape(ctx, canvas, size, colorOption, shapeColor) {
    const shapeType = Math.floor(Math.random() * 5); // 0: circle, 1: rectangle, 2: line, 3: triangle, 4: star

    const x = Math.floor(Math.random() * canvas.width);
    const y = Math.floor(Math.random() * canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = colorOption === 'random' ? `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})` : shapeColor;
    ctx.fillStyle = ctx.strokeStyle;

    if (shapeType === 0) { // Circle
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    } else if (shapeType === 1) { // Rectangle
        ctx.rect(x, y, size, size);
    } else if (shapeType === 2) { // Line
        const endX = x + Math.floor(Math.random() * 100) - 50;
        const endY = y + Math.floor(Math.random() * 100) - 50;
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
    } else if (shapeType === 3) { // Triangle
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y + size);
        ctx.closePath();
    } else if (shapeType === 4) { // Star
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
    }

    ctx.fill();
    ctx.stroke();
}

function saveImage() {
    const canvas = document.getElementById('imageCanvas');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'random_image.png';
    link.click();
}

const container = document.getElementById('scene-container');
let isRotating = true;
let shapes = [];

function randomColor() {
  return `hsl(${Math.random() * 360}, ${50 + Math.random() * 50}%, ${30 + Math.random() * 40}%)`;
}

function createCube() {
  const cube = document.createElement('div');
  cube.className = 'shape cube';
  
  const size = 50 + Math.random() * 100;
  cube.style.width = `${size}px`;
  cube.style.height = `${size}px`;
  
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  
  faces.forEach(face => {
    const element = document.createElement('div');
    element.className = `face ${face}`;
    element.style.backgroundColor = randomColor();
    
    if (face === 'front') element.style.transform = `translateZ(${size/2}px)`;
    if (face === 'back') element.style.transform = `rotateY(180deg) translateZ(${size/2}px)`;
    if (face === 'right') element.style.transform = `rotateY(90deg) translateZ(${size/2}px)`;
    if (face === 'left') element.style.transform = `rotateY(-90deg) translateZ(${size/2}px)`;
    if (face === 'top') element.style.transform = `rotateX(90deg) translateZ(${size/2}px)`;
    if (face === 'bottom') element.style.transform = `rotateX(-90deg) translateZ(${size/2}px)`;
    
    cube.appendChild(element);
  });
  
  return cube;
}

function createSphere() {
  const sphere = document.createElement('div');
  sphere.className = 'shape sphere';
  
  const size = 50 + Math.random() * 100;
  sphere.style.width = `${size}px`;
  sphere.style.height = `${size}px`;
  sphere.style.backgroundColor = randomColor();
  
  return sphere;
}

function createPyramid() {
  const pyramid = document.createElement('div');
  pyramid.className = 'shape pyramid';
  
  const size = 50 + Math.random() * 100;
  const height = size * 1.5;
  
  const base = document.createElement('div');
  base.className = 'face pyramid-base';
  base.style.width = `${size}px`;
  base.style.height = `${size}px`;
  base.style.backgroundColor = randomColor();
  base.style.transform = `rotateX(90deg) translateZ(${-height/2}px)`;
  pyramid.appendChild(base);
  
  for (let i = 0; i < 4; i++) {
    const face = document.createElement('div');
    face.className = 'pyramid-face';
    face.style.borderLeft = `${size/2}px solid transparent`;
    face.style.borderRight = `${size/2}px solid transparent`;
    face.style.borderBottom = `${height}px solid ${randomColor()}`;
    face.style.transform = `rotateY(${i * 90}deg) rotateX(30deg) translateZ(${size/2}px)`;
    pyramid.appendChild(face);
  }
  
  return pyramid;
}

function positionShape(shape) {
  const x = Math.random() * window.innerWidth - window.innerWidth/2;
  const y = Math.random() * window.innerHeight - window.innerHeight/2;
  const z = -500 + Math.random() * 1000;
  
  shape.style.left = `${window.innerWidth/2}px`;
  shape.style.top = `${window.innerHeight/2}px`;
  
  const rotX = Math.random() * 360;
  const rotY = Math.random() * 360;
  const rotZ = Math.random() * 360;
  
  shape.dataset.rotateX = (Math.random() - 0.5) * 2;
  shape.dataset.rotateY = (Math.random() - 0.5) * 2;
  shape.dataset.rotateZ = (Math.random() - 0.5) * 2;
  
  shape.style.transform = `
    translateX(${x}px) 
    translateY(${y}px) 
    translateZ(${z}px)
    rotateX(${rotX}deg) 
    rotateY(${rotY}deg) 
    rotateZ(${rotZ}deg)
  `;
  
  return shape;
}

function generateScene() {
  container.innerHTML = '';
  shapes = [];
  
  const numShapes = 5 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < numShapes; i++) {
    let shape;
    const shapeType = Math.floor(Math.random() * 3);
    
    switch(shapeType) {
      case 0:
        shape = createCube();
        break;
      case 1:
        shape = createSphere();
        break;
      case 2:
        shape = createPyramid();
        break;
    }
    
    shape = positionShape(shape);
    container.appendChild(shape);
    shapes.push(shape);
  }
}

function toggleRotation() {
  isRotating = !isRotating;
}

function animate() {
  if (isRotating) {
    shapes.forEach(shape => {
      const currentTransform = shape.style.transform;
      let rotX = parseFloat(shape.dataset.rotateX || 0.5);
      let rotY = parseFloat(shape.dataset.rotateY || 0.5);
      let rotZ = parseFloat(shape.dataset.rotateZ || 0.5);
      
      shape.style.transform = `${currentTransform} rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
    });
  }
  
  requestAnimationFrame(animate);
}

// Initialize
generateScene();
animate();

window.addEventListener('resize', generateScene);

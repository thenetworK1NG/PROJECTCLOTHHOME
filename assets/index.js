import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById('root').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(0, 5, 0);
scene.add(pointLight);

// Camera position
camera.position.z = 4;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = false;
controls.enabled = false; // Disable global controls

let isDragging = false;
let selectedModelForRotation = null;
let previousMouseX = 0;

// Model variables
let tshirtModel = null;
let hoodieModel = null;
let activeModel = 'tshirt';
let hoveredModel = null;

// Load models
const loader = new GLTFLoader();

// Error handler for model loading
const handleLoadError = (error) => {
    console.error('Error loading model:', error);
};

// Progress handler for model loading
const handleProgress = (url) => (progress) => {
    if (progress.lengthComputable) {
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log(`Loading ${url}: ${Math.round(percentComplete)}% complete`);
    }
};

// Load T-shirt
console.log('Loading T-shirt model...');
loader.load(
    '../models/TSHIRT.glb',
    (gltf) => {
        console.log('T-shirt model loaded successfully');
        tshirtModel = gltf.scene;
        tshirtModel.scale.set(3, 3, 3);
        tshirtModel.position.set(0, 0.2, 0);
        scene.add(tshirtModel);
        
        // Make T-shirt interactive
        tshirtModel.traverse((child) => {
            if (child.isMesh) {
                child.userData.type = 'tshirt';
            }
        });
    },
    handleProgress('TSHIRT.glb'),
    handleLoadError
);

// Load Hoodie
console.log('Loading Hoodie model...');
loader.load(
    '../models/HOODIE.glb',
    (gltf) => {
        console.log('Hoodie model loaded successfully');
        hoodieModel = gltf.scene;
        hoodieModel.scale.set(3, 3, 3);
        hoodieModel.position.set(8, 0.3, 0);
        scene.add(hoodieModel);
        
        // Make Hoodie interactive
        hoodieModel.traverse((child) => {
            if (child.isMesh) {
                child.userData.type = 'hoodie';
            }
        });
    },
    handleProgress('HOODIE.glb'),
    handleLoadError
);

// Raycaster for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle mouse down
renderer.domElement.addEventListener('mousedown', (event) => {
    if (hoveredModel) {
        isDragging = true;
        selectedModelForRotation = hoveredModel;
        previousMouseX = event.clientX;
        document.body.style.cursor = 'grabbing';
    }
});

// Handle mouse move
renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.type) {
            if (!isDragging) {
                document.body.style.cursor = 'grab';
            }
            hoveredModel = object.userData.type;
        } else {
            if (!isDragging) {
                document.body.style.cursor = 'default';
            }
            hoveredModel = null;
        }
    } else {
        if (!isDragging) {
            document.body.style.cursor = 'default';
        }
        hoveredModel = null;
    }

    // Handle rotation while dragging
    if (isDragging && selectedModelForRotation) {
        const deltaX = event.clientX - previousMouseX;
        const rotationSpeed = 0.01;
        
        if (selectedModelForRotation === 'tshirt' && tshirtModel) {
            tshirtModel.rotation.y += deltaX * rotationSpeed;
        } else if (selectedModelForRotation === 'hoodie' && hoodieModel) {
            hoodieModel.rotation.y += deltaX * rotationSpeed;
        }
        
        previousMouseX = event.clientX;
    }
});

// Handle mouse up
renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
    selectedModelForRotation = null;
    document.body.style.cursor = hoveredModel ? 'grab' : 'default';
});

// Handle mouse leave
renderer.domElement.addEventListener('mouseleave', () => {
    isDragging = false;
    selectedModelForRotation = null;
    document.body.style.cursor = 'default';
});

// Handle clicks for links
window.addEventListener('click', () => {
    if (hoveredModel && !isDragging) {
        if (hoveredModel === 'tshirt') {
            window.open('https://thenetwork1ng.github.io/TshirtPC/', '_blank');
        } else if (hoveredModel === 'hoodie') {
            window.open('https://thenetwork1ng.github.io/Hoodie/', '_blank');
        }
    }
});

// Navigation buttons
const createButton = (text, position, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.position = 'absolute';
    button.style.top = '50%';
    button.style.transform = 'translateY(-50%)';
    button.style.padding = '15px 25px';
    button.style.background = 'rgba(0, 0, 0, 0.5)';
    button.style.color = 'white';
    button.style.border = '2px solid rgba(255, 255, 255, 0.2)';
    button.style.borderRadius = '10px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '28px';
    button.style.transition = 'all 0.3s ease';
    button.style.left = position === 'left' ? '20px' : 'auto';
    button.style.right = position === 'right' ? '20px' : 'auto';
    
    button.addEventListener('click', onClick);
    document.getElementById('root').appendChild(button);
    return button;
};

const prevButton = createButton('←', 'left', () => {
    if (activeModel === 'hoodie') {
        activeModel = 'tshirt';
    }
});

const nextButton = createButton('→', 'right', () => {
    if (activeModel === 'tshirt') {
        activeModel = 'hoodie';
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (tshirtModel && !isDragging) {
        tshirtModel.rotation.y += 0.005;
        const targetX = activeModel === 'tshirt' ? 0 : -8;
        tshirtModel.position.x += (targetX - tshirtModel.position.x) * 0.1;
        
        const targetScale = hoveredModel === 'tshirt' ? 3.2 : 3;
        tshirtModel.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    if (hoodieModel && !isDragging) {
        hoodieModel.rotation.y += 0.005;
        const targetX = activeModel === 'hoodie' ? 0 : 8;
        hoodieModel.position.x += (targetX - hoodieModel.position.x) * 0.1;
        
        const targetScale = hoveredModel === 'hoodie' ? 3.2 : 3;
        hoodieModel.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    // Update navigation buttons visibility
    if (prevButton) prevButton.style.display = activeModel === 'tshirt' ? 'none' : 'block';
    if (nextButton) nextButton.style.display = activeModel === 'hoodie' ? 'none' : 'block';
    
    controls.update();
    renderer.render(scene, camera);
}

animate(); 
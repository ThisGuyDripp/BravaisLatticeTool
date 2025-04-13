// docs/js/main.js
// Bravais lattice visualization core logic [[6]][[8]]

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const cssRenderer = new THREE.CSS3DRenderer(); // For labels/icons [[8]]
let controls;

// Initialize renderers
renderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
document.getElementById('3d-container').appendChild(renderer.domElement);
document.getElementById('3d-container').appendChild(cssRenderer.domElement);

// Camera and controls
camera.position.z = 10;
controls = new THREE.OrbitControls(camera, renderer.domElement);

// Current lattice state
const currentLattice = {
    system: 'cubic',
    a: 4.0,
    b: 4.0,
    c: 4.0,
    alpha: 90,
    beta: 90,
    gamma: 90
};

// Crystal system rules [[4]]
const systemRules = {
    cubic: {
        a: (val) => val,
        b: (val) => currentLattice.a,
        c: (val) => currentLattice.a,
        angles: [90, 90, 90]
    },
    tetragonal: {
        a: (val) => val,
        b: (val) => currentLattice.a,
        c: (val) => val,
        angles: [90, 90, 90]
    },
    hexagonal: {
        a: (val) => val,
        b: (val) => currentLattice.a,
        c: (val) => val,
        angles: [90, 90, 120]
    },
    trigonal: {
        a: (val) => val,
        b: (val) => currentLattice.a,
        c: (val) => val,
        angles: [90, 90, 120]
    },
    orthorhombic: {
        a: (val) => val,
        b: (val) => val,
        c: (val) => val,
        angles: [90, 90, 90]
    },
    monoclinic: {
        a: (val) => val,
        b: (val) => val,
        c: (val) => val,
        angles: [90, 120, 90]
    },
    triclinic: {
        a: (val) => val,
        b: (val) => val,
        c: (val) => val,
        angles: []
    }
};

// Input synchronization [[4]]
function updateConstraints() {
    const system = document.getElementById('crystal-system').value;
    const rules = systemRules[system];

    // Axis constraints
    document.getElementById('b').disabled = (system === 'cubic' || system === 'tetragonal');
    document.getElementById('c').disabled = (system === 'cubic' || system === 'hexagonal' || system === 'trigonal');

    // Angle constraints
    if (rules.angles.length > 0) {
        document.getElementById('alpha').value = rules.angles[0];
        document.getElementById('beta').value = rules.angles[1];
        document.getElementById('gamma').value = rules.angles[2];
    } else {
        document.getElementById('alpha').disabled = false;
        document.getElementById('beta').disabled = false;
        document.getElementById('gamma').disabled = false;
    }
}

// Lattice generation [[6]]
function generateLattice() {
    // Validate triclinic angles [[4]]
    if (currentLattice.system === 'triclinic') {
        const alpha = parseFloat(document.getElementById('alpha').value);
        const beta = parseFloat(document.getElementById('beta').value);
        const gamma = parseFloat(document.getElementById('gamma').value);

        if (alpha >= beta || beta >= gamma) {
            alert("Triclinic requires ? < ? < ?");
            return;
        }
    }

    // Clear scene
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // Create unit cell geometry
    const geometry = new THREE.BoxGeometry(
        currentLattice.a,
        currentLattice.b,
        currentLattice.c
    );

    // Apply non-orthogonal transformations [[1]]
    if (currentLattice.system !== 'cubic') {
        const alphaRad = THREE.MathUtils.degToRad(currentLattice.alpha);
        const betaRad = THREE.MathUtils.degToRad(currentLattice.beta);
        const gammaRad = THREE.MathUtils.degToRad(currentLattice.gamma);

        // Create basis vectors
        const v1 = new THREE.Vector3(currentLattice.a, 0, 0);
        const v2 = new THREE.Vector3(
            currentLattice.b * Math.cos(gammaRad),
            currentLattice.b * Math.sin(gammaRad),
            0
        );
        const v3 = new THREE.Vector3(
            currentLattice.c * Math.cos(betaRad),
            currentLattice.c * (Math.cos(alphaRad) - Math.cos(betaRad) * Math.cos(gammaRad)) / Math.sin(gammaRad),
            currentLattice.c * Math.sqrt(
                1
                - Math.pow(Math.cos(alphaRad), 2)
                - Math.pow(Math.cos(betaRad), 2)
                - Math.pow(Math.cos(gammaRad), 2)
                + 2 * Math.cos(alphaRad) * Math.cos(betaRad) * Math.cos(gammaRad)
            ) / Math.sin(gammaRad) // Added closing )
        );

        // Apply transformation matrix
        geometry.applyMatrix4(new THREE.Matrix4().makeBasis(v1, v2, v3));
    }

    // Create mesh
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    });
    const lattice = new THREE.Mesh(geometry, material);
    scene.add(lattice);

    // Add symmetry elements [[7]]
    addSymmetryElements(currentLattice.system);
}

// Symmetry element visualization [[7]]
function addSymmetryElements(system) {
    if (system === 'cubic') {
        // 4-fold rotation axis with icon
        const axisGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        const axisMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const axis = new THREE.Mesh(axisGeometry, axisMaterial);
        axis.rotation.x = Math.PI / 2;
        axis.userData = { info: "4-fold rotation axis: Characteristic of cubic systems" };
        scene.add(axis);

        // Add 4-fold axis icon
        const icon4fold = createCSS3DIcon('assets/4fold-axis.svg', new THREE.Vector3(0, 0, 2.5));
        scene.add(icon4fold);
    }

    if (system === 'hexagonal') {
        // Mirror plane with icon
        const mirrorGeometry = new THREE.PlaneGeometry(5, 5);
        const mirrorMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const mirrorPlane = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        mirrorPlane.rotation.x = Math.PI / 2;
        mirrorPlane.userData = { info: "Basal mirror plane: Characteristic of hexagonal systems" };
        scene.add(mirrorPlane);

        // Add mirror plane icon
        const mirrorIcon = createCSS3DIcon('assets/mirror-plane.svg', new THREE.Vector3(0, 2.5, 0));
        scene.add(mirrorIcon);
    }
}

// Create CSS3D icons [[8]]
function createCSS3DIcon(iconPath, position) {
    const iconDiv = document.createElement('div');
    iconDiv.style.width = '48px';
    iconDiv.style.height = '48px';
    iconDiv.style.background = `url(${iconPath}) no-repeat center`;
    iconDiv.style.backgroundSize = 'contain';

    const iconObject = new THREE.CSS3DObject(iconDiv);
    iconObject.position.copy(position);
    return iconObject;
}

// Export functions [[8]]
function exportPNG() {
    html2canvas(document.getElementById('3d-container'), {
        allowTaint: true,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'lattice.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Parameter,Value\n";
    Object.entries(currentLattice).forEach(([key, value]) => {
        csvContent += `${key},${value}\n`;
    });
    csvContent += "\nSymmetry Operation,Description\n";
    csvContent += "4-fold rotation,Characteristic of cubic systems\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lattice_parameters.csv");
    document.body.appendChild(link);
    link.click();
}

// Pop-up system [[7]]
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0 && intersects[0].object.userData.info) {
        document.getElementById('info-content').textContent =
            intersects[0].object.userData.info;
        document.getElementById('info-panel').style.display = 'block';
    }
});

document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('info-panel').style.display = 'none';
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Required for OrbitControls
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
    updateLabels();
}

// Maintain label orientation [[8]]
function updateLabels() {
    scene.traverse((object) => {
        if (object instanceof THREE.CSS3DObject) {
            object.lookAt(camera.position);
        }
    });
}

animate();

// Window resize handling [[9]]
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
});
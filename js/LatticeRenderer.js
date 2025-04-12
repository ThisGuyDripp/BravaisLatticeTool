/**
 * LatticeRenderer.js
 * Handles the 3D visualization of Bravais lattices using Three.js
 */

class LatticeRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        // Initialize Three.js components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.controls = null;
        
        // Lattice elements
        this.atomsGroup = new THREE.Group();
        this.bondsGroup = new THREE.Group();
        this.unitCellGroup = new THREE.Group();
        this.axesHelper = null;
        
        // Configuration
        this.config = {
            atomRadius: 0.2,
            bondRadius: 0.05,
            atomColor: 0x0088ff,
            bondColor: 0xcccccc,
            cellColor: 0x333333,
            showAtoms: true,
            showBonds: true,
            showUnitCell: true,
            showAxes: true,
            backgroundColor: 0xf0f0f0
        };
        
        this.init();
    }
    
    init() {
        // Configure renderer
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(this.config.backgroundColor, 1);
        this.container.appendChild(this.renderer.domElement);
        
        // Set up camera
        this.camera.position.z = 10;
        
        // Set up lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 2, 3);
        this.scene.add(directionalLight);
        
        // Set up controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        
        // Add group containers to scene
        this.scene.add(this.atomsGroup);
        this.scene.add(this.bondsGroup);
        this.scene.add(this.unitCellGroup);
        
        // Add axes helper
        this.axesHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axesHelper);
        
        // Handle window resizing
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Start animation loop
        this.animate();
    }
    
    onWindowResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    renderLattice(lattice) {
        this.clear();
        
        if (lattice) {
            // Create atoms (vertices)
            if (this.config.showAtoms) {
                this.renderAtoms(lattice.atoms);
            }
            
            // Create bonds (edges)
            if (this.config.showBonds) {
                this.renderBonds(lattice.bonds);
            }
            
            // Create unit cell
            if (this.config.showUnitCell) {
                this.renderUnitCell(lattice.unitCellVectors);
            }
            
            // Center the camera on the lattice
            this.centerCamera(lattice);
        }
        
        // Toggle axes visibility
        this.axesHelper.visible = this.config.showAxes;
    }
    
    renderAtoms(atoms) {
        if (!atoms || !atoms.length) return;
        
        const geometry = new THREE.SphereGeometry(this.config.atomRadius, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: this.config.atomColor,
            shininess: 80 
        });
        
        atoms.forEach(position => {
            const atom = new THREE.Mesh(geometry, material);
            atom.position.set(position.x, position.y, position.z);
            this.atomsGroup.add(atom);
        });
    }
    
    renderBonds(bonds) {
        if (!bonds || !bonds.length) return;
        
        const material = new THREE.MeshPhongMaterial({ 
            color: this.config.bondColor,
            shininess: 50
        });
        
        bonds.forEach(bond => {
            const { start, end } = bond;
            
            // Calculate direction vector and length
            const direction = new THREE.Vector3(
                end.x - start.x,
                end.y - start.y,
                end.z - start.z
            );
            
            const length = direction.length();
            
            // Create cylinder geometry
            const geometry = new THREE.CylinderGeometry(
                this.config.bondRadius, 
                this.config.bondRadius, 
                length, 
                16, 
                1
            );
            
            // Rotate and position the bond
            const bondMesh = new THREE.Mesh(geometry, material);
            
            // Move to center point
            bondMesh.position.set(
                (start.x + end.x) / 2,
                (start.y + end.y) / 2,
                (start.z + end.z) / 2
            );
            
            // Align cylinder with direction
            bondMesh.lookAt(end.x, end.y, end.z);
            bondMesh.rotateX(Math.PI / 2);
            
            this.bondsGroup.add(bondMesh);
        });
    }
    
    renderUnitCell(vectors) {
        if (!vectors || !vectors.a || !vectors.b || !vectors.c) return;
        
        const { a, b, c } = vectors;
        
        // Define the 8 corners of the unit cell
        const corners = [
            new THREE.Vector3(0, 0, 0),                  // Origin
            new THREE.Vector3(a.x, a.y, a.z),            // a
            new THREE.Vector3(b.x, b.y, b.z),            // b
            new THREE.Vector3(a.x + b.x, a.y + b.y, a.z + b.z), // a+b
            new THREE.Vector3(c.x, c.y, c.z),            // c
            new THREE.Vector3(a.x + c.x, a.y + c.y, a.z + c.z), // a+c
            new THREE.Vector3(b.x + c.x, b.y + c.y, b.z + c.z), // b+c
            new THREE.Vector3(a.x + b.x + c.x, a.y + b.y + c.y, a.z + b.z + c.z) // a+b+c
        ];
        
        // Define the 12 edges of the unit cell
        const edges = [
            [0, 1], [0, 2], [0, 4],   // From origin
            [1, 3], [1, 5],           // From a
            [2, 3], [2, 6],           // From b
            [3, 7],                   // From a+b
            [4, 5], [4, 6],           // From c
            [5, 7],                   // From a+c
            [6, 7]                    // From b+c
        ];
        
        // Create material for edges
        const material = new THREE.LineBasicMaterial({
            color: this.config.cellColor,
            linewidth: 1
        });
        
        // Create and add each edge
        edges.forEach(([startIdx, endIdx]) => {
            const geometry = new THREE.BufferGeometry().setFromPoints([
                corners[startIdx],
                corners[endIdx]
            ]);
            const line = new THREE.Line(geometry, material);
            this.unitCellGroup.add(line);
        });
    }
    
    centerCamera(lattice) {
        if (!lattice || !lattice.unitCellVectors) return;
        
        const { a, b, c } = lattice.unitCellVectors;
        
        // Calculate the center of the unit cell
        const center = new THREE.Vector3(
            (a.x + b.x + c.x) / 2,
            (a.y + b.y + c.y) / 2,
            (a.z + b.z + c.z) / 2
        );
        
        // Move the camera target to the center
        this.controls.target.copy(center);
        
        // Calculate appropriate camera distance
        const maxDimension = Math.max(
            new THREE.Vector3(a.x, a.y, a.z).length(),
            new THREE.Vector3(b.x, b.y, b.z).length(),
            new THREE.Vector3(c.x, c.y, c.z).length()
        );
        
        // Set camera position
        this.camera.position.set(
            center.x + maxDimension * 2,
            center.y + maxDimension * 2,
            center.z + maxDimension * 2
        );
        
        // Update controls
        this.controls.update();
    }
    
    clear() {
        // Remove all atoms
        while (this.atomsGroup.children.length > 0) {
            const atom = this.atomsGroup.children[0];
            this.atomsGroup.remove(atom);
            if (atom.geometry) atom.geometry.dispose();
            if (atom.material) atom.material.dispose();
        }
        
        // Remove all bonds
        while (this.bondsGroup.children.length > 0) {
            const bond = this.bondsGroup.children[0];
            this.bondsGroup.remove(bond);
            if (bond.geometry) bond.geometry.dispose();
            if (bond.material) bond.material.dispose();
        }
        
        // Remove all unit cell lines
        while (this.unitCellGroup.children.length > 0) {
            const line = this.unitCellGroup.children[0];
            this.unitCellGroup.remove(line);
            if (line.geometry) line.geometry.dispose();
            if (line.material) line.material.dispose();
        }
    }
    
    updateConfig(newConfig) {
        // Update configuration
        this.config = { ...this.config, ...newConfig };
        
        // Update background color
        this.renderer.setClearColor(this.config.backgroundColor, 1);
        
        // Visual updates that don't require full re-rendering
        this.axesHelper.visible = this.config.showAxes;
        this.atomsGroup.visible = this.config.showAtoms;
        this.bondsGroup.visible = this.config.showBonds;
        this.unitCellGroup.visible = this.config.showUnitCell;
    }
    
    takeScreenshot() {
        // Render the scene
        this.renderer.render(this.scene, this.camera);
        
        // Get the data URL of the canvas
        return this.renderer.domElement.toDataURL('image/png');
    }
  }

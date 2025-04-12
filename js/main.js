/**
 * main.js
 * Entry point for the Bravais lattice visualization application
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        showError('Three.js library not found. Please check your internet connection or include Three.js manually.');
        return;
    }
    
    // Initialize the application
    initApp();
});

function initApp() {
    try {
        // Create the renderer
        const latticeRenderer = new LatticeRenderer('visualization-container');
        
        // Create the Bravais lattice model
        const bravaisLattice = new BravaisLattice();
        
        // Initialize with default lattice (cubic primitive)
        bravaisLattice.generateLattice({ type: 'cubic_primitive' });
        
        // Create the UI controller
        const ui = new UI(latticeRenderer, bravaisLattice);
        
        // Initial rendering
        latticeRenderer.renderLattice(bravaisLattice.getLatticeData());
        
        // Log initialization success
        console.log('Bravais lattice visualization tool initialized successfully.');
    } catch (error) {
        // Handle initialization errors
        showError(`Failed to initialize the application: ${error.message}`);
        console.error(error);
    }
}

function showError(message) {
    // Display error message to the user
    const container = document.getElementById('visualization-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>Error</h3>
                <p>${message}</p>
                <p>Please check the console for more details.</p>
            </div>
        `;
    }
    console.error(message);
}

// Helper functions

/**
 * Converts degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 */
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} - Angle in degrees
 */
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Creates a deep copy of an object
 * @param {object} obj - Object to copy
 * @returns {object} - Deep copy of the object
 */
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

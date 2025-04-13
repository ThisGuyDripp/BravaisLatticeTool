/**
* BravaisLattice.js
* Generates the atomic structure for different Bravais lattice types
*/
class BravaisLattice {
    constructor(type = 'simple-cubic') {
        this.type = type;
        this.latticeData = LATTICE_DATA[type];
        this.parameters = { ...this.latticeData.parameters };
        this.atoms = [];
        this.unitCell = [];
        this.generateLattice(1);
    }

    /**
     * Set lattice type and update parameters
     * @param {string} type - The lattice type key
     */
    setLatticeType(type) {
        if (LATTICE_DATA[type]) {
            this.type = type;
            this.latticeData = LATTICE_DATA[type];
            this.parameters = { ...this.latticeData.parameters };
            this.generateLattice(1);
            return true;
        }
        return false;
    }

    /**
     * Set a specific lattice parameter
     * @param {string} param - Parameter name (a, b, c, alpha, beta, gamma)
     * @param {number} value - New parameter value
     */
    setParameter(param, value) {
        if (this.parameters.hasOwnProperty(param)) {
            this.parameters[param] = value;

            // Handle constraints
            if (this.latticeData.constraints[param] && this.latticeData.constraints[param].equals) {
                this.latticeData.constraints[param].equals.forEach(otherParam => {
                    this.parameters[otherParam] = value;
                });
            }

            return true;
        }
        return false;
    }

    /**
     * Generate the lattice structure
     * @param {number} repeats - Number of unit cell repetitions in each direction
     */
    generateLattice(repeats = 1) {
        this.atoms = [];
        this.unitCell = this.calculateUnitCellVectors();

        // Generate atoms for the specified number of unit cells
        for (let i = 0; i < repeats; i++) {
            for (let j = 0; j < repeats; j++) {
                for (let k = 0; k < repeats; k++) {
                    this.generateUnitCellAtoms(i, j, k);
                }
            }
        }

        return this.atoms;
    }

    /**
     * Calculate the unit cell vectors based on lattice parameters
     * @returns {Array} Array of unit cell vectors
     */
    calculateUnitCellVectors() {
        const { a, b, c, alpha, beta, gamma } = this.parameters;

        // Convert angles from degrees to radians
        const alphaRad = alpha * Math.PI / 180;
        const betaRad = beta * Math.PI / 180;
        const gammaRad = gamma * Math.PI / 180;

        // Calculate unit cell vectors
        // For a general triclinic cell
        const ax = a;
        const ay = 0;
        const az = 0;

        const bx = b * Math.cos(gammaRad);
        const by = b * Math.sin(gammaRad);
        const bz = 0;

        const cx = c * Math.cos(betaRad);
        const cy = c * (Math.cos(alphaRad) - Math.cos(betaRad) * Math.cos(gammaRad)) / Math.sin(gammaRad);
        const cz = Math.sqrt(c * c - cx * cx - cy * cy);

        return [
            [ax, ay, az],
            [bx, by, bz],
            [cx, cy, cz] // c vector
        ];
    }

    /**
     * Generate atoms for a single unit cell at the specified position
     * @param {number} i - Unit cell index in x direction
     * @param {number} j - Unit cell index in y direction
     * @param {number} k - Unit cell index in z direction
     */
    generateUnitCellAtoms(i, j, k) {
        const [a, b, c] = this.unitCell;

        // Base position for this unit cell
        const baseX = i * a[0] + j * b[0] + k * c[0];
        const baseY = i * a[1] + j * b[1] + k * c[1];
        const baseZ = i * a[2] + j * b[2] + k * c[2];

        // Add atoms at their relative positions within the unit cell
        for (const atomPos of this.latticeData.atomPositions) {
            const [relX, relY, relZ] = atomPos;

            // Calculate absolute position
            const x = baseX + relX * a[0] + relY * b[0] + relZ * c[0];
            const y = baseY + relX * a[1] + relY * b[1] + relZ * c[1];
            const z = baseZ + relX * a[2] + relY * b[2] + relZ * c[2];

            // Store atom
            this.atoms.push({ position: [x, y, z], unitCell: [i, j, k] });
        }
    }

    /**
     * Get the current lattice atoms
     * @returns {Array} Array of atom positions
     */
    getAtoms() {
        return this.atoms;
    }
    /**
     * Get the unit cell vertices
     * @returns {Array} Array of unit cell corner positions
     */
    getUnitCellVertices(cellI = 0, cellJ = 0, cellK = 0) {
        const [a, b, c] = this.unitCell;

        // Base position for this unit cell
        const baseX = cellI * a[0] + cellJ * b[0] + cellK * c[0];
        const baseY = cellI * a[1] + cellJ * b[1] + cellK * c[1];
        const baseZ = cellI * a[2] + cellJ * b[2] + cellK * c[2];

        // 8 vertices of the unit cell
        return [
            [baseX, baseY, baseZ],
            [baseX + a[0], baseY + a[1], baseZ + a[2]],
            [baseX + b[0], baseY + b[1], baseZ + b[2]],
            [baseX + a[0] + b[0], baseY + a[1] + b[1], baseZ + a[2] + b[2]],
            [baseX + c[0], baseY + c[1], baseZ + c[2]],
            [baseX + a[0] + c[0], baseY + a[1] + c[1], baseZ + a[2] + c[2]],
            [baseX + b[0] + c[0], baseY + b[1] + c[1], baseZ + b[2] + c[2]],
            [baseX + a[0] + b[0] + c[0], baseY + a[1] + b[1] + c[1], baseZ + a[2] + b[2] + c[2]] // 7: a + b + c
        ];
    }
}

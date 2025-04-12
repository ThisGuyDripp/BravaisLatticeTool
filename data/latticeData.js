/**
 * Bravais Lattice Data
 * Contains crystallographic information for all 14 Bravais lattices
 */
const LATTICE_DATA = {
    // Cubic Crystal System
    "simple-cubic": {
        name: "Simple Cubic",
        description: "A simple cubic lattice has equal lattice parameters (a = b = c) and all angles are 90°.",
        parameters: {
            a: 1, b: 1, c: 1,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            a: { equals: ["b", "c"] },
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0] // atom at corner
        ],
        examples: ["NaCl", "CsCl", "Po (α form)"]
    },
    
    "body-centered-cubic": {
        name: "Body-Centered Cubic",
        description: "A body-centered cubic lattice has equal lattice parameters and an additional atom at the center of the unit cell.",
        parameters: {
            a: 1, b: 1, c: 1,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            a: { equals: ["b", "c"] },
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0],     // atom at corner
            [0.5, 0.5, 0.5] // atom at body center
        ],
        examples: ["Fe (α form)", "Cr", "W", "Nb"]
    },
    
    "face-centered-cubic": {
        name: "Face-Centered Cubic",
        description: "A face-centered cubic lattice has equal lattice parameters and additional atoms at the center of each face.",
        parameters: {
            a: 1, b: 1, c: 1,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            a: { equals: ["b", "c"] },
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0],     // atom at corner
            [0.5, 0.5, 0], // atom at face center (xy)
            [0.5, 0, 0.5], // atom at face center (xz)
            [0, 0.5, 0.5]  // atom at face center (yz)
        ],
        examples: ["Cu", "Al", "Au", "Pt", "Ag"]
    },
    
    // Tetragonal Crystal System
    "simple-tetragonal": {
        name: "Simple Tetragonal",
        description: "A simple tetragonal lattice has a ≠ c, a = b, and all angles are 90°.",
        parameters: {
            a: 1, b: 1, c: 1.5,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            a: { equals: ["b"] },
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0] // atom at corner
        ],
        examples: ["TiO₂ (rutile)", "SnO₂"]
    },
    
    "body-centered-tetragonal": {
        name: "Body-Centered Tetragonal",
        description: "A body-centered tetragonal lattice has a ≠ c, a = b, all angles are 90°, and an additional atom at the center.",
        parameters: {
            a: 1, b: 1, c: 1.5,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            a: { equals: ["b"] },
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0],     // atom at corner
            [0.5, 0.5, 0.5] // atom at body center
        ],
        examples: ["Fe (white tin)", "MgZn₂"]
    },
    
    // Orthorhombic Crystal System
    "simple-orthorhombic": {
        name: "Simple Orthorhombic",
        description: "A simple orthorhombic lattice has a ≠ b ≠ c and all angles are 90°.",
        parameters: {
            a: 1, b: 1.2, c: 1.5,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0] // atom at corner
        ],
        examples: ["Aragonite (CaCO₃)", "Sulfur"]
    },
    
    "body-centered-orthorhombic": {
        name: "Body-Centered Orthorhombic",
        description: "A body-centered orthorhombic lattice has a ≠ b ≠ c, all angles are 90°, and an additional atom at the center.",
        parameters: {
            a: 1, b: 1.2, c: 1.5,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0],     // atom at corner
            [0.5, 0.5, 0.5] // atom at body center
        ],
        examples: ["Uranium (α form)", "Barium titanate"]
    },
    
    "face-centered-orthorhombic": {
        name: "Face-Centered Orthorhombic",
        description: "A face-centered orthorhombic lattice has a ≠ b ≠ c, all angles are 90°, and additional atoms at the center of each face.",
        parameters: {
            a: 1, b: 1.2, c: 1.5,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0],     // atom at corner
            [0.5, 0.5, 0], // atom at face center (xy)
            [0.5, 0, 0.5], // atom at face center (xz)
            [0, 0.5, 0.5]  // atom at face center (yz)
        ],
        examples: ["Strontium carbonate", "Iodine"]
    },
    
    "base-centered-orthorhombic": {
        name: "Base-Centered Orthorhombic",
        description: "A base-centered orthorhombic lattice has a ≠ b ≠ c, all angles are 90°, and additional atoms at the center of the base faces.",
        parameters: {
            a: 1, b: 1.2, c: 1.5,
            alpha: 90, beta: 90, gamma: 90
        },
        constraints: {
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0],    // atom at corner
            [0.5, 0.5, 0]  // atom at base center (xy)
        ],
        examples: ["Gypsum (CaSO₄·2H₂O)", "Molybdenum dioxide"]
    },
    
    // Monoclinic Crystal System
    "simple-monoclinic": {
        name: "Simple Monoclinic",
        description: "A simple monoclinic lattice has a ≠ b ≠ c, α = γ = 90°, and β ≠ 90°.",
        parameters: {
            a: 1, b: 1.2, c: 1.5,
            alpha: 90, beta: 100, gamma: 90
        },
        constraints: {
            alpha: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0] // atom at corner
        ],
        examples: ["Monoclinic sulfur", "Sodium sulfate"]
    },
    
    "base-centered-monoclinic": {
        name: "Base-Centered Monoclinic",
        description: "A base-centered monoclinic lattice has a ≠ b ≠ c, α = γ = 90°, β ≠ 90°, and an additional atom at the center of the base face.",
        parameters: {
            a: 1, b: 1.2, c: 1.5,
            alpha: 90, beta: 100, gamma: 90
        },
        constraints: {
            alpha: { fixed: 90 },
            gamma: { fixed: 90 }
        },
        atomPositions: [
            [0, 0, 0],    // atom at corner
            [0.5, 0.5, 0]  // atom at base center
        ],
        examples: ["Clinopyroxenes", "Mica"]
    },
    
    // Triclinic Crystal System
    "triclinic": {
        name: "Triclinic",
        description: "A triclinic lattice has a ≠ b ≠ c and α ≠ β ≠ γ ≠ 90°. This is the least symmetric lattice type.",
        parameters: {
            a: 1, b: 1.2, c: 1.5,
            alpha: 80, beta: 85, gamma: 100
        },
        constraints: {},
        atomPositions: [
            [0, 0, 0] // atom at corner
        ],
        examples: ["Microcline (KAlSi₃O₈)", "Copper sulfate pentahydrate"]
    },
    
    // Rhombohedral Crystal System
    "rhombohedral": {
        name: "Rhombohedral",
        description: "A rhombohedral lattice has a = b = c and α = β = γ ≠ 90°.",
        parameters: {
            a: 1, b: 1, c: 1,
            alpha: 70, beta: 70, gamma: 70
        },
        constraints: {
            a: { equals: ["b", "c"] },
            alpha: { equals: ["beta", "gamma"] }
        },
        atomPositions: [
            [0, 0, 0] // atom at corner
        ],
        examples: ["Calcite (CaCO₃)", "Corundum (Al₂O₃)", "Bismuth"]
    },
    
    // Hexagonal Crystal System
    "hexagonal": {
        name: "Hexagonal",
        description: "A hexagonal lattice has a = b ≠ c, α = β = 90°, and γ = 120°.",
        parameters: {
            a: 1, b: 1, c: 1.5,
            alpha: 90, beta: 90, gamma: 120
        },
        constraints: {
            a: { equals: ["b"] },
            alpha: { fixed: 90 },
            beta: { fixed: 90 },
            gamma: { fixed: 120 }
        },
        atomPositions: [
            [0, 0, 0],           // atom at corner
            [1/3, 2/3, 0],       // additional atom
            [2/3, 1/3, 0]        // additional atom
        ],
        examples: ["Graphite", "Zinc", "Ice (ordinary form)", "Quartz"]
    }
};

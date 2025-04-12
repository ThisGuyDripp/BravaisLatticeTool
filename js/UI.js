/**
 * UI.js
 * Handles the user interface elements and interactions for the Bravais lattice viewer
 */

class UI {
    constructor(latticeRenderer, bravaisLattice) {
        this.renderer = latticeRenderer;
        this.lattice = bravaisLattice;
        this.currentLatticeType = 'cubic_primitive';
        
        // UI elements
        this.latticeSelector = document.getElementById('lattice-selector');
        this.parametersForm = document.getElementById('parameters-form');
        this.displayOptions = document.getElementById('display-options');
        this.infoPanel = document.getElementById('info-panel');
        
        // Initialize UI
        this.initLatticeSelector();
        this.initDisplayOptions();
        this.initParametersForm();
        this.initInfoPanel();
        this.initEventListeners();
    }
    
    initLatticeSelector() {
        // Populate lattice selector with available lattice types
        if (!this.latticeSelector) return;
        
        // Clear existing options
        this.latticeSelector.innerHTML = '';
        
        // Get all lattice types from data
        const latticeGroups = {
            'Cubic': ['cubic_primitive', 'cubic_body_centered', 'cubic_face_centered'],
            'Tetragonal': ['tetragonal_primitive', 'tetragonal_body_centered'],
            'Orthorhombic': ['orthorhombic_primitive', 'orthorhombic_body_centered', 
                            'orthorhombic_face_centered', 'orthorhombic_base_centered'],
            'Monoclinic': ['monoclinic_primitive', 'monoclinic_base_centered'],
            'Triclinic': ['triclinic'],
            'Rhombohedral': ['rhombohedral'],
            'Hexagonal': ['hexagonal']
        };
        
        // Create option groups
        for (const [groupName, latticeTypes] of Object.entries(latticeGroups)) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = groupName;
            
            latticeTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = this.formatLatticeTypeName(type);
                optgroup.appendChild(option);
            });
            
            this.latticeSelector.appendChild(optgroup);
        }
    }
    
    formatLatticeTypeName(type) {
        return type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    initDisplayOptions() {
        if (!this.displayOptions) return;
        
        // Create display checkboxes
        const options = [
            { id: 'show-atoms', label: 'Show Atoms', checked: true },
            { id: 'show-bonds', label: 'Show Bonds', checked: true },
            { id: 'show-unit-cell', label: 'Show Unit Cell', checked: true },
            { id: 'show-axes', label: 'Show Axes', checked: true }
        ];
        
        options.forEach(option => {
            const container = document.createElement('div');
            container.className = 'option-container';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = option.id;
            checkbox.checked = option.checked;
            
            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.textContent = option.label;
            
            container.appendChild(checkbox);
            container.appendChild(label);
            this.displayOptions.appendChild(container);
        });
        
        // Add color pickers
        const colorOptions = [
            { id: 'atom-color', label: 'Atom Color', default: '#0088ff' },
            { id: 'bond-color', label: 'Bond Color', default: '#cccccc' },
            { id: 'cell-color', label: 'Cell Color', default: '#333333' },
            { id: 'bg-color', label: 'Background Color', default: '#f0f0f0' }
        ];
        
        colorOptions.forEach(option => {
            const container = document.createElement('div');
            container.className = 'option-container';
            
            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.textContent = option.label;
            
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.id = option.id;
            colorPicker.value = option.default;
            
            container.appendChild(label);
            container.appendChild(colorPicker);
            this.displayOptions.appendChild(container);
        });
        
        // Add screenshot button
        const btnContainer = document.createElement('div');
        btnContainer.className = 'option-container';
        
        const screenshotBtn = document.createElement('button');
        screenshotBtn.id = 'screenshot-btn';
        screenshotBtn.textContent = 'Take Screenshot';
        
        btnContainer.appendChild(screenshotBtn);
        this.displayOptions.appendChild(btnContainer);
    }
    
    initParametersForm() {
        // This will be populated dynamically when a lattice is selected
        if (!this.parametersForm) return;
        
        this.parametersForm.innerHTML = '<p>Select a lattice type to adjust parameters.</p>';
    }
    
    updateParametersForm(latticeType) {
        if (!this.parametersForm) return;
        
        // Clear current parameters
        this.parametersForm.innerHTML = '';
        
        // Get parameters for selected lattice type
        const params = this.lattice.getParametersForType(latticeType);
        if (!params) return;
        
        // Create form elements for each parameter
        Object.entries(params).forEach(([key, value]) => {
            if (key === 'type') return; // Skip the type field
            
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            // Create label
            const label = document.createElement('label');
            label.htmlFor = `param-${key}`;
            label.textContent = this.formatParameterName(key);
            
            // Create input with appropriate type
            const input = document.createElement('input');
            input.id = `param-${key}`;
            input.name = key;
            
            // Handle different param types
            if (typeof value === 'number') {
                input.type = 'range';
                
                // Set limits based on parameter
                if (key.includes('angle')) {
                    input.min = '60';
                    input.max = '120';
                    input.step = '1';
                } else {
                    input.min = '0.5';
                    input.max = '3';
                    input.step = '0.1';
                }
                
                input.value = value;
                
                // Add value display
                const valueDisplay = document.createElement('span');
                valueDisplay.className = 'param-value';
                valueDisplay.textContent = value;
                input.oninput = () => {
                    valueDisplay.textContent = input.value;
                };
                
                formGroup.appendChild(label);
                formGroup.appendChild(input);
                formGroup.appendChild(valueDisplay);
            } else {
                // Other types can be handled here if needed
                input.type = 'text';
                input.value = value;
                
                formGroup.appendChild(label);
                formGroup.appendChild(input);
            }
            
            this.parametersForm.appendChild(formGroup);
        });
        
        // Add apply button
        const applyBtn = document.createElement('button');
        applyBtn.type = 'button';
        applyBtn.id = 'apply-params';
        applyBtn.textContent = 'Apply Parameters';
        this.parametersForm.appendChild(applyBtn);
        
        // Add reset button
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.id = 'reset-params';
        resetBtn.textContent = 'Reset to Default';
        this.parametersForm.appendChild(resetBtn);
        
        // Attach event listeners to new buttons
        document.getElementById('apply-params').addEventListener('click', () => this.applyParameters());
        document.getElementById('reset-params').addEventListener('click', () => this.resetParameters());
    }
    
    formatParameterName(key) {
        // Format parameter keys to readable labels
        return key
            .replace(/_/g, ' ')
            .replace(/(\b[a-z])/g, (match) => match.toUpperCase());
    }
    
    initInfoPanel() {
        if (!this.infoPanel) return;
        
        // Add initial info text
        this.infoPanel.innerHTML = `
            <h3>Bravais Lattice Information</h3>
            <p>Select a lattice type to view information.</p>
            <div id="lattice-description"></div>
            <div id="lattice-properties"></div>
        `;
    }
    
    updateInfoPanel(latticeType) {
        const descriptionElement = document.getElementById('lattice-description');
        const propertiesElement = document.getElementById('lattice-properties');
        
        if (!descriptionElement || !propertiesElement) return;
        
        // Get information for the selected lattice type
        const latticeInfo = this.lattice.getLatticeInfo(latticeType);
        
        if (latticeInfo) {
            descriptionElement.innerHTML = `
                <h4>Description</h4>
                <p>${latticeInfo.description}</p>
            `;
            
            propertiesElement.innerHTML = `
                <h4>Properties</h4>
                <ul>
                    <li><strong>Crystal Family:</strong> ${latticeInfo.family}</li>
                    <li><strong>Symmetry:</strong> ${latticeInfo.symmetry}</li>
                    <li><strong>Examples:</strong> ${latticeInfo.examples.join(', ')}</li>
                </ul>
            `;
        } else {
            descriptionElement.innerHTML = '<p>Information not available.</p>';
            propertiesElement.innerHTML = '';
        }
    }
    
    initEventListeners() {
        // Lattice selection change
        if (this.latticeSelector) {
            this.latticeSelector.addEventListener('change', () => {
                const selectedType = this.latticeSelector.value;
                this.currentLatticeType = selectedType;
                this.updateParametersForm(selectedType);
                this.updateInfoPanel(selectedType);
                this.updateLatticeVisualization();
            });
        }
        
        // Display options events
        document.getElementById('show-atoms')?.addEventListener('change', e => {
            this.renderer.updateConfig({ showAtoms: e.target.checked });
        });
        
        document.getElementById('show-bonds')?.addEventListener('change', e => {
            this.renderer.updateConfig({ showBonds: e.target.checked });
        });
        
        document.getElementById('show-unit-cell')?.addEventListener('change', e => {
            this.renderer.updateConfig({ showUnitCell: e.target.checked });
        });
        
        document.getElementById('show-axes')?.addEventListener('change', e => {
            this.renderer.updateConfig({ showAxes: e.target.checked });
        });
        
        // Color pickers
        document.getElementById('atom-color')?.addEventListener('change', e => {
            this.renderer.updateConfig({ atomColor: this.hexToInt(e.target.value) });
            this.updateLatticeVisualization();
        });
        
        document.getElementById('bond-color')?.addEventListener('change', e => {
            this.renderer.updateConfig({ bondColor: this.hexToInt(e.target.value) });
            this.updateLatticeVisualization();
        });
        
        document.getElementById('cell-color')?.addEventListener('change', e => {
            this.renderer.updateConfig({ cellColor: this.hexToInt(e.target.value) });
            this.updateLatticeVisualization();
        });
        
        document.getElementById('bg-color')?.addEventListener('change', e => {
            this.renderer.updateConfig({ backgroundColor: this.hexToInt(e.target.value) });
        });
        
        // Screenshot button
        document.getElementById('screenshot-btn')?.addEventListener('click', () => {
            this.takeScreenshot();
        });
    }
    
    hexToInt(hexColor) {
        // Convert hex color (like #ff0000) to integer (like 0xff0000)
        return parseInt(hexColor.replace('#', '0x'));
    }
    
    applyParameters() {
        const formData = new FormData(this.parametersForm);
        const params = {};
        
        // Convert form data to parameters object
        for (const [key, value] of formData.entries()) {
            // Convert numerical values to numbers
            params[key] = isNaN(value) ? value : parseFloat(value);
        }
        
        // Add type to parameters
        params.type = this.currentLatticeType;
        
        // Generate new lattice with updated parameters
        this.lattice.generateLattice(params);
        
        // Update visualization
        this.updateLatticeVisualization();
    }
    
    resetParameters() {
        // Reset to default parameters for the current lattice type
        this.lattice.resetToDefaultParameters(this.currentLatticeType);
        
        // Update the form with default values
        this.updateParametersForm(this.currentLatticeType);
        
        // Update visualization
        this.updateLatticeVisualization();
    }
    
    updateLatticeVisualization() {
        // Get the current lattice data
        const latticeData = this.lattice.getLatticeData();
        
        // Render the lattice
        this.renderer.renderLattice(latticeData);
    }
    
    takeScreenshot() {
        // Get the screenshot data URL
        const dataUrl = this.renderer.takeScreenshot();
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `bravais-lattice-${this.currentLatticeType}.png`;
        link.click();
    }
}

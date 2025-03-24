// Resume Templates - Defines and applies different resume templates

// Template definitions
const templates = {
    professional: {
        name: 'Professional',
        description: 'A clean, traditional template suitable for most industries.',
        class: 'template-professional',
        colors: {
            primary: '#2c3e50',
            secondary: '#3498db',
            accent: '#e74c3c',
            text: '#333333',
            background: '#ffffff'
        }
    },
    modern: {
        name: 'Modern',
        description: 'A contemporary design with a fresh layout.',
        class: 'template-modern',
        colors: {
            primary: '#1a237e',
            secondary: '#0097a7',
            accent: '#ff5722',
            text: '#37474f',
            background: '#f5f5f5'
        }
    },
    creative: {
        name: 'Creative',
        description: 'A bold design for creative professionals.',
        class: 'template-creative',
        colors: {
            primary: '#6200ea',
            secondary: '#00bfa5',
            accent: '#f50057',
            text: '#424242',
            background: '#ffffff'
        }
    },
    simple: {
        name: 'Simple',
        description: 'A minimalist design focusing on content.',
        class: 'template-simple',
        colors: {
            primary: '#455a64',
            secondary: '#607d8b',
            accent: '#ff9800',
            text: '#212121',
            background: '#ffffff'
        }
    }
};

// Initialize templates module
document.addEventListener('DOMContentLoaded', function() {
    // Populate template cards in the templates section
    populateTemplateCards();
    
    // Apply default template
    applyResumeTemplate('professional');
    
    // Expose functions to window for access from other modules
    window.applyResumeTemplate = applyResumeTemplate;
    window.getTemplatesList = getTemplatesList;
    window.getTemplateStyles = getTemplateStyles;
    
    // Fix template images in sidebar
    fixTemplateImages();
});

// Handle image loading errors and provide fallbacks
function fixTemplateImages() {
    // Fix sidebar template option images
    document.querySelectorAll('.template-option img').forEach(img => {
        img.onerror = function() {
            // If PNG fails, try SVG
            if (this.src.endsWith('.png')) {
                this.src = this.src.replace('.png', '.svg');
            } 
            // If all fails, use a colored div as fallback
            this.onerror = function() {
                const templateId = this.closest('.template-option').getAttribute('data-template');
                const template = templates[templateId];
                if (template) {
                    // Create a colored rectangle as fallback
                    const div = document.createElement('div');
                    div.style.width = '100%';
                    div.style.height = '100%';
                    div.style.backgroundColor = template.colors.primary;
                    div.style.borderRadius = '4px';
                    this.parentNode.insertBefore(div, this);
                    this.style.display = 'none';
                }
            };
        };
    });
}

// Populate template cards in the templates section
function populateTemplateCards() {
    const templatesGrid = document.querySelector('.templates-grid');
    if (!templatesGrid) return;
    
    // Clear existing content
    templatesGrid.innerHTML = '';
    
    // Add template cards
    for (const [id, template] of Object.entries(templates)) {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.setAttribute('data-template', id);
        
        // Check if SVG file exists as a fallback
        const imgSrc = `assets/images/template-${id}.svg`;
        
        card.innerHTML = `
            <div class="template-preview">
                <img src="${imgSrc}" alt="${template.name} Template">
            </div>
            <div class="template-info">
                <h3>${template.name}</h3>
                <p>${template.description}</p>
                <button class="btn primary-btn use-template-btn">Use Template</button>
            </div>
        `;
        
        // Add event listener to use template button
        card.querySelector('.use-template-btn').addEventListener('click', function() {
            applyResumeTemplate(id);
            
            // Scroll to builder section
            const builderSection = document.getElementById('builder');
            if (builderSection) {
                builderSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Update template selector in sidebar
            const templateOptions = document.querySelectorAll('.template-option');
            templateOptions.forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-template') === id) {
                    option.classList.add('active');
                }
            });
        });
        
        // Handle image loading errors
        const img = card.querySelector('img');
        img.onerror = function() {
            // Create a colored rectangle as fallback
            const div = document.createElement('div');
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.backgroundColor = template.colors.primary;
            div.style.borderRadius = '4px';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.color = 'white';
            div.style.fontWeight = 'bold';
            div.textContent = template.name;
            this.parentNode.insertBefore(div, this);
            this.style.display = 'none';
        };
        
        templatesGrid.appendChild(card);
    }
}

// Apply a template to the resume preview
function applyResumeTemplate(templateId) {
    // Get template
    const template = templates[templateId] || templates.professional;
    
    // Get resume preview element
    const resumePreview = document.getElementById('resume-preview');
    if (!resumePreview) return;
    
    // Remove all template classes
    Object.values(templates).forEach(t => {
        resumePreview.classList.remove(t.class);
    });
    
    // Add selected template class
    resumePreview.classList.add(template.class);
    
    // Apply template colors as CSS variables
    resumePreview.style.setProperty('--template-primary', template.colors.primary);
    resumePreview.style.setProperty('--template-secondary', template.colors.secondary);
    resumePreview.style.setProperty('--template-accent', template.colors.accent);
    resumePreview.style.setProperty('--template-text', template.colors.text);
    resumePreview.style.setProperty('--template-background', template.colors.background);
    
    // Update resume data with selected template
    if (window.getResumeData) {
        const resumeData = window.getResumeData();
        resumeData.template = templateId;
        
        // Save updated resume data
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
    
    // Update preview with new template
    if (window.renderResumePreview) {
        window.renderResumePreview();
    }
}

// Get the list of available templates
function getTemplatesList() {
    return templates;
}

// Generate template-specific CSS for the resume preview
function getTemplateStyles(templateId) {
    const template = templates[templateId] || templates.professional;
    
    // Base styles for all templates
    let styles = `
        .resume-preview {
            font-family: var(--font-family);
            color: var(--template-text);
            background-color: var(--template-background);
            padding: 40px;
            position: relative;
        }
        
        .resume-preview h1, 
        .resume-preview h2, 
        .resume-preview h3, 
        .resume-preview h4 {
            color: var(--template-primary);
            margin-bottom: 10px;
        }
        
        .resume-preview section {
            margin-bottom: 25px;
        }
        
        .resume-preview .section-title {
            border-bottom: 2px solid var(--template-secondary);
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .resume-preview .item {
            margin-bottom: 15px;
        }
        
        .resume-preview .item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        
        .resume-preview .item-title {
            font-weight: bold;
        }
        
        .resume-preview .item-subtitle {
            color: var(--template-secondary);
        }
        
        .resume-preview .item-date {
            color: var(--template-text);
            opacity: 0.8;
        }
        
        .resume-preview .item-description {
            margin-top: 5px;
        }
        
        .resume-preview .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .resume-preview .skill-item {
            background-color: var(--template-secondary);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
        }
    `;
    
    // Template-specific styles
    switch (templateId) {
        case 'professional':
            styles += `
                .template-professional .resume-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .template-professional .contact-info {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 10px;
                }
                
                .template-professional .section-title {
                    font-size: 18px;
                    text-transform: uppercase;
                }
            `;
            break;
            
        case 'modern':
            styles += `
                .template-modern .resume-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                
                .template-modern .contact-info {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                
                .template-modern .section-title {
                    font-size: 20px;
                    position: relative;
                    padding-left: 15px;
                    border-bottom: none;
                }
                
                .template-modern .section-title:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 5px;
                    background-color: var(--template-secondary);
                }
                
                .template-modern .skill-item {
                    background-color: transparent;
                    color: var(--template-text);
                    border: 1px solid var(--template-secondary);
                }
            `;
            break;
            
        case 'creative':
            styles += `
                .template-creative .resume-header {
                    background-color: var(--template-primary);
                    color: white;
                    padding: 30px;
                    margin: -40px -40px 30px -40px;
                }
                
                .template-creative .resume-header h1 {
                    color: white;
                }
                
                .template-creative .contact-info {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 20px;
                }
                
                .template-creative .section-title {
                    display: inline-block;
                    padding: 5px 15px;
                    background-color: var(--template-secondary);
                    color: white;
                    border-bottom: none;
                    border-radius: 20px;
                }
                
                .template-creative .item-header {
                    background-color: rgba(0, 0, 0, 0.05);
                    padding: 10px;
                    border-radius: 4px;
                }
                
                .template-creative .skill-item {
                    border-radius: 20px;
                }
            `;
            break;
            
        case 'simple':
            styles += `
                .template-simple .resume-header {
                    margin-bottom: 30px;
                }
                
                .template-simple .contact-info {
                    margin-top: 10px;
                    color: var(--template-secondary);
                }
                
                .template-simple .section-title {
                    font-size: 16px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    border-bottom: 1px solid var(--template-secondary);
                }
                
                .template-simple .item-title {
                    color: var(--template-primary);
                }
                
                .template-simple .skill-item {
                    background-color: transparent;
                    color: var(--template-text);
                    border-bottom: 2px solid var(--template-secondary);
                    border-radius: 0;
                    padding: 5px 0;
                }
            `;
            break;
    }
    
    return styles;
} 
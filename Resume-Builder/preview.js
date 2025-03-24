// Resume Preview - Renders the resume preview based on user input

// Initialize preview module
document.addEventListener('DOMContentLoaded', function() {
    // Expose functions to window for access from other modules
    window.renderResumePreview = renderResumePreview;
    
    // Add a preview updating indicator
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) {
        const updateIndicator = document.createElement('div');
        updateIndicator.className = 'preview-updating-indicator';
        updateIndicator.innerHTML = '<span>Updating...</span>';
        previewContainer.appendChild(updateIndicator);
    }
});

// Render the resume preview with current data
function renderResumePreview() {
    // Show updating indicator
    const updateIndicator = document.querySelector('.preview-updating-indicator');
    if (updateIndicator) {
        updateIndicator.classList.add('active');
    }
    
    // Get resume data
    let resumeData = { 
        template: 'professional',
        personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            website: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        interests: []
    };
    
    // Get data from builder module if available
    if (window.getResumeData) {
        resumeData = window.getResumeData();
    }
    
    // Get resume preview element
    const resumePreview = document.getElementById('resume-preview');
    if (!resumePreview) return;
    
    // Generate HTML for the resume
    const resumeHTML = generateResumeHTML(resumeData);
    
    // Update the preview
    resumePreview.innerHTML = resumeHTML;
    
    // Apply template-specific styles
    applyTemplateStyles(resumeData.template);
    
    // Ensure the preview is visible
    resumePreview.style.opacity = '0';
    resumePreview.style.display = 'block';
    
    // Force a reflow to ensure the preview is updated
    resumePreview.offsetHeight; // Force reflow
    
    // Fade in the preview
    resumePreview.style.transition = 'opacity 0.2s ease-in-out';
    resumePreview.style.opacity = '1';
    
    // Hide updating indicator after a short delay
    setTimeout(() => {
        if (updateIndicator) {
            updateIndicator.classList.remove('active');
        }
    }, 300);
    
    // Log the current data to help with debugging
    console.log('Resume data updated:', resumeData);
}

// Generate HTML for the resume
function generateResumeHTML(data) {
    // Start with the header section
    let html = `
        <div class="resume-header">
            <h1>${data.personal.fullName || 'Your Name'}</h1>
            <div class="contact-info">
                ${data.personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.personal.email}</div>` : ''}
                ${data.personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${data.personal.phone}</div>` : ''}
                ${data.personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.personal.location}</div>` : ''}
                ${data.personal.website ? `<div class="contact-item"><i class="fas fa-globe"></i> ${data.personal.website}</div>` : ''}
            </div>
        </div>
    `;
    
    // Add summary section if available
    if (data.summary) {
        html += `
            <section class="summary-section">
                <h2 class="section-title">Professional Summary</h2>
                <p>${data.summary}</p>
            </section>
        `;
    }
    
    // Add experience section if available
    if (data.experience && data.experience.length > 0) {
        html += `
            <section class="experience-section">
                <h2 class="section-title">Work Experience</h2>
                ${data.experience.map(exp => `
                    <div class="item experience-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${exp.jobTitle || 'Job Title'}</div>
                                <div class="item-subtitle">${exp.company || 'Company'} ${exp.location ? `- ${exp.location}` : ''}</div>
                            </div>
                            <div class="item-date">${exp.startDate || 'Start Date'} - ${exp.endDate || 'Present'}</div>
                        </div>
                        <div class="item-description">${exp.description || ''}</div>
                    </div>
                `).join('')}
            </section>
        `;
    }
    
    // Add education section if available
    if (data.education && data.education.length > 0) {
        html += `
            <section class="education-section">
                <h2 class="section-title">Education</h2>
                ${data.education.map(edu => `
                    <div class="item education-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${edu.degree || 'Degree'}</div>
                                <div class="item-subtitle">${edu.institution || 'Institution'} ${edu.location ? `- ${edu.location}` : ''}</div>
                            </div>
                            <div class="item-date">${edu.startDate || 'Start Date'} - ${edu.endDate || 'End Date'}</div>
                        </div>
                        <div class="item-description">${edu.description || ''}</div>
                    </div>
                `).join('')}
            </section>
        `;
    }
    
    console.log('Generating HTML for skills:', data.skills);

    // Add skills section if available
    if (data.skills && data.skills.length > 0) {
        html += `
            <section class="skills-section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-list">
                    ${data.skills.map(skill => `
                        <div class="skill-item">
                            <strong>${skill.name}</strong>
                            ${skill.level ? ` - <span class="skill-level">${skill.level}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
    
    // Add projects section if available
    if (data.projects && data.projects.length > 0) {
        html += `
            <section class="projects-section">
                <h2 class="section-title">Projects</h2>
                ${data.projects.map(project => `
                    <div class="item project-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${project.name || 'Project Name'} ${project.role ? `- ${project.role}` : ''}</div>
                                ${project.link ? `<div class="item-subtitle"><a href="${project.link}" target="_blank">${project.link}</a></div>` : ''}
                            </div>
                            <div class="item-date">${project.startDate || ''} ${project.endDate ? `- ${project.endDate}` : ''}</div>
                        </div>
                        <div class="item-description">${project.description || ''}</div>
                    </div>
                `).join('')}
            </section>
        `;
    }
    
    // Add certifications section if available
    if (data.certifications && data.certifications.length > 0) {
        html += `
            <section class="certifications-section">
                <h2 class="section-title">Certifications</h2>
                ${data.certifications.map(cert => `
                    <div class="item certification-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${cert.name || 'Certification Name'}</div>
                                <div class="item-subtitle">${cert.issuer || 'Issuing Organization'}</div>
                            </div>
                            <div class="item-date">${cert.date || ''} ${cert.expiration ? `(Expires: ${cert.expiration})` : ''}</div>
                        </div>
                    </div>
                `).join('')}
            </section>
        `;
    }
    
    // Add languages section if available
    if (data.languages && data.languages.length > 0) {
        html += `
            <section class="languages-section">
                <h2 class="section-title">Languages</h2>
                <div class="languages-list">
                    ${data.languages.map(lang => `
                        <div class="item language-item">
                            <span class="language-name">${lang.name || 'Language'}</span>
                            ${lang.proficiency ? ` - <span class="language-proficiency">${lang.proficiency}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
    
    // Add interests section if available
    if (data.interests && data.interests.length > 0) {
        html += `
            <section class="interests-section">
                <h2 class="section-title">Interests</h2>
                <div class="interests-list">
                    ${data.interests.map(interest => `
                        <div class="interest-item">${interest.name || 'Interest'}</div>
                    `).join(', ')}
                </div>
            </section>
        `;
    }
    
    return html;
}

// Apply template-specific styles
function applyTemplateStyles(templateId) {
    // Get template styles
    let templateStyles = '';
    if (window.getTemplateStyles) {
        templateStyles = window.getTemplateStyles(templateId);
    } else {
        // Fallback styles if template module is not available
        templateStyles = `
            .resume-preview {
                font-family: Arial, sans-serif;
                padding: 40px;
                color: #333;
                background-color: white;
            }
            
            .resume-preview h1, 
            .resume-preview h2, 
            .resume-preview h3 {
                color: #2c3e50;
                margin-bottom: 10px;
            }
            
            .resume-preview .section-title {
                border-bottom: 2px solid #3498db;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
            
            .resume-preview section {
                margin-bottom: 25px;
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
                color: #3498db;
            }
            
            .resume-preview .item-date {
                color: #666;
            }
            
            .resume-preview .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .resume-preview .skill-item {
                background-color: #3498db;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .resume-preview .contact-info {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 10px;
            }
        `;
    }
    
    // Check if style element already exists
    let styleElement = document.getElementById('resume-template-styles');
    
    if (!styleElement) {
        // Create style element if it doesn't exist
        styleElement = document.createElement('style');
        styleElement.id = 'resume-template-styles';
        document.head.appendChild(styleElement);
    }
    
    // Update style element content
    styleElement.textContent = templateStyles;
} 
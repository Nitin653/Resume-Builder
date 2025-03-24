// Resume Builder - Form Handling and Data Management

// Global resume data object
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

// Initialize the builder module
document.addEventListener('DOMContentLoaded', function() {
    initFormListeners();
    setupDragAndDrop();
    
    // Expose functions to window for access from other modules
    window.createSectionEditorContent = createSectionEditorContent;
    window.loadSavedResumeData = loadSavedResumeData;
    window.showSectionSelectionModal = showSectionSelectionModal;
    window.getResumeData = getResumeData;
});

// Initialize form input listeners
function initFormListeners() {
    // Personal information form
    const personalForm = document.getElementById('personal-section');
    if (personalForm) {
        const inputs = personalForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Use input event for real-time updates as user types
            input.addEventListener('input', function() {
                updatePersonalInfo();
            });
            
            // Also listen for blur events to catch paste operations
            input.addEventListener('blur', function() {
                updatePersonalInfo();
            });
            
            // For textareas, also listen for keyup to catch all changes
            if (input.tagName.toLowerCase() === 'textarea') {
                input.addEventListener('keyup', function() {
                    updatePersonalInfo();
                });
            }
        });
    }
    
    // Add listeners for other sections as they are created
    document.addEventListener('sectionCreated', function(e) {
        const sectionName = e.detail.section;
        const sectionForm = document.getElementById(`${sectionName}-section`);
        
        if (sectionForm) {
            // Handle input and textarea elements
            const inputs = sectionForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                // Use input event for real-time updates as user types
                input.addEventListener('input', function() {
                    updateSectionData(sectionName);
                });
                
                // Also listen for blur events to catch paste operations
                input.addEventListener('blur', function() {
                    updateSectionData(sectionName);
                });
                
                // For textareas, also listen for keyup to catch all changes
                if (input.tagName.toLowerCase() === 'textarea') {
                    input.addEventListener('keyup', function() {
                        updateSectionData(sectionName);
                    });
                }
            });
            
            // Handle select elements separately with change event
            const selects = sectionForm.querySelectorAll('select');
            selects.forEach(select => {
                select.addEventListener('change', function() {
                    updateSectionData(sectionName);
                });
            });
            
            // Add listeners for any buttons that might affect the preview
            const buttons = sectionForm.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    // Use a small timeout to ensure the DOM is updated
                    setTimeout(() => {
                        updateSectionData(sectionName);
                    }, 50);
                });
            });
        }
    });

    // Add event listeners for skill level changes
    document.addEventListener('click', function(e) {
        // Check if we clicked on a skill-related element
        if (e.target && (e.target.closest('.skill-item') || e.target.closest('.add-skill-btn'))) {
            // Use a small timeout to ensure the DOM is updated
            setTimeout(() => {
                updateSkillsData();
            }, 50);
        }
    });
    
    // Add global listener for any changes in the editor area
    const editorArea = document.querySelector('.editor');
    if (editorArea) {
        editorArea.addEventListener('change', function(e) {
            // Find the closest section
            const section = e.target.closest('.section-editor');
            if (section) {
                const sectionId = section.id;
                const sectionName = sectionId.replace('-section', '');
                updateSectionData(sectionName);
            }
        });
    }
}

// Update personal information in the resume data
function updatePersonalInfo() {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const website = document.getElementById('website').value;
    
    resumeData.personal = {
        fullName,
        email,
        phone,
        location,
        website
    };
    
    // Save data and update preview
    saveResumeData();
    updateResumePreview();
}

// Update section data in the resume data object
function updateSectionData(sectionName) {
    switch (sectionName) {
        case 'summary':
            updateSummaryData();
            break;
        case 'experience':
            updateExperienceData();
            break;
        case 'education':
            updateEducationData();
            break;
        case 'skills':
            updateSkillsData();
            break;
        case 'projects':
            updateProjectsData();
            break;
        case 'certifications':
            updateCertificationsData();
            break;
        case 'languages':
            updateLanguagesData();
            break;
        case 'interests':
            updateInterestsData();
            break;
    }
    
    // Save data and update preview
    saveResumeData();
    updateResumePreview();
}

// Update summary data
function updateSummaryData() {
    const summaryText = document.getElementById('summary-text').value;
    resumeData.summary = summaryText;
}

// Update experience data
function updateExperienceData() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const experiences = [];
    
    experienceItems.forEach(item => {
        const jobTitle = item.querySelector('.job-title').value;
        const company = item.querySelector('.company').value;
        const location = item.querySelector('.job-location').value;
        const startDate = item.querySelector('.start-date').value;
        const endDate = item.querySelector('.end-date').value;
        const description = item.querySelector('.job-description').value;
        
        if (jobTitle || company) {
            experiences.push({
                jobTitle,
                company,
                location,
                startDate,
                endDate,
                description
            });
        }
    });
    
    resumeData.experience = experiences;
}

// Update education data
function updateEducationData() {
    const educationItems = document.querySelectorAll('.education-item');
    const educations = [];
    
    educationItems.forEach(item => {
        const degree = item.querySelector('.degree').value;
        const institution = item.querySelector('.institution').value;
        const location = item.querySelector('.education-location').value;
        const startDate = item.querySelector('.education-start-date').value;
        const endDate = item.querySelector('.education-end-date').value;
        const description = item.querySelector('.education-description').value;
        
        if (degree || institution) {
            educations.push({
                degree,
                institution,
                location,
                startDate,
                endDate,
                description
            });
        }
    });
    
    resumeData.education = educations;
}

// Update skills data
function updateSkillsData() {
    const skillItems = document.querySelectorAll('#skills-section .skill-item');
    const skills = [];
    
    skillItems.forEach(item => {
        const skillName = item.querySelector('.skill-name').value;
        const skillLevel = item.querySelector('.skill-level').value;
        
        if (skillName) {
            skills.push({
                name: skillName,
                level: skillLevel || 'Beginner' // Default to Beginner if no level is selected
            });
        }
    });
    
    resumeData.skills = skills;
    saveResumeData();
    updateResumePreview();
}

// Update projects data
function updateProjectsData() {
    const projectItems = document.querySelectorAll('.project-item');
    const projects = [];
    
    projectItems.forEach(item => {
        const projectName = item.querySelector('.project-name').value;
        const projectRole = item.querySelector('.project-role').value;
        const startDate = item.querySelector('.project-start-date').value;
        const endDate = item.querySelector('.project-end-date').value;
        const description = item.querySelector('.project-description').value;
        const link = item.querySelector('.project-link').value;
        
        if (projectName) {
            projects.push({
                name: projectName,
                role: projectRole,
                startDate,
                endDate,
                description,
                link
            });
        }
    });
    
    resumeData.projects = projects;
}

// Update certifications data
function updateCertificationsData() {
    const certItems = document.querySelectorAll('.certification-item');
    const certifications = [];
    
    certItems.forEach(item => {
        const certName = item.querySelector('.cert-name').value;
        const issuer = item.querySelector('.cert-issuer').value;
        const date = item.querySelector('.cert-date').value;
        const expiration = item.querySelector('.cert-expiration').value;
        
        if (certName) {
            certifications.push({
                name: certName,
                issuer,
                date,
                expiration
            });
        }
    });
    
    resumeData.certifications = certifications;
}

// Update languages data
function updateLanguagesData() {
    const languageItems = document.querySelectorAll('.language-item');
    const languages = [];
    
    languageItems.forEach(item => {
        const languageName = item.querySelector('.language-name').value;
        const proficiency = item.querySelector('.language-proficiency').value;
        
        if (languageName) {
            languages.push({
                name: languageName,
                proficiency
            });
        }
    });
    
    resumeData.languages = languages;
}

// Update interests data
function updateInterestsData() {
    const interestItems = document.querySelectorAll('.interest-item');
    const interests = [];
    
    interestItems.forEach(item => {
        const interestName = item.querySelector('.interest-name').value;
        
        if (interestName) {
            interests.push({
                name: interestName
            });
        }
    });
    
    resumeData.interests = interests;
}

// Create a section editor based on section type
function createSectionEditorContent(sectionName) {
    const editor = document.querySelector('.editor');
    
    if (!editor) return;
    
    // Create section editor container
    const sectionEditor = document.createElement('div');
    sectionEditor.id = `${sectionName}-section`;
    sectionEditor.className = 'section-editor';
    
    // Generate content based on section type
    let content = '';
    
    switch (sectionName) {
        case 'summary':
            content = createSummaryEditor();
            break;
        case 'experience':
            content = createExperienceEditor();
            break;
        case 'education':
            content = createEducationEditor();
            break;
        case 'skills':
            content = createSkillsEditor();
            break;
        case 'projects':
            content = createProjectsEditor();
            break;
        case 'certifications':
            content = createCertificationsEditor();
            break;
        case 'languages':
            content = createLanguagesEditor();
            break;
        case 'interests':
            content = createInterestsEditor();
            break;
        default:
            content = '<p>Section not available</p>';
    }
    
    sectionEditor.innerHTML = content;
    editor.appendChild(sectionEditor);
    
    // Initialize add/remove buttons for the section
    initSectionItemButtons(sectionName);
    
    // Dispatch event that section was created
    document.dispatchEvent(new CustomEvent('sectionCreated', {
        detail: { section: sectionName }
    }));
}

// Create summary editor
function createSummaryEditor() {
    return `
        <h3>Professional Summary</h3>
        <p class="section-description">Write a concise summary of your professional background and key qualifications.</p>
        <div class="form-group">
            <label for="summary-text">Summary</label>
            <textarea id="summary-text" placeholder="e.g., Experienced software developer with 5+ years of expertise in web development and a passion for creating user-friendly applications..."></textarea>
        </div>
    `;
}

// Create experience editor
function createExperienceEditor() {
    return `
        <h3>Work Experience</h3>
        <p class="section-description">Add your work experience, starting with the most recent position.</p>
        <div class="experience-list">
            <div class="experience-item">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="job-title" placeholder="e.g., Senior Software Engineer">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" class="company" placeholder="e.g., Tech Solutions Inc.">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" class="job-location" placeholder="e.g., San Francisco, CA">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="text" class="start-date" placeholder="e.g., Jan 2020">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="text" class="end-date" placeholder="e.g., Present">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="job-description" placeholder="Describe your responsibilities and achievements..."></textarea>
                </div>
                <div class="item-actions">
                    <button class="btn icon-btn remove-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
        <button class="btn secondary-btn add-item" data-section="experience">
            <i class="fas fa-plus"></i> Add Experience
        </button>
    `;
}

// Create education editor
function createEducationEditor() {
    return `
        <h3>Education</h3>
        <p class="section-description">Add your educational background, starting with the highest degree.</p>
        <div class="education-list">
            <div class="education-item">
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" class="degree" placeholder="e.g., Bachelor of Science in Computer Science">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Institution</label>
                        <input type="text" class="institution" placeholder="e.g., University of California">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" class="education-location" placeholder="e.g., Berkeley, CA">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="text" class="education-start-date" placeholder="e.g., Sep 2016">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="text" class="education-end-date" placeholder="e.g., May 2020">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="education-description" placeholder="Describe your achievements, GPA, relevant coursework..."></textarea>
                </div>
                <div class="item-actions">
                    <button class="btn icon-btn remove-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
        <button class="btn secondary-btn add-item" data-section="education">
            <i class="fas fa-plus"></i> Add Education
        </button>
    `;
}

// Create skills editor
function createSkillsEditor() {
    return `
        <h3>Skills</h3>
        <p class="section-description">Add your technical and professional skills.</p>
        <div class="skills-list">
            <div class="skill-item">
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label>Skill</label>
                        <input type="text" class="skill-name" placeholder="e.g., JavaScript">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Level</label>
                        <select class="skill-level">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn icon-btn remove-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
        <button class="btn secondary-btn add-item" data-section="skills">
            <i class="fas fa-plus"></i> Add Skill
        </button>
    `;
}

// Create projects editor
function createProjectsEditor() {
    return `
        <h3>Projects</h3>
        <p class="section-description">Add your notable projects.</p>
        <div class="projects-list">
            <div class="project-item">
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label>Project Name</label>
                        <input type="text" class="project-name" placeholder="e.g., E-commerce Website">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Role</label>
                        <input type="text" class="project-role" placeholder="e.g., Lead Developer">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="text" class="project-start-date" placeholder="e.g., Jan 2021">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="text" class="project-end-date" placeholder="e.g., Mar 2021">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="project-description" placeholder="Describe the project, your role, and technologies used..."></textarea>
                </div>
                <div class="form-group">
                    <label>Link</label>
                    <input type="url" class="project-link" placeholder="e.g., https://github.com/yourusername/project">
                </div>
                <div class="item-actions">
                    <button class="btn icon-btn remove-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
        <button class="btn secondary-btn add-item" data-section="projects">
            <i class="fas fa-plus"></i> Add Project
        </button>
    `;
}

// Create certifications editor
function createCertificationsEditor() {
    return `
        <h3>Certifications</h3>
        <p class="section-description">Add your professional certifications and licenses.</p>
        <div class="certifications-list">
            <div class="certification-item">
                <div class="form-group">
                    <label>Certification Name</label>
                    <input type="text" class="cert-name" placeholder="e.g., AWS Certified Solutions Architect">
                </div>
                <div class="form-group">
                    <label>Issuing Organization</label>
                    <input type="text" class="cert-issuer" placeholder="e.g., Amazon Web Services">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date Earned</label>
                        <input type="text" class="cert-date" placeholder="e.g., May 2021">
                    </div>
                    <div class="form-group">
                        <label>Expiration Date (Optional)</label>
                        <input type="text" class="cert-expiration" placeholder="e.g., May 2024">
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn icon-btn remove-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
        <button class="btn secondary-btn add-item" data-section="certifications">
            <i class="fas fa-plus"></i> Add Certification
        </button>
    `;
}

// Create languages editor
function createLanguagesEditor() {
    return `
        <h3>Languages</h3>
        <p class="section-description">Add languages you speak and your proficiency level.</p>
        <div class="languages-list">
            <div class="language-item">
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label>Language</label>
                        <input type="text" class="language-name" placeholder="e.g., Spanish">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Proficiency</label>
                        <select class="language-proficiency">
                            <option value="Elementary">Elementary</option>
                            <option value="Limited Working">Limited Working</option>
                            <option value="Professional Working">Professional Working</option>
                            <option value="Full Professional">Full Professional</option>
                            <option value="Native/Bilingual">Native/Bilingual</option>
                        </select>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn icon-btn remove-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
        <button class="btn secondary-btn add-item" data-section="languages">
            <i class="fas fa-plus"></i> Add Language
        </button>
    `;
}

// Create interests editor
function createInterestsEditor() {
    return `
        <h3>Interests</h3>
        <p class="section-description">Add your personal interests and hobbies.</p>
        <div class="interests-list">
            <div class="interest-item">
                <div class="form-group">
                    <label>Interest</label>
                    <input type="text" class="interest-name" placeholder="e.g., Photography">
                </div>
                <div class="item-actions">
                    <button class="btn icon-btn remove-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
        <button class="btn secondary-btn add-item" data-section="interests">
            <i class="fas fa-plus"></i> Add Interest
        </button>
    `;
}

// Initialize add/remove buttons for section items
function initSectionItemButtons(sectionName) {
    // Add item button
    const addButton = document.querySelector(`.add-item[data-section="${sectionName}"]`);
    if (addButton) {
        addButton.addEventListener('click', function() {
            addSectionItem(sectionName);
        });
    }
    
    // Remove item buttons
    const removeButtons = document.querySelectorAll(`#${sectionName}-section .remove-item`);
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest(`.${sectionName}-item`);
            if (item) {
                item.remove();
                updateSectionData(sectionName);
            }
        });
    });
}

// Modify addSectionItem function to handle skills specifically
function addSectionItem(sectionName) {
    const listContainer = document.querySelector(`.${sectionName}-list`);
    if (!listContainer) return;
    
    const firstItem = listContainer.querySelector(`.${sectionName}-item`);
    if (!firstItem) return;
    
    const newItem = firstItem.cloneNode(true);
    
    // Clear input values
    const inputs = newItem.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.value = '';
        if (input.classList.contains('skill-level')) {
            input.value = 'Beginner'; // Set default skill level
        }
    });
    
    // Add event listener to remove button
    const removeButton = newItem.querySelector('.remove-item');
    if (removeButton) {
        removeButton.addEventListener('click', function() {
            newItem.remove();
            updateSectionData(sectionName);
        });
    }
    
    // Add specific event listeners for skills section
    if (sectionName === 'skills') {
        const skillName = newItem.querySelector('.skill-name');
        const skillLevel = newItem.querySelector('.skill-level');
        
        if (skillName) {
            skillName.addEventListener('input', () => updateSkillsData());
            skillName.addEventListener('blur', () => updateSkillsData());
        }
        
        if (skillLevel) {
            skillLevel.addEventListener('change', () => updateSkillsData());
        }
    } else {
        // Regular event listeners for other sections
        const textInputs = newItem.querySelectorAll('input, textarea');
        textInputs.forEach(input => {
            input.addEventListener('input', () => updateSectionData(sectionName));
            input.addEventListener('blur', () => updateSectionData(sectionName));
            
            if (input.tagName.toLowerCase() === 'textarea') {
                input.addEventListener('keyup', () => updateSectionData(sectionName));
            }
        });
        
        const selects = newItem.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', () => updateSectionData(sectionName));
        });
    }
    
    // Add the new item to the list
    listContainer.appendChild(newItem);
    
    // Update the section data
    updateSectionData(sectionName);
}

// Setup drag and drop for sections
function setupDragAndDrop() {
    const sectionsList = document.getElementById('sections-list');
    if (!sectionsList) return;
    
    // Make sections draggable
    const sectionItems = sectionsList.querySelectorAll('li');
    sectionItems.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-section'));
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Handle drop events
    sectionsList.addEventListener('dragover', function(e) {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (!draggingItem) return;
        
        const afterElement = getDragAfterElement(sectionsList, e.clientY);
        if (afterElement) {
            sectionsList.insertBefore(draggingItem, afterElement);
        } else {
            sectionsList.appendChild(draggingItem);
        }
    });
    
    sectionsList.addEventListener('drop', function(e) {
        e.preventDefault();
        // Update the order of sections in the resume data
        updateSectionsOrder();
    });
}

// Helper function for drag and drop
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Update the order of sections in the resume data
function updateSectionsOrder() {
    const sectionItems = document.querySelectorAll('#sections-list li');
    const sectionsOrder = [];
    
    sectionItems.forEach(item => {
        sectionsOrder.push(item.getAttribute('data-section'));
    });
    
    resumeData.sectionsOrder = sectionsOrder;
    saveResumeData();
    updateResumePreview();
}

// Show modal for adding a new section
function showSectionSelectionModal() {
    // This would be implemented with a custom modal
    // For now, we'll just add a default section (interests)
    const sectionsList = document.getElementById('sections-list');
    if (!sectionsList) return;
    
    // Check if interests section already exists
    const interestsItem = sectionsList.querySelector('[data-section="interests"]');
    if (!interestsItem) {
        const newItem = document.createElement('li');
        newItem.setAttribute('data-section', 'interests');
        newItem.innerHTML = '<i class="fas fa-heart"></i> Interests';
        
        newItem.addEventListener('click', function() {
            sectionsList.querySelectorAll('li').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            showSectionEditor('interests');
        });
        
        sectionsList.appendChild(newItem);
    }
}

// Save resume data to local storage
function saveResumeData() {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

// Load resume data from local storage
function loadSavedResumeData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        resumeData = JSON.parse(savedData);
        
        // Populate form fields with saved data
        populateFormFields();
    }
}

// Populate form fields with saved data
function populateFormFields() {
    // Populate personal info
    if (resumeData.personal) {
        const fullNameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const locationInput = document.getElementById('location');
        const websiteInput = document.getElementById('website');
        
        if (fullNameInput) fullNameInput.value = resumeData.personal.fullName || '';
        if (emailInput) emailInput.value = resumeData.personal.email || '';
        if (phoneInput) phoneInput.value = resumeData.personal.phone || '';
        if (locationInput) locationInput.value = resumeData.personal.location || '';
        if (websiteInput) websiteInput.value = resumeData.personal.website || '';
    }
    
    // Other sections will be populated when they are created
}

// Get the current resume data
function getResumeData() {
    return resumeData;
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Update resume preview with the current data
const debouncedPreviewUpdate = debounce(() => {
    if (window.renderResumePreview) {
        window.renderResumePreview();
    }
}, 100); // 100ms debounce time

function updateResumePreview() {
    // Call the renderResumePreview function from preview.js
    debouncedPreviewUpdate();
} 
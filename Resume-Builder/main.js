// Main JavaScript file for the Resume Builder application

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initMobileMenu();
    initTemplateSelector();
    initSectionNavigation();
    initPreviewActions();
    initDownloadModal();
    initAnimations();
    
    // Load resume data from local storage if available
    loadResumeData();
    
    // Initialize the first preview
    updateResumePreview();
    
    // Handle navigation indicator
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    const navIndicator = document.querySelector('.nav-indicator');
    
    // Initialize nav indicator
    if (navIndicator && navItems.length > 0) {
        const firstItem = navItems[0];
        navIndicator.style.width = `${firstItem.offsetWidth}px`;
        navIndicator.style.left = `${firstItem.offsetLeft}px`;
    }
    
    // Update nav indicator on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
                if (navIndicator) {
                    navIndicator.style.width = `${item.offsetWidth}px`;
                    navIndicator.style.left = `${item.offsetLeft}px`;
                }
            }
        });
    });
    
    // Smooth scroll for navigation links
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Logo click handler
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Handle navigation and scrolling
function initNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .footer-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Update active nav link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Start building button scrolls to builder section
    const startBuildingBtn = document.getElementById('start-building');
    if (startBuildingBtn) {
        startBuildingBtn.addEventListener('click', function() {
            const builderSection = document.getElementById('builder');
            if (builderSection) {
                builderSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Handle template selection
function initTemplateSelector() {
    const templateOptions = document.querySelectorAll('.template-option');
    templateOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            templateOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get selected template
            const selectedTemplate = this.getAttribute('data-template');
            
            // Update resume preview with selected template
            updateResumeTemplate(selectedTemplate);
        });
    });
}

// Handle section navigation
function initSectionNavigation() {
    const sectionItems = document.querySelectorAll('#sections-list li');
    const addSectionBtn = document.getElementById('add-section');
    
    // Handle section navigation clicks
    sectionItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sectionItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get selected section
            const selectedSection = this.getAttribute('data-section');
            
            // Show the corresponding section editor
            showSectionEditor(selectedSection);
        });
    });
    
    // Handle add section button
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', function() {
            showAddSectionModal();
        });
    }
    
    // Show the first section by default (personal info)
    showSectionEditor('personal');
}

// Show the editor for a specific section
function showSectionEditor(sectionName) {
    // Hide all section editors
    const sectionEditors = document.querySelectorAll('.section-editor');
    sectionEditors.forEach(editor => {
        editor.style.display = 'none';
    });
    
    // Show the selected section editor
    const selectedEditor = document.getElementById(`${sectionName}-section`);
    if (selectedEditor) {
        selectedEditor.style.display = 'block';
    } else {
        // If the section editor doesn't exist yet, create it
        createSectionEditor(sectionName);
    }
}

// Create a new section editor dynamically
function createSectionEditor(sectionName) {
    // This function will be implemented in builder.js
    // It will create the appropriate form fields based on the section type
    if (window.createSectionEditorContent) {
        window.createSectionEditorContent(sectionName);
    }
}

// Initialize preview actions (zoom, download)
function initPreviewActions() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const downloadBtn = document.getElementById('download-btn');
    const resumePreview = document.getElementById('resume-preview');
    
    let currentZoom = 1;
    
    // Zoom in button
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            if (currentZoom < 1.5) {
                currentZoom += 0.1;
                resumePreview.style.transform = `scale(${currentZoom})`;
            }
        });
    }
    
    // Zoom out button
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            if (currentZoom > 0.5) {
                currentZoom -= 0.1;
                resumePreview.style.transform = `scale(${currentZoom})`;
            }
        });
    }
    
    // Download button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            openDownloadModal();
        });
    }
}

// Initialize download modal
function initDownloadModal() {
    const modal = document.getElementById('download-modal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-download');
    const confirmBtn = document.getElementById('confirm-download');
    const downloadOptions = document.querySelectorAll('.download-option');
    
    let selectedFormat = 'pdf';
    
    // Handle download option selection
    downloadOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            downloadOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Get selected format
            selectedFormat = this.getAttribute('data-format');
        });
    });
    
    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeDownloadModal();
        });
    }
    
    // Close modal when clicking the cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeDownloadModal();
        });
    }
    
    // Handle download confirmation
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            downloadResume(selectedFormat);
            closeDownloadModal();
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeDownloadModal();
        }
    });
}

// Open download modal
function openDownloadModal() {
    const modal = document.getElementById('download-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close download modal
function closeDownloadModal() {
    const modal = document.getElementById('download-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Download resume in the specified format
function downloadResume(format) {
    // This function will be implemented in export.js
    if (window.exportResume) {
        window.exportResume(format);
    }
}

// Update resume preview with the current data
function updateResumePreview() {
    // This function will be implemented in preview.js
    if (window.renderResumePreview) {
        // Clear any existing timeout to prevent multiple calls
        if (window.previewUpdateTimeout) {
            clearTimeout(window.previewUpdateTimeout);
        }
        
        // Set a small timeout to ensure all DOM updates are processed
        window.previewUpdateTimeout = setTimeout(() => {
            window.renderResumePreview();
        }, 50);
    }
}

// Update resume template
function updateResumeTemplate(templateName) {
    // This function will be implemented in templates.js
    if (window.applyResumeTemplate) {
        window.applyResumeTemplate(templateName);
    }
}

// Load resume data from local storage
function loadResumeData() {
    // This function will be implemented in builder.js
    if (window.loadSavedResumeData) {
        window.loadSavedResumeData();
    }
}

// Show modal for adding a new section
function showAddSectionModal() {
    // This function will be implemented in builder.js
    if (window.showSectionSelectionModal) {
        window.showSectionSelectionModal();
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a nav item
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !event.target.closest('#mobile-menu-toggle') && 
            !event.target.closest('#nav-links') && 
            document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
        }
    });
}

// Initialize animations
function initAnimations() {
    // Animate score circle when visible
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scoreValue = parseInt(document.getElementById('score-value').textContent);
                    animateScoreCircle(scoreValue);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(scoreCircle);
    }
    
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.analyzer-upload, .analyzer-results, .template-card, .tip-card');
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                elementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => elementObserver.observe(el));
}

// Animate score circle
function animateScoreCircle(score) {
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        scoreCircle.style.background = `conic-gradient(
            var(--primary-color) 0%, 
            var(--accent-color) ${score / 2}%, 
            var(--background-light) ${score}%
        )`;
    }
} 
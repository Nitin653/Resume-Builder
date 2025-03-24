// Resume Export - Handles exporting the resume in different formats

// Initialize export module
document.addEventListener('DOMContentLoaded', function() {
    // Expose functions to window for access from other modules
    window.exportResume = exportResume;
});

// Export resume in the specified format
function exportResume(format) {
    // Get resume data
    let resumeData = { personal: { fullName: 'Your Name' } };
    if (window.getResumeData) {
        resumeData = window.getResumeData();
    }
    
    // Generate filename based on user's name
    const name = resumeData.personal.fullName || 'Resume';
    const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `${sanitizedName}_resume_${timestamp}`;
    
    // Export based on format
    switch (format) {
        case 'pdf':
            exportAsPDF(filename);
            break;
        case 'docx':
            exportAsDocx(filename);
            break;
        case 'txt':
            exportAsText(filename);
            break;
        default:
            exportAsPDF(filename);
    }
}

// Export resume as PDF
function exportAsPDF(filename) {
    // Show loading indicator
    showExportLoading('Generating PDF...');
    
    // Get the resume preview element
    const resumePreview = document.getElementById('resume-preview');
    if (!resumePreview) {
        hideExportLoading();
        showExportError('Resume preview not found');
        return;
    }
    
    // Use html2canvas and jsPDF to generate PDF
    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
        hideExportLoading();
        showExportError('PDF generation libraries not loaded');
        return;
    }
    
    // Create a clone of the resume preview to avoid modifying the original
    const clone = resumePreview.cloneNode(true);
    clone.style.transform = 'scale(1)'; // Reset any zoom
    
    // Temporarily append the clone to the document
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);
    
    // Calculate dimensions (A4 size)
    const a4Width = 210; // mm
    const a4Height = 297; // mm
    const pdfWidth = a4Width;
    const pdfHeight = a4Height;
    
    // Generate PDF
    html2canvas(clone, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
    }).then(canvas => {
        // Remove the clone
        document.body.removeChild(clone);
        
        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Calculate dimensions to fit the page
        const imgWidth = pdfWidth;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // If the resume is longer than one page, add more pages
        if (imgHeight > pdfHeight) {
            let remainingHeight = imgHeight;
            let currentPosition = -pdfHeight;
            
            while (remainingHeight > pdfHeight) {
                pdf.addPage();
                currentPosition -= pdfHeight;
                pdf.addImage(imgData, 'PNG', 0, currentPosition, imgWidth, imgHeight);
                remainingHeight -= pdfHeight;
            }
        }
        
        // Save the PDF
        pdf.save(`${filename}.pdf`);
        
        // Hide loading indicator
        hideExportLoading();
        
        // Show success message
        showExportSuccess('PDF downloaded successfully');
    }).catch(error => {
        console.error('Error generating PDF:', error);
        hideExportLoading();
        showExportError('Error generating PDF');
    });
}

// Export resume as DOCX
function exportAsDocx(filename) {
    // For simplicity, we'll use a basic approach to generate a Word-like document
    // In a production environment, you might want to use a library like docx.js
    
    // Show loading indicator
    showExportLoading('Generating Word document...');
    
    // Get resume data
    let resumeData = {};
    if (window.getResumeData) {
        resumeData = window.getResumeData();
    }
    
    // Create a simple HTML representation
    let docContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:w="urn:schemas-microsoft-com:office:word" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <title>${resumeData.personal?.fullName || 'Resume'}</title>
            <style>
                body {
                    font-family: 'Calibri', sans-serif;
                    font-size: 12pt;
                    line-height: 1.5;
                }
                h1 {
                    font-size: 18pt;
                    text-align: center;
                    margin-bottom: 10pt;
                }
                h2 {
                    font-size: 14pt;
                    border-bottom: 1pt solid #999;
                    margin-top: 15pt;
                    margin-bottom: 10pt;
                }
                .contact-info {
                    text-align: center;
                    margin-bottom: 15pt;
                }
                .item {
                    margin-bottom: 10pt;
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                }
                .item-title {
                    font-weight: bold;
                }
                .item-subtitle {
                    color: #666;
                }
                .item-date {
                    color: #666;
                }
                .skills-list {
                    display: flex;
                    flex-wrap: wrap;
                }
                .skill-item {
                    margin-right: 10pt;
                }
            </style>
        </head>
        <body>
    `;
    
    // Add personal information
    docContent += `
        <h1>${resumeData.personal?.fullName || 'Your Name'}</h1>
        <div class="contact-info">
            ${resumeData.personal?.email ? `${resumeData.personal.email} | ` : ''}
            ${resumeData.personal?.phone ? `${resumeData.personal.phone} | ` : ''}
            ${resumeData.personal?.location ? `${resumeData.personal.location} | ` : ''}
            ${resumeData.personal?.website ? `${resumeData.personal.website}` : ''}
        </div>
    `;
    
    // Add summary if available
    if (resumeData.summary) {
        docContent += `
            <h2>Professional Summary</h2>
            <p>${resumeData.summary}</p>
        `;
    }
    
    // Add experience if available
    if (resumeData.experience && resumeData.experience.length > 0) {
        docContent += `<h2>Work Experience</h2>`;
        
        resumeData.experience.forEach(exp => {
            docContent += `
                <div class="item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${exp.jobTitle || 'Job Title'}</div>
                            <div class="item-subtitle">${exp.company || 'Company'} ${exp.location ? `- ${exp.location}` : ''}</div>
                        </div>
                        <div class="item-date">${exp.startDate || 'Start Date'} - ${exp.endDate || 'Present'}</div>
                    </div>
                    <div>${exp.description || ''}</div>
                </div>
            `;
        });
    }
    
    // Add education if available
    if (resumeData.education && resumeData.education.length > 0) {
        docContent += `<h2>Education</h2>`;
        
        resumeData.education.forEach(edu => {
            docContent += `
                <div class="item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${edu.degree || 'Degree'}</div>
                            <div class="item-subtitle">${edu.institution || 'Institution'} ${edu.location ? `- ${edu.location}` : ''}</div>
                        </div>
                        <div class="item-date">${edu.startDate || 'Start Date'} - ${edu.endDate || 'End Date'}</div>
                    </div>
                    <div>${edu.description || ''}</div>
                </div>
            `;
        });
    }
    
    // Add skills if available
    if (resumeData.skills && resumeData.skills.length > 0) {
        docContent += `
            <h2>Skills</h2>
            <div class="skills-list">
        `;
        
        resumeData.skills.forEach(skill => {
            docContent += `
                <div class="skill-item">${skill.name} ${skill.level ? `(${skill.level})` : ''}</div>
            `;
        });
        
        docContent += `</div>`;
    }
    
    // Add other sections as needed...
    
    // Close the document
    docContent += `
        </body>
        </html>
    `;
    
    // Create a Blob with the content
    const blob = new Blob([docContent], { type: 'application/msword' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.doc`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Hide loading indicator
    hideExportLoading();
    
    // Show success message
    showExportSuccess('Word document downloaded successfully');
}

// Export resume as plain text
function exportAsText(filename) {
    // Show loading indicator
    showExportLoading('Generating text file...');
    
    // Get resume data
    let resumeData = {};
    if (window.getResumeData) {
        resumeData = window.getResumeData();
    }
    
    // Create text content
    let textContent = '';
    
    // Add personal information
    textContent += `${resumeData.personal?.fullName || 'YOUR NAME'}\n`;
    
    if (resumeData.personal) {
        const contactInfo = [
            resumeData.personal.email,
            resumeData.personal.phone,
            resumeData.personal.location,
            resumeData.personal.website
        ].filter(Boolean).join(' | ');
        
        if (contactInfo) {
            textContent += `${contactInfo}\n`;
        }
    }
    
    textContent += '\n';
    
    // Add summary if available
    if (resumeData.summary) {
        textContent += 'PROFESSIONAL SUMMARY\n';
        textContent += '-------------------\n';
        textContent += `${resumeData.summary}\n\n`;
    }
    
    // Add experience if available
    if (resumeData.experience && resumeData.experience.length > 0) {
        textContent += 'WORK EXPERIENCE\n';
        textContent += '--------------\n';
        
        resumeData.experience.forEach(exp => {
            textContent += `${exp.jobTitle || 'Job Title'} at ${exp.company || 'Company'}`;
            if (exp.location) textContent += `, ${exp.location}`;
            textContent += '\n';
            
            if (exp.startDate || exp.endDate) {
                textContent += `${exp.startDate || 'Start Date'} - ${exp.endDate || 'Present'}\n`;
            }
            
            if (exp.description) {
                textContent += `${exp.description}\n`;
            }
            
            textContent += '\n';
        });
    }
    
    // Add education if available
    if (resumeData.education && resumeData.education.length > 0) {
        textContent += 'EDUCATION\n';
        textContent += '---------\n';
        
        resumeData.education.forEach(edu => {
            textContent += `${edu.degree || 'Degree'} from ${edu.institution || 'Institution'}`;
            if (edu.location) textContent += `, ${edu.location}`;
            textContent += '\n';
            
            if (edu.startDate || edu.endDate) {
                textContent += `${edu.startDate || 'Start Date'} - ${edu.endDate || 'End Date'}\n`;
            }
            
            if (edu.description) {
                textContent += `${edu.description}\n`;
            }
            
            textContent += '\n';
        });
    }
    
    // Add skills if available
    if (resumeData.skills && resumeData.skills.length > 0) {
        textContent += 'SKILLS\n';
        textContent += '------\n';
        
        const skillsText = resumeData.skills.map(skill => 
            `${skill.name}${skill.level ? ` (${skill.level})` : ''}`
        ).join(', ');
        
        textContent += `${skillsText}\n\n`;
    }
    
    // Add other sections as needed...
    
    // Create a Blob with the content
    const blob = new Blob([textContent], { type: 'text/plain' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Hide loading indicator
    hideExportLoading();
    
    // Show success message
    showExportSuccess('Text file downloaded successfully');
}

// Show loading indicator
function showExportLoading(message) {
    // Check if loading element already exists
    let loadingElement = document.getElementById('export-loading');
    
    if (!loadingElement) {
        // Create loading element
        loadingElement = document.createElement('div');
        loadingElement.id = 'export-loading';
        loadingElement.className = 'export-notification loading';
        loadingElement.innerHTML = `
            <div class="spinner"></div>
            <span id="export-loading-message">${message || 'Exporting...'}</span>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .export-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 4px;
                background-color: white;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                display: flex;
                align-items: center;
                animation: fadeIn 0.3s;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .export-notification.loading {
                background-color: #f8f9fa;
            }
            
            .export-notification.success {
                background-color: #d4edda;
                color: #155724;
            }
            
            .export-notification.error {
                background-color: #f8d7da;
                color: #721c24;
            }
            
            .spinner {
                width: 20px;
                height: 20px;
                border: 3px solid #ddd;
                border-top: 3px solid #3498db;
                border-radius: 50%;
                margin-right: 10px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loadingElement);
    } else {
        // Update message
        const messageElement = document.getElementById('export-loading-message');
        if (messageElement) {
            messageElement.textContent = message || 'Exporting...';
        }
        
        // Show the loading element
        loadingElement.style.display = 'flex';
    }
}

// Hide loading indicator
function hideExportLoading() {
    const loadingElement = document.getElementById('export-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Show success message
function showExportSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'export-notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show error message
function showExportError(message) {
    const notification = document.createElement('div');
    notification.className = 'export-notification error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle" style="margin-right: 10px;"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 
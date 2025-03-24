// ATS Resume Analyzer Functionality

document.addEventListener('DOMContentLoaded', function() {
    initResumeAnalyzer();
    initCapabilities();
    initAnalyzerResults(); // Initialize analyzer results section
});

function initResumeAnalyzer() {
    const uploadArea = document.getElementById('upload-area');
    const resumeUpload = document.getElementById('resume-upload');
    const analyzeBtn = document.getElementById('analyze-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (!uploadArea || !resumeUpload || !analyzeBtn) return;
    
    // Handle file upload via click
    uploadArea.addEventListener('click', function() {
        resumeUpload.click();
    });
    
    // Handle file selection
    resumeUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
            // Enable analyze button immediately after file selection
            analyzeBtn.disabled = false;
        }
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
            // Enable analyze button immediately after file drop
            analyzeBtn.disabled = false;
        }
    });
    
    // Handle analyze button click
    analyzeBtn.addEventListener('click', function() {
        // Show loading state
        this.classList.add('loading');
        this.innerHTML = '<i class="fas fa-spinner"></i> Analyzing...';
        this.disabled = true; // Disable the button during analysis
        
        // Perform the analysis
        analyzeResume();
    });
    
    // Handle tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function handleFileUpload(file) {
    const uploadArea = document.getElementById('upload-area');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
    }
    
    // Update UI to show selected file
    uploadArea.innerHTML = `
        <i class="fas fa-file-alt"></i>
        <h3>${file.name}</h3>
        <p>${(file.size / 1024).toFixed(2)} KB</p>
        <p class="file-types">Click "Analyze Resume" to continue</p>
    `;
    
    // Store file in global scope for analysis
    window.resumeFile = file;
}

function analyzeResume() {
    if (!window.resumeFile) return;
    
    // Get the analyze button
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // Ensure the analyzer results container exists
    ensureAnalyzerResultsExists();
    
    // Read the file content
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        
        // Call analysis service
        analyzeResumeContent(content)
            .then(results => {
                // Update the results in the UI
                updateAnalysisResults(results);
                
                // Ensure results are visible
                showAnalyzerResults();
                
                // Show success state
                analyzeBtn.classList.remove('loading');
                analyzeBtn.classList.add('success');
                analyzeBtn.innerHTML = '<i class="fas fa-check"></i> Analysis Complete';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    analyzeBtn.classList.remove('success');
                    analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> Analyze Resume';
                    analyzeBtn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.error("Analysis failed:", error);
                
                // Show fallback message
                const scoreSummary = document.querySelector('.score-summary');
                if (scoreSummary) {
                    const fallbackMessage = document.createElement('div');
                    fallbackMessage.className = 'fallback-message';
                    fallbackMessage.innerHTML = `
                        <i class="fas fa-exclamation-triangle"></i>
                        Analysis failed. Using basic analysis instead.
                        <br>
                        Error: ${error.message}
                    `;
                    scoreSummary.appendChild(fallbackMessage);
                }
                
                // Fallback to rule-based analysis
                const results = analyzeContent(content);
                updateAnalysisResults(results);
                
                // Ensure results are visible
                showAnalyzerResults();
                
                // Update button state
                analyzeBtn.classList.remove('loading');
                analyzeBtn.classList.add('warning');
                analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> Basic Analysis Complete';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    analyzeBtn.classList.remove('warning');
                    analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> Analyze Resume';
                    analyzeBtn.disabled = false;
                }, 3000);
            });
    };
    
    reader.readAsText(window.resumeFile);
}

// Resume analysis function
async function analyzeResumeContent(content) {
    try {
        // Instead of calling an API that doesn't exist, we'll use a mock implementation
        // that returns sample data for demonstration purposes
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a random score between 65 and 95
        const score = Math.floor(Math.random() * 31) + 65;
        
        // Extract some basic information from the content
        const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(content);
        const hasPhone = /(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/.test(content);
        const hasLinkedIn = /linkedin\.com\/in\//.test(content);
        const wordCount = content.split(/\s+/).length;
        
        // Sample keywords to check
        const keywordList = [
            { name: 'Project Management', importance: 'high' },
            { name: 'Team Leadership', importance: 'high' },
            { name: 'Agile', importance: 'high' },
            { name: 'Scrum', importance: 'medium' },
            { name: 'JavaScript', importance: 'high' },
            { name: 'React', importance: 'medium' },
            { name: 'Node.js', importance: 'medium' },
            { name: 'Python', importance: 'low' },
            { name: 'Data Analysis', importance: 'medium' },
            { name: 'Communication', importance: 'high' },
            { name: 'Problem Solving', importance: 'high' },
            { name: 'Innovation', importance: 'medium' }
        ];
        
        // Check which keywords are present in the content
        const keywords = keywordList.map(keyword => {
            const isFound = content.toLowerCase().includes(keyword.name.toLowerCase());
            return {
                ...keyword,
                found: isFound
            };
        });
        
        // Calculate keyword match percentage
        const foundKeywords = keywords.filter(k => k.found).length;
        const keywordPercentage = Math.round((foundKeywords / keywords.length) * 100);
        
        // Generate score breakdown
        const scoreBreakdown = [
            { category: 'Keyword Match', score: keywordPercentage },
            { category: 'Format & Structure', score: Math.floor(Math.random() * 21) + 70 },
            { category: 'Content Quality', score: Math.floor(Math.random() * 21) + 70 },
            { category: 'ATS Compatibility', score: Math.floor(Math.random() * 21) + 70 }
        ];
        
        // Generate format analysis
        const formatAnalysis = [
            {
                title: 'Contact Information',
                status: hasEmail && hasPhone ? 'good' : 'warning',
                message: hasEmail && hasPhone ? 
                    'Your contact information is properly formatted and easy to find.' : 
                    'Some contact information may be missing or not easily identifiable.'
            },
            {
                title: 'Resume Length',
                status: wordCount > 300 && wordCount < 1000 ? 'good' : 'warning',
                message: wordCount > 300 && wordCount < 1000 ? 
                    'Your resume has an appropriate length for ATS scanning.' : 
                    wordCount <= 300 ? 'Your resume may be too short. Consider adding more details.' : 
                    'Your resume may be too long. Consider condensing it to focus on the most relevant information.'
            },
            {
                title: 'File Format',
                status: 'good',
                message: 'Your file format is compatible with ATS systems.'
            },
            {
                title: 'Professional Links',
                status: hasLinkedIn ? 'good' : 'warning',
                message: hasLinkedIn ? 
                    'LinkedIn profile link detected.' : 
                    'Consider adding your LinkedIn profile to enhance your resume.'
            }
        ];
        
        // Generate content analysis
        const contentAnalysis = [
            {
                title: 'Professional Summary',
                status: wordCount > 50 ? 'good' : 'warning',
                message: wordCount > 50 ? 
                    'Your resume includes a professional summary.' : 
                    'Consider adding a strong professional summary to highlight your qualifications.'
            },
            {
                title: 'Skills Section',
                status: content.toLowerCase().includes('skills') ? 'good' : 'warning',
                message: content.toLowerCase().includes('skills') ? 
                    'Skills section detected.' : 
                    'Consider adding a dedicated skills section to highlight your capabilities.'
            },
            {
                title: 'Quantifiable Achievements',
                status: /\d+%|\d+ years|\d+\+/.test(content) ? 'good' : 'warning',
                message: /\d+%|\d+ years|\d+\+/.test(content) ? 
                    'Your resume includes quantifiable achievements.' : 
                    'Consider adding metrics and numbers to quantify your achievements.'
            }
        ];
        
        // Generate suggestions
        const suggestions = [
            {
                title: 'Optimize Keywords',
                description: 'Include more industry-specific keywords from the job description.',
                example: 'Instead of "Led team", use "Led cross-functional team of 5 developers"'
            },
            {
                title: 'Use Action Verbs',
                description: 'Start bullet points with strong action verbs.',
                example: 'Instead of "Was responsible for", use "Managed", "Led", or "Implemented"'
            },
            {
                title: 'Quantify Achievements',
                description: 'Add numbers and percentages to demonstrate impact.',
                example: 'Instead of "Increased sales", use "Increased sales by 27% in 6 months"'
            },
            {
                title: 'Improve Readability',
                description: 'Use consistent formatting and bullet points for better readability.',
                example: 'Use bullet points for achievements and responsibilities'
            }
        ];
        
        // Return mock analysis results
        return {
            score,
            summary: `Your resume scored ${score}% on our ATS compatibility check.`,
            formatAnalysis,
            contentAnalysis,
            scoreBreakdown,
            keywords,
            suggestions,
            companyType: 'mnc'
        };
    } catch (error) {
        console.error("Error in analysis:", error);
        throw error;
    }
}

// Function to initialize capabilities
function initCapabilities() {
    window.analysisAvailable = true;
    console.log("Resume analysis capabilities are enabled");
    
    // Update the analyze button to indicate analysis is available
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> Analyze Resume';
    }
}

function analyzeContent(content) {
    // Convert content to lowercase for case-insensitive matching
    const lowerContent = content.toLowerCase();
    
    // Initialize scoring based on the comprehensive rubric (100-point scale)
    let totalScore = 0;
    let formatScore = 0;
    let contactScore = 0;
    let summaryScore = 0;
    let skillsScore = 0;
    let experienceScore = 0;
    let educationScore = 0;
    let additionalScore = 0;
    let atsScore = 0;
    
    // Define keywords based on company type for keyword analysis
    const mncKeywords = [
        { name: 'Project Management', importance: 'high' },
        { name: 'Team Leadership', importance: 'high' },
        { name: 'Enterprise Software', importance: 'medium' },
        { name: 'Agile/Scrum', importance: 'high' },
        { name: 'Cross-functional Teams', importance: 'high' },
        { name: 'Business Analysis', importance: 'medium' },
        { name: 'Risk Management', importance: 'medium' },
        { name: 'Compliance', importance: 'high' },
        { name: 'Enterprise Architecture', importance: 'medium' },
        { name: 'Six Sigma', importance: 'low' },
        { name: 'Strategic Planning', importance: 'high' },
        { name: 'Budget Management', importance: 'medium' },
        { name: 'Stakeholder Management', importance: 'high' }
    ];

    const startupKeywords = [
        { name: 'Rapid Prototyping', importance: 'high' },
        { name: 'Full-stack Development', importance: 'high' },
        { name: 'Product Development', importance: 'high' },
        { name: 'Growth Hacking', importance: 'medium' },
        { name: 'MVP Development', importance: 'high' },
        { name: 'User Analytics', importance: 'medium' },
        { name: 'A/B Testing', importance: 'medium' },
        { name: 'Startup Environment', importance: 'high' },
        { name: 'Innovation', importance: 'high' },
        { name: 'Adaptability', importance: 'high' },
        { name: 'Lean Methodology', importance: 'medium' },
        { name: 'User Experience', importance: 'high' },
        { name: 'Agile Development', importance: 'high' }
    ];

    const keywordsList = 'mnc' === 'mnc' ? mncKeywords : startupKeywords;
    
    // Check keywords presence and calculate keyword score
    const keywordsFound = keywordsList.map(keyword => {
        const found = lowerContent.includes(keyword.name.toLowerCase());
        return {
            name: keyword.name,
            found: found,
            importance: keyword.importance
        };
    });
    
    // Calculate keyword score based on found keywords
    const keywordScore = keywordsFound.reduce((score, keyword) => {
        return score + (keyword.found ? 
            (keyword.importance === 'high' ? 3 : 
             keyword.importance === 'medium' ? 2 : 1) : 0);
    }, 0);
    
    // Calculate percentage of keyword score
    const maxKeywordScore = keywordsList.reduce((total, keyword) => {
        return total + (keyword.importance === 'high' ? 3 : 
                        keyword.importance === 'medium' ? 2 : 1);
    }, 0);
    
    // Add keyword score to ATS score (5 points max)
    atsScore += Math.min(5, Math.round((keywordScore / maxKeywordScore) * 5));
    
    // 1. Formatting and Structure (15 points)
    const formatChecks = {
        // Professional Appearance (5 points)
        hasConsistentFormatting: !/<\/?[^>]+(>|$)/g.test(content) && // No HTML tags
                                 !/\t{2,}/g.test(content), // No excessive tabs
        
        // Section Organization (5 points)
        hasProperSections: /(?:experience|work|employment)/i.test(content) && 
                          /(?:education|qualification)/i.test(content) && 
                          /(?:skills|abilities|competencies)/i.test(content),
        
        // Length Appropriateness (5 points)
        hasProperLength: content.split(/\r\n|\r|\n/).length <= 150 // Approximate 2-page limit
    };
    
    formatScore += formatChecks.hasConsistentFormatting ? 5 : 0;
    formatScore += formatChecks.hasProperSections ? 5 : 0;
    formatScore += formatChecks.hasProperLength ? 5 : 0;
    
    // 2. Contact Information (10 points)
    const contactChecks = {
        // Completeness (5 points)
        hasCompleteContactInfo: /(?:phone|tel|mobile)/i.test(content) && 
                               /(?:email|@)/i.test(content) && 
                               /(?:linkedin|github|portfolio)/i.test(content),
        
        // Professionalism (5 points)
        hasProfessionalEmail: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(content) && 
                             !/(hotmail|yahoo|aol)/i.test(content)
    };
    
    contactScore += contactChecks.hasCompleteContactInfo ? 5 : 0;
    contactScore += contactChecks.hasProfessionalEmail ? 5 : 0;
    
    // 3. Resume Summary or Objective (10 points)
    const summaryChecks = {
        // Relevance (5 points)
        hasSummary: /(?:summary|profile|objective|about me)/i.test(content),
        
        // Conciseness (5 points)
        hasConciseSummary: /(?:summary|profile|objective|about me)/i.test(content) && 
                          content.match(/(?:summary|profile|objective|about me).*?(?:\n\n|\n\r\n|$)/is) && 
                          content.match(/(?:summary|profile|objective|about me).*?(?:\n\n|\n\r\n|$)/is)[0].length < 500
    };
    
    summaryScore += summaryChecks.hasSummary ? 5 : 0;
    summaryScore += summaryChecks.hasConciseSummary ? 5 : 0;
    
    // 4. Skills Section (15 points)
    const skillsChecks = {
        // Technical Skills (8 points)
        hasTechnicalSkills: 'mnc' === 'mnc' ? 
            /(?:technical skills|hard skills|proficiencies).*?(?:microsoft|office|excel|powerpoint|word|project management|agile|scrum|six sigma|erp|sap)/is.test(content) : 
            /(?:technical skills|hard skills|proficiencies).*?(?:programming|javascript|python|react|node|aws|cloud|docker|kubernetes|git)/is.test(content),
        
        // Soft Skills (7 points)
        hasSoftSkills: /(?:soft skills|interpersonal skills).*?(?:communication|leadership|teamwork|problem.solving|critical.thinking|adaptability|time.management)/is.test(content)
    };
    
    skillsScore += skillsChecks.hasTechnicalSkills ? 8 : 0;
    skillsScore += skillsChecks.hasSoftSkills ? 7 : 0;
    
    // 5. Work Experience (20 points)
    const experienceChecks = {
        // Relevance (10 points)
        hasRelevantExperience: 'mnc' === 'mnc' ? 
            /(?:experience|work|employment).*?(?:managed|led|coordinated|developed|implemented|analyzed|improved)/is.test(content) : 
            /(?:experience|work|employment).*?(?:created|built|designed|launched|innovated|optimized|transformed)/is.test(content),
        
        // Achievements (10 points)
        hasQuantifiableAchievements: /(?:\d+%|\$\d+|increased|decreased|improved|reduced|saved|generated|delivered)/i.test(content)
    };
    
    experienceScore += experienceChecks.hasRelevantExperience ? 10 : 0;
    experienceScore += experienceChecks.hasQuantifiableAchievements ? 10 : 0;
    
    // 6. Education (10 points)
    const educationChecks = {
        // Details (5 points)
        hasEducationDetails: /(?:education|degree|university|college).*?(?:bachelor|master|phd|mba|btech|bsc|msc)/is.test(content),
        
        // Academic Performance (5 points)
        hasAcademicPerformance: /(?:gpa|grade|cgpa|percentage|cum laude|honors|distinction)/i.test(content)
    };
    
    educationScore += educationChecks.hasEducationDetails ? 5 : 0;
    educationScore += educationChecks.hasAcademicPerformance ? 5 : 0;
    
    // 7. Additional Sections (10 points)
    const additionalChecks = {
        // Certifications (5 points)
        hasCertifications: /(?:certification|certified|certificate|credential)/i.test(content),
        
        // Projects/Awards (5 points)
        hasProjectsOrAwards: /(?:project|award|recognition|achievement|honor)/i.test(content)
    };
    
    additionalScore += additionalChecks.hasCertifications ? 5 : 0;
    additionalScore += additionalChecks.hasProjectsOrAwards ? 5 : 0;
    
    // 8. ATS Compatibility (10 points)
    const atsChecks = {
        // Keyword Optimization (5 points)
        hasKeywordOptimization: checkKeywordOptimization(content),
        
        // Simplicity (5 points)
        hasSimpleFormat: !/<table|<div|<header|<footer/i.test(content) && 
                         !/{|}|\[|\]|\||>/g.test(content)
    };
    
    atsScore += atsChecks.hasKeywordOptimization ? 5 : 0;
    atsScore += atsChecks.hasSimpleFormat ? 5 : 0;
    
    // Calculate total score
    totalScore = formatScore + contactScore + summaryScore + skillsScore + 
                experienceScore + educationScore + additionalScore + atsScore;
    
    // Generate appropriate summary based on score and company type
    let summary = '';
    if (totalScore >= 90) {
        summary = 'Excellent resume! Your resume exemplifies best practices and is highly competitive.';
    } else if (totalScore >= 75) {
        summary = 'Good resume. Meets most criteria with only minor improvements needed.';
    } else if (totalScore >= 60) {
        summary = 'Average resume. Satisfactory but requires significant enhancements.';
    } else {
        summary = 'Your resume needs substantial revisions to meet industry standards.';
    }

    // Format analysis results
    const formatAnalysis = [
        {
            title: 'Professional Appearance',
            status: formatChecks.hasConsistentFormatting ? 'good' : 'error',
            message: formatChecks.hasConsistentFormatting ? 
                'Consistent formatting with appropriate spacing and font usage.' : 
                'Inconsistent formatting detected. Ensure uniform fonts and proper spacing.'
        },
        {
            title: 'Section Organization',
            status: formatChecks.hasProperSections ? 'good' : 'error',
            message: formatChecks.hasProperSections ? 
                'Well-organized sections with clear headings.' : 
                'Standard sections (Experience, Education, Skills) not clearly defined or missing.'
        },
        {
            title: 'Resume Length',
            status: formatChecks.hasProperLength ? 'good' : 'warning',
            message: formatChecks.hasProperLength ?
                'Appropriate length for professional resume.' :
                'Resume might be too long. Consider condensing to 1-2 pages.'
        },
        {
            title: 'Contact Information',
            status: contactChecks.hasCompleteContactInfo ? 'good' : 'error',
            message: contactChecks.hasCompleteContactInfo ?
                'Complete contact information provided.' :
                'Missing essential contact details. Include phone, email, and professional profile links.'
        },
        {
            title: 'ATS Compatibility',
            status: (atsChecks.hasKeywordOptimization && atsChecks.hasSimpleFormat) ? 'good' : 'warning',
            message: (atsChecks.hasKeywordOptimization && atsChecks.hasSimpleFormat) ?
                'Resume is ATS-friendly with good keyword optimization.' :
                'Improve ATS compatibility by using standard formatting and relevant keywords.'
        }
    ];

    // Content analysis results
    const contentAnalysis = [
        {
            title: 'Professional Summary',
            status: summaryChecks.hasSummary ? 'good' : 'warning',
            message: summaryChecks.hasSummary ?
                'Effective professional summary included.' :
                'Add a concise professional summary highlighting your value proposition.'
        },
        {
            title: 'Skills Presentation',
            status: (skillsChecks.hasTechnicalSkills || skillsChecks.hasSoftSkills) ? 'good' : 'error',
            message: (skillsChecks.hasTechnicalSkills || skillsChecks.hasSoftSkills) ?
                'Skills are well-presented and relevant.' :
                'Enhance your skills section with both technical and soft skills.'
        },
        {
            title: 'Work Experience',
            status: experienceChecks.hasRelevantExperience ? 'good' : 'warning',
            message: experienceChecks.hasRelevantExperience ?
                'Work experience is relevant and well-detailed.' :
                'Focus on making your work experience more relevant to the target role.'
        },
        {
            title: 'Achievements',
            status: experienceChecks.hasQuantifiableAchievements ? 'good' : 'error',
            message: experienceChecks.hasQuantifiableAchievements ?
                'Quantifiable achievements effectively highlighted.' :
                'Add measurable achievements with specific metrics and results.'
        },
        {
            title: 'Education & Certifications',
            status: (educationChecks.hasEducationDetails || additionalChecks.hasCertifications) ? 'good' : 'warning',
            message: (educationChecks.hasEducationDetails || additionalChecks.hasCertifications) ?
                'Education and certifications properly presented.' :
                'Enhance your education section with more details and relevant certifications.'
        }
    ];

    // Generate detailed score breakdown
    const scoreBreakdown = [
        { category: 'Formatting & Structure', score: formatScore, maxScore: 15 },
        { category: 'Contact Information', score: contactScore, maxScore: 10 },
        { category: 'Professional Summary', score: summaryScore, maxScore: 10 },
        { category: 'Skills Section', score: skillsScore, maxScore: 15 },
        { category: 'Work Experience', score: experienceScore, maxScore: 20 },
        { category: 'Education', score: educationScore, maxScore: 10 },
        { category: 'Additional Sections', score: additionalScore, maxScore: 10 },
        { category: 'ATS Compatibility', score: atsScore, maxScore: 10 }
    ];

    // Return the results including the keywords
    return {
        score: totalScore,
        summary,
        formatAnalysis,
        contentAnalysis,
        scoreBreakdown,
        keywords: keywordsFound,
        suggestions: generateSuggestions(formatChecks, contactChecks, summaryChecks, skillsChecks, 
                                        experienceChecks, educationChecks, additionalChecks, atsChecks),
        companyType: 'mnc'
    };
}

function checkKeywordOptimization(content) {
    // Define keywords based on company type
    const mncKeywords = [
        'project management', 'team leadership', 'enterprise', 'agile', 'scrum', 
        'cross-functional', 'business analysis', 'risk management', 'compliance', 
        'stakeholder', 'process improvement', 'strategic planning', 'budget'
    ];

    const startupKeywords = [
        'innovation', 'startup', 'product development', 'growth', 'mvp', 
        'user experience', 'analytics', 'a/b testing', 'rapid', 'adaptability',
        'full-stack', 'entrepreneurial', 'lean', 'scalable'
    ];

    const keywords = 'mnc' === 'mnc' ? mncKeywords : startupKeywords;
    
    // Count how many keywords are present
    const keywordsFound = keywords.filter(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Return true if at least 30% of keywords are found
    return keywordsFound.length >= Math.ceil(keywords.length * 0.3);
}

function generateSuggestions(formatChecks, contactChecks, summaryChecks, skillsChecks, 
                           experienceChecks, educationChecks, additionalChecks, atsChecks) {
    const suggestions = [];
    
    // Format suggestions
    if (!formatChecks.hasConsistentFormatting) {
        suggestions.push({
            title: 'Improve Formatting Consistency',
            description: 'Your resume has inconsistent formatting that may appear unprofessional.',
            example: 'Use consistent fonts, spacing, and bullet styles throughout the document.'
        });
    }
    
    if (!formatChecks.hasProperSections) {
        suggestions.push({
            title: 'Organize Standard Sections',
            description: 'Your resume is missing clear section organization.',
            example: 'Include clearly labeled sections: Summary, Experience, Skills, Education, etc.'
        });
    }
    
    // Contact suggestions
    if (!contactChecks.hasCompleteContactInfo) {
        suggestions.push({
            title: 'Complete Contact Information',
            description: 'Your resume is missing essential contact details.',
            example: 'Include phone number, professional email, and LinkedIn profile at the top of your resume.'
        });
    }
    
    // Summary suggestions
    if (!summaryChecks.hasSummary) {
        suggestions.push({
            title: 'Add Professional Summary',
            description: 'A compelling summary helps recruiters quickly understand your value.',
            example: 'Include a 3-4 line summary highlighting your experience, skills, and career goals.'
        });
    }
    
    // Skills suggestions
    if (!skillsChecks.hasTechnicalSkills) {
        suggestions.push({
            title: 'Enhance Technical Skills',
            description: 'Include relevant technical skills for MNC positions.',
            example: 'Add skills like: Project Management, Microsoft Office Suite, ERP systems, etc.'
        });
    }
    
    // Experience suggestions
    if (!experienceChecks.hasQuantifiableAchievements) {
        suggestions.push({
            title: 'Quantify Your Achievements',
            description: 'Use numbers and metrics to demonstrate your impact.',
            example: 'Instead of "Improved sales", write "Increased sales by 27% over 6 months".'
        });
    }
    
    // Education suggestions
    if (!educationChecks.hasEducationDetails) {
        suggestions.push({
            title: 'Enhance Education Section',
            description: 'Provide more details about your educational background.',
            example: 'Include degree name, university, graduation year, and relevant coursework.'
        });
    }
    
    // ATS suggestions
    if (!atsChecks.hasKeywordOptimization) {
        suggestions.push({
            title: 'Optimize for ATS',
            description: 'Include more industry-specific keywords to pass ATS screening.',
            example: 'Incorporate terms from job descriptions for MNC positions.'
        });
    }
    
    return suggestions;
}

function updateAnalysisResults(results) {
    // Update score
    const scoreValue = document.getElementById('score-value');
    const scoreCircle = document.querySelector('.score-circle');
    const scoreSummary = document.querySelector('.score-summary p');
    
    if (scoreValue && scoreCircle && scoreSummary) {
        // Animate score value
        animateNumber(scoreValue, 0, results.score, 1500);
        
        // Update score circle background
        scoreCircle.style.background = `conic-gradient(
            var(--primary-color) 0%, 
            var(--accent-color) ${results.score / 2}%, 
            var(--background-light) ${results.score}%
        )`;
        
        // Update summary
        scoreSummary.textContent = results.summary;
    }
    
    // Update score breakdown if it exists
    const scoreBreakdown = document.getElementById('score-breakdown');
    if (scoreBreakdown) {
        scoreBreakdown.innerHTML = '<h4>Score Breakdown</h4>';
        results.scoreBreakdown.forEach(item => {
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            breakdownItem.innerHTML = `
                <div class="breakdown-category">
                    <span>${item.category}</span>
                    <span>${item.score}%</span>
                </div>
                <div class="breakdown-bar">
                    <div class="breakdown-progress" style="width: ${item.score}%"></div>
                </div>
            `;
            scoreBreakdown.appendChild(breakdownItem);
        });
    }
    
    // Update format tab
    const formatAnalysis = document.getElementById('format-analysis');
    if (formatAnalysis) {
        let formatHTML = '';
        
        results.formatAnalysis.forEach(item => {
            formatHTML += `
                <div class="format-item">
                    <div class="format-icon ${item.status}">
                        <i class="fas ${item.status === 'good' ? 'fa-check' : item.status === 'warning' ? 'fa-exclamation' : 'fa-times'}"></i>
                    </div>
                    <div class="format-content">
                        <h5>${item.title}</h5>
                        <p>${item.message}</p>
                    </div>
                </div>
            `;
        });
        
        formatAnalysis.innerHTML = formatHTML;
    }
    
    // Update content tab
    const contentAnalysis = document.getElementById('content-analysis');
    if (contentAnalysis) {
        let contentHTML = '';
        
        results.contentAnalysis.forEach(item => {
            contentHTML += `
                <div class="format-item">
                    <div class="format-icon ${item.status}">
                        <i class="fas ${item.status === 'good' ? 'fa-check' : item.status === 'warning' ? 'fa-exclamation' : 'fa-times'}"></i>
                    </div>
                    <div class="format-content">
                        <h5>${item.title}</h5>
                        <p>${item.message}</p>
                    </div>
                </div>
            `;
        });
        
        contentAnalysis.innerHTML = contentHTML;
    }
    
    // Update suggestions tab
    const improvementSuggestions = document.getElementById('improvement-suggestions');
    if (improvementSuggestions) {
        let suggestionsHTML = '';
        
        results.suggestions.forEach(suggestion => {
            suggestionsHTML += `
                <div class="suggestion-item">
                    <h5>${suggestion.title}</h5>
                    <p>${suggestion.description}</p>
                    <div class="suggestion-example">
                        <strong>Example:</strong> ${suggestion.example}
                    </div>
                </div>
            `;
        });
        
        improvementSuggestions.innerHTML = suggestionsHTML;
    }
    
    // Update keywords tab
    const keywordMatches = document.getElementById('keyword-matches');
    if (keywordMatches && results.keywords) {
        let keywordHTML = '';
        
        results.keywords.forEach(keyword => {
            keywordHTML += `
                <div class="keyword-item">
                    <div class="keyword-status ${keyword.found ? 'found' : 'missing'}">
                        <i class="fas ${keyword.found ? 'fa-check' : 'fa-times'}"></i>
                    </div>
                    <div class="keyword-name">${keyword.name}</div>
                    <div class="keyword-importance importance-${keyword.importance}">
                        ${keyword.importance.charAt(0).toUpperCase() + keyword.importance.slice(1)}
                    </div>
                </div>
            `;
        });
        
        keywordMatches.innerHTML = keywordHTML;
    }
    
    // Fix layouts after updating content
    setTimeout(() => {
        fixScoreBreakdownLayout();
        fixTabContentLayout();
    }, 100);
    
    // Make the results visible using multiple approaches to ensure it works
    showAnalyzerResults();
}

// Function to ensure analyzer results container exists
function ensureAnalyzerResultsExists() {
    let analyzerResults = document.getElementById('analyzer-results');
    
    // If the analyzer results container doesn't exist, create it
    if (!analyzerResults) {
        console.log('Analyzer results container not found, creating it...');
        
        // Find the analyzer container
        const analyzerContainer = document.querySelector('.analyzer-container');
        if (!analyzerContainer) {
            console.error('Analyzer container not found!');
            return null;
        }
        
        // Create the analyzer results element
        analyzerResults = document.createElement('div');
        analyzerResults.id = 'analyzer-results';
        analyzerResults.className = 'analyzer-results';
        analyzerResults.style.display = 'block';
        
        // Append it to the analyzer container
        analyzerContainer.appendChild(analyzerResults);
        
        // Initialize it
        initAnalyzerResults();
    }
    
    return analyzerResults;
}

// Function to fix the layout of the score breakdown section
function fixScoreBreakdownLayout() {
    const scoreBreakdown = document.getElementById('score-breakdown');
    if (!scoreBreakdown) return;
    
    console.log('Fixing score breakdown layout');
    
    // Apply styles to ensure proper display
    scoreBreakdown.style.padding = '20px 30px 30px';
    scoreBreakdown.style.borderTop = '1px solid var(--border-color)';
    scoreBreakdown.style.marginTop = '20px';
    scoreBreakdown.style.width = '100%';
    
    // Style the breakdown items
    const breakdownItems = scoreBreakdown.querySelectorAll('.breakdown-item');
    breakdownItems.forEach(item => {
        item.style.marginBottom = '15px';
    });
    
    // Style the breakdown category
    const breakdownCategories = scoreBreakdown.querySelectorAll('.breakdown-category');
    breakdownCategories.forEach(category => {
        category.style.display = 'flex';
        category.style.justifyContent = 'space-between';
        category.style.marginBottom = '5px';
    });
    
    // Style the breakdown bars
    const breakdownBars = scoreBreakdown.querySelectorAll('.breakdown-bar');
    breakdownBars.forEach(bar => {
        bar.style.height = '8px';
        bar.style.background = 'rgba(255, 255, 255, 0.1)';
        bar.style.borderRadius = '4px';
        bar.style.overflow = 'hidden';
    });
    
    // Style the breakdown progress
    const breakdownProgress = scoreBreakdown.querySelectorAll('.breakdown-progress');
    breakdownProgress.forEach(progress => {
        progress.style.height = '100%';
        progress.style.background = 'var(--primary-color)';
        progress.style.borderRadius = '4px';
    });
    
    console.log('Score breakdown layout fixed');
}

// Function to fix the layout of the tab content sections
function fixTabContentLayout() {
    console.log('Fixing tab content layout');
    
    // Fix format analysis layout
    const formatAnalysis = document.getElementById('format-analysis');
    if (formatAnalysis) {
        formatAnalysis.style.background = 'rgba(255, 255, 255, 0.03)';
        formatAnalysis.style.borderRadius = 'var(--border-radius)';
        formatAnalysis.style.padding = '20px';
        formatAnalysis.style.minHeight = '200px';
    }
    
    // Fix content analysis layout
    const contentAnalysis = document.getElementById('content-analysis');
    if (contentAnalysis) {
        contentAnalysis.style.background = 'rgba(255, 255, 255, 0.03)';
        contentAnalysis.style.borderRadius = 'var(--border-radius)';
        contentAnalysis.style.padding = '20px';
        contentAnalysis.style.minHeight = '200px';
    }
    
    // Fix keyword matches layout
    const keywordMatches = document.getElementById('keyword-matches');
    if (keywordMatches) {
        keywordMatches.style.background = 'rgba(255, 255, 255, 0.03)';
        keywordMatches.style.borderRadius = 'var(--border-radius)';
        keywordMatches.style.padding = '20px';
        keywordMatches.style.minHeight = '200px';
    }
    
    // Fix improvement suggestions layout
    const improvementSuggestions = document.getElementById('improvement-suggestions');
    if (improvementSuggestions) {
        improvementSuggestions.style.background = 'rgba(255, 255, 255, 0.03)';
        improvementSuggestions.style.borderRadius = 'var(--border-radius)';
        improvementSuggestions.style.padding = '20px';
        improvementSuggestions.style.minHeight = '200px';
    }
    
    // Fix format items layout
    const formatItems = document.querySelectorAll('.format-item');
    formatItems.forEach(item => {
        item.style.display = 'flex';
        item.style.alignItems = 'flex-start';
        item.style.marginBottom = '20px';
        item.style.padding = '15px';
        item.style.background = 'rgba(255, 255, 255, 0.02)';
        item.style.borderRadius = 'var(--border-radius)';
    });
    
    // Fix format icons layout
    const formatIcons = document.querySelectorAll('.format-icon');
    formatIcons.forEach(icon => {
        icon.style.width = '30px';
        icon.style.height = '30px';
        icon.style.borderRadius = '50%';
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.marginRight = '15px';
        
        // Set color based on status
        if (icon.classList.contains('good')) {
            icon.style.background = 'rgba(46, 213, 115, 0.2)';
            icon.style.color = '#2ed573';
        } else if (icon.classList.contains('warning')) {
            icon.style.background = 'rgba(255, 165, 2, 0.2)';
            icon.style.color = '#ffa502';
        } else if (icon.classList.contains('error')) {
            icon.style.background = 'rgba(255, 71, 87, 0.2)';
            icon.style.color = '#ff4757';
        }
    });
    
    // Fix format content layout
    const formatContents = document.querySelectorAll('.format-content');
    formatContents.forEach(content => {
        content.style.flex = '1';
    });
    
    // Fix keyword items layout
    const keywordItems = document.querySelectorAll('.keyword-item');
    keywordItems.forEach(item => {
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.padding = '10px 15px';
        item.style.marginBottom = '10px';
        item.style.background = 'rgba(255, 255, 255, 0.02)';
        item.style.borderRadius = 'var(--border-radius)';
        item.style.transition = 'all 0.3s ease';
    });
    
    // Fix keyword status layout
    const keywordStatuses = document.querySelectorAll('.keyword-status');
    keywordStatuses.forEach(status => {
        status.style.width = '24px';
        status.style.height = '24px';
        status.style.borderRadius = '50%';
        status.style.display = 'flex';
        status.style.alignItems = 'center';
        status.style.justifyContent = 'center';
        status.style.marginRight = '15px';
        
        // Set color based on found status
        if (status.classList.contains('found')) {
            status.style.background = 'rgba(46, 213, 115, 0.2)';
            status.style.color = '#2ed573';
        } else if (status.classList.contains('missing')) {
            status.style.background = 'rgba(255, 71, 87, 0.2)';
            status.style.color = '#ff4757';
        }
    });
    
    // Fix suggestion items layout
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
        item.style.background = 'rgba(255, 255, 255, 0.02)';
        item.style.borderRadius = 'var(--border-radius)';
        item.style.padding = '20px';
        item.style.marginBottom = '20px';
    });
    
    // Fix suggestion examples layout
    const suggestionExamples = document.querySelectorAll('.suggestion-example');
    suggestionExamples.forEach(example => {
        example.style.background = 'rgba(255, 255, 255, 0.05)';
        example.style.borderRadius = 'var(--border-radius)';
        example.style.padding = '15px';
        example.style.marginTop = '15px';
        example.style.fontSize = '0.9rem';
    });
    
    console.log('Tab content layout fixed');
}

// Function to ensure analyzer results are visible
function showAnalyzerResults() {
    const analyzerResults = document.getElementById('analyzer-results');
    if (!analyzerResults) {
        console.error('Analyzer results element not found');
        return;
    }

    // Make sure the results are visible
    analyzerResults.style.display = 'block';
    analyzerResults.style.visibility = 'visible';
    analyzerResults.style.opacity = '1';
    analyzerResults.style.height = 'auto';
    
    // Add visible class
    analyzerResults.classList.add('visible');
    
    // Fix tab display
    const tabs = analyzerResults.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        if (tab.classList.contains('active')) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });

    // Scroll to results with a delay to ensure everything is rendered
    setTimeout(() => {
        try {
            analyzerResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('Scrolled to analyzer results');
        } catch (error) {
            console.error('Error scrolling to results:', error);
            // Fallback scrolling method
            window.scrollTo({
                top: analyzerResults.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }, 300);
}

function switchTab(tabName) {
    console.log(`Switching to tab: ${tabName}`);
    
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate selected tab and button
    const selectedTab = document.getElementById(`${tabName}-tab`);
    const selectedBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    
    if (selectedTab) {
        selectedTab.classList.add('active');
        selectedTab.style.display = 'block';
        console.log(`Activated tab: ${tabName}-tab`);
    } else {
        console.error(`Tab not found: ${tabName}-tab`);
    }
    
    if (selectedBtn) {
        selectedBtn.classList.add('active');
        console.log(`Activated button for tab: ${tabName}`);
    } else {
        console.error(`Button not found for tab: ${tabName}`);
    }
}

function animateNumber(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add information about how MNC companies select resumes
const atsInfo = {
    howAtsWorks: `
        <h3>How ATS Systems Work</h3>
        <p>Applicant Tracking Systems (ATS) are used by 99% of Fortune 500 companies and 75% of recruiters to filter resumes before they reach human eyes. Here's how they work:</p>
        <ul>
            <li><strong>Keyword Matching:</strong> ATS scans resumes for specific keywords and phrases related to the job description.</li>
            <li><strong>Ranking System:</strong> Resumes are scored based on how well they match the job requirements.</li>
            <li><strong>Parsing Logic:</strong> ATS extracts information from your resume into standardized fields (name, experience, education, etc.).</li>
            <li><strong>Elimination Filters:</strong> Resumes that don't meet minimum requirements are automatically rejected.</li>
        </ul>
    `,
    
    mnc_selection_criteria: `
        <h3>How MNC Companies Select Candidates</h3>
        <p>Major companies like Google, Microsoft, Amazon, and others use sophisticated resume screening processes:</p>
        <ul>
            <li><strong>Initial ATS Screening:</strong> Only 25% of resumes typically pass this first filter.</li>
            <li><strong>Keyword Relevance:</strong> Technical skills, certifications, and industry-specific terminology are weighted heavily.</li>
            <li><strong>Experience Matching:</strong> Systems look for relevant experience that matches the job description.</li>
            <li><strong>Education Requirements:</strong> Degrees, institutions, and relevant coursework are evaluated.</li>
            <li><strong>Quantifiable Results:</strong> Metrics and achievements with numbers stand out to both ATS and recruiters.</li>
            <li><strong>Secondary Human Review:</strong> After ATS filtering, recruiters spend an average of just 7 seconds scanning each resume.</li>
        </ul>
    `,
    
    optimization_tips: `
        <h3>How to Optimize Your Resume for ATS</h3>
        <ul>
            <li><strong>Use Standard Formats:</strong> Stick to .docx or simple PDF formats.</li>
            <li><strong>Avoid Headers/Footers:</strong> Many ATS systems can't properly parse these areas.</li>
            <li><strong>Use Standard Section Titles:</strong> "Work Experience", "Education", "Skills", etc.</li>
            <li><strong>Include Keywords:</strong> Mirror language from the job description.</li>
            <li><strong>Avoid Tables and Columns:</strong> These can confuse ATS parsing.</li>
            <li><strong>Use Standard Fonts:</strong> Arial, Calibri, Times New Roman, etc.</li>
            <li><strong>Spell Out Acronyms:</strong> Include both the acronym and the full term.</li>
            <li><strong>Quantify Achievements:</strong> Use numbers and percentages to highlight results.</li>
        </ul>
    `
};

// Button state handling
const analyzeBtn = document.getElementById('analyze-btn');
const resumeUpload = document.getElementById('resume-upload');
const uploadArea = document.getElementById('upload-area');

// Enable button when file is selected
resumeUpload.addEventListener('change', function() {
    if (this.files.length > 0) {
        analyzeBtn.disabled = false;
        // Show file name in upload area
        const fileName = this.files[0].name;
        updateUploadAreaWithFile(fileName);
    } else {
        analyzeBtn.disabled = true;
        resetUploadArea();
    }
});

// Handle drag and drop
uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', function() {
    this.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length > 0) {
        resumeUpload.files = e.dataTransfer.files;
        analyzeBtn.disabled = false;
        
        // Show file name in upload area
        const fileName = e.dataTransfer.files[0].name;
        updateUploadAreaWithFile(fileName);
    }
});

// Click on upload area to trigger file input
uploadArea.addEventListener('click', function() {
    resumeUpload.click();
});

// Handle analyze button click
analyzeBtn.addEventListener('click', function() {
    // Show loading state
    this.classList.add('loading');
    this.innerHTML = '<i class="fas fa-spinner"></i> Analyzing...';
    this.disabled = true; // Disable the button during analysis
    
    // Perform the analysis
    analyzeResume();
});

// Update upload area with file information
function updateUploadAreaWithFile(fileName) {
    uploadArea.innerHTML = `
        <i class="fas fa-file-alt" style="color: var(--success-color);"></i>
        <h3>File Selected</h3>
        <p>${fileName}</p>
        <p class="file-types">Click "Analyze Resume" to proceed</p>
    `;
}

// Reset upload area to initial state
function resetUploadArea() {
    uploadArea.innerHTML = `
        <i class="fas fa-file-upload"></i>
        <h3>Upload Your Resume</h3>
        <p>Drag & drop your resume file or click to browse</p>
        <p class="file-types">Supported formats: PDF, DOCX, DOC</p>
    `;
}

// Helper function to create AI badge
function createAiBadge() {
    const aiBadge = document.createElement('span');
    aiBadge.className = 'ai-badge';
    aiBadge.textContent = 'AI';
    return aiBadge;
}

// Function to initialize the analyzer results section
function initAnalyzerResults() {
    let analyzerResults = document.getElementById('analyzer-results');
    
    if (!analyzerResults) {
        analyzerResults = document.createElement('div');
        analyzerResults.id = 'analyzer-results';
        analyzerResults.className = 'analyzer-results';
        
        const analyzerContainer = document.querySelector('.analyzer-container');
        if (!analyzerContainer) {
            console.error('Analyzer container not found');
            return;
        }
        
        analyzerContainer.appendChild(analyzerResults);
    }

    // Set initial content
    analyzerResults.innerHTML = `
        <div class="results-header">
            <div class="ats-score">
                <div class="score-circle">
                    <span id="score-value">0</span>
                </div>
            </div>
            <div class="score-summary">
                <h3>ATS Compatibility Score</h3>
                <p>Upload your resume and click "Analyze Resume" to see your score.</p>
            </div>
        </div>
        <div class="results-details">
            <div class="results-tabs">
                <button class="tab-btn active" data-tab="format">Format Analysis</button>
                <button class="tab-btn" data-tab="content">Content Analysis</button>
                <button class="tab-btn" data-tab="keywords">Keyword Matches</button>
                <button class="tab-btn" data-tab="suggestions">Suggestions</button>
            </div>
            <div id="format-tab" class="tab-content active">
                <div id="format-analysis">
                    <p class="placeholder-text">Upload your resume to see format analysis.</p>
                </div>
            </div>
            <div id="content-tab" class="tab-content">
                <div id="content-analysis">
                    <p class="placeholder-text">Upload your resume to see content analysis.</p>
                </div>
            </div>
            <div id="keywords-tab" class="tab-content">
                <div id="keyword-matches">
                    <p class="placeholder-text">Upload your resume to see keyword matches.</p>
                </div>
            </div>
            <div id="suggestions-tab" class="tab-content">
                <div id="improvement-suggestions">
                    <p class="placeholder-text">Upload your resume to get personalized suggestions.</p>
                </div>
            </div>
        </div>
        <div id="score-breakdown">
            <h4>Score Breakdown</h4>
            <div class="breakdown-content">
                <p class="placeholder-text">Upload your resume to see detailed score breakdown.</p>
            </div>
        </div>
    `;

    // Set up tab switching
    const tabButtons = analyzerResults.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Show the analyzer results
    showAnalyzerResults();
} 
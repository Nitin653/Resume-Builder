// Enhanced Mobile Responsiveness
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initResponsiveLayout();
    initTouchInteractions();
    fixAnalyzerDisplay();
    handleOrientationChange();
});

function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (mobileMenuToggle) {
        // Improved touch handling for menu toggle
        mobileMenuToggle.addEventListener('touchstart', toggleMobileMenu, { passive: true });
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isMenuOpen = document.body.classList.contains('menu-open');
            const isClickInsideMenu = event.target.closest('.nav-links') || event.target.closest('.mobile-menu-toggle');
            
            if (isMenuOpen && !isClickInsideMenu) {
                closeMobileMenu();
            }
        });
        
        // Close menu when scrolling
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (Math.abs(scrollTop - lastScrollTop) > 10) { // Only trigger after 10px of scroll
                closeMobileMenu();
            }
            lastScrollTop = scrollTop;
        }, { passive: true });
        
        // Handle navigation items
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                closeMobileMenu();
                
                // Smooth scroll to section
                const targetId = this.getAttribute('href').slice(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

function toggleMobileMenu(event) {
    if (event) {
        event.stopPropagation();
    }
    document.body.classList.toggle('menu-open');
    
    // Handle aria-expanded state
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        const isExpanded = document.body.classList.contains('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    }
}

function closeMobileMenu() {
    document.body.classList.remove('menu-open');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
}

function initResponsiveLayout() {
    // Fix analyzer results display on mobile
    window.addEventListener('resize', debounce(adjustAnalyzerLayout, 250));
    adjustAnalyzerLayout();
    
    // Make tabs scrollable on mobile
    makeTabsScrollable();
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        fixAnalyzerDisplay();
        makeTabsScrollable();
        adjustContentLayout();
    }, 250));
}

function initTouchInteractions() {
    // Improve scrolling on mobile
    const scrollableElements = document.querySelectorAll('.results-tabs, .preview-container');
    scrollableElements.forEach(element => {
        element.style.webkitOverflowScrolling = 'touch';
        
        // Add momentum scrolling for iOS
        if (CSS.supports('-webkit-overflow-scrolling: touch')) {
            element.addEventListener('touchstart', function() {}, { passive: true });
        }
    });
    
    // Handle tab swipe on mobile
    const tabsContainer = document.querySelector('.results-tabs');
    if (tabsContainer) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        tabsContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        tabsContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].clientX;
            handleTabSwipe();
        }, { passive: true });
        
        function handleTabSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
                tabsContainer.scrollBy({
                    left: -swipeDistance,
                    behavior: 'smooth'
                });
            }
        }
    }
}

function adjustAnalyzerLayout() {
    const analyzerResults = document.getElementById('analyzer-results');
    if (!analyzerResults) return;
    
    const isMobile = window.innerWidth <= 768;
    
    // Apply mobile-specific styles
    if (isMobile) {
        analyzerResults.style.width = '100%';
        analyzerResults.style.margin = '20px 0';
        analyzerResults.style.padding = '15px';
        
        // Adjust header layout
        const resultsHeader = analyzerResults.querySelector('.results-header');
        if (resultsHeader) {
            resultsHeader.style.flexDirection = 'column';
            resultsHeader.style.alignItems = 'center';
            resultsHeader.style.textAlign = 'center';
            resultsHeader.style.padding = '20px';
        }
        
        // Adjust items layout
        const items = analyzerResults.querySelectorAll('.format-item, .keyword-item, .suggestion-item');
        items.forEach(item => {
            item.style.flexDirection = 'column';
            item.style.alignItems = 'center';
            item.style.textAlign = 'center';
            item.style.padding = '15px';
            item.style.marginBottom = '15px';
        });
        
        // Ensure proper tab display
        const tabs = analyzerResults.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            if (tab.classList.contains('active')) {
                tab.style.display = 'block';
            }
        });
    } else {
        // Reset styles for desktop
        analyzerResults.style = '';
        
        const resultsHeader = analyzerResults.querySelector('.results-header');
        if (resultsHeader) {
            resultsHeader.style = '';
        }
        
        const items = analyzerResults.querySelectorAll('.format-item, .keyword-item, .suggestion-item');
        items.forEach(item => {
            item.style = '';
        });
    }
}

function makeTabsScrollable() {
    const resultsTabs = document.querySelector('.results-tabs');
    if (!resultsTabs) return;
    
    if (window.innerWidth <= 768) {
        resultsTabs.style.overflowX = 'auto';
        resultsTabs.style.webkitOverflowScrolling = 'touch';
        resultsTabs.style.scrollSnapType = 'x mandatory';
        
        const tabButtons = resultsTabs.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.style.flex = '0 0 auto';
            btn.style.scrollSnapAlign = 'start';
        });
        
        // Add scroll indicators if needed
        addScrollIndicators(resultsTabs);
    } else {
        resultsTabs.style = '';
        const tabButtons = resultsTabs.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.style = '';
        });
        
        // Remove scroll indicators
        const indicators = resultsTabs.querySelectorAll('.scroll-indicator');
        indicators.forEach(indicator => indicator.remove());
    }
}

function addScrollIndicators(container) {
    // Only add indicators if content is scrollable
    if (container.scrollWidth > container.clientWidth) {
        const leftIndicator = document.createElement('div');
        leftIndicator.className = 'scroll-indicator scroll-left';
        leftIndicator.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const rightIndicator = document.createElement('div');
        rightIndicator.className = 'scroll-indicator scroll-right';
        rightIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        container.parentNode.appendChild(leftIndicator);
        container.parentNode.appendChild(rightIndicator);
        
        // Handle indicator clicks
        leftIndicator.addEventListener('click', () => {
            container.scrollBy({ left: -100, behavior: 'smooth' });
        });
        
        rightIndicator.addEventListener('click', () => {
            container.scrollBy({ left: 100, behavior: 'smooth' });
        });
        
        // Show/hide indicators based on scroll position
        container.addEventListener('scroll', debounce(() => {
            leftIndicator.style.opacity = container.scrollLeft > 0 ? '1' : '0';
            rightIndicator.style.opacity = 
                container.scrollLeft < (container.scrollWidth - container.clientWidth) ? '1' : '0';
        }, 100));
    }
}

function handleOrientationChange() {
    window.addEventListener('orientationchange', function() {
        // Wait for the orientation change to complete
        setTimeout(() => {
            adjustAnalyzerLayout();
            makeTabsScrollable();
            fixAnalyzerDisplay();
        }, 100);
    });
}

function adjustContentLayout() {
    const isMobile = window.innerWidth <= 768;
    
    // Adjust builder layout
    const builderContainer = document.querySelector('.builder-container');
    if (builderContainer) {
        builderContainer.style.display = isMobile ? 'block' : 'grid';
    }
    
    // Adjust preview size
    const preview = document.querySelector('.preview');
    if (preview) {
        preview.style.maxHeight = isMobile ? '500px' : 'none';
        preview.style.overflowY = isMobile ? 'auto' : 'visible';
    }
    
    // Adjust form layouts
    const formRows = document.querySelectorAll('.form-row');
    formRows.forEach(row => {
        row.style.flexDirection = isMobile ? 'column' : 'row';
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fix analyzer display issues
function fixAnalyzerDisplay() {
    const analyzerResults = document.getElementById('analyzer-results');
    if (!analyzerResults) return;
    
    const styles = {
        display: 'block',
        visibility: 'visible',
        opacity: '1',
        overflow: 'visible',
        width: '100%',
        maxWidth: '100%',
        position: 'relative',
        clear: 'both',
        marginTop: '30px',
        background: 'var(--background-dark)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };
    
    Object.assign(analyzerResults.style, styles);
    
    // Ensure active tab is visible
    const activeTab = analyzerResults.querySelector('.tab-content.active');
    if (activeTab) {
        activeTab.style.display = 'block';
    }
    
    // Fix header layout
    const resultsHeader = analyzerResults.querySelector('.results-header');
    if (resultsHeader) {
        const isMobile = window.innerWidth <= 768;
        Object.assign(resultsHeader.style, {
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            padding: isMobile ? '20px' : '30px',
            borderBottom: '1px solid var(--border-color)'
        });
    }
    
    // Fix details section
    const resultsDetails = analyzerResults.querySelector('.results-details');
    if (resultsDetails) {
        resultsDetails.style.padding = window.innerWidth <= 768 ? '15px' : '20px';
        resultsDetails.style.display = 'block';
    }
}

// Ensure analyzer results are properly displayed after analysis
document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            // After analysis is complete, ensure results are visible
            setTimeout(function() {
                fixAnalyzerDisplay();
                
                // Scroll to results
                const analyzerResults = document.getElementById('analyzer-results');
                if (analyzerResults) {
                    analyzerResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 2500); // Wait for analysis to complete
        });
    }
    
    // Fix tab switching to ensure proper display
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(fixAnalyzerDisplay, 100);
        });
    });
}); 
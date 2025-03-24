// Dark Mode Toggle Functionality

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});

function initDarkMode() {
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const moonIcon = themeToggleBtn.querySelector('.fa-moon');
    const sunIcon = themeToggleBtn.querySelector('.fa-sun');
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or check system preference
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle dark mode when button is clicked
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Add animation classes
        moonIcon.style.animation = 'rotate-out 0.5s forwards';
        sunIcon.style.animation = 'rotate-in 0.5s forwards';
        
        // Save user preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Optional: Trigger a custom event that other parts of the app can listen to
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDarkMode } }));
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Only if user hasn't set a preference
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}

// Add these styles to your CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rotate-in {
        from {
            transform: rotate(-180deg) scale(0);
            opacity: 0;
        }
        to {
            transform: rotate(0) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes rotate-out {
        from {
            transform: rotate(0) scale(1);
            opacity: 1;
        }
        to {
            transform: rotate(180deg) scale(0);
            opacity: 0;
        }
    }
    
    .theme-toggle {
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .theme-toggle:hover {
        transform: scale(1.1);
    }
    
    .theme-toggle:active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(style); 
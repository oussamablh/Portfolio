// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const darkModeToggle = document.getElementById('darkModeToggle');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');

// Dark mode state
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize dark mode
function initDarkMode() {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    initDarkMode();
}

// Mobile menu toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

// Smooth scroll to sections
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    // Get all sections
    const sections = document.querySelectorAll('section[id]');
    
    // Default to hero section if at the very top
    let activeSectionId = 'hero';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSectionId = sectionId;
        }
    });
    
    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('text-blue-600', 'dark:text-blue-400');
        link.classList.add('text-gray-700', 'dark:text-gray-300');
    });
    
    // Add active class to current section's nav link
    const activeLink = document.querySelector(`a[href="#${activeSectionId}"]`);
    if (activeLink) {
        activeLink.classList.remove('text-gray-700', 'dark:text-gray-300');
        activeLink.classList.add('text-blue-600', 'dark:text-blue-400');
    }
}

// Navbar background on scroll
function updateNavbarBackground() {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white/95', 'dark:bg-gray-900/95', 'shadow-md');
        navbar.classList.remove('bg-white/90', 'dark:bg-gray-900/90', 'shadow-sm');
    } else {
        navbar.classList.remove('bg-white/95', 'dark:bg-gray-900/95', 'shadow-md');
        navbar.classList.add('bg-white/90', 'dark:bg-gray-900/90', 'shadow-sm');
    }
}

// Form validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.classList.add('hidden');
        msg.textContent = '';
    });
    
    // Validate name
    if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentNode.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    // Add error styling to input
    field.classList.add('border-red-500', 'focus:ring-red-500');
    field.classList.remove('border-gray-300', 'dark:border-gray-600', 'focus:ring-blue-500');
}

// Clear error styling
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.parentNode.querySelector('.error-message');
    errorDiv.classList.add('hidden');
    
    // Remove error styling
    field.classList.remove('border-red-500', 'focus:ring-red-500');
    field.classList.add('border-gray-300', 'dark:border-gray-600', 'focus:ring-blue-500');
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Show success alert
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    }
}

// Intersection Observer for animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-slide-up');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Portfolio filtering functionality
function setupPortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            });
            button.classList.add('active', 'bg-blue-600', 'text-white');
            button.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'slideUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();
    
    // Setup animations
    setupAnimations();
    
    // Setup portfolio filtering
    setupPortfolioFiltering();
    
    // Initialize active navigation link
    updateActiveNavLink();
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Form field focus/blur for error clearing
    const formFields = ['name', 'email', 'message'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('focus', () => clearError(fieldId));
        field.addEventListener('blur', () => {
            // Re-validate on blur
            const value = field.value.trim();
            if (value && fieldId === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError(fieldId, 'Please enter a valid email address');
                }
            }
        });
    });
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
            
            // Close mobile menu if open
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }
    });
});

// Scroll event listeners
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateNavbarBackground();
});

// Add smooth scrolling for all anchor links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        smoothScrollTo(targetId);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu();
    }
    
    // Enter key on dark mode toggle
    if (e.key === 'Enter' && document.activeElement === darkModeToggle) {
        toggleDarkMode();
    }
});

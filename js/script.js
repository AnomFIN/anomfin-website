/**
 * Global Group Oy - Professional Website JavaScript
 * Clean, production-ready functionality for infrastructure company
 */

// Configuration and Messages
const CONFIG = {
    contact: {
        endpoint: '/api/contact.php', // Placeholder for future contact form endpoint
        timeout: 10000
    },
    animation: {
        scrollRevealOffset: 100,
        transitionDuration: 250
    }
};

const MESSAGES = {
    contact: {
        requiredFields: 'Täytä kaikki pakolliset kentät.',
        invalidEmail: 'Tarkista sähköpostiosoite.',
        consentRequired: 'Hyväksy käyttöehdot jatkaaksesi.',
        success: 'Kiitos viestistäsi! Otamme sinuun yhteyttä pian.',
        error: 'Viestin lähetys epäonnistui. Yritä myöhemmin uudelleen tai ota yhteyttä puhelimitse.',
        sending: 'Lähetetään...'
    }
};

/**
 * Utility Functions
 */
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport(element, offset = CONFIG.animation.scrollRevealOffset) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight - offset &&
            rect.bottom > offset
        );
    },

    // Smooth scroll to element
    scrollToElement(target, offset = 80) {
        const element = document.querySelector(target);
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    // Validate email address
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Show/hide element with smooth transition
    toggleElement(element, show) {
        if (show) {
            element.style.display = 'block';
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.opacity = '1';
            }, 10);
        } else {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.display = 'none';
            }, CONFIG.animation.transitionDuration);
        }
    }
};

/**
 * Navigation Functionality
 */
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileToggle = document.getElementById('mobile-menu');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        if (!this.navbar) return;

        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupSmoothScroll();
        this.handleResize();
    }

    setupMobileMenu() {
        if (!this.mobileToggle || !this.navMenu) return;

        this.mobileToggle.addEventListener('click', () => {
            const isExpanded = this.mobileToggle.getAttribute('aria-expanded') === 'true';
            
            this.mobileToggle.setAttribute('aria-expanded', !isExpanded);
            this.mobileToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // If it's an anchor link, handle scroll and close menu
                if (href.startsWith('#')) {
                    e.preventDefault();
                    utils.scrollToElement(href);
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.mobileToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    setupScrollBehavior() {
        let lastScrollY = window.pageYOffset;
        let ticking = false;

        const updateNavbar = () => {
            const scrollY = window.pageYOffset;
            
            // Add/remove scrolled class for styling
            if (scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    setupSmoothScroll() {
        // Handle all anchor links for smooth scrolling
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            utils.scrollToElement(href);
        });
    }

    handleResize() {
        const handleResize = utils.debounce(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        }, 250);

        window.addEventListener('resize', handleResize);
    }
}

/**
 * Contact Form Functionality
 */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitButton = null;
        
        if (this.form) {
            this.submitButton = this.form.querySelector('button[type="submit"]');
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.form.addEventListener('input', utils.debounce((e) => {
            this.validateField(e.target);
        }, 300));

        // Phone number formatting (optional enhancement)
        const phoneInput = this.form.querySelector('#contact-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous validation
        this.clearFieldError(field);

        // Skip validation if field is not required and empty
        if (!field.required && !value) return true;

        switch (field.type) {
            case 'email':
                isValid = utils.isValidEmail(value);
                if (!isValid) errorMessage = MESSAGES.contact.invalidEmail;
                break;
            case 'text':
            case 'textarea':
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'Tämä kenttä on pakollinen.';
                }
                break;
            case 'checkbox':
                if (field.required && !field.checked) {
                    isValid = false;
                    errorMessage = MESSAGES.contact.consentRequired;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    formatPhoneNumber(input) {
        // Simple Finnish phone number formatting
        let value = input.value.replace(/\D/g, '');
        
        if (value.startsWith('358')) {
            // International format
            if (value.length > 3) {
                value = '+358 ' + value.slice(3);
            }
        } else if (value.startsWith('0')) {
            // National format - keep as is for now
        }
        
        input.value = value;
    }

    async handleSubmit() {
        // Validate all fields
        const formData = new FormData(this.form);
        const fields = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        // Clear previous form-level errors
        this.clearFormError();

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showFormError(MESSAGES.contact.requiredFields);
            return;
        }

        // Show loading state
        this.setSubmitState(true);

        try {
            // For production, this would send to actual endpoint
            await this.simulateFormSubmission(formData);
            
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            console.error('Contact form error:', error);
            this.showFormError(MESSAGES.contact.error);
        } finally {
            this.setSubmitState(false);
        }
    }

    async simulateFormSubmission(formData) {
        // Simulate API call for demo purposes
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 1500);
        });
    }

    setSubmitState(loading) {
        if (!this.submitButton) return;

        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = MESSAGES.contact.sending;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Lähetä tarjouspyyntö';
        }
    }

    showFormError(message) {
        this.showFormMessage(message, 'error');
    }

    showSuccessMessage() {
        this.showFormMessage(MESSAGES.contact.success, 'success');
    }

    showFormMessage(message, type) {
        this.clearFormError();
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        
        this.form.appendChild(messageElement);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    clearFormError() {
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

/**
 * Scroll Animations
 */
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate], .service-card, .datacenter-feature, .about-feature');
        this.observer = null;
        
        this.init();
    }

    init() {
        if (!this.elements.length) return;

        // Use Intersection Observer for performance
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: `0px 0px -${CONFIG.animation.scrollRevealOffset}px 0px`
            }
        );

        this.elements.forEach(element => {
            element.classList.add('animate-hidden');
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                entry.target.classList.remove('animate-hidden');
                
                // Stop observing once animated
                this.observer.unobserve(entry.target);
            }
        });
    }
}

/**
 * Performance Optimizations
 */
class PerformanceOptimizations {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupCriticalCSS();
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        // Native lazy loading for images
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                }
            });
        } else {
            // Fallback for older browsers
            this.setupIntersectionObserverLazyLoading();
        }
    }

    setupIntersectionObserverLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    setupCriticalCSS() {
        // Load non-critical CSS asynchronously if needed
        const nonCriticalCSS = document.querySelector('link[data-non-critical]');
        if (nonCriticalCSS) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = nonCriticalCSS.dataset.href;
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
            document.head.appendChild(link);
        }
    }

    preloadCriticalResources() {
        // Preload critical hero image if not already preloaded in HTML
        const heroImage = document.querySelector('.hero-image');
        if (heroImage && !document.querySelector(`link[href="${heroImage.src}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = heroImage.src;
            link.as = 'image';
            document.head.appendChild(link);
        }
    }
}

/**
 * Accessibility Enhancements
 */
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIAUpdates();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.querySelector('.nav-menu.active');
                if (mobileMenu) {
                    const navigation = window.navigation;
                    if (navigation && navigation.closeMobileMenu) {
                        navigation.closeMobileMenu();
                    }
                }
            }
        });

        // Tab trap for mobile menu (optional enhancement)
        this.setupTabTrap();
    }

    setupTabTrap() {
        const mobileMenu = document.querySelector('.nav-menu');
        if (!mobileMenu) return;

        const focusableElements = mobileMenu.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            if (!mobileMenu.classList.contains('active')) return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    setupFocusManagement() {
        // Ensure focus is visible for keyboard users
        document.addEventListener('mousedown', () => {
            document.body.classList.add('mouse-user');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('mouse-user');
            }
        });
    }

    setupARIAUpdates() {
        // Update ARIA states dynamically
        const mobileToggle = document.getElementById('mobile-menu');
        if (mobileToggle) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isActive = mobileToggle.classList.contains('active');
                        mobileToggle.setAttribute('aria-expanded', isActive);
                    }
                });
            });

            observer.observe(mobileToggle, { attributes: true });
        }
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
    }
}

/**
 * Application Initialization
 */
class GlobalGroupApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize core components
            this.components.navigation = new Navigation();
            this.components.contactForm = new ContactForm();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.performance = new PerformanceOptimizations();
            this.components.accessibility = new AccessibilityEnhancements();

            // Make navigation globally available for mobile menu control
            window.navigation = this.components.navigation;

            // Initialize any additional components
            this.setupAdditionalFeatures();
            
            console.log('Global Group Oy website initialized successfully');
        } catch (error) {
            console.error('Error initializing website components:', error);
        }
    }

    setupAdditionalFeatures() {
        // Add CSS for animations
        this.addAnimationStyles();
        
        // Setup service worker for PWA features (future enhancement)
        this.setupServiceWorker();
        
        // Analytics initialization placeholder
        this.initAnalytics();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-hidden {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            
            .animate-visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .form-message {
                padding: 1rem;
                border-radius: 0.5rem;
                margin-top: 1rem;
                font-weight: 500;
            }
            
            .form-message-success {
                background: #dcfce7;
                color: #166534;
                border: 1px solid #bbf7d0;
            }
            
            .form-message-error {
                background: #fee2e2;
                color: #991b1b;
                border: 1px solid #fecaca;
            }
            
            .field-error {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            }
            
            input.error,
            textarea.error {
                border-color: #ef4444;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }
            
            .lazy {
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .lazy.loaded {
                opacity: 1;
            }
            
            /* Focus styles for keyboard users */
            body:not(.mouse-user) *:focus {
                outline: 2px solid #2563eb;
                outline-offset: 2px;
            }
            
            body.mouse-user *:focus {
                outline: none;
            }
            
            /* Navbar scroll state */
            .navbar.scrolled {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(16px);
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            }
        `;
        
        document.head.appendChild(style);
    }

    setupServiceWorker() {
        // Service worker registration for future PWA features
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Uncomment when service worker is implemented
                // navigator.serviceWorker.register('/sw.js')
                //     .then(registration => console.log('SW registered'))
                //     .catch(error => console.log('SW registration failed'));
            });
        }
    }

    initAnalytics() {
        // Placeholder for analytics initialization
        // This would be where Google Analytics, Matomo, or other analytics would be initialized
        console.log('Analytics initialization placeholder');
    }
}

// Initialize the application
const app = new GlobalGroupApp();
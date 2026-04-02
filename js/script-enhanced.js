/**
 * Global Group Oy - Enhanced Professional Website JavaScript
 * Now with jQuery, GSAP, Particles.js and amazing smooth effects
 */

$(document).ready(function() {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize all smooth features
    initParticles();
    initScrollAnimations();
    initCounters();
    initTypingEffect();
    initNavigation();
    initContactForm();
    initHoverEffects();
    initPageLoad();
    
    console.log('🚀 Global Group Oy - Smooth animations loaded!');
});

/**
 * Initialize Particles.js for amazing background effect
 */
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.5,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#2563eb',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 200,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

/**
 * Initialize smooth scroll animations with GSAP
 */
function initScrollAnimations() {
    // Fade up animations for elements
    gsap.utils.toArray('.animate-fade-up').forEach((element, index) => {
        const delay = element.dataset.delay || 0;
        
        gsap.fromTo(element, {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: delay / 1000,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Slide up animations for titles
    gsap.utils.toArray('.animate-slide-up').forEach((element, index) => {
        const delay = element.dataset.delay || 0;
        
        gsap.fromTo(element, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: delay / 1000,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Service cards stagger animation
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.fromTo(card, {
            opacity: 0,
            y: 40,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Capability items wave animation
    gsap.utils.toArray('.capability-item').forEach((item, index) => {
        gsap.fromTo(item, {
            opacity: 0,
            x: -30
        }, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: index * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.capabilities-strip',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

/**
 * Initialize animated counters
 */
function initCounters() {
    $('.counter').each(function() {
        const element = $(this);
        const target = parseFloat(element.data('target'));
        const isDecimal = element.data('decimal');
        const duration = 2.5;
        
        let start = 0;
        const increment = target / (duration * 60); // 60fps
        
        const counter = { value: start };
        
        gsap.to(counter, {
            value: target,
            duration: duration,
            ease: 'power3.out',
            onUpdate: function() {
                if (isDecimal) {
                    element.text(counter.value.toFixed(1));
                } else {
                    element.text(Math.round(counter.value));
                }
            },
            scrollTrigger: {
                trigger: element[0],
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

/**
 * Initialize typing effect
 */
function initTypingEffect() {
    $('.typing-text').each(function() {
        const element = $(this);
        const text = element.data('text');
        const speed = 100;
        
        ScrollTrigger.create({
            trigger: element[0],
            start: 'top 80%',
            onEnter: function() {
                typeText(element, text, speed);
            }
        });
    });
}

function typeText(element, text, speed) {
    element.text('');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.text(element.text() + text.charAt(i));
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * Enhanced Navigation with smooth scrolling and active states
 */
function initNavigation() {
    // Smooth scroll for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'easeInOutCubic');
        }
    });
    
    // Mobile menu toggle
    $('#mobile-menu').on('click', function() {
        $(this).toggleClass('active');
        $('#primary-menu').toggleClass('active');
    });
    
    // Close mobile menu when clicking on links
    $('.nav-link').on('click', function() {
        $('#mobile-menu').removeClass('active');
        $('#primary-menu').removeClass('active');
    });
    
    // Active navigation highlighting
    $(window).on('scroll', function() {
        const scrollPos = $(window).scrollTop() + 100;
        
        $('.nav-link').each(function() {
            const currLink = $(this);
            const refElement = $(currLink.attr('href'));
            
            if (refElement.length && 
                refElement.offset().top <= scrollPos && 
                refElement.offset().top + refElement.height() > scrollPos) {
                $('.nav-link').removeClass('active');
                currLink.addClass('active');
            }
        });
    });
    
    // Navbar background on scroll
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
}

/**
 * Enhanced Contact Form with smooth submission
 */
function initContactForm() {
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.text();
        
        // Add loading state
        submitBtn.text('Lähetetään...').prop('disabled', true).addClass('loading');
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(function() {
            // Success animation
            gsap.to(form[0], {
                scale: 0.95,
                opacity: 0.8,
                duration: 0.3,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1,
                onComplete: function() {
                    showNotification('Kiitos! Otamme yhteyttä pian.', 'success');
                    form[0].reset();
                    submitBtn.text(originalText).prop('disabled', false).removeClass('loading');
                }
            });
        }, 2000);
    });
}

/**
 * Initialize enhanced hover effects
 */
function initHoverEffects() {
    // Service card magnetic effect
    $('.service-card').on('mousemove', function(e) {
        const card = $(this);
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        gsap.to(this, {
            rotationY: deltaX * 5,
            rotationX: deltaY * -5,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    $('.service-card').on('mouseleave', function() {
        gsap.to(this, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    // Button hover effects
    $('.btn').on('mouseenter', function() {
        gsap.to(this, {
            scale: 1.05,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });
    
    $('.btn').on('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });
    
    // Capability items hover
    $('.capability-item').on('mouseenter', function() {
        gsap.to(this, {
            y: -8,
            boxShadow: '0 15px 30px rgba(37, 99, 235, 0.15)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    $('.capability-item').on('mouseleave', function() {
        gsap.to(this, {
            y: 0,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
}

/**
 * Page load animation
 */
function initPageLoad() {
    // Hide page initially
    gsap.set('body', { opacity: 0 });
    
    // Animate page in
    gsap.to('body', {
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Hero content animation sequence
    const heroTl = gsap.timeline({ delay: 0.3 });
    
    heroTl.fromTo('.eyebrow', {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    })
    .fromTo('.hero-title-line', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=0.3')
    .fromTo('.hero-subtitle', {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.4')
    .fromTo('.hero-buttons .btn', {
        opacity: 0,
        y: 20,
        scale: 0.9
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    }, '-=0.3')
    .fromTo('.hero-metrics li', {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    }, '-=0.3');
    
    // Datacenter SVG animation
    gsap.fromTo('.datacenter-svg', {
        opacity: 0,
        scale: 0.8,
        rotationY: 20
    }, {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.2,
        delay: 0.8,
        ease: 'power3.out'
    });
    
    // Floating icons animation
    gsap.fromTo('.floating-icon', {
        opacity: 0,
        scale: 0
    }, {
        opacity: 0.7,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 1.5,
        ease: 'back.out(1.7)'
    });
}

/**
 * Utility function to show notifications
 */
function showNotification(message, type = 'info') {
    const notification = $(`
        <div class="notification notification-${type}" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#2563eb'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            opacity: 0;
        ">
            ${message}
        </div>
    `).appendTo('body');
    
    // Animate in
    gsap.to(notification[0], {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });
    
    // Animate out after 3 seconds
    setTimeout(() => {
        gsap.to(notification[0], {
            x: '100%',
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => notification.remove()
        });
    }, 3000);
}

/**
 * Fallback for browsers without jQuery or GSAP
 */
if (typeof $ === 'undefined' || typeof gsap === 'undefined') {
    console.warn('jQuery or GSAP not loaded. Using basic functionality.');
    
    // Basic navigation toggle
    function initBasicNavigation() {
        const mobileMenu = document.getElementById('mobile-menu');
        const primaryMenu = document.getElementById('primary-menu');
        
        if (mobileMenu && primaryMenu) {
            mobileMenu.addEventListener('click', function() {
                this.classList.toggle('active');
                primaryMenu.classList.toggle('active');
            });
        }
    }
    
    // Basic form handling
    function initBasicContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Kiitos viestistänne! Otamme yhteyttä pian.');
                this.reset();
            });
        }
    }
    
    // Initialize basic functionality
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initBasicNavigation();
            initBasicContactForm();
        });
    } else {
        initBasicNavigation();
        initBasicContactForm();
    }
}
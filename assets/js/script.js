const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Cursor animation
function animate() {
    if (!cursor || !cursorDot) return;
    
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    dotX += (mouseX - dotX) * 0.8;
    dotY += (mouseY - dotY) * 0.8;

    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';

    cursorDot.style.left = dotX - 2 + 'px';
    cursorDot.style.top = dotY - 2 + 'px';

    requestAnimationFrame(animate);
}

if (cursor && cursorDot) {
    animate();
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for resize events
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

// Unified scroll handler
let ticking = false;
function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateReadingProgress();
            updateActiveNavLink();
            toggleBackToTopButton();
            // Remove parallax effect as it conflicts with other animations
            ticking = false;
        });
        ticking = true;
    }
}

// Reading progress bar
function updateReadingProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const readingProgress = document.querySelector('.reading-progress');
    if (readingProgress) {
        readingProgress.style.width = `${progress}%`;
    }
}

// Active nav link update
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Back to top button
function toggleBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
}

// Add throttled scroll listener
window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-active');
            // Remove the unobserving code - keep elements observed
        }
    });
}, observerOptions);

// Initialize fade-in elements
function initializeFadeElements() {
    document.querySelectorAll('.fade-in').forEach(el => {
        // REMOVE THESE LINES:
        // el.classList.remove('fade-in-active');
        // el.style.opacity = '0';
        // el.style.transform = 'translateY(30px)';
        // el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        fadeObserver.observe(el);
    });
}

// Add CSS for fade-in-active class
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .fade-in-active {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(fadeInStyle);

// Cursor hover effects
function addCursorHoverEffects() {
    const hoverElements = document.querySelectorAll('a, .project, .misc-item, .nav-link, .contact-link, .submit-button, .skill-item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor && !el.classList.contains('demo-button')) {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = '#999';
            }
        });

        el.addEventListener('mouseleave', () => {
            if (cursor && !el.classList.contains('demo-button')) {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '';
            }
        });
    });
}

// Demo button effects
document.querySelectorAll('.demo-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const demoUrl = button.getAttribute('data-demo');
        
        if (demoUrl) {
            button.style.transform = 'translateY(0) scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
                window.open(demoUrl, '_blank');
            }, 150);
        }
    });

    button.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.transform = 'scale(2)';
            cursor.style.borderColor = '#999';
            cursor.style.background = 'rgba(0, 0, 0, 0.1)';
        }
    });

    button.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '';
            cursor.style.background = 'transparent';
        }
    });
});

// Project click effects with ripple
document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            const link = project.querySelector('.project-name a');
            if (link) {
                const ripple = document.createElement('div');
                const rect = project.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(26, 26, 26, 0.05);
                    border-radius: 50%;
                    transform: scale(0);
                    pointer-events: none;
                    z-index: 1;
                `;

                project.style.position = 'relative';
                project.appendChild(ripple);

                ripple.animate([
                    { transform: 'scale(0)', opacity: 1 },
                    { transform: 'scale(2)', opacity: 0 }
                ], {
                    duration: 600,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                });

                setTimeout(() => {
                    ripple.remove();
                    window.open(link.href, '_blank');
                }, 300);
            }
        }
    });

    // Project hover effects
    project.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    project.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offset = 100;
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    const toggleText = darkModeToggle.querySelector('.toggle-text');

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        if (toggleText) {
            toggleText.textContent = isDark ? 'light' : 'dark';
        }
        updateFavicon();
    });

    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        if (toggleText) toggleText.textContent = 'light';
    }
}

// Link preview on hover
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            const preview = document.createElement('div');
            preview.className = 'link-preview';
            preview.textContent = new URL(link.href).hostname.replace('www.', '');
            preview.style.cssText = `
                position: fixed;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            `;
            document.body.appendChild(preview);

            const updatePosition = (e) => {
                preview.style.left = `${e.clientX + 15}px`;
                preview.style.top = `${e.clientY + 15}px`;
            };

            link.addEventListener('mousemove', updatePosition);
            link.addEventListener('mouseleave', () => {
                preview.remove();
                link.removeEventListener('mousemove', updatePosition);
            });
        }
    });
});

// Favicon update
const favicon = document.querySelector("link[rel='icon']");
const updateFavicon = () => {
    if (favicon) {
        const emoji = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
        favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
    }
};

// Console message
if (window.console) {
    const styles = [
        'color: #000000',
        'background: #f5f5f5',
        'font-size: 12px',
        'padding: 4px 8px',
        'border-radius: 3px',
        'font-family: "IBM Plex Mono"'
    ].join(';');

    console.log('%c👋 Hey there fellow developer!', styles);
    console.log('%cLooking for something interesting? The source is right here!', styles);
}

// Update current year
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Back to top button handler
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typing indicator removal
setTimeout(() => {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.opacity = '0';
        setTimeout(() => typingIndicator.remove(), 500);
    }
}, 3000);

// Contact links animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize fade-in elements
    initializeFadeElements();
    
    const contactLinks = document.querySelectorAll('.contact a');
    contactLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';

        setTimeout(() => {
            link.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 1000 + (index * 150));
    });

    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const animateSkillBars = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const progress = skillBar.getAttribute('data-progress');
                setTimeout(() => {
                    skillBar.style.width = progress + '%';
                    skillBar.style.transition = 'width 1s ease';
                }, 200);
                observer.unobserve(skillBar);
            }
        });
    };

    const skillObserver = new IntersectionObserver(animateSkillBars, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        skillObserver.observe(bar);
    });

    // Add cursor hover effects
    addCursorHoverEffects();

    // Initialize favicon
    updateFavicon();
});

// Performance optimization for low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.6s');
}

// Konami code easter egg
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        document.body.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'rainbow 3s ease infinite';
        
        if (!document.querySelector('#rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.background = '';
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});

// EmailJS Configuration and Contact Form Handler
(function() {
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init('os8WyY2Wston7lwiQ');
    }
})();

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitButton = contactForm.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (typeof emailjs === 'undefined') {   
                showNotification('EmailJS is not loaded. Please try again later.', 'error');
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Update button state
            buttonText.textContent = 'sending...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            
            // Send email using EmailJS
            emailjs.send('service_q0z5m4p', 'template_uo04fzt', {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message
            })
            .then(function(response) {
                console.log('Email sent successfully:', response);
                
                // Success state
                buttonText.textContent = 'message sent!';
                submitButton.style.backgroundColor = '#4caf50';
                
                // Reset form
                contactForm.reset();
                
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset button after delay
                setTimeout(() => {
                    buttonText.textContent = 'send message';
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.backgroundColor = '';
                }, 3000);
                
            })
            .catch(function(error) {
                console.error('Email failed to send:', error);
                
                // Error state
                buttonText.textContent = 'failed to send';
                submitButton.style.backgroundColor = '#f44336';
                
                // Show error message
                showNotification('Failed to send message. Please try again or contact me directly.', 'error');
                
                // Reset button after delay
                setTimeout(() => {
                    buttonText.textContent = 'send message';
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.backgroundColor = '';
                }, 3000);
            });
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Metropolis', sans-serif;
        font-size: 14px;
        line-height: 1.4;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}




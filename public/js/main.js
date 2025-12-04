// Mobile Menu Toggle - ENHANCED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar');
    
    // Enhanced mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
                document.body.style.overflow = '';
            }
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
            document.body.style.overflow = '';
        }
    });

    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            navbar.style.padding = '0.5rem 5%';
        } else {
            header.classList.remove('scrolled');
            navbar.style.padding = '1rem 5%';
        }
    });

    // Set active navigation link
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage || (currentPage === '' && linkPage === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            }
        });
    });

    // Contact form handling with improved validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const formMessages = document.getElementById('form-messages');
            
            // Basic validation
            if (!validateForm(this)) {
                return;
            }

            try {
                submitBtn.classList.add('loading');
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate API call - replace with actual endpoint
                const response = await simulateFormSubmission(formData);
                
                if (response.success) {
                    showFormMessage('Message sent successfully! We will get back to you within 24 hours.', 'success');
                    this.reset();
                } else {
                    showFormMessage('Error sending message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showFormMessage('Error sending message. Please try again.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Form validation function
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e53e3e';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }

            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.style.borderColor = '#e53e3e';
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Simulate form submission (replace with actual API call)
    function simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Message sent successfully'
                });
            }, 2000);
        });
    }

    // Show form messages
    function showFormMessage(message, type) {
        let formMessages = document.getElementById('form-messages');
        if (!formMessages) {
            formMessages = document.createElement('div');
            formMessages.id = 'form-messages';
            const form = document.getElementById('contactForm');
            form.parentNode.insertBefore(formMessages, form);
        }

        formMessages.textContent = message;
        formMessages.className = `form-messages ${type}`;
        
        setTimeout(() => {
            formMessages.style.display = 'none';
        }, 5000);
    }

    // Add loading animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                entry.target.style.opacity = '0';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .portfolio-item, .investment-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

    // Simple counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }

    // Initialize counters when stats section is in view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-item h3').forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('+')) {
                        const target = parseInt(text);
                        if (!isNaN(target)) {
                            animateCounter(stat, target);
                        }
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ============================
    // COOKIE CONSENT FUNCTIONALITY
    // ============================

    // Cookie consent functions (make them globally available)
    window.acceptCookies = function() {
        console.log('Cookies accepted');
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieConsent();
        initializeAnalytics();
        showCookieToast('Cookies accepted. Thank you!', 'success');
    };

    window.rejectCookies = function() {
        console.log('Cookies rejected');
        localStorage.setItem('cookieConsent', 'rejected');
        hideCookieConsent();
        clearAllCookies();
        showCookieToast('Cookies rejected. Basic functionality only.', 'info');
    };

    function checkCookieConsent() {
        const consent = localStorage.getItem('cookieConsent');
        console.log('Cookie consent status:', consent);
        
        if (!consent) {
            // Show consent banner after a short delay
            setTimeout(() => {
                showCookieConsent();
            }, 1000);
        } else if (consent === 'accepted') {
            initializeAnalytics();
        }
    }

    function showCookieConsent() {
        const cookieConsent = document.getElementById('cookieConsent');
        if (cookieConsent) {
            cookieConsent.style.display = 'block';
            // Add fade-in animation
            setTimeout(() => {
                cookieConsent.style.opacity = '1';
                cookieConsent.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    function hideCookieConsent() {
        const cookieConsent = document.getElementById('cookieConsent');
        if (cookieConsent) {
            cookieConsent.style.opacity = '0';
            cookieConsent.style.transform = 'translateY(100%)';
            setTimeout(() => {
                cookieConsent.style.display = 'none';
            }, 300);
        }
    }

    function initializeAnalytics() {
        console.log('🔍 Analytics initialized');
        // Add your analytics code here (Google Analytics, Facebook Pixel, etc.)
        // Example:
        // gtag('config', 'GA_MEASUREMENT_ID');
    }

    function clearAllCookies() {
        // Clear all cookies except essential ones
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            // Don't clear essential cookies like 'cookieConsent'
            if (name !== 'cookieConsent') {
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }
        }
        console.log('🧹 Non-essential cookies cleared');
    }

    function showCookieToast(message, type) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Enhanced cookie management
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    }

    // Initialize cookie consent on page load
    checkCookieConsent();

    // Make phone numbers clickable
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth > 768) {
                e.preventDefault();
                // Show phone number confirmation for desktop
                const number = this.getAttribute('href').replace('tel:', '');
                if (confirm(`Call ${number}?`)) {
                    window.location.href = this.getAttribute('href');
                }
            }
        });
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Newsletter form handling for homepage
    const newsletterForm = document.getElementById('homeNewsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.background = 'var(--success)';
                this.reset();
                
                const successMsg = document.createElement('div');
                successMsg.style.cssText = `
                    background: var(--success);
                    color: white;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    text-align: center;
                `;
                successMsg.textContent = '🎉 Thank you for subscribing!';
                this.parentNode.appendChild(successMsg);
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                    successMsg.remove();
                }, 5000);
            }, 1500);
        });
    }
});

// ROI Calculator
class ROICalculator {
    constructor() {
        this.initializeCalculator();
    }

    initializeCalculator() {
        const calculator = document.getElementById('roiCalculator');
        if (calculator) {
            calculator.addEventListener('input', this.calculateROI.bind(this));
            // Set default to 10 years
            document.getElementById('investmentDuration').value = '10';
            // Calculate initial values
            this.calculateROI();
        }
    }

    calculateROI() {
        const investment = parseFloat(document.getElementById('investmentAmount').value) || 0;
        const duration = parseFloat(document.getElementById('investmentDuration').value) || 10; // Default to 10 years
        const project = document.getElementById('projectType').value;

        const roiRates = {
            'poultry': 0.35,
            'block': 0.45,
            'aquaculture': 0.30,
            'piggery': 0.40
        };

        const rate = roiRates[project] || 0.35;
        const annualReturn = investment * rate;
        const totalReturn = annualReturn * duration;
        const totalValue = investment + totalReturn;

        this.updateDisplay(investment, annualReturn, totalReturn, totalValue, duration);
    }

    updateDisplay(investment, annualReturn, totalReturn, totalValue, duration) {
        const annualReturnEl = document.getElementById('annualReturn');
        const totalReturnEl = document.getElementById('totalReturn');
        const totalValueEl = document.getElementById('totalValue');
        const investmentPeriodEl = document.getElementById('investmentPeriod');

        if (annualReturnEl) annualReturnEl.textContent = this.formatCurrency(annualReturn);
        if (totalReturnEl) totalReturnEl.textContent = this.formatCurrency(totalReturn);
        if (totalValueEl) totalValueEl.textContent = this.formatCurrency(totalValue);
        if (investmentPeriodEl) investmentPeriodEl.textContent = duration + ' Year' + (duration > 1 ? 's' : '');
    }

    formatCurrency(amount) {
        return '₦' + amount.toLocaleString('en-NG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ROICalculator();
});
/* ==========================================================================
   COLLABORATIVE INVESTMENT LTD – MAIN JS (SECURE VERSION)
   Clean • Modular • Mobile-Responsive • Secure Login • Cart System • Animations
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    console.log('CIL website initialized');

    /* ============================================================
       NAVBAR + MOBILE MENU
    ============================================================ */
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const header = document.querySelector(".header");

    const toggleMobile = () => {
        const isOpen = navLinks.classList.toggle("active");
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        
        // Transform hamburger to X
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (spans.length >= 3) {
            spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = isOpen ? '0' : '1';
            spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
        } else {
            // Fallback for icon-based buttons
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
            }
        }
        document.body.style.overflow = isOpen ? "hidden" : "";
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", toggleMobile);
    }

    // Close menu when clicking outside or on a link
    document.addEventListener("click", (e) => {
        if (navLinks && navLinks.classList.contains("active") &&
            !e.target.closest(".nav-links") &&
            !e.target.closest(".mobile-menu-btn")) {
            toggleMobile();
        }
        
        // Close menu when clicking on nav link (for smooth scrolling)
        if (e.target.closest(".nav-links a")) {
            setTimeout(() => {
                if (window.innerWidth <= 992 && navLinks.classList.contains("active")) {
                    toggleMobile();
                }
            }, 300);
        }
    });

    // Responsive behavior
    window.addEventListener("resize", () => {
        if (window.innerWidth > 992 && navLinks && navLinks.classList.contains("active")) {
            toggleMobile();
        }
    });

    /* Sticky header */
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 50);
        });
    }

    /* Highlight active menu link */
    const currentPath = window.location.pathname;
    document.querySelectorAll(".nav-links a").forEach((link) => {
        const linkPath = link.getAttribute("href");
        if (currentPath === linkPath || 
            (currentPath.includes(linkPath) && linkPath !== "/" && linkPath.length > 1)) {
            link.classList.add("active");
        }
    });

    /* ============================================================
       CART DRAWER SYSTEM
    ============================================================ */
    const drawer = document.getElementById("cart-drawer");
    const drawerOverlay = document.getElementById("cart-drawer-overlay");
    const openCart = document.getElementById("open-cart-drawer");
    const closeCart = document.getElementById("close-cart-drawer");
    const drawerItems = document.getElementById("cart-drawer-items");
    const drawerTotal = document.getElementById("drawer-total");

    const updateCartBadge = () => {
        try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const count = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

            const badge = document.getElementById("cart-count-badge");
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? "inline-flex" : "none";
            }
        } catch (e) {
            console.error("Error updating cart badge:", e);
        }
    };

    const loadDrawer = () => {
        try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");

            if (cart.length === 0) {
                if (drawerItems) {
                    drawerItems.innerHTML = `<div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="/shop-categories" class="btn btn-primary">Start Shopping</a>
                    </div>`;
                }
                if (drawerTotal) {
                    drawerTotal.textContent = "₦0";
                }
                return;
            }

            let total = 0;
            if (drawerItems) {
                drawerItems.innerHTML = cart.map((item) => {
                    const price = parseFloat(item.price) || 0;
                    const quantity = parseInt(item.quantity) || 1;
                    const itemTotal = price * quantity;
                    total += itemTotal;
                    
                    return `
                        <div class="drawer-item">
                            <div class="drawer-item-info">
                                <strong>${item.name || 'Unnamed Item'}</strong>
                                <span class="drawer-item-price">₦${price.toLocaleString()}</span>
                            </div>
                            <div class="drawer-item-actions">
                                <span class="drawer-item-quantity">Qty: ${quantity}</span>
                                <span class="drawer-item-total">₦${itemTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    `;
                }).join("");
            }

            if (drawerTotal) {
                drawerTotal.textContent = `₦${total.toLocaleString()}`;
            }
        } catch (e) {
            console.error("Error loading drawer:", e);
            if (drawerItems) {
                drawerItems.innerHTML = `<p class="error">Error loading cart. Please try again.</p>`;
            }
        }
    };

    const openDrawer = () => {
        if (drawer) drawer.classList.add("open");
        if (drawerOverlay) drawerOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        loadDrawer();
    };

    const closeDrawer = () => {
        if (drawer) drawer.classList.remove("open");
        if (drawerOverlay) drawerOverlay.classList.remove("active");
        document.body.style.overflow = "";
    };

    if (openCart) openCart.addEventListener("click", openDrawer);
    if (closeCart) closeCart.addEventListener("click", closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

    // Initialize cart badge
    updateCartBadge();

    /* ============================================================
       SECURE ADMIN HIDDEN LOGIN SYSTEM
       - No hard-coded passwords
       - Legitimate login handled entirely by backend
    ============================================================ */
    const adminLink = document.querySelector(".admin-hidden-link");
    
    if (adminLink) {
        adminLink.addEventListener("click", (e) => {
            // Only show login prompt if Ctrl key is pressed (hidden from regular users)
            if (!e.ctrlKey) {
                // Regular users just follow the link
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // Admin login with Ctrl+Click
            const email = prompt("Enter admin email:");
            if (!email) return;

            const password = prompt("Enter admin password:");
            if (!password) return;

            // This would be handled by backend in production
            console.log("Admin login attempt:", email);
            
            // Simulate API call
            setTimeout(() => {
                alert("Login would be processed by backend. This is a frontend simulation.");
                // In production: window.location.href = "/admin/dashboard";
            }, 500);
        });
    }

    /* ============================================================
       FADE-IN EFFECT ON SCROLL
    ============================================================ */
    const fadeEls = document.querySelectorAll(".fade-in-up");

    if (fadeEls.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate");
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        fadeEls.forEach((el) => {
            // Add delay based on position
            const index = Array.from(fadeEls).indexOf(el);
            el.style.animationDelay = `${index * 0.1}s`;
            fadeObserver.observe(el);
        });
    }

    /* ============================================================
       CTA COUNTER ANIMATION
    ============================================================ */
    const statsSection = document.querySelector(".cta-stats");
    let statsPlayed = false;

    const animateNumber = (el, target, duration = 1500) => {
        let current = 0;
        const increment = target / (duration / 16);
        let startTime = null;

        const formatNumber = (num) => {
            if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B+';
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K+';
            return Math.floor(num).toLocaleString();
        };

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            current = target * easeOutQuart;
            
            el.textContent = formatNumber(current);
            
            if (percentage < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = formatNumber(target);
            }
        };

        requestAnimationFrame(step);
    };

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsPlayed) {
                statsPlayed = true;

                document.querySelectorAll(".cta-stat-value").forEach((el, index) => {
                    const text = el.textContent.trim();
                    let val = 0;
                    
                    if (text.includes('B+')) {
                        val = parseFloat(text.replace('B+', '')) * 1000000000;
                    } else if (text.includes('M+')) {
                        val = parseFloat(text.replace('M+', '')) * 1000000;
                    } else if (text.includes('%')) {
                        val = parseFloat(text.replace('%', ''));
                    } else if (text.includes('+')) {
                        val = parseFloat(text.replace('+', ''));
                    } else {
                        val = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
                    }
                    
                    if (!isNaN(val) && val > 0) {
                        setTimeout(() => {
                            el.textContent = "0";
                            animateNumber(el, val);
                        }, index * 200);
                    }
                });
            }
        }, { 
            threshold: 0.5,
            rootMargin: "0px 0px -100px 0px"
        });

        statsObserver.observe(statsSection);
    }

    /* ============================================================
       LAZY LOAD IMAGES
    ============================================================ */
    const lazyImgs = document.querySelectorAll("img[data-src]");

    if (lazyImgs.length > 0) {
        const imgObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    // Add loaded class for fade-in effect
                    img.onload = () => {
                        img.classList.add("loaded");
                    };
                    
                    img.removeAttribute("data-src");
                    imgObs.unobserve(img);
                }
            });
        }, { 
            rootMargin: "100px 0px",
            threshold: 0.01
        });

        lazyImgs.forEach((img) => {
            // Add loading state
            img.style.opacity = "0";
            img.style.transition = "opacity 0.3s ease";
            imgObs.observe(img);
        });
    }

    /* ============================================================
       CONTACT FORM SIMULATION
    ============================================================ */
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector("button[type='submit']");
            if (!btn) return;

            const originalText = btn.textContent;

            btn.textContent = "Sending...";
            btn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                // In production, this would be an actual fetch request
                // fetch('/contact', { method: 'POST', body: new FormData(contactForm) })
                
                alert("Thank you for your message! We'll contact you soon.");
                contactForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1200);
        });
    }

    /* ============================================================
       ROI CALCULATOR
    ============================================================ */
    class ROICalculator {
        constructor() {
            this.amount = document.getElementById("investmentAmount");
            this.duration = document.getElementById("investmentDuration");
            this.project = document.getElementById("projectType");

            this.annual = document.getElementById("annualReturn");
            this.total = document.getElementById("totalReturn");
            this.final = document.getElementById("totalValue");

            if (this.amount && this.duration && this.project && 
                this.annual && this.total && this.final) {
                this.bind();
                this.calculate();
            }
        }

        bind() {
            [this.amount, this.duration, this.project].forEach((el) =>
                el.addEventListener("input", () => this.calculate())
            );
        }

        calculate() {
            const amt = parseFloat(this.amount.value) || 0;
            const dur = parseFloat(this.duration.value) || 1;

            const rates = {
                poultry: 0.35,
                block: 0.45,
                aquaculture: 0.3,
                piggery: 0.4,
            };

            const rate = rates[this.project.value] || 0.3;

            const annual = amt * rate;
            const total = annual * dur;
            const finalValue = amt + total;

            if (this.annual) this.annual.textContent = "₦" + annual.toLocaleString();
            if (this.total) this.total.textContent = "₦" + total.toLocaleString();
            if (this.final) this.final.textContent = "₦" + finalValue.toLocaleString();
        }
    }

    // Initialize ROI Calculator if elements exist
    if (document.getElementById("investmentAmount")) {
        new ROICalculator();
    }

    /* ============================================================
       WHATSAPP FLOAT BUTTON
    ============================================================ */
    if (!document.querySelector('.whatsapp-float')) {
        const w = document.createElement("a");
        w.href = "https://wa.me/2348129978419";
        w.className = "whatsapp-float";
        w.target = "_blank";
        w.rel = "noopener noreferrer";
        w.innerHTML = `<i class="fab fa-whatsapp"></i>`;
        w.title = "Chat with us on WhatsApp";
        w.setAttribute("aria-label", "Chat with us on WhatsApp");
        document.body.appendChild(w);
    }

    /* ============================================================
       SMOOTH SCROLL FOR ANCHOR LINKS
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, href);
            }
        });
    });

    /* ============================================================
       BACK TO TOP BUTTON
    ============================================================ */
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.title = 'Back to top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    // Add styles for back to top button
    const backToTopStyles = document.createElement('style');
    backToTopStyles.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background: var(--secondary);
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 768px) {
            .back-to-top {
                bottom: 90px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(backToTopStyles);

    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ============================================================
       IMAGE HOVER EFFECTS
    ============================================================ */
    const cards = document.querySelectorAll('.model-card, .portfolio-card, .reason-card, .preview-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '';
        });
    });

    /* ============================================================
       FORM VALIDATION ENHANCEMENT
    ============================================================ */
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('error');
                }
            });
        });
    });

    /* ============================================================
       INITIALIZE ANIMATIONS ON PAGE LOAD
    ============================================================ */
    // Trigger initial animations for elements already in view
    setTimeout(() => {
        fadeEls.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add("animate");
            }
        });
    }, 300);

    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    console.log('All JavaScript functionality loaded successfully');
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Service Worker registration (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                window.location.href = '/admin/login';
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            // Fade in animation
            const fadeElements = document.querySelectorAll('.fade-in-up');
            
            const fadeInOnScroll = () => {
                fadeElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    
                    if (elementTop < window.innerHeight - elementVisible) {
                        element.classList.add('visible');
                    }
                });
            };
            
            // Initial check
            fadeInOnScroll();
            
            // Check on scroll
            window.addEventListener('scroll', fadeInOnScroll);
            
            // Cart functionality (simplified)
            function updateCartCount() {
                try {
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
                    const cartBadge = document.getElementById('cart-count-badge');
                    if (cartBadge) {
                        cartBadge.textContent = cartCount;
                        cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
                    }
                } catch (error) {
                    console.error('Error updating cart count:', error);
                }
            }
            
            updateCartCount();
            
            // Show quick contact card after scrolling down
            const quickCard = document.getElementById('quickContactCard');
            let cardShown = false;
            
            window.addEventListener('scroll', function() {
                if (!cardShown && window.scrollY > 500) {
                    quickCard.classList.add('show');
                    cardShown = true;
                }
            });
            
            // Close quick card when clicking outside? Not needed as it has a close button.
        });
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.card, .sector-item, .team-card, .department-card');
            const fadeInOnScroll = () => {
                cards.forEach(el => {
                    const top = el.getBoundingClientRect().top;
                    if (top < window.innerHeight - 80) el.style.opacity = '1';
                    else el.style.opacity = '0.3';
                });
            };
            cards.forEach(c => c.style.transition = 'opacity 0.4s');
            fadeInOnScroll();
            window.addEventListener('scroll', fadeInOnScroll);

            try {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const count = cart.reduce((s,i)=> s + i.quantity,0);
                const badge = document.getElementById('cart-count-badge');
                if(badge) { badge.textContent = count; badge.style.display = count>0?'flex':'none'; }
            } catch(e) {}

            const qc = document.getElementById('quickContactCard');
            let shown = false;
            window.addEventListener('scroll',()=>{
                if(!shown && window.scrollY>600) { qc.classList.add('show'); shown=true; }
            });
        });
        document.addEventListener('DOMContentLoaded', function() {
            try {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const count = cart.reduce((s,i) => s + i.quantity, 0);
                const badge = document.getElementById('cart-count-badge');
                if(badge) { badge.textContent = count; badge.style.display = count>0 ? 'flex' : 'none'; }
            } catch(e) {}
        });
        // Category filtering functionality
        document.addEventListener('DOMContentLoaded', function() {
            const categoryBtns = document.querySelectorAll('.category-btn');
            const articles = document.querySelectorAll('.featured-card, .article-card');
            
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    const category = this.dataset.category;
                    
                    // Filter articles
                    articles.forEach(article => {
                        if (category === 'all' || article.dataset.category.includes(category)) {
                            article.style.display = 'block';
                        } else {
                            article.style.display = 'none';
                        }
                    });
                });
            });
            
            // Newsletter form handling
            document.getElementById('newsletterForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                const button = this.querySelector('button');
                const originalText = button.textContent;
                
                // Simple validation
                if (!email || !email.includes('@')) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                // Simulate subscription
                button.textContent = 'Subscribing...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = 'Subscribed!';
                    this.reset();
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 2000);
                }, 1000);
                
                // You can add actual newsletter subscription logic here
                console.log('Newsletter subscription:', email);
            });
            
            // Simple cart count update (example)
            function updateCartCount() {
                const cartCount = 0; // This would come from your cart system
                const cartBadge = document.getElementById('cart-count-badge');
                if (cartBadge) {
                    cartBadge.textContent = cartCount;
                    cartBadge.style.display = cartCount > 0 ? 'inline' : 'none';
                }
            }
            
            updateCartCount();
        });

        // Contact Form Handling
        document.addEventListener('DOMContentLoaded', function() {
            const contactForm = document.getElementById('contactForm');
            const formMessages = document.getElementById('form-messages');
            
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get form data
                    const formData = new FormData(this);
                    const name = formData.get('name');
                    const email = formData.get('email');
                    const service = formData.get('service');
                    const message = formData.get('message');
                    
                    // Simple validation
                    if (!name || !email || !service || !message) {
                        showFormMessage('error', 'Please fill in all required fields.');
                        return;
                    }
                    
                    if (!isValidEmail(email)) {
                        showFormMessage('error', 'Please enter a valid email address.');
                        return;
                    }
                    
                    // Show loading state
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitButton.textContent;
                    submitButton.textContent = 'Sending...';
                    submitButton.disabled = true;
                    
                    // Simulate form submission (replace with actual API call)
                    setTimeout(() => {
                        showFormMessage('success', 'Thank you! Your message has been sent. We will respond within 24 hours.');
                        contactForm.reset();
                        
                        // Reset button
                        setTimeout(() => {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        }, 2000);
                    }, 1500);
                    
                    // Log form data (for testing)
                    console.log('Form submitted:', {
                        name,
                        email,
                        service,
                        message
                    });
                });
            }
            
            function showFormMessage(type, message) {
                formMessages.className = 'form-messages ' + type;
                formMessages.textContent = message;
                formMessages.style.display = 'block';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessages.style.display = 'none';
                }, 5000);
            }
            
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            // Cart count update
            function updateCartCount() {
                const cartCount = 0; // This would come from your cart system
                const cartBadge = document.getElementById('cart-count-badge');
                if (cartBadge) {
                    cartBadge.textContent = cartCount;
                    cartBadge.style.display = cartCount > 0 ? 'inline' : 'none';
                }
            }
            
            updateCartCount();
        });

        document.addEventListener('DOMContentLoaded', function() {
            // Investment Calculator
            const elements = {
                amount: document.getElementById('investmentAmount'),
                amountValue: document.getElementById('amountValue'),
                duration: document.getElementById('investmentDuration'),
                durationValue: document.getElementById('durationValue'),
                projectCards: document.querySelectorAll('.project-card'),
                annualReturn: document.getElementById('annualReturn'),
                totalReturn: document.getElementById('totalReturn'),
                totalValue: document.getElementById('totalValue'),
                roiPercentage: document.getElementById('roiPercentage')
            };

            let selectedProject = { type: 'poultry', roi: 35 };

            // Initialize calculator
            updateAmountDisplay();
            updateDurationDisplay();
            calculateROI();

            // Event Listeners
            elements.amount.addEventListener('input', function() {
                updateAmountDisplay();
                calculateROI();
            });

            elements.duration.addEventListener('input', function() {
                updateDurationDisplay();
                calculateROI();
            });

            elements.projectCards.forEach(card => {
                card.addEventListener('click', function() {
                    elements.projectCards.forEach(c => {
                        c.style.background = 'var(--gray-100)';
                        c.style.color = 'var(--gray-800)';
                        c.style.border = '2px solid transparent';
                        c.querySelector('.project-roi').style.color = 'var(--gray-600)';
                        c.classList.remove('selected');
                    });
                    
                    this.style.background = 'var(--primary)';
                    this.style.color = 'white';
                    this.style.border = '2px solid var(--accent)';
                    this.querySelector('.project-roi').style.color = 'rgba(255, 255, 255, 0.9)';
                    this.classList.add('selected');
                    
                    selectedProject = {
                        type: this.dataset.type,
                        roi: parseInt(this.dataset.roi)
                    };
                    calculateROI();
                });
            });

            function updateAmountDisplay() {
                const amount = parseFloat(elements.amount.value);
                elements.amountValue.textContent = `₦${formatNumber(amount)}`;
            }

            function updateDurationDisplay() {
                const months = parseInt(elements.duration.value);
                const years = months / 12;
                elements.durationValue.textContent = years >= 1 ? `${years} Year${years > 1 ? 's' : ''}` : `${months} Month${months > 1 ? 's' : ''}`;
            }

            function calculateROI() {
                const amount = parseFloat(elements.amount.value) || 0;
                const months = parseInt(elements.duration.value) || 12;
                const years = months / 12;
                const roiRate = selectedProject.roi / 100;
                
                const annualReturnAmount = amount * roiRate;
                const totalReturnAmount = annualReturnAmount * years;
                const totalValueAmount = amount + totalReturnAmount;
                const roiPercent = selectedProject.roi;
                
                elements.annualReturn.textContent = `₦${formatNumber(annualReturnAmount)}`;
                elements.totalReturn.textContent = `₦${formatNumber(totalReturnAmount)}`;
                elements.totalValue.textContent = `₦${formatNumber(totalValueAmount)}`;
                elements.roiPercentage.textContent = `${roiPercent}%`;
            }

            function formatNumber(num) {
                return new Intl.NumberFormat('en-NG').format(Math.round(num));
            }

            // Add animation on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }
                });
            }, observerOptions);
            
            // Observe elements for animation
            document.querySelectorAll('.model-card, .portfolio-card, .opportunity-card, .process-step, .benefit-card').forEach(el => {
                el.style.opacity = "0";
                el.style.transform = "translateY(30px)";
                el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                observer.observe(el);
            });
        });
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Diaspora, Hotel & Property Management page loaded');
            
            const header = document.querySelector('.header');
            window.addEventListener('scroll', function() {
                header.classList.toggle('scrolled', window.scrollY > 50);
            });
            
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
            
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            updateCartCount();
            
            function animateOnScroll() {
                const elements = document.querySelectorAll('.sector-card, .package-card, .process-step, .trust-point');
                elements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    if (elementTop < window.innerHeight - elementVisible) {
                        element.style.opacity = "1";
                        element.style.transform = "translateY(0)";
                    }
                });
            }
            
            document.querySelectorAll('.sector-card, .package-card, .process-step, .trust-point').forEach(el => {
                el.style.opacity = "0";
                el.style.transform = "translateY(30px)";
                el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            });
            
            window.addEventListener('scroll', animateOnScroll);
            animateOnScroll();
            
            const whatsappButton = document.createElement('a');
            whatsappButton.href = 'https://wa.me/2348129978419';
            whatsappButton.target = '_blank';
            whatsappButton.rel = 'noopener noreferrer';
            whatsappButton.className = 'whatsapp-float';
            whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
            whatsappButton.title = 'Chat with us on WhatsApp';
            whatsappButton.setAttribute('aria-label', 'Chat with us on WhatsApp');
            document.body.appendChild(whatsappButton);
            
            const whatsappStyles = document.createElement('style');
            whatsappStyles.textContent = `
                .whatsapp-float {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: #25D366;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 1000;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }
                .whatsapp-float:hover {
                    transform: scale(1.1);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                    background: #128C7E;
                }
                @media (max-width: 768px) {
                    .whatsapp-float {
                        width: 50px;
                        height: 50px;
                        font-size: 1.5rem;
                        bottom: 20px;
                        right: 20px;
                    }
                }
            `;
            document.head.appendChild(whatsappStyles);
            
        });
        document.addEventListener('DOMContentLoaded', function() {
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
            
            fadeInOnScroll();
            
            window.addEventListener('scroll', fadeInOnScroll);
            
            const tabButtons = document.querySelectorAll('.tab-btn');
            const projectCards = document.querySelectorAll('.project-card');
            
            if (tabButtons.length > 0) {
                tabButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        tabButtons.forEach(btn => btn.classList.remove('active'));
                        
                        this.classList.add('active');
                        
                        const filter = this.dataset.filter;
                        
                        projectCards.forEach(card => {
                            if (filter === 'all' || card.dataset.category === filter) {
                                card.style.display = 'block';
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, 10);
                            } else {
                                card.style.opacity = '0';
                                card.style.transform = 'translateY(20px)';
                                setTimeout(() => {
                                    card.style.display = 'none';
                                }, 300);
                            }
                        });
                    });
                });
            }
            
            function updateCartCount() {
                try {
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
                    const cartBadge = document.getElementById('cart-count-badge');
                    if (cartBadge) {
                        cartBadge.textContent = cartCount;
                        cartBadge.style.display = cartCount > 0 ? 'inline-flex' : 'none';
                    }
                } catch (error) {
                    console.error('Error updating cart count:', error);
                }
            }
            
            updateCartCount();
            
            document.addEventListener('keydown', function (e) {
                if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                    window.location.href = '/admin/login';
                }
            });
        });
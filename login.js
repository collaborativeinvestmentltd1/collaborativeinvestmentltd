        document.addEventListener('DOMContentLoaded', function() {
            console.log('Dual login page loaded');
            
            // Update cart count
            function updateCartCount() {
                try {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                    const badge = document.getElementById('cart-count-badge');
                    if (badge) {
                        badge.textContent = totalItems;
                        badge.style.display = totalItems > 0 ? 'flex' : 'none';
                    }
                } catch (error) {
                    console.error('Error updating cart count:', error);
                }
            }
            
            updateCartCount();
            
            // Account Type Switching
            const customerBtn = document.getElementById('customer-btn');
            const investorBtn = document.getElementById('investor-btn');
            const customerCard = document.getElementById('customer-login-card');
            const investorCard = document.getElementById('investor-login-card');
            
            customerBtn.addEventListener('click', function() {
                customerBtn.classList.add('active');
                investorBtn.classList.remove('active');
                customerCard.style.display = 'block';
                investorCard.style.display = 'none';
                
                // Clear any existing messages
                clearMessages('customer');
                clearMessages('investor');
            });
            
            investorBtn.addEventListener('click', function() {
                investorBtn.classList.add('active');
                customerBtn.classList.remove('active');
                investorCard.style.display = 'block';
                customerCard.style.display = 'none';
                
                // Clear any existing messages
                clearMessages('customer');
                clearMessages('investor');
            });
            
            // Toggle Password Visibility
            function setupPasswordToggle(type) {
                const toggleBtn = document.getElementById(`${type}-toggle-password`);
                const passwordInput = document.getElementById(`${type}-password`);
                
                if (toggleBtn && passwordInput) {
                    toggleBtn.addEventListener('click', function() {
                        const currentType = passwordInput.getAttribute('type');
                        const newType = currentType === 'password' ? 'text' : 'password';
                        passwordInput.setAttribute('type', newType);
                        this.textContent = newType === 'password' ? '👁️' : '';
                    });
                }
            }
            
            setupPasswordToggle('customer');
            setupPasswordToggle('investor');
            
            // Show/Hide Messages
            function showMessage(type, message, accountType = 'customer') {
                const container = document.getElementById(`${accountType}-${type}-message`);
                if (container) {
                    container.textContent = message;
                    container.style.display = 'block';
                    
                    // Hide other messages for this account type
                    const allMessages = ['success', 'error', 'warning'];
                    allMessages.filter(t => t !== type).forEach(t => {
                        const otherMessage = document.getElementById(`${accountType}-${t}-message`);
                        if (otherMessage) otherMessage.style.display = 'none';
                    });
                    
                    // Auto hide success messages after 5 seconds
                    if (type === 'success') {
                        setTimeout(() => {
                            container.style.display = 'none';
                        }, 5000);
                    }
                }
            }
            
            function clearMessages(accountType) {
                const messages = ['success', 'error', 'warning'];
                messages.forEach(type => {
                    const container = document.getElementById(`${accountType}-${type}-message`);
                    if (container) container.style.display = 'none';
                });
                
                // Clear error displays
                const emailError = document.getElementById(`${accountType}-email-error`);
                const passwordError = document.getElementById(`${accountType}-password-error`);
                if (emailError) {
                    emailError.classList.remove('show');
                    emailError.textContent = '';
                }
                if (passwordError) {
                    passwordError.classList.remove('show');
                    passwordError.textContent = '';
                }
            }
            
            // Form Validation
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            function validatePassword(password) {
                return password.length >= 6;
            }
            
            // Login Functions
            function setupLoginForm(accountType) {
                const form = document.getElementById(`${accountType}-login-form`);
                const loginButton = document.getElementById(`${accountType}-login-button`);
                const loginText = document.getElementById(`${accountType}-login-text`);
                const loginSpinner = document.getElementById(`${accountType}-login-spinner`);
                
                if (!form) return;
                
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    // Get form values
                    const email = document.getElementById(`${accountType}-email`).value.trim();
                    const password = document.getElementById(`${accountType}-password`).value.trim();
                    const rememberMe = document.getElementById(`${accountType}-remember-me`).checked;
                    
                    // Clear previous errors
                    clearMessages(accountType);
                    
                    // Validate
                    let isValid = true;
                    
                    if (!validateEmail(email)) {
                        const emailError = document.getElementById(`${accountType}-email-error`);
                        emailError.textContent = 'Please enter a valid email address';
                        emailError.classList.add('show');
                        isValid = false;
                    }
                    
                    if (!validatePassword(password)) {
                        const passwordError = document.getElementById(`${accountType}-password-error`);
                        passwordError.textContent = 'Password must be at least 6 characters';
                        passwordError.classList.add('show');
                        isValid = false;
                    }
                    
                    if (!isValid) {
                        showMessage('error', 'Please fix the errors in the form', accountType);
                        return;
                    }
                    
                    // Show loading state
                    loginButton.disabled = true;
                    loginText.textContent = 'Signing in...';
                    loginSpinner.style.display = 'block';
                    
                    try {
                        // Send login request
                        const response = await fetch('/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email,
                                password,
                                accountType,
                                rememberMe
                            })
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok) {
                            showMessage('success', `Login successful! Redirecting to ${accountType} dashboard...`, accountType);
                            
                            // Save login state
                            if (rememberMe) {
                                localStorage.setItem(`${accountType}Email`, email);
                                localStorage.setItem('lastAccountType', accountType);
                            }
                            
                            // Determine redirect URL based on account type
                            let redirectUrl = '/customer-dashboard';
                            if (accountType === 'investor') {
                                redirectUrl = '/investor-dashboard';
                            }
                            
                            // Redirect after 1.5 seconds
                            setTimeout(() => {
                                window.location.href = redirectUrl;
                            }, 1500);
                        } else {
                            showMessage('error', data.message || 'Login failed. Please check your credentials.', accountType);
                            loginButton.disabled = false;
                            loginText.textContent = accountType === 'customer' ? 'Sign In as Customer' : 'Sign In as Investor';
                            loginSpinner.style.display = 'none';
                        }
                    } catch (error) {
                        console.error('Login error:', error);
                        showMessage('error', 'Network error. Please try again.', accountType);
                        loginButton.disabled = false;
                        loginText.textContent = accountType === 'customer' ? 'Sign In as Customer' : 'Sign In as Investor';
                        loginSpinner.style.display = 'none';
                    }
                });
            }
            
            // Setup both login forms
            setupLoginForm('customer');
            setupLoginForm('investor');
            
            // Check for saved email and account type
            const lastAccountType = localStorage.getItem('lastAccountType') || 'customer';
            const savedCustomerEmail = localStorage.getItem('customerEmail');
            const savedInvestorEmail = localStorage.getItem('investorEmail');
            
            if (lastAccountType === 'customer' && savedCustomerEmail) {
                document.getElementById('customer-email').value = savedCustomerEmail;
                document.getElementById('customer-remember-me').checked = true;
                // Activate customer tab if saved as last used
                customerBtn.click();
            } else if (lastAccountType === 'investor' && savedInvestorEmail) {
                document.getElementById('investor-email').value = savedInvestorEmail;
                document.getElementById('investor-remember-me').checked = true;
                // Activate investor tab if saved as last used
                investorBtn.click();
            }
            
            // Check URL for messages and account type
            const urlParams = new URLSearchParams(window.location.search);
            const message = urlParams.get('message');
            const messageType = urlParams.get('type');
            const urlAccountType = urlParams.get('accountType');
            
            if (message && messageType && urlAccountType) {
                showMessage(messageType, decodeURIComponent(message), urlAccountType);
                
                // Switch to appropriate tab
                if (urlAccountType === 'customer') {
                    customerBtn.click();
                } else if (urlAccountType === 'investor') {
                    investorBtn.click();
                }
                
                // Clean URL
                const url = new URL(window.location);
                url.searchParams.delete('message');
                url.searchParams.delete('type');
                url.searchParams.delete('accountType');
                window.history.replaceState({}, '', url);
            }
            
            // Add fade-in animation to elements
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            // Add WhatsApp float button
            const whatsappButton = document.createElement('a');
            whatsappButton.href = 'https://wa.me/2348129978419';
            whatsappButton.target = '_blank';
            whatsappButton.rel = 'noopener noreferrer';
            whatsappButton.className = 'whatsapp-float';
            whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
            whatsappButton.title = 'Chat with us on WhatsApp';
            whatsappButton.setAttribute('aria-label', 'Chat with us on WhatsApp');
            document.body.appendChild(whatsappButton);
            
            // Add WhatsApp button styles
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
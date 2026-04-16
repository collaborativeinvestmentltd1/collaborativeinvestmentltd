        // Multi-step form navigation
        let currentStep = 1;
        let currentRegistrationType = 'customer';
        let selectedCustomerPreferences = [];
        let selectedInvestments = [];
        let selectedPaymentMethod = null;
        let depositAmount = 0;
        let skipDeposit = false;
        const registrationFormData = {};

        // Select registration type
        function selectRegistrationType(type) {
            currentRegistrationType = type;
            
            // Update UI selection
            document.querySelectorAll('.registration-type-card').forEach(card => {
                card.classList.remove('selected');
            });
            document.querySelector(`.registration-type-card.${type}`).classList.add('selected');
            
            // Update form styling
            const form = document.getElementById('registration-form');
            const progress = document.getElementById('form-progress');
            form.classList.remove('customer-form', 'investor-form');
            progress.classList.remove('customer-progress', 'investor-progress');
            
            if (type === 'customer') {
                form.classList.add('customer-form');
                progress.classList.add('customer-progress');
            } else {
                form.classList.add('investor-form');
                progress.classList.add('investor-progress');
            }
            
            // Update hero section
            updateHeroSection(type);
            
            // Update step 2 content
            updateStep2Content(type);
            
            // Update payment step for investor
            updatePaymentStep(type);
            
            // Update benefits
            updateBenefits(type);
            
            // Update tier features
            updateTierFeatures();
        }

        // Update hero section based on registration type
        function updateHeroSection(type) {
            const title = document.getElementById('registration-title');
            const subtitle = document.getElementById('registration-subtitle');
            
            if (type === 'customer') {
                title.textContent = 'Create Your Customer Account';
                subtitle.textContent = 'Shop quality products, track orders, and enjoy exclusive deals';
                
                // Update stats
                document.getElementById('stat1-value').textContent = '1,000+';
                document.getElementById('stat1-label').textContent = 'Products';
                document.getElementById('stat2-value').textContent = '24/7';
                document.getElementById('stat2-label').textContent = 'Support';
                document.getElementById('stat3-value').textContent = '₦0';
                document.getElementById('stat3-label').textContent = 'Min. Order';
                document.getElementById('stat4-value').textContent = '8';
                document.getElementById('stat4-label').textContent = 'Sectors';
            } else {
                title.textContent = 'Start Your Investment Journey';
                subtitle.textContent = 'Join over 500 investors who trust CIL to grow their wealth';
                
                // Update stats
                document.getElementById('stat1-value').textContent = '18-38%';
                document.getElementById('stat1-label').textContent = 'Avg. ROI';
                document.getElementById('stat2-value').textContent = '50+';
                document.getElementById('stat2-label').textContent = 'Investors';
                document.getElementById('stat3-value').textContent = '₦5M';
                document.getElementById('stat3-label').textContent = 'Minimum';
                document.getElementById('stat4-value').textContent = '8';
                document.getElementById('stat4-label').textContent = 'Sectors';
            }
        }

        // Update step 2 content based on registration type
        function updateStep2Content(type) {
            const step2Title = document.getElementById('step2-title');
            const step2Description = document.getElementById('step2-description');
            const step2Label = document.getElementById('step2-label');
            const customerSection = document.getElementById('customer-preferences-section');
            const investorSection = document.getElementById('investor-preferences-section');
            
            if (type === 'customer') {
                step2Title.textContent = 'Customer Preferences';
                step2Description.textContent = 'Select your shopping preferences';
                step2Label.textContent = 'Preferences';
                customerSection.style.display = 'block';
                investorSection.style.display = 'none';
            } else {
                step2Title.textContent = 'Investment Preferences';
                step2Description.textContent = 'Select your preferred investment models and sectors';
                step2Label.textContent = 'Investment';
                customerSection.style.display = 'none';
                investorSection.style.display = 'block';
            }
        }

        // Update payment step based on registration type
        function updatePaymentStep(type) {
            const paymentTitle = document.getElementById('payment-step-title');
            const paymentDescription = document.getElementById('payment-step-description');
            const investorNotice = document.getElementById('investor-requirement-notice');
            const customerDepositSection = document.getElementById('customer-deposit-section');
            const investorDepositSection = document.getElementById('investor-deposit-section');
            
            if (type === 'customer') {
                paymentTitle.textContent = 'Optional Initial Deposit';
                paymentDescription.textContent = 'You can make an initial deposit now or skip and fund your account later';
                investorNotice.style.display = 'none';
                customerDepositSection.style.display = 'block';
                investorDepositSection.style.display = 'none';
                
                // Reset skip deposit checkbox for customer
                document.getElementById('skipDeposit').checked = false;
                toggleDepositSection();
            } else {
                paymentTitle.textContent = 'Investment Commitment';
                paymentDescription.textContent = 'Minimum investment requirement is ₦5,000,000. Payment is required to complete registration.';
                investorNotice.style.display = 'block';
                customerDepositSection.style.display = 'none';
                investorDepositSection.style.display = 'block';
                
                // Set minimum amount for investor
                document.getElementById('investorDepositAmount').min = 5000000;
                document.getElementById('investorDepositAmount').required = true;
            }
            
            // Generate new payment reference
            generatePaymentReference();
        }

        // Update benefits section
        function updateBenefits(type) {
            const benefitsTitle = document.getElementById('benefits-title');
            
            if (type === 'customer') {
                benefitsTitle.textContent = 'Why Register as Customer?';
                
                // Show customer benefits, hide investor benefits
                for (let i = 1; i <= 3; i++) {
                    document.getElementById(`benefit-customer-${i}`).style.display = 'flex';
                    document.getElementById(`benefit-investor-${i}`).style.display = 'none';
                }
            } else {
                benefitsTitle.textContent = 'Why Register as Investor?';
                
                // Show investor benefits, hide customer benefits
                for (let i = 1; i <= 3; i++) {
                    document.getElementById(`benefit-customer-${i}`).style.display = 'none';
                    document.getElementById(`benefit-investor-${i}`).style.display = 'flex';
                }
            }
        }

        // Toggle customer preferences
        function toggleCustomerPreference(element) {
            const value = element.getAttribute('data-value');
            const index = selectedCustomerPreferences.indexOf(value);
            
            if (index === -1) {
                selectedCustomerPreferences.push(value);
                element.classList.add('selected');
            } else {
                selectedCustomerPreferences.splice(index, 1);
                element.classList.remove('selected');
            }
        }

        // Toggle investment options
        function toggleInvestmentOption(element) {
            const value = element.getAttribute('data-value');
            const index = selectedInvestments.indexOf(value);
            
            if (index === -1) {
                selectedInvestments.push(value);
                element.classList.add('selected');
            } else {
                selectedInvestments.splice(index, 1);
                element.classList.remove('selected');
            }
        }

        // Toggle deposit section (for customers only)
        function toggleDepositSection() {
            if (currentRegistrationType === 'customer') {
                skipDeposit = document.getElementById('skipDeposit').checked;
                const depositSection = document.getElementById('deposit-section');
                
                if (skipDeposit) {
                    depositSection.style.display = 'none';
                } else {
                    depositSection.style.display = 'block';
                }
            }
        }

        // Select payment method
        function selectPaymentMethod(method) {
            selectedPaymentMethod = method;
            
            // Update UI selection
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector(`.payment-option[onclick*="${method}"]`).classList.add('selected');
            
            // Show bank transfer details if selected
            const bankDetails = document.getElementById('bank-transfer-details');
            if (method === 'bank') {
                bankDetails.classList.add('active');
            } else {
                bankDetails.classList.remove('active');
            }
        }

        // Generate payment reference
        function generatePaymentReference() {
            const refNumber = Math.floor(100000 + Math.random() * 900000);
            document.getElementById('ref-number').textContent = refNumber;
            return `CIL-REG-${refNumber}`;
        }

        // Copy to clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }

        // Update tier features based on verification method
        function updateTierFeatures() {
            const verificationMethod = document.getElementById('verificationMethod').value;
            const tierName = document.getElementById('tier-name');
            const tierFeatures = document.getElementById('tier-features');
            
            let features = [];
            
            if (!verificationMethod) {
                tierName.textContent = 'Basic';
                features = [
                    'Limited dashboard access',
                    'Basic profile viewing',
                    'Email notifications only',
                    'KYC required for full access'
                ];
            } else if (verificationMethod === 'email') {
                tierName.textContent = 'Email Verified';
                features = [
                    'Full dashboard access',
                    'Profile management',
                    'Email & SMS notifications',
                    'Basic investment browsing',
                    'KYC required for transactions'
                ];
            } else if (verificationMethod === 'phone') {
                tierName.textContent = 'Phone Verified';
                features = [
                    'Full dashboard access',
                    'Profile management',
                    'Email & SMS notifications',
                    'Basic investment browsing',
                    'KYC required for transactions'
                ];
            } else if (verificationMethod === 'both') {
                tierName.textContent = 'Fully Verified';
                features = [
                    'Full dashboard access',
                    'Profile management',
                    'Email & SMS notifications',
                    'Complete investment access',
                    'Transaction capabilities',
                    'Priority support'
                ];
            }
            
            // Update tier features list
            tierFeatures.innerHTML = '';
            features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
                tierFeatures.appendChild(li);
            });
        }

        // Form navigation functions
        function nextStep(step) {
            // Validate current step before proceeding
            if (!validateStep(currentStep)) {
                return;
            }
            
            // Save current step data
            saveStepData(currentStep);
            
            // Hide current step
            document.getElementById(`step-${currentStep}`).classList.remove('active');
            document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
            
            // Show next step
            document.getElementById(`step-${step}`).classList.add('active');
            document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
            
            // Mark previous step as completed
            document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');
            
            currentStep = step;
            
            // Update payment reference on step 3
            if (step === 3) {
                generatePaymentReference();
            }
        }

        function prevStep(step) {
            // Hide current step
            document.getElementById(`step-${currentStep}`).classList.remove('active');
            document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
            
            // Show previous step
            document.getElementById(`step-${step}`).classList.add('active');
            document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
            
            // Remove completed status from current step
            document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('completed');
            
            currentStep = step;
        }

        function validateStep(step) {
            switch(step) {
                case 1:
                    const firstName = document.getElementById('firstName').value.trim();
                    const lastName = document.getElementById('lastName').value.trim();
                    const email = document.getElementById('email').value.trim();
                    const phone = document.getElementById('phone').value.trim();
                    
                    if (!firstName || !lastName || !email || !phone) {
                        alert('Please fill in all required fields in Step 1');
                        return false;
                    }
                    
                    if (!validateEmail(email)) {
                        alert('Please enter a valid email address');
                        return false;
                    }
                    
                    return true;
                    
                case 2:
                    // For customer registration, preferences are optional
                    if (currentRegistrationType === 'customer') {
                        return true;
                    }
                    
                    // For investor registration, validate investment preferences
                    if (selectedInvestments.length === 0) {
                        alert('Please select at least one investment interest');
                        return false;
                    }
                    
                    const investmentAmount = document.getElementById('investmentAmount').value;
                    if (!investmentAmount) {
                        alert('Please select your investment range');
                        return false;
                    }
                    
                    return true;
                    
                case 3:
                    // For investor, mandatory minimum investment validation
                    if (currentRegistrationType === 'investor') {
                        const depositAmt = parseFloat(document.getElementById('investorDepositAmount').value);
                        if (isNaN(depositAmt) || depositAmt < 5000000) {
                            alert('Minimum investment for investor account is ₦5,000,000');
                            return false;
                        }
                        
                        if (!selectedPaymentMethod) {
                            alert('Please select a payment method');
                            return false;
                        }
                        
                        // Validate bank transfer proof if selected
                        if (selectedPaymentMethod === 'bank') {
                            const paymentProof = document.getElementById('paymentProof').files[0];
                            if (!paymentProof) {
                                alert('Please upload proof of payment for bank transfer');
                                return false;
                            }
                        }
                    }
                    
                    // For customer and not skipping deposit
                    if (currentRegistrationType === 'customer' && !skipDeposit) {
                        const depositAmt = parseFloat(document.getElementById('depositAmount').value);
                        if (!isNaN(depositAmt) && depositAmt > 0 && depositAmt < 5000) {
                            alert('Minimum deposit amount is ₦5,000');
                            return false;
                        }
                        
                        if (depositAmt > 0 && !selectedPaymentMethod) {
                            alert('Please select a payment method');
                            return false;
                        }
                    }
                    
                    return true;
                    
                case 4:
                    const password = document.getElementById('password').value;
                    const confirmPassword = document.getElementById('confirmPassword').value;
                    
                    if (!password || !confirmPassword) {
                        alert('Please fill in both password fields');
                        return false;
                    }
                    
                    if (password !== confirmPassword) {
                        alert('Passwords do not match');
                        return false;
                    }
                    
                    if (password.length < 8) {
                        alert('Password must be at least 8 characters long');
                        return false;
                    }
                    
                    return true;
                    
                case 5:
                    const terms = document.getElementById('terms');
                    const verificationMethod = document.getElementById('verificationMethod').value;
                    
                    if (!terms.checked) {
                        alert('You must agree to the Terms of Service and Privacy Policy');
                        return false;
                    }
                    
                    if (!verificationMethod) {
                        alert('Please select a verification method');
                        return false;
                    }
                    
                    return true;
                    
                default:
                    return true;
            }
        }

        function saveStepData(step) {
            switch(step) {
                case 1:
                    registrationFormData.personal = {
                        firstName: document.getElementById('firstName').value,
                        lastName: document.getElementById('lastName').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        country: document.getElementById('country').value,
                        referral: document.getElementById('referral').value
                    };
                    break;
                    
                case 2:
                    if (currentRegistrationType === 'customer') {
                        registrationFormData.preferences = {
                            interests: [...selectedCustomerPreferences],
                            shippingAddress: document.getElementById('shippingAddress').value
                        };
                    } else {
                        registrationFormData.investment = {
                            interests: [...selectedInvestments],
                            amount: document.getElementById('investmentAmount').value,
                            duration: document.getElementById('investmentDuration').value,
                            sectors: Array.from(document.getElementById('sectorInterest').selectedOptions).map(opt => opt.value)
                        };
                    }
                    break;
                    
                case 3:
                    if (currentRegistrationType === 'customer') {
                        skipDeposit = document.getElementById('skipDeposit').checked;
                        depositAmount = skipDeposit ? 0 : parseFloat(document.getElementById('depositAmount').value) || 0;
                    } else {
                        // Investor: mandatory deposit
                        skipDeposit = false;
                        depositAmount = parseFloat(document.getElementById('investorDepositAmount').value) || 0;
                    }
                    
                    registrationFormData.payment = {
                        skipDeposit: skipDeposit,
                        depositAmount: depositAmount,
                        paymentMethod: selectedPaymentMethod,
                        paymentReference: generatePaymentReference(),
                        paymentProof: selectedPaymentMethod === 'bank' ? document.getElementById('paymentProof').files[0] : null
                    };
                    break;
                    
                case 4:
                    registrationFormData.security = {
                        password: document.getElementById('password').value,
                        question: document.getElementById('securityQuestion').value,
                        answer: document.getElementById('securityAnswer').value
                    };
                    break;
                    
                case 5:
                    registrationFormData.terms = {
                        acceptedTerms: document.getElementById('terms').checked,
                        communications: document.getElementById('communications').checked,
                        verification: document.getElementById('verificationMethod').value
                    };
                    break;
            }
        }

        // Password strength and validation
        function checkPasswordStrength() {
            const password = document.getElementById('password').value;
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            
            let strength = 0;
            let text = 'Password strength';
            let color = '#e53e3e';
            
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            switch(strength) {
                case 0:
                    color = '#e53e3e';
                    text = 'Very weak';
                    break;
                case 1:
                    color = '#e53e3e';
                    text = 'Weak';
                    break;
                case 2:
                    color = '#d69e2e';
                    text = 'Fair';
                    break;
                case 3:
                    color = '#38a169';
                    text = 'Good';
                    break;
                case 4:
                    color = '#38a169';
                    text = 'Strong';
                    break;
            }
            
            strengthFill.style.width = `${strength * 25}%`;
            strengthFill.style.background = color;
            strengthText.textContent = text;
            strengthText.style.color = color;
        }

        function checkPasswordMatch() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const matchText = document.getElementById('passwordMatchText');
            
            if (!confirmPassword) {
                matchText.textContent = '';
                return;
            }
            
            if (password === confirmPassword) {
                matchText.textContent = 'Passwords match';
                matchText.style.color = '#38a169';
            } else {
                matchText.textContent = 'Passwords do not match';
                matchText.style.color = '#e53e3e';
            }
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Process payment with selected gateway
        async function processPayment() {
            if (currentRegistrationType === 'customer' && skipDeposit) {
                return { success: true, paymentId: null };
            }
            
            if (depositAmount <= 0) {
                return { success: false, message: 'Deposit amount is required' };
            }
            
            const email = registrationFormData.personal.email;
            const amount = depositAmount * 100; // Convert to kobo
            const reference = registrationFormData.payment.paymentReference;
            
            if (selectedPaymentMethod === 'paystack') {
                return await processPaystackPayment(email, amount, reference);
            } else if (selectedPaymentMethod === 'flutterwave') {
                return await processFlutterwavePayment(email, amount, reference);
            } else if (selectedPaymentMethod === 'bank') {
                // For bank transfer, we just need to verify the proof upload
                return { success: true, paymentId: reference, method: 'bank_transfer' };
            }
            
            return { success: false, message: 'Invalid payment method' };
        }

        // Process Paystack payment
        function processPaystackPayment(email, amount, reference) {
            return new Promise((resolve) => {
                const handler = PaystackPop.setup({
                    key: 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY', // Replace with actual key
                    email: email,
                    amount: amount,
                    ref: reference,
                    callback: function(response) {
                        resolve({ 
                            success: true, 
                            paymentId: response.reference,
                            method: 'paystack'
                        });
                    },
                    onClose: function() {
                        resolve({ 
                            success: false, 
                            message: 'Payment cancelled' 
                        });
                    }
                });
                handler.openIframe();
            });
        }

        // Process Flutterwave payment
        function processFlutterwavePayment(email, amount, reference) {
            return new Promise((resolve) => {
                FlutterwaveCheckout({
                    public_key: 'FLWPUBK_TEST_YOUR_PUBLIC_KEY', // Replace with actual key
                    tx_ref: reference,
                    amount: amount / 100, // Convert back to Naira
                    currency: 'NGN',
                    payment_options: 'card, banktransfer, ussd',
                    customer: {
                        email: email,
                        phone_number: registrationFormData.personal.phone,
                        name: `${registrationFormData.personal.firstName} ${registrationFormData.personal.lastName}`
                    },
                    customizations: {
                        title: 'CIL Registration Deposit',
                        description: 'Initial deposit for account setup',
                        logo: '/img/logo.jpg'
                    },
                    callback: function(data) {
                        resolve({ 
                            success: true, 
                            paymentId: data.transaction_id,
                            method: 'flutterwave'
                        });
                    },
                    onclose: function() {
                        resolve({ 
                            success: false, 
                            message: 'Payment cancelled' 
                        });
                    }
                });
            });
        }

        // Submit registration
        async function submitRegistration() {
            if (!validateStep(5)) {
                return;
            }
            
            saveStepData(5);
            
            // Process payment if applicable
            if (currentRegistrationType === 'investor' || (currentRegistrationType === 'customer' && !skipDeposit && depositAmount > 0)) {
                const paymentResult = await processPayment();
                if (!paymentResult.success) {
                    alert(`Payment failed: ${paymentResult.message}`);
                    return;
                }
                registrationFormData.payment.paymentResult = paymentResult;
            }
            
            // Prepare data for API
            const apiData = {
                firstName: registrationFormData.personal.firstName,
                lastName: registrationFormData.personal.lastName,
                email: registrationFormData.personal.email,
                phone: registrationFormData.personal.phone,
                password: registrationFormData.security.password,
                accountType: currentRegistrationType,
                country: registrationFormData.personal.country,
                referral: registrationFormData.personal.referral,
                verificationMethod: registrationFormData.terms.verification,
                acceptsTerms: registrationFormData.terms.acceptedTerms,
                acceptsCommunications: registrationFormData.terms.communications,
                payment: registrationFormData.payment,
                tier: document.getElementById('tier-name').textContent
            };
            
            // Add preferences based on account type
            if (currentRegistrationType === 'customer') {
                apiData.preferences = registrationFormData.preferences;
                apiData.role = 'customer';
                apiData.kycStatus = 'pending';
            } else {
                apiData.investmentPreferences = registrationFormData.investment;
                apiData.role = 'investor';
                apiData.kycStatus = 'pending';
                apiData.investmentStatus = 'deposit_pending';
                // Generate investor ID
                apiData.investorId = 'CIL-INV-' + Date.now().toString().slice(-6);
            }
            
            try {
                // Show loading state
                const submitBtn = document.querySelector('#step-5 .btn-primary');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // Send registration data to backend API
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(apiData)
                });
                
                const data = await response.json();
                
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                if (data.success) {
                    // Update success message
                    const successTitle = document.getElementById('success-title');
                    const successMessage = document.getElementById('successMessage');
                    const redirectMessage = document.getElementById('redirect-message');
                    
                    if (currentRegistrationType === 'customer') {
                        successTitle.textContent = 'Customer Account Created!';
                        if (depositAmount > 0) {
                            successMessage.innerHTML = `
                                Your customer account has been created successfully!<br>
                                <strong>Initial deposit: ₦${depositAmount.toLocaleString()}</strong><br>
                                Please check your email for verification instructions and payment confirmation.
                            `;
                        } else {
                            successMessage.textContent = 'Your customer account has been created successfully. Please check your email for verification instructions.';
                        }
                        redirectMessage.textContent = 'You will be redirected to the customer dashboard shortly.';
                    } else {
                        successTitle.textContent = 'Investor Account Created!';
                        successMessage.innerHTML = `
                            Your investor account has been created successfully!<br>
                            <strong>Initial investment: ₦${depositAmount.toLocaleString()}</strong><br>
                            An account manager will contact you within 24 hours to discuss your investment portfolio.
                        `;
                        redirectMessage.textContent = 'You will be redirected to the investor dashboard shortly.';
                    }
                    
                    // Show success message
                    document.getElementById(`step-${currentStep}`).classList.remove('active');
                    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
                    document.getElementById('step-success').classList.add('active');
                    
                    // Mark all steps as completed
                    document.querySelectorAll('.progress-step').forEach(step => {
                        step.classList.add('completed');
                    });
                    
                    // Store user data in session
                    if (data.user) {
                        localStorage.setItem('userData', JSON.stringify(data.user));
                        localStorage.setItem('accountType', currentRegistrationType);
                        localStorage.setItem('kycStatus', 'pending');
                        if (currentRegistrationType === 'investor') {
                            localStorage.setItem('investmentAmount', depositAmount);
                        }
                    }
                    
                    // Send welcome notification
                    sendWelcomeNotification(data.user);
                    
                } else {
                    alert('Registration failed: ' + data.message);
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Error submitting registration. Please try again.');
                
                // Reset button state
                const submitBtn = document.querySelector('#step-5 .btn-primary');
                submitBtn.innerHTML = 'Complete Registration <i class="fas fa-check"></i>';
                submitBtn.disabled = false;
            }
        }

        // Send welcome notification
        function sendWelcomeNotification(user) {
            // Send welcome email/SMS notification
            fetch('/api/send-welcome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    phone: user.phone,
                    name: `${user.firstName} ${user.lastName}`,
                    accountType: currentRegistrationType,
                    depositAmount: depositAmount
                })
            }).catch(error => {
                console.error('Error sending welcome notification:', error);
            });
        }

        function redirectToDashboard() {
            if (currentRegistrationType === 'customer') {
                window.location.href = '/customer-dashboard';
            } else {
                window.location.href = '/investor-dashboard';
            }
        }

        function startKYC() {
            if (currentRegistrationType === 'customer') {
                window.location.href = '/customer-dashboard/kyc';
            } else {
                window.location.href = '/investor-dashboard/kyc';
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize cart count
            updateCartCount();
            
            // Check URL for registration type
            const urlParams = new URLSearchParams(window.location.search);
            const typeFromUrl = urlParams.get('type');
            
            if (typeFromUrl && (typeFromUrl === 'customer' || typeFromUrl === 'investor')) {
                selectRegistrationType(typeFromUrl);
            }
            
            // Generate initial payment reference
            generatePaymentReference();
            
            // Initialize tier features
            updateTierFeatures();
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
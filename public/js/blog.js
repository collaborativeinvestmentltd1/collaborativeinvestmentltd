        // Reading time estimation and view counter simulation
        document.addEventListener('DOMContentLoaded', function() {
            // Estimate reading time
            const articleText = document.querySelector('.article-body').textContent;
            const wordCount = articleText.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
            
            // Update reading time in meta (if element exists)
            const readingTimeElement = document.querySelector('.article-meta span:nth-child(2)');
            if (readingTimeElement) {
                readingTimeElement.textContent = `⏱ ${readingTime} min read`;
            }
            
            // Simulate view count (in a real implementation, this would come from a backend)
            const viewCount = Math.floor(Math.random() * 500) + 1500;
            const viewCountElement = document.querySelector('.article-meta span:nth-child(3)');
            if (viewCountElement) {
                viewCountElement.textContent = `👁 ${viewCount.toLocaleString()} views`;
            }
            
            // Newsletter form handling
            document.getElementById('newsletterForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                const button = this.querySelector('button');
                const originalText = button.textContent;
                
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
            });
            
            // Mobile menu functionality
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.navbar')) {
                    navLinks.style.display = 'none';
                }
            });
        });
/* ==========================================
   VoltX Electronics - Contact Page Logic
   Form handling, FAQ accordion, store status
   ========================================== */

(function() {

    // ==========================================
    // Store Open/Closed Status
    // ==========================================
    const storeStatus = document.getElementById('storeStatus');
    if (storeStatus) {
        function updateStoreStatus() {
            const now = new Date();
            const day = now.getDay(); // 0=Sun, 1=Mon...
            const hour = now.getHours();
            const minutes = now.getMinutes();
            const time = hour + minutes / 60;

            let isOpen = false;
            let message = '';

            if (day === 0) {
                // Sunday: 11AM - 7PM
                isOpen = time >= 11 && time < 19;
                message = isOpen ? '🟢 Open Now (Closes at 7 PM)' : '🔴 Closed (Opens Mon 10 AM)';
            } else if (day >= 1 && day <= 6) {
                // Mon-Sat: 10AM - 9PM
                isOpen = time >= 10 && time < 21;
                if (isOpen) {
                    message = '🟢 Open Now (Closes at 9 PM)';
                } else if (time < 10) {
                    message = '🔴 Closed (Opens at 10 AM)';
                } else {
                    if (day === 6) {
                        message = '🔴 Closed (Opens Sun 11 AM)';
                    } else {
                        message = '🔴 Closed (Opens tomorrow 10 AM)';
                    }
                }
            }

            storeStatus.textContent = message;
            storeStatus.className = 'store-status ' + (isOpen ? 'store-open' : 'store-closed');
        }

        updateStoreStatus();
        setInterval(updateStoreStatus, 60000); // Update every minute
    }

    // ==========================================
    // FAQ Accordion
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(faq => faq.classList.remove('active'));

            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ==========================================
    // Contact Form Handling
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation visual feedback
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            let valid = true;

            inputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    input.style.borderColor = '#d63031';
                    valid = false;
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!valid) return;

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
            }, 1200);
        });

        // Clear error styling on input
        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });
    }

})();

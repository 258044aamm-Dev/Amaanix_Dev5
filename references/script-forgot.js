/**
 * Forgot Password Page Script
 * Handles email validation and form submission
 */
(function() {
    'use strict';

    // Email validation helper
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // DOM ready handler
    document.addEventListener('DOMContentLoaded', function() {
        const resetEmail = document.getElementById('reset-email');
        const resetEmailError = document.getElementById('reset-email-error');
        const forgotForm = document.getElementById('forgot-password-form');
        const successMessage = document.getElementById('successMessage');

        // Email field validation
        if (resetEmail && resetEmailError) {
            resetEmail.addEventListener('blur', function() {
                if (this.value && !isValidEmail(this.value)) {
                    resetEmailError.textContent = 'Please enter a valid email address';
                    resetEmailError.classList.add('visible');
                    this.classList.add('invalid');
                    this.classList.remove('valid');
                } else if (this.value) {
                    resetEmailError.textContent = '';
                    resetEmailError.classList.remove('visible');
                    this.classList.remove('invalid');
                    this.classList.add('valid');
                }
            });

            resetEmail.addEventListener('input', function() {
                if (this.classList.contains('invalid') && isValidEmail(this.value)) {
                    resetEmailError.textContent = '';
                    resetEmailError.classList.remove('visible');
                    this.classList.remove('invalid');
                    this.classList.add('valid');
                }
            });
        }

        // Form submission handler
        if (forgotForm) {
            forgotForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('reset-email');
                let valid = true;

                // Validate email
                if (!isValidEmail(email.value)) {
                    resetEmailError.textContent = 'Please enter a valid email address';
                    resetEmailError.classList.add('visible');
                    email.classList.add('invalid');
                    valid = false;
                }

                if (valid) {
                    // Simulate API call
                    forgotForm.classList.add('loading');
                    const submitBtn = forgotForm.querySelector('.auth-form__submit');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;

                    // Mock async operation
                    setTimeout(function() {
                        forgotForm.classList.remove('loading');
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        forgotForm.style.display = 'none';
                        successMessage.removeAttribute('hidden');
                    }, 1500);
                }
            });
        }
    });
})();

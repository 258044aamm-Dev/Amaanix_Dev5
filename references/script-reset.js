/**
 * Reset Password Page Script
 * Handles password validation, requirements checking, and form submission
 *
 * [FIX #9]  Empty confirm password now properly validated
 * [FIX #10] Multiple password errors collected and shown together (not overwritten)
 * [FIX #19] originalText is now restored on error/failure scenarios
 */
(function() {
    'use strict';

    // Password validation helpers
    function checkPasswordRequirements(password) {
        return {
            length: password.length >= 8,
            number: /\d/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
    }

    function updatePasswordUI(password) {
        const requirements = checkPasswordRequirements(password);
        
        // Update requirement indicators
        const reqLength = document.getElementById('req-length');
        const reqNumber = document.getElementById('req-number');
        const reqSpecial = document.getElementById('req-special');
        
        if (reqLength) {
            reqLength.classList.toggle('auth-form__requirement--met', requirements.length);
            reqLength.classList.toggle('auth-form__requirement--unmet', !requirements.length);
        }
        if (reqNumber) {
            reqNumber.classList.toggle('auth-form__requirement--met', requirements.number);
            reqNumber.classList.toggle('auth-form__requirement--unmet', !requirements.number);
        }
        if (reqSpecial) {
            reqSpecial.classList.toggle('auth-form__requirement--met', requirements.special);
            reqSpecial.classList.toggle('auth-form__requirement--unmet', !requirements.special);
        }
    }

    // Toggle password visibility
    function togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const btn = document.querySelector('[data-toggle-password="' + inputId + '"]');
        if (!input || !btn) return;
        
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isPassword ? 'ph ph-eye-slash' : 'ph ph-eye';
        }
    }

    // DOM ready handler
    document.addEventListener('DOMContentLoaded', function() {
        const newPasswordInput = document.getElementById('new-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const newPasswordError = document.getElementById('new-password-error');
        const confirmPasswordError = document.getElementById('confirm-password-error');
        const resetForm = document.getElementById('reset-form');
        const successMessage = document.getElementById('reset-success');

        // Password toggle buttons
        document.querySelectorAll('[data-toggle-password]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const inputId = this.getAttribute('data-toggle-password');
                togglePasswordVisibility(inputId);
            });
        });

        // Real-time password validation
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function() {
                updatePasswordUI(this.value);
                
                if (this.value.length > 0 && this.value.length < 8) {
                    newPasswordError.textContent = 'Password must be at least 8 characters';
                    newPasswordError.classList.add('visible');
                    this.classList.add('invalid');
                    this.classList.remove('valid');
                } else if (this.value.length >= 8) {
                    newPasswordError.textContent = '';
                    newPasswordError.classList.remove('visible');
                    this.classList.remove('invalid');
                    this.classList.add('valid');
                } else {
                    this.classList.remove('valid', 'invalid');
                }
            });
        }

        // Confirm password validation
        if (confirmPasswordInput && newPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                if (this.value && this.value !== newPasswordInput.value) {
                    confirmPasswordError.textContent = 'Passwords do not match';
                    confirmPasswordError.classList.add('visible');
                    this.classList.add('invalid');
                    this.classList.remove('valid');
                } else if (this.value) {
                    confirmPasswordError.textContent = '';
                    confirmPasswordError.classList.remove('visible');
                    this.classList.remove('invalid');
                    this.classList.add('valid');
                }
            });
        }

        // Form submission handler
        if (resetForm) {
            resetForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let valid = true;

                // Validate new password requirements
                const newPassword = document.getElementById('new-password');
                const confirmPassword = document.getElementById('confirm-password');
                const reqs = checkPasswordRequirements(newPassword.value);

                // [FIX #10] Collect ALL failing requirements into an array
                // instead of sequential if-blocks that overwrite each other
                const failedRequirements = [];
                
                if (!reqs.length) {
                    failedRequirements.push('at least 8 characters');
                }
                
                if (!reqs.number) {
                    failedRequirements.push('at least one number');
                }
                
                if (!reqs.special) {
                    failedRequirements.push('at least one special character');
                }

                if (failedRequirements.length > 0) {
                    newPasswordError.textContent = 'Password must contain ' + failedRequirements.join(', ');
                    newPasswordError.classList.add('visible');
                    newPassword.classList.add('invalid');
                    valid = false;
                } else {
                    newPasswordError.textContent = '';
                    newPasswordError.classList.remove('visible');
                    newPassword.classList.remove('invalid');
                }

                // [FIX #9] Check for EMPTY confirm password BEFORE checking mismatch
                // Previously, empty confirm was silently accepted
                if (!confirmPassword.value) {
                    confirmPasswordError.textContent = 'Please confirm your password';
                    confirmPasswordError.classList.add('visible');
                    confirmPassword.classList.add('invalid');
                    valid = false;
                } else if (confirmPassword.value !== newPassword.value) {
                    confirmPasswordError.textContent = 'Passwords do not match';
                    confirmPasswordError.classList.add('visible');
                    confirmPassword.classList.add('invalid');
                    valid = false;
                } else {
                    confirmPasswordError.textContent = '';
                    confirmPasswordError.classList.remove('visible');
                    confirmPassword.classList.remove('invalid');
                }

                if (valid) {
                    // Simulate API call
                    resetForm.classList.add('loading');
                    const submitBtn = resetForm.querySelector('.auth-form__submit');
                    // [FIX #19] originalText is now used — restored on failure
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Resetting...';
                    submitBtn.disabled = true;

                    // Mock async operation
                    setTimeout(function() {
                        // Simulate success — in a real app, check server response
                        const isSuccess = true; // Mock: always success

                        if (isSuccess) {
                            resetForm.classList.remove('loading');
                            resetForm.style.display = 'none';
                            successMessage.removeAttribute('hidden');
                            
                            // Redirect to login after delay
                            setTimeout(function() {
                                window.location.href = 'auth.html';
                            }, 2000);
                        } else {
                            // [FIX #19] Restore button text on failure
                            resetForm.classList.remove('loading');
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            newPasswordError.textContent = 'Password reset failed. Please try again.';
                            newPasswordError.classList.add('visible');
                        }
                    }, 1500);
                }
            });
        }
    });
})();

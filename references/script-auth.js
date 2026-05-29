/* Auth Page Scripts */
/* Generated from login-and-registration.html */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Tab switching
          document.querySelectorAll('.auth-tab').forEach(tab => {
              tab.addEventListener('click', function() {
                  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                  this.classList.add('active');
                  const targetForm = document.getElementById(this.dataset.target);
                  if (targetForm) targetForm.classList.add('active');
              });
          });
  
          // Handle URL hash for direct navigation (e.g., auth.html#register or auth.html#login)
          const handleHashNavigation = () => {
              const hash = window.location.hash;
              // Remove active classes from all tabs and forms first
              document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
              document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
              
              // Show register form if hash is #register, otherwise show login (default)
              if (hash === '#register') {
                  const registerTab = document.querySelector('.auth-tab[data-target="register-form"]');
                  const registerForm = document.getElementById('register-form');
                  if (registerTab && registerForm) {
                      registerTab.classList.add('active');
                      registerForm.classList.add('active');
                  }
              } else {
                  // Default to login form
                  const loginTab = document.querySelector('.auth-tab[data-target="login-form"]');
                  const loginForm = document.getElementById('login-form');
                  if (loginTab && loginForm) {
                      loginTab.classList.add('active');
                      loginForm.classList.add('active');
                  }
              }
          };
          
          // Run hash handler on initial load
          handleHashNavigation();
          
          // Also handle hash changes if user navigates with back/forward buttons
          window.addEventListener('hashchange', handleHashNavigation);
  
          // Password validation helper functions
          function checkPasswordRequirements(password) {
              return {
                  length: password.length >= 8,
                  number: /\d/.test(password),
                  special: /[^A-Za-z0-9]/.test(password)
              };
          }
  
          function calculatePasswordStrength(password) {
              let strength = 0;
              if (password.length >= 8) strength++;
              if (password.length >= 12) strength++;
              if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
              if (/\d/.test(password)) strength++;
              if (/[^A-Za-z0-9]/.test(password)) strength++;
              return strength;
          }
  
          function updatePasswordUI(password) {
              const requirements = checkPasswordRequirements(password);
              const strength = calculatePasswordStrength(password);

              // Update requirement indicators
              // [FIX #13] Use classList.toggle instead of className overwrite
              // This preserves any existing classes (e.g., auth-form__requirement--unmet)
              const reqLength = document.getElementById('req-length');
              const reqNumber = document.getElementById('req-number');
              const reqSpecial = document.getElementById('req-special');

              if (reqLength) {
                  reqLength.classList.toggle('met', requirements.length);
                  reqLength.classList.toggle('unmet', !requirements.length);
              }
              if (reqNumber) {
                  reqNumber.classList.toggle('met', requirements.number);
                  reqNumber.classList.toggle('unmet', !requirements.number);
              }
              if (reqSpecial) {
                  reqLength.classList.toggle('met', requirements.special);
                  reqSpecial.classList.toggle('unmet', !requirements.special);
              }
  
              // Update strength bar
              const strengthBar = document.getElementById('strength-bar');
              const strengthLabel = document.getElementById('strength-label');
              if (!strengthBar || !strengthLabel) return;
              strengthBar.className = 'strength-bar';
              strengthLabel.className = 'strength-label';
              if (password.length > 0) {
                  if (strength <= 2) {
                      strengthBar.classList.add('weak');
                      strengthLabel.classList.add('weak');
                      strengthLabel.textContent = 'Weak password';
                  } else if (strength <= 4) {
                      strengthBar.classList.add('medium');
                      strengthLabel.classList.add('medium');
                      strengthLabel.textContent = 'Good password';
                  } else {
                      strengthBar.classList.add('strong');
                      strengthLabel.classList.add('strong');
                      strengthLabel.textContent = 'Strong password';
                  }
              } else {
                  strengthLabel.textContent = '';
              }
          }
  
          // Real-time password validation for register form
          const registerPassword = document.getElementById('register-password');
          if (registerPassword) {
              registerPassword.addEventListener('input', function() {
                  updatePasswordUI(this.value);
                  const passwordError = document.getElementById('password-error');
                  if (this.value.length > 0 && this.value.length < 8) {
                      passwordError.textContent = 'Password must be at least 8 characters';
                      passwordError.classList.add('visible');
                      this.classList.add('invalid');
                      this.classList.remove('valid');
                  } else if (this.value.length >= 8) {
                      passwordError.textContent = '';
                      passwordError.classList.remove('visible');
                      this.classList.remove('invalid');
                      this.classList.add('valid');
                  } else {
                      this.classList.remove('valid', 'invalid');
                  }
              });
          }
  
          // Email validation helper
          function isValidEmail(email) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          }
  
          // Inline validation for email fields
          ['login-email', 'register-email'].forEach(id => {
              const input = document.getElementById(id);
              const errorEl = document.getElementById(id + '-error');
              if (input && errorEl) {
                  input.addEventListener('blur', function() {
                      if (this.value && !isValidEmail(this.value)) {
                          errorEl.textContent = 'Please enter a valid email address';
                          errorEl.classList.add('visible');
                          this.classList.add('invalid');
                          this.classList.remove('valid');
                      } else if (this.value) {
                          errorEl.textContent = '';
                          errorEl.classList.remove('visible');
                          this.classList.remove('invalid');
                          this.classList.add('valid');
                      }
                  });
                  input.addEventListener('input', function() {
                      if (this.classList.contains('invalid') && isValidEmail(this.value)) {
                          errorEl.textContent = '';
                          errorEl.classList.remove('visible');
                          this.classList.remove('invalid');
                          this.classList.add('valid');
                      }
                  });
              }
          });
  
          // Confirm password validation
          const registerConfirm = document.getElementById('register-confirm');
          if (registerConfirm && registerPassword) {
              registerConfirm.addEventListener('input', function() {
                  const errorEl = document.getElementById('register-confirm-error');
                  if (this.value && this.value !== registerPassword.value) {
                      errorEl.textContent = 'Passwords do not match';
                      errorEl.classList.add('visible');
                      this.classList.add('invalid');
                      this.classList.remove('valid');
                  } else if (this.value) {
                      errorEl.textContent = '';
                      errorEl.classList.remove('visible');
                      this.classList.remove('invalid');
                      this.classList.add('valid');
                  }
              });
          }
  
          // Redirect helper - get return URL from sessionStorage or URL params
          function getReturnUrl() {
              const urlParams = new URLSearchParams(window.location.search);
              const redirect = urlParams.get('redirect');
              if (redirect) return decodeURIComponent(redirect);
              return sessionStorage.getItem('returnUrl') || 'index.html';
          }
  
          // [FIX #20] Login form submission — added null check
          const loginForm = document.getElementById('login-form');
          if (loginForm) {
              loginForm.addEventListener('submit', function(e) {
                  e.preventDefault();
                  const email = document.getElementById('login-email');
                  const password = document.getElementById('login-password');
                  let valid = true;
  
                  // Validate email
                  if (!isValidEmail(email.value)) {
                      const emailError = document.getElementById('login-email-error');
                      if (emailError) {
                          emailError.textContent = 'Please enter a valid email address';
                          emailError.classList.add('visible');
                      }
                      email.classList.add('invalid');
                      valid = false;
                  } else {
                      const emailError = document.getElementById('login-email-error');
                      if (emailError) emailError.classList.remove('visible');
                      email.classList.remove('invalid');
                  }
  
                  // Validate password
                  if (password.value.length < 1) {
                      const pwError = document.getElementById('login-password-error');
                      if (pwError) {
                          pwError.textContent = 'Password is required';
                          pwError.classList.add('visible');
                      }
                      password.classList.add('invalid');
                      valid = false;
                  } else {
                      const pwError = document.getElementById('login-password-error');
                      if (pwError) pwError.classList.remove('visible');
                      password.classList.remove('invalid');
                  }
  
                  if (valid) {
                      // Simulate successful login - redirect to return URL
                      window.location.href = getReturnUrl();
                  }
              });
          }
  
          // [FIX #21] Register form submission — added null check
          const registerForm = document.getElementById('register-form');
          if (registerForm) {
              registerForm.addEventListener('submit', function(e) {
                  e.preventDefault();
                  const name = document.getElementById('register-name');
                  const email = document.getElementById('register-email');
                  const password = document.getElementById('register-password');
                  const confirm = document.getElementById('register-confirm');
                  let valid = true;
  
                  // Validate name
                  if (name.value.trim().length < 2) {
                      const nameError = document.getElementById('register-name-error');
                      if (nameError) {
                          nameError.textContent = 'Please enter your full name';
                          nameError.classList.add('visible');
                      }
                      name.classList.add('invalid');
                      valid = false;
                  } else {
                      const nameError = document.getElementById('register-name-error');
                      if (nameError) nameError.classList.remove('visible');
                      name.classList.remove('invalid');
                  }
  
                  // Validate email
                  if (!isValidEmail(email.value)) {
                      const emailError = document.getElementById('register-email-error');
                      if (emailError) {
                          emailError.textContent = 'Please enter a valid email address';
                          emailError.classList.add('visible');
                      }
                      email.classList.add('invalid');
                      valid = false;
                  } else {
                      const emailError = document.getElementById('register-email-error');
                      if (emailError) emailError.classList.remove('visible');
                      email.classList.remove('invalid');
                  }
  
                  // [FIX #11] Collect ALL failing password requirements instead of else-if chain
                  // [FIX #12] Add password.classList.add('invalid') when requirements fail
                  const reqs = checkPasswordRequirements(password.value);
                  const passwordError = document.getElementById('password-error');
                  const failedRequirements = [];

                  if (!reqs.length) {
                      failedRequirements.push('at least 8 characters');
                  }
                  if (!reqs.number) {
                      failedRequirements.push('at least 1 number');
                  }
                  if (!reqs.special) {
                      failedRequirements.push('at least 1 special character (!@#$%^&*)');
                  }

                  if (failedRequirements.length > 0) {
                      passwordError.textContent = 'Password must contain ' + failedRequirements.join(', ');
                      passwordError.classList.add('visible');
                      password.classList.add('invalid');  // [FIX #12] Now shows red invalid styling
                      valid = false;
                  } else {
                      passwordError.classList.remove('visible');
                      password.classList.remove('invalid');
                  }
  
                  // Validate confirm password
                  if (confirm.value !== password.value) {
                      const confirmError = document.getElementById('register-confirm-error');
                      if (confirmError) {
                          confirmError.textContent = 'Passwords do not match';
                          confirmError.classList.add('visible');
                      }
                      confirm.classList.add('invalid');
                      valid = false;
                  } else {
                      const confirmError = document.getElementById('register-confirm-error');
                      if (confirmError) confirmError.classList.remove('visible');
                      confirm.classList.remove('invalid');
                  }
  
                  if (valid) {
                      // Simulate successful registration - redirect to return URL
                      window.location.href = getReturnUrl();
                  }
              });
          }
  
          // Mobile-first: Ensure proper input types trigger correct keyboards
          // email inputs already have type="email" for email keyboard
  
          // Password visibility toggle
          function togglePasswordVisibility(toggleBtn) {
              const wrapper = toggleBtn.closest('.password-input-wrapper');
              if (!wrapper) return;
              const input = wrapper.querySelector('.form-input');
              const icon = toggleBtn.querySelector('i');
              if (!input) return;
              
              if (input.type === 'password') {
                  input.type = 'text';
                  if (icon) {
                      icon.classList.remove('ph-eye');
                      icon.classList.add('ph-eye-slash');
                  }
              } else {
                  input.type = 'password';
                  if (icon) {
                      icon.classList.remove('ph-eye-slash');
                      icon.classList.add('ph-eye');
                  }
              }
          }

          // [FIX #6] Wire up all password toggle buttons — the function existed but was never called
          document.querySelectorAll('.password-toggle').forEach(function(toggleBtn) {
              toggleBtn.addEventListener('click', function(e) {
                  e.preventDefault();
                  togglePasswordVisibility(this);
              });
          });
});

(function() {
  var mobileToggle = document.getElementById('mobileToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileOverlay = document.getElementById('mobileOverlay');
  var mobileClose = document.getElementById('mobileClose');
  if (!mobileToggle || !mobileMenu || !mobileOverlay || !mobileClose) return;

  var removeMobTrap = null;

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileToggle.setAttribute('aria-expanded', 'true');
    if (window.theme && window.theme.trapFocus) {
      removeMobTrap = window.theme.trapFocus(mobileMenu);
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.focus();
    if (removeMobTrap) { removeMobTrap(); removeMobTrap = null; }
  }

  mobileToggle.addEventListener('click', openMobileMenu);
  mobileClose.addEventListener('click', closeMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mobile-nav-links a').forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMobileMenu();
  });
})();

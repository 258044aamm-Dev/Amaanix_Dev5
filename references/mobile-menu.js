// ── CSS ─────────────────────────────────────────
const css = `
  .mobile-menu {
    position: fixed; top: 0; left: -100%; width: 80%; max-width: 300px; height: 100vh;
    background: var(--white); box-shadow: 2px 0 10px rgba(0,0,0,0.1); z-index: 2000;
    transition: left 0.3s ease; padding: 60px 20px 20px; display: none; flex-direction: column;
  }
  .mobile-menu.active { left: 0; display: flex; }
  .mobile-menu-close {
    position: absolute; top: 20px; right: 20px; font-size: 24px;
    cursor: pointer; color: var(--text-dark); background: none; border: none;
  }
  .mobile-nav-links { list-style: none; padding: 0; margin: 0; }
  .mobile-nav-links li { border-bottom: 1px solid var(--border); }
  .mobile-nav-links a { display: block; padding: 15px 0; font-size: 16px; font-weight: 500; color: var(--text-dark); }

  .mobile-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 1999; opacity: 0; visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  .mobile-overlay.active { opacity: 1; visibility: visible; }

  .mobile-menu .social-icon {
    width: 36px; height: 36px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--bg-light); color: var(--primary);
    text-decoration: none; transition: all 0.3s ease;
  }
  .mobile-menu .social-icon:hover {
    background: var(--primary); color: var(--white);
  }
`;

// ── HTML ────────────────────────────────────────
const html = `
  <div class="mobile-overlay" id="mobileOverlay"></div>
  <div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Navigation menu">
    <button class="mobile-menu-close" id="mobileClose" aria-label="Close menu">
      <i data-lucide="x" class="icon-close" aria-hidden="true"></i>
    </button>
    <ul class="mobile-nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">Shop</a></li>
      <li><a href="#brand-story">About</a></li>
      <li><a href="#">Support</a></li>
    </ul>
    <div class="mobile-account-section mb-20 pt-20 border-top">
      <div class="d-flex gap-10 mb-15">
        <a href="#" class="btn btn-outline-dark flex-1 p-10 fs-14 text-center">Login</a>
        <a href="#" class="btn btn-primary flex-1 p-10 fs-14 text-center">Register</a>
      </div>
    </div>
    <div class="mobile-social-section mt-auto pt-20 border-top text-center">
      <div class="d-flex gap-15 justify-center">
        <a href="#" class="social-icon w-36 h-36 fs-14" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
        <a href="#" class="social-icon w-36 h-36 fs-14" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
        <a href="#" class="social-icon w-36 h-36 fs-14" aria-label="Twitter"><i class="fab fa-twitter" aria-hidden="true"></i></a>
        <a href="#" class="social-icon w-36 h-36 fs-14" aria-label="Pinterest"><i class="fab fa-pinterest-p" aria-hidden="true"></i></a>
      </div>
    </div>
  </div>
`;

// ── JS Logic ────────────────────────────────────
export function renderMobileMenu(targetId = 'mobile-menu-placeholder') {
  if (!document.getElementById('mobile-menu-style')) {
    const style = document.createElement('style');
    style.id = 'mobile-menu-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;

  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');
  if (!mobileToggle || !mobileMenu || !mobileOverlay || !mobileClose) return;

  function trapFocus(element) {
    const focusableEls = element.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (focusableEls.length === 0) return;
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableEl) { lastFocusableEl.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === lastFocusableEl) { firstFocusableEl.focus(); e.preventDefault(); }
      }
    }
    element.addEventListener('keydown', handleTab);
    return () => element.removeEventListener('keydown', handleTab);
  }

  let removeMobileTrap = null;

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    removeMobileTrap = trapFocus(mobileMenu);
    mobileClose.focus();
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (removeMobileTrap) removeMobileTrap();
    mobileToggle.focus();
  }

  mobileToggle.addEventListener('click', (e) => { e.preventDefault(); openMobileMenu(); });
  mobileClose.addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); });
  mobileOverlay.addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); });
  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

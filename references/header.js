// ── CSS ─────────────────────────────────────────
const css = `
  .header {
    background-color: var(--white);
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: fixed;
    top: var(--header-top, 0px);
    left: 0;
    width: 100%;
    z-index: 1000;
    padding: 15px 0;
    transition: transform 0.35s ease;
  }
  .header--hidden { }
  .header-spacer { width: 100%; }
  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    font-family: var(--font-heading);
    font-size: 28px;
    font-weight: 700;
    color: var(--primary);
    letter-spacing: 1px;
  }
  .nav-menu { display: flex; gap: 30px; }
  .nav-item { position: relative; }
  .nav-link { font-weight: 500; font-size: 15px; color: var(--text-dark); padding: 10px 0; }
  .nav-link:hover { color: var(--primary); }

  .dropdown {
    position: absolute; top: 100%; left: 0;
    background: var(--white); box-shadow: var(--shadow-hover);
    min-width: 200px; padding: 15px 0; border-radius: var(--radius);
    opacity: 0; visibility: hidden; transform: translateY(10px);
    transition: all 0.3s ease; z-index: 100;
  }
  .nav-item:hover .dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
  .dropdown li a { display: block; padding: 8px 20px; font-size: 14px; color: var(--text-dark); }
  .dropdown li a:hover { background-color: var(--bg-light); color: var(--primary); }

  .header-icons { display: flex; gap: 12px; align-items: center; }
  .icon-btn {
    font-size: 20px; color: var(--text-dark); cursor: pointer;
    position: relative; background: none; border: none; font-family: var(--font-body);
    display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; padding: 0; border-radius: 50%;
    transition: all 0.3s ease;
  }
  .icon-btn:hover {
    background-color: var(--bg-light);
    color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .icon-btn i {
    width: 20px; height: 20px;
    transition: all 0.3s ease;
  }
  .icon-btn:hover i { transform: scale(1.1); }

  .cart-count,
  .wishlist-count {
    position: absolute; top: -8px; right: -8px;
    background-color: var(--primary); color: var(--white);
    font-size: 10px; width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .mobile-toggle {
    display: none; font-size: 24px; cursor: pointer;
    color: var(--text-dark); margin-right: 15px; background: none; border: none;
    padding: 0; width: 40px; height: 40px;
    align-items: center; justify-content: center;
  }
  .hamburger-fallback { font-size: 24px; line-height: 1; }
  .mobile-toggle svg + .hamburger-fallback { display: none; }

  .profile-dropdown { position: relative; display: inline-flex; align-items: center; justify-content: center; }
  .profile-dropdown i { width: 20px; height: 20px; }
  .profile-menu {
    position: absolute; top: 100%; right: 0;
    background: var(--white); box-shadow: var(--shadow-hover);
    min-width: 180px; padding: 10px 0; border-radius: var(--radius);
    opacity: 0; visibility: hidden; transform: translateY(10px);
    transition: all 0.3s ease; z-index: 100;
  }
  .profile-dropdown:hover .profile-menu,
  .profile-dropdown.active .profile-menu { opacity: 1; visibility: visible; transform: translateY(0); }
  .profile-menu a { display: block; padding: 10px 20px; font-size: 14px; color: var(--text-dark); transition: background 0.3s; }
  .profile-menu a:hover { background-color: var(--bg-light); color: var(--primary); text-decoration: none; }

  .wishlist-icon { display: none; }
  @media (min-width: 769px) { .wishlist-icon { display: inline-flex !important; } }
  .mobile-wishlist-icon { display: none; }

  @media (max-width: 1024px) {
    .header-icons { gap: 10px; }
    .icon-btn { width: 38px; height: 38px; }
    .icon-btn i { width: 19px; height: 19px; }
    .profile-dropdown i { width: 19px; height: 19px; }
  }

  @media (max-width: 768px) {
    .nav-menu { display: none; }
    .mobile-toggle { display: inline-flex; position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; }
    .header-inner { justify-content: center; position: relative; min-height: 50px; }
    .header-icons { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); gap: 8px; }
    .icon-btn { width: 36px; height: 36px; }
    .icon-btn i { width: 18px; height: 18px; }
    .profile-dropdown i { width: 18px; height: 18px; }
    .profile-dropdown { display: none !important; }
    .logo { transform: translateX(-18px); }
  }
  @media (max-width: 768px) {
    .mobile-wishlist-icon { display: inline-flex !important; }
    .wishlist-icon { display: none !important; }
  }
  @media (min-width: 769px) {
    .profile-card-mobile { display: none; }
    .logo { margin-left: 36px; }
  }
`;

// ── HTML ────────────────────────────────────────
const html = `
  <header class="header" id="header">
    <div class="container header-inner">
      <button class="mobile-toggle" id="mobileToggle" aria-label="Open menu" aria-controls="mobileMenu">
        <i data-lucide="menu" class="icon-menu" aria-hidden="true"></i>
        <span class="hamburger-fallback" aria-hidden="true">☰</span>
      </button>
      <a href="#" class="logo">AMAANIX</a>
      <nav>
        <ul class="nav-menu">
          <li class="nav-item"><a href="#" class="nav-link">Home</a></li>
          <li class="nav-item"><a href="#" class="nav-link">Shop</a></li>
          <li class="nav-item"><a href="#brand-story" class="nav-link">About</a></li>
          <li class="nav-item"><a href="#" class="nav-link">Support</a></li>
        </ul>
      </nav>
      <div class="header-icons">
        <button class="icon-btn" id="searchTrigger" aria-label="Open search"><i data-lucide="search" class="icon-search" aria-hidden="true"></i></button>
        <button class="icon-btn mobile-wishlist-icon" title="Wishlist" aria-label="Open wishlist"><i data-lucide="heart" class="icon-heart" aria-hidden="true"></i><span class="wishlist-count" aria-live="polite" aria-atomic="true">0</span></button>
        <div class="icon-btn profile-dropdown" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">
          <i data-lucide="user" class="icon-user" aria-hidden="true"></i>
          <ul class="profile-menu">
            <li><a href="login-and-registration.html">Login</a></li>
            <li><a href="login-and-registration.html#register">Register</a></li>
            <li class="divider profile-card-mobile"></li>
            <li class="profile-card-mobile"><a href="#" id="profileCardLink">Cart</a></li>
          </ul>
        </div>
        <button class="icon-btn wishlist-icon" title="Wishlist" aria-label="Open wishlist">
          <i data-lucide="heart" class="icon-heart" aria-hidden="true"></i>
          <span class="wishlist-count" aria-live="polite" aria-atomic="true">0</span>
        </button>
        <div class="icon-btn cart-icon-btn" title="Shopping Cart" role="button" tabindex="0" aria-label="Open cart">
          <i data-lucide="shopping-bag" class="icon-cart" aria-hidden="true"></i>
          <span class="cart-count" aria-live="polite" aria-atomic="true">0</span>
        </div>
      </div>
    </div>
  </header>
`;

// ── JS Logic ────────────────────────────────────
export function renderHeader(targetId = 'header-placeholder') {
  if (!document.getElementById('header-style')) {
    const style = document.createElement('style');
    style.id = 'header-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;

  // Add spacer and set header top offset for announcement bar
  requestAnimationFrame(() => {
    const headerEl = document.querySelector('.header');
    if (headerEl && !document.querySelector('.header-spacer')) {
      const spacer = document.createElement('div');
      spacer.className = 'header-spacer';
      spacer.style.height = headerEl.offsetHeight + 'px';
      headerEl.parentNode.insertBefore(spacer, headerEl.nextSibling);
    }
    updateHeaderTop();
  });

  // Profile Dropdown Toggle
  const profileDropdown = document.querySelector('.profile-dropdown');
  if (profileDropdown) {
    function updateAriaExpanded() {
      const isActive = profileDropdown.classList.contains('active');
      profileDropdown.setAttribute('aria-expanded', String(isActive));
    }
    function toggleDropdown(e) {
      if (e.target.closest('.profile-menu a')) return;
      e.preventDefault();
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
      updateAriaExpanded();
    }
    profileDropdown.addEventListener('click', toggleDropdown);
    profileDropdown.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        profileDropdown.classList.toggle('active');
        updateAriaExpanded();
      }
    });
    document.addEventListener('click', function(e) {
      if (!profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('active');
        updateAriaExpanded();
      }
    });
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        profileDropdown.classList.remove('active');
        updateAriaExpanded();
      }
    });
    updateAriaExpanded();
  }

  // Hide on scroll down, show on scroll up
  let lastScrollY = window.scrollY;
  const scrollThreshold = 50;
  const header = document.querySelector('.header');
  if (header) {
    header.style.boxShadow = window.scrollY > 50 ? "0 4px 20px rgba(0,0,0,0.1)" : "0 2px 10px rgba(0,0,0,0.05)";
  }

  function toggleBars(isHidden) {
    const h = document.querySelector('.header');
    const ann = document.getElementById('announcementBar');

    if (isHidden) {
      if (h) {
        const annHeight = ann && !ann.classList.contains('dismissing') && ann.style.display !== 'none' ? ann.offsetHeight : 0;
        const totalOffset = h.offsetHeight + annHeight;
        h.style.transform = `translateY(-${totalOffset}px)`;
        h.classList.add('header--hidden');
      }
      ann?.classList.add('announcement-bar--hidden');
    } else {
      if (h) {
        h.style.transform = '';
        h.classList.remove('header--hidden');
      }
      ann?.classList.remove('announcement-bar--hidden');
    }
  }

  function updateHeaderTop() {
    const annBar = document.getElementById('announcementBar');
    const annSpacer = document.querySelector('.announcement-spacer');
    if (annBar && annSpacer && annBar.offsetHeight && annBar.style.display !== 'none' && !annBar.classList.contains('dismissing')) {
      const h = annBar.offsetHeight;
      document.documentElement.style.setProperty('--header-top', h + 'px');
      annSpacer.style.height = h + 'px';
    } else {
      document.documentElement.style.setProperty('--header-top', '0px');
    }
  }

  window.addEventListener('scroll', () => {
    const h = document.querySelector('.header');
    if (!h) return;
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    const pastThreshold = currentScrollY > scrollThreshold;

    if (isScrollingDown && pastThreshold) {
      toggleBars(true);
    } else if (!isScrollingDown || currentScrollY <= scrollThreshold) {
      toggleBars(false);
    }
    h.style.boxShadow = currentScrollY > 50 ? "0 4px 20px rgba(0,0,0,0.1)" : "0 2px 10px rgba(0,0,0,0.05)";
    lastScrollY = currentScrollY;
  });
  window.addEventListener('resize', () => {
    const spacer = document.querySelector('.header-spacer');
    const h = document.querySelector('.header');
    if (spacer && h) spacer.style.height = h.offsetHeight + 'px';
    updateHeaderTop();
  });
  window.addEventListener('announcement-dismissed', updateHeaderTop);

  // Escape key closes profile dropdown
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      document.querySelector('.profile-dropdown.active')?.classList.remove('active');
    }
  });

  // Shopping bag icon opens cart drawer
  document.querySelector(".cart-icon-btn")?.addEventListener("click", function(e) {
    e.preventDefault();
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (drawer && overlay) {
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      const closeBtn = drawer.querySelector(".cart-drawer-close");
      if (closeBtn) closeBtn.focus();
    }
  });

  // "Cart" link in profile menu opens cart drawer
  document.getElementById('profileCardLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      const closeBtn = drawer.querySelector('.cart-drawer-close');
      if (closeBtn) closeBtn.focus();
    }
    // Close profile dropdown
    document.querySelector('.profile-dropdown.active')?.classList.remove('active');
  });
}



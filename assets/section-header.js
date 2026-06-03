(function() {
  var headerEl, announcementBar, profileDropdown, cartIcon;
  var prevScrollY = 0;
  var ticking = false;
  var listenersSet = false;

  /* ---------- helpers ---------- */

  function getElements() {
    if (!headerEl) headerEl = document.querySelector('.header[data-section-id]');
    if (!headerEl) return;
    if (!announcementBar) announcementBar = document.getElementById('announcementBar');
    if (!profileDropdown) profileDropdown = headerEl.querySelector('.profile-dropdown');
    if (!cartIcon) cartIcon = headerEl.querySelector('.cart-icon-btn');
  }

  function abHeight() {
    return announcementBar && !(announcementBar.style.display === 'none' || announcementBar.offsetHeight === 0)
      ? announcementBar.offsetHeight : 0;
  }

  function totalHeight() {
    return (headerEl ? headerEl.offsetHeight : 0) + abHeight();
  }

  /* ---------- visual updates ---------- */

  function updateHeaderTop() {
    if (!announcementBar || !headerEl) return;
    headerEl.style.top = abHeight() + 'px';
  }

  function pushMainContent() {
    var main = document.getElementById('MainContent');
    if (!main) return;
    var total = totalHeight();
    if (total > 0) main.style.paddingTop = total + 'px';
  }

  function reposition() {
    getElements();
    updateHeaderTop();
    pushMainContent();
    document.documentElement.style.setProperty('--header-offset', totalHeight() + 'px');
  }

  /* ---------- scroll hide/reveal ---------- */

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var scrollY = window.scrollY;
      if (scrollY > prevScrollY && scrollY > 100) {
        if (headerEl) { headerEl.classList.add('header-hidden'); headerEl.classList.remove('header-visible'); }
        if (announcementBar) { announcementBar.classList.add('announcement-hidden'); announcementBar.classList.remove('announcement-visible'); }
      } else {
        if (headerEl) { headerEl.classList.remove('header-hidden'); headerEl.classList.add('header-visible'); }
        if (announcementBar) { announcementBar.classList.remove('announcement-hidden'); announcementBar.classList.add('announcement-visible'); }
      }
      prevScrollY = scrollY;
      ticking = false;
    });
  }

  /* ---------- event listeners ---------- */

  function setupListeners() {
    if (listenersSet) return;
    listenersSet = true;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function() {
      reposition();
      if (window.innerWidth > 768 && profileDropdown) {
        profileDropdown.classList.remove('active');
      }
    });
    window.addEventListener('announcement-dismissed', updateHeaderTop);

    if (profileDropdown) {
      profileDropdown.querySelectorAll('.profile-menu a').forEach(function(link) {
        link.addEventListener('click', function(e) {
          if (link.getAttribute('href') === '#') {
            e.preventDefault();
            if (link.textContent.trim().toLowerCase().indexOf('cart') !== -1 && window.openCartDrawer) {
              window.openCartDrawer();
            }
            profileDropdown.classList.remove('active');
          }
        });
      });
      profileDropdown.addEventListener('click', function(e) { e.stopPropagation(); });
      document.addEventListener('click', function(e) {
        if (profileDropdown && !profileDropdown.contains(e.target)) profileDropdown.classList.remove('active');
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && profileDropdown) profileDropdown.classList.remove('active');
      });
    }

    if (cartIcon) {
      cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.openCartDrawer) window.openCartDrawer();
      });
    }

    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (href === '#' || href === '') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = totalHeight() + 10;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  }

  /* ---------- boot ---------- */

  function boot() {
    getElements();
    if (!headerEl) {
      window.addEventListener('load', boot);
      return;
    }
    setupListeners();
    requestAnimationFrame(reposition);
  }

  boot();
  window.addEventListener('load', function() {
    getElements();
    pushMainContent();
  });
})();

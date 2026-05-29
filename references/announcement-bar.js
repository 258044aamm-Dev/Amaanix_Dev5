// ── CSS ─────────────────────────────────────────
const css = `
  .announcement-bar {
    background-color: #00999b;
    color: var(--white);
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    font-weight: 500;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1001;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: transform 0.35s ease;
  }
  .announcement-bar--hidden { transform: translateY(-100%); }

  .announcement-ticker {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .announcement-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
    will-change: transform;
    width: 100%;
  }

  .announcement-item {
    flex: 0 0 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 40px;
    box-sizing: border-box;
  }

  .announcement-item a {
    color: var(--white);
    text-decoration: underline;
    font-weight: 600;
    transition: opacity 0.3s ease;
  }

  .announcement-item a:hover {
    opacity: 0.9;
  }

  .announcement-bar:hover .announcement-track {
    animation-play-state: paused;
  }

  .close-announcement {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 18px;
    z-index: 10;
    opacity: 0.9;
    transition: opacity 0.3s ease;
    background: none;
    border: none;
    color: var(--white);
  }

  .close-announcement:hover {
    opacity: 1;
  }

  .announcement-bar.dismissing {
    animation: slideUpFade 0.3s ease forwards;
  }

  @keyframes slideUpFade {
    to {
      opacity: 0;
      transform: translateY(-100%);
      height: 0;
      padding: 0;
      margin: 0;
    }
  }

  @media (min-width: 769px) {
    .announcement-track { width: 100%; }
    .announcement-item { flex: 0 0 100%; width: 100%; padding: 0 40px; }
  }

  @media (max-width: 768px) {
    .announcement-ticker { touch-action: pan-x; -webkit-overflow-scrolling: touch; }
    .announcement-item { padding: 0 30px; }
  }
`;

// ── HTML ────────────────────────────────────────
const html = `
  <div class="announcement-bar" id="announcementBar">
    <div class="container position-relative full-width">
      <div class="announcement-ticker">
        <div class="announcement-track" id="announcementTrack">
          <div class="announcement-item">
            <span>🚚</span>
            <a href="#shipping">Free Shipping on Orders $50+</a>
          </div>
          <div class="announcement-item">
            <span>🎁</span>
            <a href="#welcome">10% Welcome Discount</a>
          </div>
        </div>
      </div>
      <button class="close-announcement" id="closeAnnouncementBtn" aria-label="Close announcement">✕</button>
    </div>
  </div>
`;

// ── JS Logic ────────────────────────────────────
export function renderAnnouncementBar(targetId = 'announcement-bar-placeholder') {
  if (!document.getElementById('announcement-bar-style')) {
    const style = document.createElement('style');
    style.id = 'announcement-bar-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;

  // Add spacer for fixed announcement bar
  requestAnimationFrame(() => {
    const bar = document.getElementById('announcementBar');
    if (bar && !document.querySelector('.announcement-spacer')) {
      const spacer = document.createElement('div');
      spacer.className = 'announcement-spacer';
      spacer.style.height = bar.offsetHeight + 'px';
      bar.parentNode.insertBefore(spacer, bar.nextSibling);
    }
  });

  const announcementBar = document.getElementById('announcementBar');
  const announcementTrack = document.getElementById('announcementTrack');
  const closeBtn = document.getElementById('closeAnnouncementBtn');
  if (!announcementBar || !announcementTrack || !closeBtn) return;

  const totalSlides = document.querySelectorAll('.announcement-item').length;
  let announcementCurrentSlide = 0;
  let autoRotateInterval;
  let isHovering = false;
  let isSwiping = false;
  let startX = 0;
  let currentX = 0;

  function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
      if (!isHovering && !isSwiping) nextAnnouncementSlide();
    }, 5000);
  }

  function nextAnnouncementSlide() {
    announcementCurrentSlide = (announcementCurrentSlide + 1) % totalSlides;
    updateAnnouncementTrackPosition();
  }

  function updateAnnouncementTrackPosition() {
    announcementTrack.style.transform = `translateX(-${announcementCurrentSlide * 100}%)`;
  }

  announcementBar.addEventListener('mouseenter', () => isHovering = true);
  announcementBar.addEventListener('mouseleave', () => isHovering = false);

  announcementBar.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    currentX = startX;
    isSwiping = true;
  }, { passive: true });

  announcementBar.addEventListener('touchmove', (e) => {
    if (isSwiping) currentX = e.touches[0].clientX;
  }, { passive: true });

  announcementBar.addEventListener('touchend', () => {
    if (!isSwiping) return;
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextAnnouncementSlide();
      else {
        announcementCurrentSlide = (announcementCurrentSlide - 1 + totalSlides) % totalSlides;
        updateAnnouncementTrackPosition();
      }
    }
    isSwiping = false;
  });

  closeBtn.addEventListener('click', () => {
    clearInterval(autoRotateInterval);
    announcementBar.classList.add('dismissing');
    setTimeout(() => {
      announcementBar.style.display = 'none';
      window.dispatchEvent(new CustomEvent('announcement-dismissed'));
    }, 300);
  });

  startAutoRotate();
}

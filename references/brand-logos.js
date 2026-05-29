// ── CSS ─────────────────────────────────────────
const css = `
  .brand-logos-section { padding: 60px 0; background: var(--white); border-top: 1px solid var(--border); }
  .logos-marquee { overflow: hidden; position: relative; }
  .logos-track {
    display: flex; gap: 40px; animation: logosScroll 25s linear infinite;
    opacity: 0.6; width: max-content; padding: 10px 0;
  }
  .logos-track:hover { animation-play-state: paused; }
  @keyframes logosScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  @media (max-width: 768px) {
    .logos-marquee { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .logos-marquee::-webkit-scrollbar { display: none; }
    .logos-track { animation: none; cursor: grab; padding: 10px 20px; }
    .logos-track:active { cursor: grabbing; }
  }
  .logo-placeholder { font-size: 24px; font-weight: 700; color: #999999; text-transform: uppercase; }
`;

// ── HTML ────────────────────────────────────────
const html = `
  <section class="brand-logos-section" id="brand-logos-section">
    <div class="container">
      <div class="logos-marquee">
        <div class="logos-track">
          <div class="logo-placeholder">VOGUE</div>
          <div class="logo-placeholder">FORBES</div>
          <div class="logo-placeholder">WIRED</div>
          <div class="logo-placeholder">ELLE DECOR</div>
          <div class="logo-placeholder">GQ</div>
          <div class="logo-placeholder">VOGUE</div>
          <div class="logo-placeholder">FORBES</div>
          <div class="logo-placeholder">WIRED</div>
          <div class="logo-placeholder">ELLE DECOR</div>
          <div class="logo-placeholder">GQ</div>
        </div>
      </div>
    </div>
  </section>
`;

// ── JS Logic ────────────────────────────────────
export function renderBrandLogos(targetId = 'brand-logos-placeholder') {
  if (!document.getElementById('brand-logos-style')) {
    const style = document.createElement('style');
    style.id = 'brand-logos-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;
}

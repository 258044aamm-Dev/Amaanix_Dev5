// ── CSS ─────────────────────────────────────────
const css = `
  .product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .product-card {
    border-radius: var(--radius); overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    cursor: pointer;
  }
  .product-card:hover { transform: translateY(-4px); }
  .product-image-wrapper {
    position: relative; overflow: hidden; aspect-ratio: 1;
    background: var(--bg-light); border-radius: var(--radius);
  }
  .product-image {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover; transition: opacity 0.5s ease;
  }
  .product-image-main { z-index: 1; }
  .product-image-hover { z-index: 2; opacity: 0; }
  .product-card:hover .product-image-main { opacity: 0; }
  .product-card:hover .product-image-hover { opacity: 1; }
  .product-overlay {
    position: absolute; inset: 0; z-index: 3;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 60%, transparent 100%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 24px; opacity: 0;
    transition: opacity 0.4s ease;
  }
  .product-card:hover .product-overlay { opacity: 1; }
  .product-overlay-name {
    font-family: var(--font-heading); font-size: 18px; font-weight: 600;
    color: var(--white); margin-bottom: 8px;
    transform: translateY(12px); transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .product-card:hover .product-overlay-name { transform: translateY(0); }
  .product-overlay-cta {
    font-family: var(--font-body); font-size: 12px; font-weight: 500;
    text-transform: uppercase; letter-spacing: 1.5px; color: var(--white);
    opacity: 0; transform: translateY(10px);
    transition: opacity 0.3s ease 0.1s, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .product-overlay-cta i { font-size: 11px; transition: transform 0.3s ease; }
  .product-card:hover .product-overlay-cta { opacity: 1; transform: translateY(0); }
  .product-card:hover .product-overlay-cta i { transform: translateX(4px); }
  @media (max-width: 1024px) {
    .product-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .product-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  }
`;

// ── HTML ────────────────────────────────────────
const html = `
  <section class="section-padding" id="product-grid">
    <div class="container">
      <div class="section-header">
        <h2>FEATURED PRODUCTS</h2>
        <p>Curated essentials designed for every part of your day</p>
      </div>
      <div class="product-grid">
        <div class="product-card" data-id="1" data-name="Premium Desk Organizer" data-price="49.99">
          <div class="product-image-wrapper">
            <img loading="lazy" src="assets/images/product-01-main.png" alt="Premium Desk Organizer" class="product-image product-image-main" width="600" height="600">
            <img loading="lazy" src="assets/images/product-01-hover.png" alt="Premium Desk Organizer" class="product-image product-image-hover" width="600" height="600">
            <div class="product-overlay">
              <h3 class="product-overlay-name">Premium Desk Organizer</h3>
              <span class="product-overlay-cta">Browse <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div class="product-card" data-id="2" data-name="Wireless Charging Pad" data-price="34.99">
          <div class="product-image-wrapper">
            <img loading="lazy" src="assets/images/product-02-main.png" alt="Wireless Charging Pad" class="product-image product-image-main" width="600" height="600">
            <img loading="lazy" src="assets/images/product-02-hover.png" alt="Wireless Charging Pad" class="product-image product-image-hover" width="600" height="600">
            <div class="product-overlay">
              <h3 class="product-overlay-name">Wireless Charging Pad</h3>
              <span class="product-overlay-cta">Browse <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div class="product-card" data-id="3" data-name="Aromatherapy Candle Set" data-price="36.00">
          <div class="product-image-wrapper">
            <img loading="lazy" src="assets/images/product-03-main.png" alt="Aromatherapy Candle Set" class="product-image product-image-main" width="600" height="600">
            <img loading="lazy" src="assets/images/product-03-hover.png" alt="Aromatherapy Candle Set" class="product-image product-image-hover" width="600" height="600">
            <div class="product-overlay">
              <h3 class="product-overlay-name">Aromatherapy Candle Set</h3>
              <span class="product-overlay-cta">Browse <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
        <div class="product-card" data-id="4" data-name="Leather Journal" data-price="24.99">
          <div class="product-image-wrapper">
            <img loading="lazy" src="assets/images/product-04-main.png" alt="Leather Journal" class="product-image product-image-main" width="600" height="600">
            <img loading="lazy" src="assets/images/product-04-hover.png" alt="Leather Journal" class="product-image product-image-hover" width="600" height="600">
            <div class="product-overlay">
              <h3 class="product-overlay-name">Leather Journal</h3>
              <span class="product-overlay-cta">Browse <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

// ── JS Logic ────────────────────────────────────
export function renderProductGrid(targetId = 'product-grid-placeholder') {
  if (!document.getElementById('product-grid-style')) {
    const style = document.createElement('style');
    style.id = 'product-grid-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;

  const grid = document.querySelector('.product-grid');
  if (grid) {
    grid.addEventListener('click', function(e) {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const name = card.dataset.name;
      if (window.showToast) {
        window.showToast(`Viewing: ${name}`);
      }
    });
  }
}

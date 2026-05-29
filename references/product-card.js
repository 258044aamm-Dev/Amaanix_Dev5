// ── CSS ─────────────────────────────────────────
const css = `
  .product-item {
    background: var(--white);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                box-shadow 0.35s ease;
  }
  .product-item:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.10);
  }

  .product-item-image-wrap {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--bg-light);
  }
  .product-item-image-inner {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .product-item-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .product-item:hover .product-item-image {
    transform: scale(1.08);
  }

  .product-item-image-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }
  .product-item:hover .product-item-image-wrap::after {
    opacity: 1;
  }

  .product-item-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 3;
    padding: 5px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }
  .badge-sale {
    background: #ff4757;
    color: var(--white);
  }
  .badge-new {
    background: var(--primary);
    color: var(--white);
  }
  .badge-best {
    background: #ffa502;
    color: var(--white);
  }

  .product-item-wishlist {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.95);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    font-size: 16px;
    transition: all 0.25s ease;
  }
  .product-item-wishlist:hover {
    background: #fff0f0;
    color: #ff4757;
    transform: scale(1.1);
  }
  .product-item-wishlist.active {
    color: #ff4757;
    background: #fff0f0;
  }

  .product-item-body {
    padding: 16px 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }
  .product-item-category {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--primary);
    font-weight: 600;
  }
  .product-item-title {
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 500;
    color: var(--text-dark);
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .product-item-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    margin-top: 1px;
  }
  .product-item-stars {
    color: #ffa502;
    letter-spacing: 1px;
  }
  .product-item-review-count {
    color: #999;
    font-size: 11px;
  }

  .product-item-price {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    padding-top: 8px;
  }
  .price-current {
    font-size: 19px;
    font-weight: 700;
    color: var(--text-dark);
    line-height: 1;
  }
  .price-old {
    font-size: 14px;
    color: #aaa;
    text-decoration: line-through;
    font-weight: 400;
  }
  .price-sale {
    color: #ff4757;
  }
  .price-discount-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    background: #ff4757;
    color: var(--white);
    border-radius: 5px;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.4;
    margin-left: 2px;
  }

  .product-item-add {
    margin-top: 10px;
    width: 100%;
    padding: 11px 14px;
    background: var(--primary);
    color: var(--white);
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .product-item-add:hover {
    background: var(--primary-dark);
    box-shadow: 0 4px 12px rgba(0,181,184,0.3);
  }
  .product-item-add:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    .product-item-body {
      padding: 12px 12px 14px;
    }
    .product-item-title {
      font-size: 13px;
    }
    .price-current {
      font-size: 16px;
    }
    .product-item-add {
      padding: 10px 12px;
      font-size: 12px;
    }
    .product-item-wishlist {
      opacity: 1;
      transform: none;
      top: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      font-size: 13px;
    }
    .product-item-badge {
      top: 8px;
      left: 8px;
      font-size: 10px;
      padding: 3px 8px;
    }
  }
`;

// ── Config (dynamic, replaces hardcoded values) ─
const DEFAULTS = {
  imageBasePath: 'assets/images/',
  currencySymbol: '$',
  priceDecimals: 2,
  buttonAddText: 'Add to Cart',
  buttonAddedText: 'Added',
  buttonAddedBg: '#27ae60',
  badgeLabels: {
    sale: '% OFF',
    new: 'New',
    best: 'Best Seller',
  },
  starFull: '<i class="fas fa-star"></i>',
  starHalf: '<i class="fas fa-star-half-alt"></i>',
  starEmpty: '<i class="far fa-star"></i>',
  imgLoading: 'lazy',
  imgWidth: 600,
  imgHeight: 600,
};

// ── Star generator ──────────────────────────────
function generateStars(rating, cfg) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += cfg.starFull;
    else if (i === full && half) html += cfg.starHalf;
    else html += cfg.starEmpty;
  }
  return html;
}

// ── HTML Template ───────────────────────────────
function template(product, cfg) {
  const onSale = product.oldPrice != null;
  const discount = onSale
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const badgeHtml = product.badge
    ? `<span class="product-item-badge badge-${product.badge}">${
        product.badge === 'sale'
          ? `${discount}${cfg.badgeLabels.sale}`
          : product.badge === 'new'
            ? cfg.badgeLabels.new
            : cfg.badgeLabels.best
      }</span>`
    : '';
  const starsHtml = generateStars(product.rating, cfg);

  return `
    <div class="product-item" data-id="${product.id}">
      <div class="product-item-image-wrap">
        <div class="product-item-image-inner">
          <img loading="${cfg.imgLoading}" src="${cfg.imageBasePath}${product.image}" alt="${product.name}" class="product-item-image" width="${cfg.imgWidth}" height="${cfg.imgHeight}">
        </div>
        ${badgeHtml}
        <button class="product-item-wishlist" data-id="${product.id}" aria-label="Add ${product.name} to wishlist" type="button">
          <i class="far fa-heart"></i>
        </button>
      </div>
      <div class="product-item-body">
        <span class="product-item-category">${product.category}</span>
        <h3 class="product-item-title">${product.name}</h3>
        <div class="product-item-rating">
          <span class="product-item-stars">${starsHtml}</span>
          <span class="product-item-review-count">(${product.reviews})</span>
        </div>
        <div class="product-item-price">
          <span class="price-current${onSale ? ' price-sale' : ''}">${cfg.currencySymbol}${product.price.toFixed(cfg.priceDecimals)}</span>
          ${onSale ? `<span class="price-old">${cfg.currencySymbol}${product.oldPrice.toFixed(cfg.priceDecimals)}</span>` : ''}
          ${onSale ? `<span class="price-discount-badge">-${discount}%</span>` : ''}
        </div>
        <button class="product-item-add" data-id="${product.id}" type="button">
          <i class="fas fa-shopping-bag"></i> ${cfg.buttonAddText}
        </button>
      </div>
    </div>
  `;
}

// ── JS Logic ────────────────────────────────────
export function renderProductCard(targetId = 'product-card-placeholder', product = null, customConfig = {}) {
  if (!document.getElementById('product-card-style')) {
    const style = document.createElement('style');
    style.id = 'product-card-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const cfg = { ...DEFAULTS, ...customConfig };
  const target = document.getElementById(targetId);
  if (!target || !product) return;

  target.innerHTML = template(product, cfg);
}

export function productCardHtml(product, customConfig = {}) {
  const cfg = { ...DEFAULTS, ...customConfig };
  return template(product, cfg);
}

export { DEFAULTS as productCardDefaults };

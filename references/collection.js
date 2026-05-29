/* ── Toast ───────────────────────────────────────── */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
window.showToast = showToast;

/* ── Product Data ──────────────────────────────── */
const PRODUCTS = [
  { id: 1,  name: "Premium Desk Organizer",     category: "Office",      price: 49.99,  oldPrice: null,   rating: 4.5, reviews: 128, badge: "best",    image: "product-01-main.png",  imageHover: "product-01-hover.png" },
  { id: 2,  name: "Wireless Charging Pad",       category: "Electronics", price: 34.99,  oldPrice: null,   rating: 4.2, reviews: 96,  badge: null,     image: "product-02-main.png",  imageHover: "product-02-hover.png" },
  { id: 3,  name: "Aromatherapy Candle Set",     category: "Home",        price: 36.00,  oldPrice: null,   rating: 4.8, reviews: 204, badge: "best",    image: "product-03-main.png",  imageHover: "product-03-hover.png" },
  { id: 4,  name: "Leather Journal",             category: "Office",      price: 24.99,  oldPrice: null,   rating: 4.3, reviews: 73,  badge: null,     image: "product-04-main.png",  imageHover: "product-04-hover.png" },
  { id: 5,  name: "Smart Home Speaker",          category: "Electronics", price: 59.00,  oldPrice: 99.00,  rating: 4.6, reviews: 312, badge: "sale",    image: "hero-01.jpg",         imageHover: "hero-03.jpg" },
  { id: 6,  name: "Bamboo Cutting Board",        category: "Kitchen",     price: 29.99,  oldPrice: null,   rating: 4.4, reviews: 57,  badge: "new",     image: "deal-product-featured.png", imageHover: "hero-01.jpg" },
  { id: 7,  name: "Ceramic Mug Set",             category: "Kitchen",     price: 32.00,  oldPrice: null,   rating: 4.1, reviews: 41,  badge: null,     image: "product-01-main.png",  imageHover: "product-01-hover.png" },
  { id: 8,  name: "Linen Throw Blanket",         category: "Home",        price: 59.99,  oldPrice: null,   rating: 4.7, reviews: 186, badge: "best",    image: "product-03-main.png",  imageHover: "product-03-hover.png" },
  { id: 9,  name: "Plant Pot Collection",        category: "Home",        price: 44.00,  oldPrice: null,   rating: 4.0, reviews: 33,  badge: null,     image: "product-02-main.png",  imageHover: "product-02-hover.png" },
  { id: 10, name: "Ergonomic Mouse Pad",         category: "Office",      price: 19.99,  oldPrice: null,   rating: 3.9, reviews: 64,  badge: null,     image: "product-04-main.png",  imageHover: "product-04-hover.png" },
  { id: 11, name: "LED Desk Lamp",               category: "Office",      price: 54.99,  oldPrice: null,   rating: 4.5, reviews: 147, badge: "new",     image: "product-01-main.png",  imageHover: "product-01-hover.png" },
  { id: 12, name: "Essential Oil Diffuser",      category: "Home",        price: 39.99,  oldPrice: null,   rating: 4.6, reviews: 93,  badge: null,     image: "product-03-main.png",  imageHover: "product-03-hover.png" },
  { id: 13, name: "Stainless Water Bottle",      category: "Lifestyle",   price: 27.99,  oldPrice: null,   rating: 4.3, reviews: 215, badge: null,     image: "product-02-main.png",  imageHover: "product-02-hover.png" },
  { id: 14, name: "Premium Yoga Mat",            category: "Lifestyle",   price: 49.99,  oldPrice: null,   rating: 4.4, reviews: 178, badge: null,     image: "product-04-main.png",  imageHover: "product-04-hover.png" },
  { id: 15, name: "Silk Pillowcase Set",         category: "Home",        price: 34.99,  oldPrice: null,   rating: 4.2, reviews: 88,  badge: "new",     image: "product-01-main.png",  imageHover: "product-01-hover.png" },
  { id: 16, name: "French Coffee Press",         category: "Kitchen",     price: 45.00,  oldPrice: null,   rating: 4.8, reviews: 256, badge: "best",    image: "product-03-main.png",  imageHover: "product-03-hover.png" },
  { id: 17, name: "Minimal Wall Clock",          category: "Home",        price: 39.99,  oldPrice: null,   rating: 4.1, reviews: 52,  badge: null,     image: "product-02-main.png",  imageHover: "product-02-hover.png" },
  { id: 18, name: "Premium Notebook Set",        category: "Office",      price: 18.99,  oldPrice: null,   rating: 4.0, reviews: 109, badge: null,     image: "product-04-main.png",  imageHover: "product-04-hover.png" },
  { id: 19, name: "Aluminum Phone Stand",        category: "Office",      price: 14.99,  oldPrice: null,   rating: 3.8, reviews: 44,  badge: null,     image: "product-01-main.png",  imageHover: "product-01-hover.png" },
  { id: 20, name: "Scented Candle Trio",         category: "Home",        price: 42.00,  oldPrice: null,   rating: 4.7, reviews: 167, badge: null,     image: "product-03-main.png",  imageHover: "product-03-hover.png" },
  { id: 21, name: "Bamboo Desk Shelf",           category: "Office",      price: 79.99,  oldPrice: 99.99,  rating: 4.5, reviews: 81,  badge: "sale",    image: "product-02-main.png",  imageHover: "product-02-hover.png" },
  { id: 22, name: "Glass Food Container Set",    category: "Kitchen",     price: 24.99,  oldPrice: null,   rating: 4.3, reviews: 63,  badge: "new",     image: "product-04-main.png",  imageHover: "product-04-hover.png" },
  { id: 23, name: "Canvas Tote Bag",             category: "Lifestyle",   price: 22.00,  oldPrice: null,   rating: 4.2, reviews: 135, badge: null,     image: "product-01-main.png",  imageHover: "product-01-hover.png" },
  { id: 24, name: "Weighted Blanket (15lb)",     category: "Home",        price: 89.99,  oldPrice: null,   rating: 4.9, reviews: 421, badge: "best",    image: "product-03-main.png",  imageHover: "product-03-hover.png" },
];

const ITEMS_PER_PAGE = 9;

/* ── State ─────────────────────────────────────── */
const state = {
  filtered: [],
  page: 1,
  sort: 'featured',
  filters: {
    categories: new Set(['all']),
    price: 'all',
    rating: 0,
  },
};

/* ── Image URL ─────────────────────────────────── */
function imgUrl(name) {
  return `assets/images/${name}`;
}

/* ── Filter & Sort ──────────────────────────────── */
function applyFilters() {
  const { categories, price, rating } = state.filters;
  const showAll = categories.has('all');

  state.filtered = PRODUCTS.filter(p => {
    if (!showAll && !categories.has(p.category)) return false;
    if (rating > 0 && p.rating < rating) return false;
    if (price !== 'all') {
      const effective = p.oldPrice || p.price;
      if (price === '0-25' && (effective < 0 || effective > 25)) return false;
      if (price === '25-50' && (effective < 25 || effective > 50)) return false;
      if (price === '50-100' && (effective < 50 || effective > 100)) return false;
      if (price === '100+' && effective <= 100) return false;
    }
    return true;
  });

  applySort();
}

function applySort() {
  const sort = state.sort;
  const list = state.filtered;

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => (a.oldPrice || a.price) - (b.oldPrice || b.price));
      break;
    case 'price-desc':
      list.sort((a, b) => (b.oldPrice || b.price) - (a.oldPrice || a.price));
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      list.sort((a, b) => a.id - b.id);
  }
}

/* ── Render Products ────────────────────────────── */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const start = (state.page - 1) * ITEMS_PER_PAGE;
  const pageItems = state.filtered.slice(start, start + ITEMS_PER_PAGE);

  if (pageItems.length === 0) {
    grid.innerHTML = '';
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('pagination').innerHTML = '';
    document.getElementById('resultsCount').textContent = '0 products found';
    return;
  }

  document.getElementById('emptyState').style.display = 'none';

  grid.className = 'products-grid';

  grid.innerHTML = pageItems.map(p =>
    productCardHtml(p)
  ).join('');

  updateResultsCount();
  renderPagination();
}

/* ── Pagination ──────────────────────────────────── */
function renderPagination() {
  const container = document.getElementById('pagination');
  const total = Math.ceil(state.filtered.length / ITEMS_PER_PAGE);
  if (total <= 1) { container.innerHTML = ''; return; }

  const current = state.page;
  let html = '';

  html += `<button class="pagination-btn" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''} aria-label="Previous page">&laquo;</button>`;

  const range = getPageRange(current, total);
  for (const p of range) {
    if (p === '...') {
      html += `<span class="pagination-ellipsis">...</span>`;
    } else {
      html += `<button class="pagination-btn${p === current ? ' active' : ''}" data-page="${p}">${p}</button>`;
    }
  }

  html += `<button class="pagination-btn" data-page="${current + 1}" ${current === total ? 'disabled' : ''} aria-label="Next page">&raquo;</button>`;

  container.innerHTML = html;
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

/* ── Active Filter Tags ─────────────────────────── */
function renderActiveFilters() {
  const container = document.getElementById('activeFilters');
  const tags = [];

  if (!state.filters.categories.has('all')) {
    state.filters.categories.forEach(cat => {
      tags.push({ label: cat, type: 'category', value: cat });
    });
  }

  if (state.filters.price !== 'all') {
    const labels = { '0-25': 'Under $25', '25-50': '$25 - $50', '50-100': '$50 - $100', '100+': '$100+' };
    tags.push({ label: labels[state.filters.price], type: 'price', value: state.filters.price });
  }

  if (state.filters.rating > 0) {
    tags.push({ label: `★ ${state.filters.rating} & Up`, type: 'rating', value: state.filters.rating });
  }

  if (tags.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = tags.map(t => `
    <span class="filter-tag">
      ${t.label}
      <button class="filter-tag-remove" data-type="${t.type}" data-value="${t.value}" aria-label="Remove filter: ${t.label}" type="button">
        <i class="fas fa-times"></i>
      </button>
    </span>
  `).join('');
}

function updateResultsCount() {
  const el = document.getElementById('resultsCount');
  const start = (state.page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(state.page * ITEMS_PER_PAGE, state.filtered.length);
  if (state.filtered.length === 0) {
    el.textContent = '0 products found';
  } else {
    el.textContent = `Showing ${start}–${end} of ${state.filtered.length} products`;
  }
}

/* ── URL Sync ────────────────────────────────────── */
function syncStateToUrl() {
  const params = new URLSearchParams();
  if (!state.filters.categories.has('all')) {
    params.set('cat', [...state.filters.categories].join(','));
  }
  if (state.filters.price !== 'all') params.set('price', state.filters.price);
  if (state.filters.rating > 0) params.set('rating', state.filters.rating);
  if (state.sort !== 'featured') params.set('sort', state.sort);
  if (state.page > 1) params.set('page', state.page);

  const qs = params.toString();
  const url = qs ? `?${qs}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

function syncStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('cat')) {
    state.filters.categories = new Set(params.get('cat').split(','));
  }
  if (params.has('price')) state.filters.price = params.get('price');
  if (params.has('rating')) state.filters.rating = Number(params.get('rating'));
  if (params.has('sort')) state.sort = params.get('sort');
  if (params.has('page')) state.page = Number(params.get('page'));
}

/* ── Sync UI to State ────────────────────────────── */
function syncFiltersToUI() {
  document.querySelectorAll('#categoryFilters input').forEach(inp => {
    inp.checked = state.filters.categories.has(inp.value);
  });
  document.querySelectorAll('#priceFilters input').forEach(inp => {
    inp.checked = inp.value === state.filters.price;
  });
  document.querySelectorAll('#ratingFilters input').forEach(inp => {
    inp.checked = Number(inp.value) === state.filters.rating;
  });
  document.getElementById('sortSelect').value = state.sort;
}

/* ── Full Re-render ──────────────────────────────── */
function refresh() {
  applyFilters();
  renderProducts();
  renderActiveFilters();
  syncStateToUrl();
}

/* ── Wishlist Toggle ─────────────────────────────── */
function toggleWishlist(id, btn) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  const icon = btn.querySelector('i');
  const isActive = icon.classList.contains('fas');
  icon.className = isActive ? 'far fa-heart' : 'fas fa-heart';
  btn.classList.toggle('active', !isActive);

  if (isActive) {
    if (window.removeFromWishlist) window.removeFromWishlist(String(p.id));
  } else {
    if (window.addToWishlist) {
      window.addToWishlist({
        id: String(p.id),
        name: p.name,
        price: String(p.price),
        image: imgUrl(p.image),
      });
    }
  }
  if (window.showToast) {
    window.showToast(isActive ? 'Removed from Wishlist' : `Added to ${p.name}`);
  }
}

window.resetCartButton = function(id) {
  const card = document.querySelector(`.product-item[data-id="${id}"]`);
  if (card) {
    const btn = card.querySelector('.product-item-add');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
      btn.style.background = '';
      btn.disabled = false;
      delete btn.dataset.added;
    }
  }
};

/* ── Add to Cart ─────────────────────────────────── */
function addToCart(id, btn) {
  if (!btn || btn.dataset.added) return;
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  btn.dataset.added = 'true';

  if (window.addToCartDrawer) {
    window.addToCartDrawer({
      id: String(p.id),
      name: p.name,
      price: String(p.price),
      image: imgUrl(p.image),
    });
  }
  btn.innerHTML = '<i class="fas fa-check"></i> Added';
  btn.style.background = '#27ae60';
  btn.disabled = true;
  if (window.showToast) {
    window.showToast(`${p.name} added to cart`);
  }
}

/* ── Event Listeners ─────────────────────────────── */
function setupEvents() {
  // Category checkboxes
  document.getElementById('categoryFilters').addEventListener('change', e => {
    if (e.target.dataset.filter !== 'category') return;
    const val = e.target.value;
    if (val === 'all') {
      state.filters.categories = new Set(['all']);
    } else {
      state.filters.categories.delete('all');
      if (e.target.checked) {
        state.filters.categories.add(val);
      } else {
        state.filters.categories.delete(val);
      }
      if (state.filters.categories.size === 0) {
        state.filters.categories.add('all');
      }
    }
    state.page = 1;
    syncFiltersToUI();
    refresh();
  });

  // Price/rating radios
  document.querySelectorAll('#priceFilters input, #ratingFilters input').forEach(el => {
    el.addEventListener('change', e => {
      const type = e.target.dataset.filter;
      state.filters[type] = type === 'rating' ? Number(e.target.value) : e.target.value;
      state.page = 1;
      refresh();
    });
  });

  // Clear all
  document.getElementById('clearAllFilters').addEventListener('click', () => {
    state.filters.categories = new Set(['all']);
    state.filters.price = 'all';
    state.filters.rating = 0;
    state.page = 1;
    syncFiltersToUI();
    refresh();
  });

  // Sort
  document.getElementById('sortSelect').addEventListener('change', e => {
    state.sort = e.target.value;
    state.page = 1;
    refresh();
  });

  // Pagination (delegated)
  document.getElementById('pagination').addEventListener('click', e => {
    const btn = e.target.closest('.pagination-btn');
    if (!btn || btn.classList.contains('disabled') || btn.classList.contains('active')) return;
    state.page = Number(btn.dataset.page);
    refresh();
    document.getElementById('collection-main').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Product grid events (wishlist + add to cart)
  document.getElementById('productsGrid').addEventListener('click', e => {
    const wishlistBtn = e.target.closest('.product-item-wishlist');
    if (wishlistBtn) {
      toggleWishlist(Number(wishlistBtn.dataset.id), wishlistBtn);
      return;
    }
    const addBtn = e.target.closest('.product-item-add');
    if (addBtn) {
      addToCart(Number(addBtn.dataset.id), addBtn);
      return;
    }
  });

  // Active filter tag removal
  document.getElementById('activeFilters').addEventListener('click', e => {
    const removeBtn = e.target.closest('.filter-tag-remove');
    if (!removeBtn) return;
    const { type, value } = removeBtn.dataset;

    if (type === 'category') {
      state.filters.categories.delete(value);
      if (state.filters.categories.size === 0) state.filters.categories.add('all');
    } else if (type === 'price') {
      state.filters.price = 'all';
    } else if (type === 'rating') {
      state.filters.rating = 0;
    }
    state.page = 1;
    syncFiltersToUI();
    refresh();
  });

  // Mobile filter toggle
  document.getElementById('filterToggle').addEventListener('click', () => {
    document.getElementById('collectionFilters').classList.add('open');
    document.getElementById('filtersOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeFilters() {
    document.getElementById('collectionFilters').classList.remove('open');
    document.getElementById('filtersOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('filtersClose').addEventListener('click', closeFilters);
  document.getElementById('filtersOverlay').addEventListener('click', closeFilters);

  // Empty state reset
  document.getElementById('emptyReset').addEventListener('click', () => {
    state.filters.categories = new Set(['all']);
    state.filters.price = 'all';
    state.filters.rating = 0;
    state.page = 1;
    syncFiltersToUI();
    refresh();
  });
}

/* ── SFC Rendering (shared components) ───────────── */
import { renderAnnouncementBar } from './Shared Component/announcement-bar.js';
import { renderBrandLogos } from './Shared Component/brand-logos.js';
import { renderFooter } from './Shared Component/footer.js';
import { renderHeader } from './Shared Component/header.js';
import { renderMobileMenu } from './Shared Component/mobile-menu.js';
import { renderWishlistDrawer } from './Shared Component/wishlist-drawer.js';
import { renderSearchOverlay } from './Shared Component/search-overlay.js';
import { renderCartDrawer } from './Shared Component/cart-drawer.js';
import { productCardHtml } from './Shared Component/product-card.js';

function renderSharedComponents() {
  renderAnnouncementBar();
  renderHeader();
  renderMobileMenu();
  renderWishlistDrawer();
  renderSearchOverlay();
  renderCartDrawer();
  renderBrandLogos();
  renderFooter();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ── Init ─────────────────────────────────────────── */
function init() {
  renderSharedComponents();
  syncStateFromUrl();
  syncFiltersToUI();
  refresh();
  setupEvents();
}

document.addEventListener('DOMContentLoaded', init);

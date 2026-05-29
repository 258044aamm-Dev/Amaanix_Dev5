// ── CSS ─────────────────────────────────────────
const css = `
  .wishlist-drawer {
    position: fixed; top: 0; right: -400px; width: 100%; max-width: 400px; height: 100vh;
    background: var(--white); box-shadow: -2px 0 20px rgba(0,0,0,0.15); z-index: 3000;
    transition: right 0.3s ease; display: flex; flex-direction: column;
  }
  .wishlist-drawer.active { right: 0; }
  .wishlist-drawer-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 2999; opacity: 0; visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  .wishlist-drawer-overlay.active { opacity: 1; visibility: visible; }
  .wishlist-drawer-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .wishlist-drawer-header h3 { font-size: 18px; font-weight: 600; color: var(--text-dark); margin: 0; }
  .wishlist-drawer-close { font-size: 24px; cursor: pointer; color: var(--text-light); transition: color 0.3s; background: none; border: none; padding: 5px; }
  .wishlist-drawer-close:hover { color: var(--primary); }
  .wishlist-drawer-body { flex: 1; overflow-y: auto; padding: 20px; }
  .wishlist-item { display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid var(--border); }
  .wishlist-item:last-child { border-bottom: none; }
  .wishlist-item-image { width: 70px; height: 70px; border-radius: var(--radius); object-fit: cover; background: var(--bg-light); }
  .wishlist-item-info { flex: 1; }
  .wishlist-item-name { font-size: 14px; font-weight: 600; color: var(--text-dark); margin-bottom: 5px; }
  .wishlist-item-price { font-size: 14px; font-weight: 600; color: var(--primary); margin-bottom: 10px; }
  .wishlist-item-actions { display: flex; gap: 10px; align-items: center; }
  .wishlist-add-cart {
    padding: 6px 12px; background: var(--primary); color: var(--white); border: none;
    border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.3s;
  }
  .wishlist-add-cart:hover { background: var(--primary-dark); }
  .wishlist-remove {
    padding: 6px 12px; background: transparent; color: var(--text-light);
    border: 1px solid var(--border); border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.3s;
  }
  .wishlist-remove:hover { color: #C0392B; border-color: #C0392B; }
  .wishlist-quantity { display: flex; align-items: center; gap: 8px; margin: 5px 0; }
  .quantity-btn {
    width: 24px; height: 24px; border: 1px solid var(--border); background: var(--white);
    border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .quantity-btn:hover { background: var(--primary); color: var(--white); border-color: var(--primary); }
  .quantity-value { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
  .wishlist-summary { padding: 15px; background: var(--bg-light); border-radius: var(--radius); margin-bottom: 15px; }
  .wishlist-summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .wishlist-summary-row:last-child { margin-bottom: 0; padding-top: 8px; border-top: 1px solid var(--border); font-weight: 700; font-size: 16px; }
  .wishlist-total-label { color: var(--text-dark); }
  .wishlist-total-price { color: var(--primary); font-size: 18px; }
  .wishlist-add-all {
    width: 100%; padding: 12px; background: var(--primary); color: var(--white); border: none;
    border-radius: var(--radius); font-size: 14px; font-weight: 600; cursor: pointer;
    transition: background 0.3s; margin-bottom: 10px;
  }
  .wishlist-add-all:hover { background: var(--primary-dark); }
  .wishlist-add-all:disabled { background: #ccc; cursor: not-allowed; }
  .wishlist-guest-prompt {
    background: linear-gradient(135deg, var(--primary) 0%, var(--midnight-green) 100%);
    color: var(--white); padding: 12px 15px; border-radius: var(--radius); margin-bottom: 15px;
    font-size: 13px; display: flex; align-items: center; gap: 10px;
  }
  .wishlist-guest-prompt a { color: var(--white); font-weight: 700; text-decoration: underline; }
  .wishlist-guest-prompt .close-prompt { margin-left: auto; cursor: pointer; opacity: 0.9; font-size: 18px; background: none; border: none; color: white; }
  .wishlist-guest-prompt .close-prompt:hover { opacity: 1; }
  .wishlist-drawer-footer { padding: 20px; border-top: 1px solid var(--border); text-align: center; }
  .wishlist-empty { text-align: center; padding: 40px 20px; color: var(--text-light); font-family: var(--font-supporting); }
  .wishlist-empty a { color: var(--primary); font-weight: 600; }
  @media (max-width: 480px) { .wishlist-drawer { max-width: 100%; } }
`;

// ── HTML ────────────────────────────────────────
const html = `
  <div class="wishlist-drawer-overlay" id="wishlistDrawerOverlay"></div>
  <div class="wishlist-drawer" id="wishlistDrawer" role="dialog" aria-modal="true" aria-label="Wishlist">
    <div class="wishlist-drawer-header">
      <h3>My Wishlist</h3>
      <button class="wishlist-drawer-close" aria-label="Close wishlist">&times;</button>
    </div>
    <div class="wishlist-drawer-body">
      <div class="wishlist-guest-prompt" id="wishlistGuestPrompt">
        <i class="fas fa-heart" aria-hidden="true"></i>
        <span>Save your wishlist permanently! <a href="login-and-registration.html">Sign up now</a></span>
        <button class="close-prompt">&times;</button>
      </div>
      <div class="wishlist-summary" id="wishlistSummary">
        <div class="wishlist-summary-row">
          <span class="wishlist-total-label">Subtotal (<span id="wishlistItemCount">3</span> items)</span>
          <span class="wishlist-total-price" id="wishlistSubtotal">$144.97</span>
        </div>
        <div class="wishlist-summary-row">
          <span class="wishlist-total-label">Total</span>
          <span class="wishlist-total-price" id="wishlistTotal">$144.97</span>
        </div>
      </div>
      <div id="wishlistItemsContainer"></div>
    </div>
    <div class="wishlist-drawer-footer">
      <button class="wishlist-add-all" id="wishlistAddAllBtn">Add All to Cart</button>
      <a href="collectionpage.html" class="btn btn-outline-dark full-width-btn">View All Products</a>
    </div>
  </div>
`;

// ── JS Logic ────────────────────────────────────
export function renderWishlistDrawer(targetId = 'wishlist-drawer-placeholder') {
  if (!document.getElementById('wishlist-drawer-style')) {
    const style = document.createElement('style');
    style.id = 'wishlist-drawer-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;

  let removeWishlistTrap = null;

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

  function openWishlistDrawer(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('wishlistDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      checkUserStatus();
      updateWishlistSummary();
      removeWishlistTrap = trapFocus(drawer);
      const closeBtn = drawer.querySelector('.wishlist-drawer-close');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('wishlistDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (removeWishlistTrap) removeWishlistTrap();
    }
  }

  function isUserLoggedIn() { return localStorage.getItem('amaanix_user') !== null; }

  function checkUserStatus() {
    const p = document.getElementById('wishlistGuestPrompt');
    if (p) p.style.display = !isUserLoggedIn() ? 'flex' : 'none';
  }

  function hideGuestPrompt() {
    const p = document.getElementById('wishlistGuestPrompt');
    if (p) p.style.display = 'none';
  }

  function updateWishlistSummary() {
    const items = document.querySelectorAll('#wishlistItemsContainer .wishlist-item');
    let total = 0, count = 0;
    items.forEach(item => {
      const price = parseFloat(item.dataset.price) || 0;
      const quantity = parseInt(item.querySelector('.quantity-value').textContent) || 1;
      total += price * quantity;
      count += quantity;
    });
    const subtotalEl = document.getElementById('wishlistSubtotal');
    const totalEl = document.getElementById('wishlistTotal');
    const countEl = document.getElementById('wishlistItemCount');
    const addAllBtn = document.getElementById('wishlistAddAllBtn');
    if (subtotalEl) subtotalEl.textContent = '$' + total.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
    if (countEl) countEl.textContent = count;
    if (addAllBtn) addAllBtn.disabled = items.length === 0;
    if (!isUserLoggedIn()) saveWishlistToLocalStorage();
    updateWishlistCount();
  }

  function updateQuantity(btn, change) {
    const q = btn.parentElement.querySelector('.quantity-value');
    let v = parseInt(q.textContent) || 1;
    q.textContent = Math.max(1, v + change);
    updateWishlistSummary();
  }

  function removeFromWishlist(btn) {
    const item = btn.closest('.wishlist-item');
    if (item) {
      const id = item.dataset.id;
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
      setTimeout(() => {
        item.remove();
        updateWishlistSummary();
        if (!isUserLoggedIn()) saveWishlistToLocalStorage();
        resetProductCardWishlist(id);
      }, 200);
    }
  }

  function resetProductCardWishlist(id) {
    const card = document.querySelector(`.product-item[data-id="${id}"]`);
    if (card) {
      const btn = card.querySelector('.product-item-wishlist');
      if (btn) {
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'far fa-heart';
        btn.classList.remove('active');
      }
    }
  }

  function addToCartFromWishlist(btn) {
    const item = btn.closest('.wishlist-item');
    const name = item.querySelector('.wishlist-item-name').textContent;
    const price = item.querySelector('.wishlist-item-price').textContent;
    const quantity = parseInt(item.querySelector('.quantity-value').textContent) || 1;
    if (window.showToast) {
      window.showToast(`${name} (x${quantity}) added to cart for ${price} each!`);
    }
    btn.textContent = 'Added!';
    btn.style.background = '#27ae60';
    setTimeout(() => { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 1500);
  }

  function addAllToCart() {
    const items = document.querySelectorAll('#wishlistItemsContainer .wishlist-item');
    if (items.length === 0) return;
    if (window.showToast) {
      window.showToast(`${items.length} item(s) added to cart!`);
    }
    const btn = document.getElementById('wishlistAddAllBtn');
    if (btn) {
      const o = btn.textContent;
      btn.textContent = 'All Added! \u2713';
      btn.style.background = '#27ae60';
      setTimeout(() => { btn.textContent = o; btn.style.background = ''; }, 2000);
    }
  }

  function saveWishlistToLocalStorage() {
    const items = [];
    document.querySelectorAll('#wishlistItemsContainer .wishlist-item').forEach(item => {
      items.push({
        id: item.dataset.id,
        name: item.querySelector('.wishlist-item-name').textContent,
        price: item.dataset.price,
        image: item.querySelector('.wishlist-item-image').src,
        quantity: parseInt(item.querySelector('.quantity-value').textContent) || 1
      });
    });
    try { localStorage.setItem('amaanix_wishlist_guest', JSON.stringify(items)); } catch(e) {}
  }

  function loadWishlistFromLocalStorage() {
    let saved;
    try { saved = localStorage.getItem('amaanix_wishlist_guest'); } catch(e) { return; }
    if (!saved) { updateWishlistCount(); return; }
    try {
      const items = JSON.parse(saved);
      const container = document.getElementById('wishlistItemsContainer');
      if (!container || items.length === 0) return;
      container.innerHTML = '';
      items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'wishlist-item';
        itemEl.dataset.id = item.id;
        itemEl.dataset.price = item.price;
        const img = document.createElement('img');
        img.className = 'wishlist-item-image';
        img.setAttribute('src', item.image);
        img.setAttribute('alt', item.name);
        itemEl.appendChild(img);
        const info = document.createElement('div');
        info.className = 'wishlist-item-info';
        const nameDiv = document.createElement('div');
        nameDiv.className = 'wishlist-item-name';
        nameDiv.textContent = item.name;
        info.appendChild(nameDiv);
        const priceDiv = document.createElement('div');
        priceDiv.className = 'wishlist-item-price';
        priceDiv.textContent = item.price;
        info.appendChild(priceDiv);
        const qtyDiv = document.createElement('div');
        qtyDiv.className = 'wishlist-quantity';
        const minusBtn = document.createElement('button');
        minusBtn.className = 'quantity-btn';
        minusBtn.textContent = '\u2212';
        qtyDiv.appendChild(minusBtn);
        const qtySpan = document.createElement('span');
        qtySpan.className = 'quantity-value';
        qtySpan.textContent = item.quantity;
        qtyDiv.appendChild(qtySpan);
        const plusBtn = document.createElement('button');
        plusBtn.className = 'quantity-btn';
        plusBtn.textContent = '+';
        qtyDiv.appendChild(plusBtn);
        info.appendChild(qtyDiv);
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'wishlist-item-actions';
        const addCartBtn = document.createElement('button');
        addCartBtn.className = 'wishlist-add-cart';
        addCartBtn.textContent = 'Add to Cart';
        actionsDiv.appendChild(addCartBtn);
        const removeBtn = document.createElement('button');
        removeBtn.className = 'wishlist-remove';
        removeBtn.textContent = 'Remove';
        actionsDiv.appendChild(removeBtn);
        info.appendChild(actionsDiv);
        itemEl.appendChild(info);
        container.appendChild(itemEl);
      });
      updateWishlistSummary();
    } catch (e) { console.error('Failed to load wishlist:', e); }
  }

  function syncWishlistWithServer() { if (!isUserLoggedIn()) return; console.log('Wishlist synced (simulated)'); }

  const wishlistDrawer = document.getElementById('wishlistDrawer');
  if (wishlistDrawer) {
    // Delegate clicks within wishlist drawer
    wishlistDrawer.addEventListener('click', function(e) {
      const target = e.target;
      if (target.classList.contains('quantity-btn')) {
        e.preventDefault();
        const delta = target.textContent.trim() === '+' ? 1 : -1;
        updateQuantity(target, delta);
        return;
      }
      if (target.classList.contains('wishlist-add-cart')) {
        e.preventDefault();
        addToCartFromWishlist(target);
        return;
      }
      if (target.classList.contains('wishlist-remove')) {
        e.preventDefault();
        removeFromWishlist(target);
        return;
      }
    });

    const addAllBtn = document.getElementById('wishlistAddAllBtn');
    if (addAllBtn) {
      addAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addAllToCart();
      });
    }

    const overlay = document.getElementById('wishlistDrawerOverlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeWishlistDrawer();
      });
    }

    const closeBtn = wishlistDrawer.querySelector('.wishlist-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeWishlistDrawer();
      });
    }

    const guestPrompt = document.getElementById('wishlistGuestPrompt');
    if (guestPrompt) {
      const closePrompt = guestPrompt.querySelector('.close-prompt');
      if (closePrompt) {
        closePrompt.addEventListener('click', function(e) {
          e.preventDefault();
          hideGuestPrompt();
        });
      }
    }
  }

  // Wishlist icon buttons (header)
  const wishlistIcons = document.querySelectorAll('.wishlist-icon, .mobile-wishlist-icon');
  wishlistIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault();
      openWishlistDrawer(e);
    });
  });

  // Escape key closes wishlist
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('wishlistDrawer');
      if (drawer && drawer.classList.contains('active')) {
        closeWishlistDrawer();
      }
    }
  });

  // Load saved wishlist data
  if (!isUserLoggedIn()) loadWishlistFromLocalStorage();
  else syncWishlistWithServer();

  window.addEventListener('storage', function(e) {
    if (e.key === 'amaanix_wishlist_guest' && !isUserLoggedIn()) loadWishlistFromLocalStorage();
  });

  // ── Public API: updateWishlistCount ──────────────
  function updateWishlistCount() {
    const count = document.querySelectorAll('#wishlistItemsContainer .wishlist-item').length;
    document.querySelectorAll('.wishlist-count').forEach(el => el.textContent = count);
  }
  window.updateWishlistCount = updateWishlistCount;

  // ── Public API: openWishlistDrawer ───────────────
  window.openWishlistDrawer = openWishlistDrawer;

  // ── Public API: addToWishlist ────────────────────
  window.addToWishlist = function({ id, name, price, image }) {
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;

    const existing = container.querySelector(`.wishlist-item[data-id="${id}"]`);
    if (existing) {
      const qtyEl = existing.querySelector('.quantity-value');
      qtyEl.textContent = (parseInt(qtyEl.textContent) || 1) + 1;
    } else {
      const div = document.createElement('div');
      div.className = 'wishlist-item';
      div.dataset.id = id;
      div.dataset.price = price;
      div.innerHTML = `
        <img loading="lazy" src="${image}" alt="${name}" class="wishlist-item-image" width="100" height="100">
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${name}</div>
          <div class="wishlist-item-price">$${parseFloat(price).toFixed(2)}</div>
          <div class="wishlist-quantity">
            <button class="quantity-btn">&minus;</button>
            <span class="quantity-value">1</span>
            <button class="quantity-btn">+</button>
          </div>
          <div class="wishlist-item-actions">
            <button class="wishlist-add-cart">Add to Cart</button>
            <button class="wishlist-remove">Remove</button>
          </div>
        </div>`;
      container.prepend(div);
    }
    updateWishlistSummary();
    if (!isUserLoggedIn()) saveWishlistToLocalStorage();
  };

  // ── Public API: removeFromWishlist ───────────────
  window.removeFromWishlist = function(id) {
    const item = document.querySelector(`#wishlistItemsContainer .wishlist-item[data-id="${id}"]`);
    if (item) {
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
      setTimeout(() => {
        item.remove();
        updateWishlistSummary();
        if (!isUserLoggedIn()) saveWishlistToLocalStorage();
        resetProductCardWishlist(id);
      }, 200);
    }
  };
}

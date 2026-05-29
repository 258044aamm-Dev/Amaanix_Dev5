const css = `
  .cart-drawer {
    position: fixed; top: 0; right: -400px; width: 100%; max-width: 400px; height: 100vh;
    background: var(--white); box-shadow: -2px 0 20px rgba(0,0,0,0.15); z-index: 3000;
    transition: right 0.3s ease; display: flex; flex-direction: column;
  }
  .cart-drawer.active { right: 0; }
  .cart-drawer-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 2999; opacity: 0; visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  .cart-drawer-overlay.active { opacity: 1; visibility: visible; }
  .cart-drawer-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .cart-drawer-header h3 { font-size: 18px; font-weight: 600; color: var(--text-dark); margin: 0; display: flex; align-items: center; gap: 8px; }
  .cart-drawer-close { font-size: 24px; cursor: pointer; color: var(--text-light); transition: color 0.3s; background: none; border: none; padding: 5px; }
  .cart-drawer-close:hover { color: var(--primary); }
  .cart-drawer-body { flex: 1; overflow-y: auto; padding: 20px; }
  .cart-item { display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid var(--border); }
  .cart-item:last-child { border-bottom: none; }
  .cart-item-image { width: 70px; height: 70px; border-radius: var(--radius); object-fit: cover; background: var(--bg-light); }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-size: 14px; font-weight: 600; color: var(--text-dark); margin-bottom: 5px; }
  .cart-item-price { font-size: 14px; font-weight: 600; color: var(--primary); margin-bottom: 10px; }
  .cart-item-actions { display: flex; gap: 10px; align-items: center; }
  .cart-remove {
    padding: 6px 12px; background: transparent; color: var(--text-light);
    border: 1px solid var(--border); border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.3s;
  }
  .cart-remove:hover { color: #C0392B; border-color: #C0392B; }
  .cart-quantity { display: flex; align-items: center; gap: 8px; margin: 5px 0; }

  .cart-promo { padding: 12px 0; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
  .cart-promo-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-light); margin-bottom: 8px; }
  .cart-promo-row { display: flex; gap: 8px; }
  .cart-promo-input {
    flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius);
    font-size: 13px; font-family: var(--font-body); transition: border-color 0.3s;
  }
  .cart-promo-input:focus { outline: none; border-color: var(--primary); }
  .cart-promo-apply {
    padding: 8px 16px; background: var(--text-dark); color: var(--white); border: none;
    border-radius: var(--radius); font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.3s; white-space: nowrap;
  }
  .cart-promo-apply:hover { background: var(--primary); }
  .cart-promo-msg { font-size: 12px; margin-top: 6px; min-height: 18px; }
  .cart-promo-msg.success { color: #27ae60; }
  .cart-promo-msg.error { color: #C0392B; }

  .cart-drawer-footer { padding: 20px; border-top: 1px solid var(--border); }
  .cart-summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 14px; }
  .cart-summary-row.cart-discount-row { color: #27ae60; display: none; }
  .cart-summary-row.cart-shipping-row { font-size: 13px; }
  .cart-summary-row:last-of-type { margin-bottom: 0; padding-top: 8px; border-top: 1px solid var(--border); font-weight: 700; font-size: 16px; }
  .cart-total-label { color: var(--text-dark); }
  .cart-total-price { color: var(--primary); font-size: 18px; }
  .cart-discount-value { color: #27ae60; }
  .cart-free-shipping { color: #27ae60; font-weight: 600; }
  .cart-checkout-btn {
    width: 100%; padding: 12px; background: var(--primary); color: var(--white); border: none;
    border-radius: var(--radius); font-size: 14px; font-weight: 600; cursor: pointer;
    transition: background 0.3s; margin-top: 12px;
  }
  .cart-checkout-btn:hover { background: var(--primary-dark); }
  .cart-continue-link { display: block; text-align: center; margin-top: 12px; font-size: 13px; color: var(--text-light); }
  .cart-continue-link:hover { color: var(--primary); }
  .cart-empty { text-align: center; padding: 40px 20px; color: var(--text-light); font-family: var(--font-supporting); }
  .cart-empty i { font-size: 48px; color: var(--border); margin-bottom: 15px; display: block; }
  .cart-empty p { margin-bottom: 15px; }
  .cart-empty a { color: var(--primary); font-weight: 600; display: inline-block; padding: 10px 24px; border: 1px solid var(--primary); border-radius: var(--radius); transition: all 0.3s; }
  .cart-empty a:hover { background: var(--primary); color: var(--white); text-decoration: none; }
  @media (max-width: 480px) { .cart-drawer { max-width: 100%; } }
`;

const html = `
  <div class="cart-drawer-overlay" id="cartDrawerOverlay"></div>
  <div class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shopping Cart">
    <div class="cart-drawer-header">
      <h3><i class="fas fa-shopping-bag" aria-hidden="true"></i> Shopping Cart</h3>
      <button class="cart-drawer-close" aria-label="Close cart">&times;</button>
    </div>
    <div class="cart-drawer-body" id="cartDrawerBody">
      <div class="cart-promo">
        <div class="cart-promo-label">Have a coupon?</div>
        <div class="cart-promo-row">
          <input type="text" class="cart-promo-input" id="cartPromoInput" placeholder="Enter promo code" aria-label="Promo code">
          <button class="cart-promo-apply" id="cartPromoApply">Apply</button>
        </div>
        <div class="cart-promo-msg" id="cartPromoMsg"></div>
      </div>
      <div id="cartItemsContainer"></div>
    </div>
    <div class="cart-drawer-footer">
      <div id="cartSummary">
        <div class="cart-summary-row">
          <span class="cart-total-label">Subtotal</span>
          <span class="cart-total-price" id="cartSubtotal">$138.00</span>
        </div>
        <div class="cart-summary-row cart-shipping-row" id="cartShippingRow">
          <span class="cart-total-label">Shipping</span>
          <span class="cart-total-price" id="cartShipping">Calculated at checkout</span>
        </div>
        <div class="cart-summary-row cart-discount-row" id="cartDiscountRow">
          <span class="cart-total-label">Discount</span>
          <span class="cart-discount-value" id="cartDiscountValue">&minus;$0.00</span>
        </div>
        <div class="cart-summary-row">
          <span class="cart-total-label">Total</span>
          <span class="cart-total-price" id="cartTotal">$138.00</span>
        </div>
      </div>
      <button class="cart-checkout-btn" id="cartCheckoutBtn">Proceed to Checkout</button>
      <a href="collectionpage.html" class="cart-continue-link">Continue Shopping</a>
    </div>
  </div>
`;

let promoApplied = false;

export function renderCartDrawer(targetId = 'cart-drawer-placeholder') {
  if (!document.getElementById('cart-drawer-style')) {
    const style = document.createElement('style');
    style.id = 'cart-drawer-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;

  promoApplied = false;

  let removeCartTrap = null;

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

  function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (removeCartTrap) removeCartTrap();
    }
  }

  function calcSubtotal() {
    const items = document.querySelectorAll('#cartItemsContainer .cart-item');
    let total = 0, count = 0;
    items.forEach(item => {
      const price = parseFloat(item.dataset.price) || 0;
      const quantity = parseInt(item.querySelector('.quantity-value').textContent) || 1;
      total += price * quantity;
      count += quantity;
    });
    return { total, count };
  }

  function updateCartSummary() {
    updateCartCount();
    const { total, count } = calcSubtotal();
    const subtotalEl = document.getElementById('cartSubtotal');
    const countEl = document.getElementById('cartItemCount');
    if (subtotalEl) subtotalEl.textContent = '$' + total.toFixed(2);
    if (countEl) countEl.textContent = count;

    const shippingEl = document.getElementById('cartShipping');
    if (shippingEl) {
      if (total >= 50) {
        shippingEl.innerHTML = '<span class="cart-free-shipping">FREE</span>';
      } else {
        shippingEl.textContent = '$5.99';
      }
    }

    let discount = 0;
    if (promoApplied) {
      discount = total * 0.10;
      document.getElementById('cartDiscountRow').style.display = 'flex';
      document.getElementById('cartDiscountValue').textContent = '\u2212$' + discount.toFixed(2);
    } else {
      document.getElementById('cartDiscountRow').style.display = 'none';
    }

    const shipping = total >= 50 ? 0 : 5.99;
    const finalTotal = total + shipping - discount;
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = '$' + finalTotal.toFixed(2);
  }

  function updateQuantity(btn, change) {
    const q = btn.parentElement.querySelector('.quantity-value');
    let v = parseInt(q.textContent) || 1;
    q.textContent = Math.max(1, v + change);
    updateCartSummary();
  }

  function removeCartItem(btn) {
    const item = btn.closest('.cart-item');
    if (item) {
      const id = item.dataset.id;
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
      setTimeout(() => {
        item.remove();
        updateCartSummary();
        if (window.resetCartButton) window.resetCartButton(id);
      }, 200);
    }
  }

  function applyPromo() {
    const input = document.getElementById('cartPromoInput');
    const msg = document.getElementById('cartPromoMsg');
    const code = input.value.trim().toUpperCase();
    if (!code) {
      msg.className = 'cart-promo-msg error';
      msg.textContent = 'Please enter a promo code.';
      return;
    }
    if (code === 'AMAANIX10') {
      promoApplied = true;
      msg.className = 'cart-promo-msg success';
      msg.textContent = '10% discount applied!';
      updateCartSummary();
    } else if (code === 'FREESHIP') {
      const shippingEl = document.getElementById('cartShipping');
      if (shippingEl) shippingEl.innerHTML = '<span class="cart-free-shipping">FREE</span>';
      msg.className = 'cart-promo-msg success';
      msg.textContent = 'Free shipping applied!';
      updateCartSummary();
    } else {
      msg.className = 'cart-promo-msg error';
      msg.textContent = 'Invalid promo code. Try AMAANIX10 or FREESHIP.';
    }
  }

  const cartDrawerBody = document.getElementById('cartDrawerBody');
  if (cartDrawerBody) {
    cartDrawerBody.addEventListener('click', function(e) {
      const target = e.target;
      if (target.classList.contains('quantity-btn')) {
        const delta = target.textContent.trim() === '+' ? 1 : -1;
        updateQuantity(target, delta);
        return;
      }
      if (target.classList.contains('cart-remove')) {
        e.preventDefault();
        removeCartItem(target);
        return;
      }
    });
  }

  document.getElementById('cartPromoApply').addEventListener('click', function(e) {
    e.preventDefault();
    applyPromo();
  });

  document.getElementById('cartPromoInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyPromo();
    }
  });

  const overlay = document.getElementById('cartDrawerOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeCartDrawer();
    });
  }

  const closeBtn = document.querySelector('.cart-drawer-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeCartDrawer();
    });
  }

  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.showToast) {
        window.showToast('Proceeding to checkout...');
      }
      closeCartDrawer();
    });
  }

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('cartDrawer');
      if (drawer && drawer.classList.contains('active')) {
        closeCartDrawer();
      }
    }
  });

  // ── Public API: updateCartCount ──────────────────
  function updateCartCount() {
    const count = document.querySelectorAll('#cartItemsContainer .cart-item').length;
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  }
  window.updateCartCount = updateCartCount;

  // ── Public API: openCartDrawer ───────────────────
  function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      removeCartTrap = trapFocus(drawer);
    }
  }
  window.openCartDrawer = openCartDrawer;

  // Wire up header cart icon to open the drawer
  document.querySelectorAll('.icon-cart').forEach(el => {
    const btn = el.closest('.icon-btn') || el;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openCartDrawer();
    });
  });

  // ── Public API: addToCartDrawer ──────────────────
  window.addToCartDrawer = function({ id, name, price, image }) {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    const existing = container.querySelector(`.cart-item[data-id="${id}"]`);
    if (existing) {
      const qtyEl = existing.querySelector('.quantity-value');
      qtyEl.textContent = (parseInt(qtyEl.textContent) || 1) + 1;
    } else {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.dataset.id = id;
      div.dataset.price = price;
      div.innerHTML = `
        <img loading="lazy" src="${image}" alt="${name}" class="cart-item-image">
        <div class="cart-item-info">
          <div class="cart-item-name">${name}</div>
          <div class="cart-item-price">$${parseFloat(price).toFixed(2)}</div>
          <div class="cart-quantity">
            <button class="quantity-btn">&minus;</button>
            <span class="quantity-value">1</span>
            <button class="quantity-btn">+</button>
          </div>
          <div class="cart-item-actions">
            <button class="cart-remove">Remove</button>
          </div>
        </div>`;
      container.prepend(div);
    }
    updateCartSummary();
  };
}

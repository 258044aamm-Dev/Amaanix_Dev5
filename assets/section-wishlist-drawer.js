(function() {
  var drawer = document.getElementById('wishlistDrawer');
  var overlay = document.getElementById('wishlistDrawerOverlay');
  var itemsContainer = document.getElementById('wishlistItemsContainer');
  var addAllBtn = document.getElementById('wishlistAddAllBtn');
  var guestPrompt = document.getElementById('wishlistGuestPrompt');
  var summaryEl = document.getElementById('wishlistSummary');
  if (!drawer || !overlay || !itemsContainer) return;

  var removeTrap = null;
  var sessionWishlist = null;
  var lastTrigger = null;
  var saveTimeout = null;

  /* ---------- config ---------- */

  var config = {
    showGuestPrompt: drawer.dataset.showGuestPrompt !== 'false',
    showSummary: drawer.dataset.showSummary !== 'false',
    enableQuantity: drawer.dataset.enableQuantity !== 'false'
  };

  /* ---------- helpers ---------- */

  function isLoggedIn() {
    var container = document.getElementById('wishlistItemsContainer');
    return container && container.dataset.customer === 'true';
  }

  function getGuestWishlist() {
    try { return JSON.parse(localStorage.getItem('amaanix_wishlist_guest')) || []; }
    catch(e) { return []; }
  }

  function saveGuestWishlist(items) {
    localStorage.setItem('amaanix_wishlist_guest', JSON.stringify(items));
  }

  function getWishlistItems() {
    if (isLoggedIn()) {
      if (sessionWishlist) return sessionWishlist;
      var container = document.getElementById('wishlistItemsContainer');
      if (container && container.dataset.wishlistItems) {
        try {
          sessionWishlist = JSON.parse(decodeURIComponent(container.dataset.wishlistItems)) || [];
        } catch(e) {
          sessionWishlist = [];
        }
      } else {
        sessionWishlist = [];
      }
      return sessionWishlist;
    }
    return getGuestWishlist();
  }

  function saveWishlist(items) {
    sessionWishlist = items;
    if (isLoggedIn()) {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(function() { writeServerWishlist(items); }, 300);
    } else {
      saveGuestWishlist(items);
    }
    updateWishlistCount();
  }

  function writeServerWishlist(items) {
    var formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('form_type', 'customer_update');
    formData.append('customer[note]', JSON.stringify(items));
    var csrf = document.querySelector('meta[name="csrf-token"]');
    if (csrf) {
      formData.append('authenticity_token', csrf.getAttribute('content'));
    } else {
      var csrfInput = document.querySelector('input[name="authenticity_token"]');
      if (csrfInput) formData.append('authenticity_token', csrfInput.value);
    }
    fetch('/account', { method: 'POST', body: formData, credentials: 'same-origin' }).catch(function() {
      if (window.theme && window.theme.showToast) window.theme.showToast('Failed to sync wishlist');
    });
  }

  function updateWishlistCount() {
    var count = getWishlistItems().length;
    document.querySelectorAll('.wishlist-count').forEach(function(el) {
      el.textContent = count;
    });
  }

  function setWishlistIconsAriaExpanded(expanded) {
    document.querySelectorAll('.wishlist-icon, .mobile-wishlist-icon').forEach(function(el) {
      el.setAttribute('aria-expanded', expanded);
    });
  }

  /* ---------- drawer ---------- */

  function openWishlistDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.theme && window.theme.trapFocus) {
      removeTrap = window.theme.trapFocus(drawer);
    }
    if (guestPrompt) {
      guestPrompt.style.display = config.showGuestPrompt && !isLoggedIn() ? '' : 'none';
    }
    if (summaryEl) {
      summaryEl.style.display = config.showSummary ? '' : 'none';
    }
    setWishlistIconsAriaExpanded('true');
    renderWishlist();
  }

  function closeWishlistDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setWishlistIconsAriaExpanded('false');
    if (removeTrap) { removeTrap(); removeTrap = null; }
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  }

  /* ---------- render ---------- */

  function renderWishlist() {
    var items = getWishlistItems();
    var subtotal = 0;

    if (items.length === 0) {
      var emptyMsg = (document.querySelector('[data-wishlist-empty]')?.getAttribute('data-wishlist-empty')) || 'Your wishlist is empty. <a href="/collections/all">Start shopping</a>';
      itemsContainer.innerHTML = '<div class="wishlist-empty">' + emptyMsg + '</div>';
      var subtotalEl = document.getElementById('wishlistSubtotal');
      var totalEl = document.getElementById('wishlistTotal');
      var countEl = document.getElementById('wishlistItemCount');
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';
      if (countEl) countEl.textContent = '0';
      if (addAllBtn) addAllBtn.disabled = true;
      return;
    }

    var html = '';
    items.forEach(function(item, index) {
      var price = parseFloat(item.price) || 0;
      var quantity = item.quantity || 1;
      var itemTotal = price * quantity;
      subtotal += itemTotal;
      html += '<div class="wishlist-item" data-index="' + index + '" data-id="' + item.id + '">'
        + '<img class="wishlist-item-image" src="' + (item.image || 'https://placehold.co/70x70/f8f9fa/1a1a1a?text=Product') + '" alt="' + item.name + '" loading="lazy">'
        + '<div class="wishlist-item-info">'
        + '<p class="wishlist-item-name">' + item.name + '</p>'
        + '<p class="wishlist-item-price">$' + price.toFixed(2) + '</p>';
      if (config.enableQuantity) {
        html += '<div class="wishlist-quantity">'
          + '<button class="quantity-btn" data-action="decrease" aria-label="Decrease quantity">&ndash;</button>'
          + '<span class="quantity-value">' + quantity + '</span>'
          + '<button class="quantity-btn" data-action="increase" aria-label="Increase quantity">+</button>'
          + '</div>';
      }
      html += '<div class="wishlist-item-actions">'
        + '<button class="wishlist-add-cart" data-id="' + item.id + '"><i class="fas fa-shopping-cart"></i> Add to Cart</button>'
        + '<button class="wishlist-remove" data-id="' + item.id + '"><i class="fas fa-trash"></i></button>'
        + '</div>'
        + '</div></div>';
    });
    itemsContainer.innerHTML = html;
    var subtotalEl = document.getElementById('wishlistSubtotal');
    var totalEl = document.getElementById('wishlistTotal');
    var countEl = document.getElementById('wishlistItemCount');
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + subtotal.toFixed(2);
    if (countEl) countEl.textContent = items.length;
    if (addAllBtn) addAllBtn.disabled = false;
  }

  /* ---------- modify items ---------- */

  function addToWishlist(data) {
    var items = getWishlistItems();
    var existing = items.find(function(item) { return item.id === data.id; });
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (data.quantity || 1);
    } else {
      items.push({ id: data.id, name: data.name, price: data.price, image: data.image, quantity: data.quantity || 1, url: data.url || '#' });
    }
    saveWishlist(items);
    if (window.theme && window.theme.showToast) window.theme.showToast(data.name + ' added to wishlist!');
  }

  function removeFromWishlist(id) {
    var items = getWishlistItems().filter(function(item) { return item.id !== id; });
    saveWishlist(items);
    renderWishlist();
  }

  /* ---------- event listeners ---------- */

  overlay.addEventListener('click', closeWishlistDrawer);
  document.querySelectorAll('.wishlist-drawer-close').forEach(function(el) {
    el.addEventListener('click', closeWishlistDrawer);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('active')) closeWishlistDrawer();
  });

  itemsContainer.addEventListener('click', function(e) {
    var qtyBtn = e.target.closest('.quantity-btn');
    if (qtyBtn && config.enableQuantity) {
      var item = qtyBtn.closest('.wishlist-item');
      if (!item) return;
      var valEl = item.querySelector('.quantity-value');
      var val = parseInt(valEl.textContent) || 1;
      if (qtyBtn.dataset.action === 'increase') val++;
      else if (qtyBtn.dataset.action === 'decrease' && val > 1) val--;
      valEl.textContent = val;
      var items = getWishlistItems();
      var index = parseInt(item.dataset.index);
      if (items[index]) items[index].quantity = val;
      saveWishlist(items);
      renderWishlist();
    }

    var addCartBtn = e.target.closest('.wishlist-add-cart');
    if (addCartBtn) {
      var item = addCartBtn.closest('.wishlist-item');
      if (!item) return;
      var id = item.dataset.id;
      var items = getWishlistItems();
      var wishItem = items.find(function(i) { return i.id === id; });
      if (!wishItem) return;
      var quantity = parseInt(item.querySelector('.quantity-value').textContent) || 1;
      var name = item.querySelector('.wishlist-item-name').textContent;
      if (window.addToCartDrawer) {
        var btn = addCartBtn;
        var origText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Adding...';
        var promise = window.addToCartDrawer({ id: id, quantity: quantity });
        if (promise && typeof promise.then === 'function') {
          promise.then(function() { btn.disabled = false; btn.textContent = origText; }).catch(function() {
            btn.disabled = false; btn.textContent = origText;
            if (window.theme && window.theme.showToast) window.theme.showToast('Failed to add to cart');
          });
        }
      } else if (window.theme && window.theme.showToast) {
        window.theme.showToast(name + ' (x' + quantity + ') added to cart!');
      }
    }

    var removeBtn = e.target.closest('.wishlist-remove');
    if (removeBtn) {
      var id = removeBtn.dataset.id;
      removeFromWishlist(id);
    }
  });

  if (addAllBtn) {
    addAllBtn.addEventListener('click', function() {
      var items = getWishlistItems();
      if (items.length === 0) return;

      if (typeof window.addToCartDrawer !== 'function') {
        if (window.theme && window.theme.showToast) window.theme.showToast('Cart unavailable');
        return;
      }

      addAllBtn.disabled = true;
      addAllBtn.textContent = 'Adding...';
      var idx = 0;

      function addNext() {
        if (idx >= items.length) {
          addAllBtn.disabled = false;
          addAllBtn.textContent = 'Add All to Cart';
          if (window.theme && window.theme.showToast) window.theme.showToast('All items added to cart!');
          return;
        }

        var item = items[idx];
        idx++;

        var promise = window.addToCartDrawer({ id: item.id, quantity: item.quantity || 1 });
        if (promise && typeof promise.then === 'function') {
          promise.then(function() { addNext(); }).catch(function() {
            addAllBtn.disabled = false;
            addAllBtn.textContent = 'Add All to Cart';
            if (window.theme && window.theme.showToast) window.theme.showToast('Failed to add ' + (item.name || 'item'));
          });
        } else {
          addNext();
        }
      }

      addNext();
    });
  }

  var closePrompt = document.querySelector('.close-prompt');
  if (closePrompt && guestPrompt) {
    closePrompt.addEventListener('click', function() { guestPrompt.style.display = 'none'; });
  }

  document.querySelectorAll('.wishlist-icon, .mobile-wishlist-icon').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      lastTrigger = this;
      var data = this.dataset;
      if (data.id) {
        addToWishlist({ id: data.id, name: data.name, price: data.price, image: data.image, url: data.url });
      } else {
        openWishlistDrawer();
      }
    });
  });

  window.addEventListener('storage', function(e) {
    if (e.key === 'amaanix_wishlist_guest') {
      updateWishlistCount();
      if (drawer.classList.contains('active')) renderWishlist();
    }
  });

  /* ---------- init ---------- */

  updateWishlistCount();

  window.updateWishlistCount = updateWishlistCount;
  window.openWishlistDrawer = openWishlistDrawer;
  window.addToWishlist = addToWishlist;
  window.removeFromWishlist = removeFromWishlist;
})();

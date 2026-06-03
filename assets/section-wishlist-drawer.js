(function() {
  var drawer = document.getElementById('wishlistDrawer');
  var overlay = document.getElementById('wishlistDrawerOverlay');
  var itemsContainer = document.getElementById('wishlistItemsContainer');
  var addAllBtn = document.getElementById('wishlistAddAllBtn');
  var guestPrompt = document.getElementById('wishlistGuestPrompt');
  if (!drawer || !overlay || !itemsContainer) return;

  var removeTrap = null;

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

  function updateWishlistCount() {
    var count = getGuestWishlist().length;
    document.querySelectorAll('.wishlist-count').forEach(function(el) {
      el.textContent = count;
    });
  }

  function openWishlistDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.theme && window.theme.trapFocus) {
      removeTrap = window.theme.trapFocus(drawer);
    }
    renderWishlist();
  }

  function closeWishlistDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (removeTrap) { removeTrap(); removeTrap = null; }
  }

  function renderWishlist() {
    var items = isLoggedIn() ? [] : getGuestWishlist();
    var subtotal = 0;

    if (items.length === 0) {
      itemsContainer.innerHTML = '<div class="wishlist-empty">' + document.querySelector('[data-wishlist-empty]')?.getAttribute('data-wishlist-empty') || 'Your wishlist is empty. <a href="/collections/all">Start shopping</a></div>';
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
        + '<p class="wishlist-item-price">$' + price.toFixed(2) + '</p>'
        + '<div class="wishlist-quantity">'
        + '<button class="quantity-btn" data-action="decrease">&ndash;</button>'
        + '<span class="quantity-value">' + quantity + '</span>'
        + '<button class="quantity-btn" data-action="increase">+</button>'
        + '</div>'
        + '<div class="wishlist-item-actions">'
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

  function addToWishlist(data) {
    var items = getGuestWishlist();
    var existing = items.find(function(item) { return item.id === data.id; });
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (data.quantity || 1);
    } else {
      items.push({ id: data.id, name: data.name, price: data.price, image: data.image, quantity: data.quantity || 1, url: data.url || '#' });
    }
    saveGuestWishlist(items);
    updateWishlistCount();
    if (window.theme && window.theme.showToast) window.theme.showToast(data.name + ' added to wishlist!');
  }

  function removeFromWishlist(id) {
    var items = getGuestWishlist().filter(function(item) { return item.id !== id; });
    saveGuestWishlist(items);
    updateWishlistCount();
    renderWishlist();
  }

  overlay.addEventListener('click', closeWishlistDrawer);
  document.querySelectorAll('.wishlist-drawer-close').forEach(function(el) {
    el.addEventListener('click', closeWishlistDrawer);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('active')) closeWishlistDrawer();
  });

  itemsContainer.addEventListener('click', function(e) {
    var qtyBtn = e.target.closest('.quantity-btn');
    if (qtyBtn) {
      var item = qtyBtn.closest('.wishlist-item');
      if (!item) return;
      var valEl = item.querySelector('.quantity-value');
      var val = parseInt(valEl.textContent) || 1;
      if (qtyBtn.dataset.action === 'increase') val++;
      else if (qtyBtn.dataset.action === 'decrease' && val > 1) val--;
      valEl.textContent = val;
      var items = getGuestWishlist();
      var index = parseInt(item.dataset.index);
      if (items[index]) items[index].quantity = val;
      saveGuestWishlist(items);
      renderWishlist();
    }

    var addCartBtn = e.target.closest('.wishlist-add-cart');
    if (addCartBtn) {
      var item = addCartBtn.closest('.wishlist-item');
      if (!item) return;
      var id = item.dataset.id;
      var items = getGuestWishlist();
      var wishItem = items.find(function(i) { return i.id === id; });
      if (!wishItem) return;
      var quantity = parseInt(item.querySelector('.quantity-value').textContent) || 1;
      var name = item.querySelector('.wishlist-item-name').textContent;
      var price = item.querySelector('.wishlist-item-price').textContent;
      if (window.addToCartDrawer) {
        window.addToCartDrawer({ id: id, quantity: quantity });
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
      var items = getGuestWishlist();
      items.forEach(function(item) {
        if (window.addToCartDrawer) {
          window.addToCartDrawer({ id: item.id, quantity: item.quantity || 1 });
        }
      });
    });
  }

  var closePrompt = document.querySelector('.close-prompt');
  if (closePrompt && guestPrompt) {
    closePrompt.addEventListener('click', function() { guestPrompt.style.display = 'none'; });
  }

  document.querySelectorAll('.wishlist-icon, .mobile-wishlist-icon').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
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

  window.updateWishlistCount = updateWishlistCount;
  window.openWishlistDrawer = openWishlistDrawer;
  window.addToWishlist = addToWishlist;
  window.removeFromWishlist = removeFromWishlist;
})();

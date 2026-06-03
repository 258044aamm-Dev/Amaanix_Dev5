(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('cartDrawerOverlay');
    var drawer = document.getElementById('cartDrawer');
    var bodyEl = document.getElementById('cartDrawerBody');
    var itemsContainer = document.getElementById('cartItemsContainer');
    var emptyMessage = document.getElementById('cartEmptyMessage');
    var subtotalEl = document.getElementById('cartSubtotal');
    var totalEl = document.getElementById('cartTotal');
    var discountEl = document.getElementById('cartDiscountValue');
    var discountRow = document.getElementById('cartDiscountRow');
    var shippingEl = document.getElementById('cartShipping');
    var checkoutBtn = document.getElementById('cartCheckoutBtn');
    var promoInput = document.getElementById('cartPromoInput');
    var promoApply = document.getElementById('cartPromoApply');
    var promoMsg = document.getElementById('cartPromoMsg');
    var closeBtn = drawer && drawer.querySelector('.cart-drawer-close');

    if (!overlay || !drawer) return;

    function formatMoney(cents) {
      return '$' + (cents / 100).toFixed(2);
    }

    function renderItems(items) {
      return items.map(function(item) {
        return '<div class="cart-item" data-key="' + item.key + '">' +
          '<div class="cart-item-image">' +
            '<img src="' + item.image + '" alt="' + item.product_title + '" loading="lazy" width="70" height="70">' +
          '</div>' +
          '<div class="cart-item-details">' +
            '<div class="cart-item-name">' + item.product_title + '</div>' +
            (item.variant_title ? '<div class="cart-item-variant">' + item.variant_title + '</div>' : '') +
            '<div class="cart-item-price">' + formatMoney(item.price) + '</div>' +
            '<div class="cart-item-quantity">' +
              '<button class="cart-qty-btn cart-qty-minus" data-action="minus" aria-label="Decrease quantity">\u2212</button>' +
              '<span class="cart-qty-value">' + item.quantity + '</span>' +
              '<button class="cart-qty-btn cart-qty-plus" data-action="plus" aria-label="Increase quantity">+</button>' +
              '<button class="cart-item-remove" data-action="remove" aria-label="Remove item"><i class="fas fa-trash"></i></button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function render(cart) {
      if (cart.item_count === 0) {
        emptyMessage.style.display = 'block';
        itemsContainer.innerHTML = '';
        checkoutBtn.disabled = true;
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        discountRow.style.display = 'none';
        return;
      }

      emptyMessage.style.display = 'none';
      itemsContainer.innerHTML = renderItems(cart.items);
      checkoutBtn.disabled = false;
      subtotalEl.textContent = formatMoney(cart.original_total_price);

      if (cart.total_discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = '\u2212' + formatMoney(cart.total_discount);
      } else {
        discountRow.style.display = 'none';
      }

      totalEl.textContent = formatMoney(cart.total_price);

      bindItemEvents();
    }

    function bindItemEvents() {
      itemsContainer.querySelectorAll('.cart-qty-minus').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var item = btn.closest('.cart-item');
          var key = item.getAttribute('data-key');
          var qtyEl = item.querySelector('.cart-qty-value');
          var currentQty = parseInt(qtyEl.textContent, 10);
          if (currentQty > 1) {
            changeQuantity(key, currentQty - 1);
          }
        });
      });

      itemsContainer.querySelectorAll('.cart-qty-plus').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var item = btn.closest('.cart-item');
          var key = item.getAttribute('data-key');
          var qtyEl = item.querySelector('.cart-qty-value');
          var currentQty = parseInt(qtyEl.textContent, 10);
          changeQuantity(key, currentQty + 1);
        });
      });

      itemsContainer.querySelectorAll('.cart-item-remove').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var item = btn.closest('.cart-item');
          var key = item.getAttribute('data-key');
          removeItem(key);
        });
      });
    }

    function fetchCart() {
      return fetch('/cart.js')
        .then(function(r) { return r.json(); })
        .then(function(cart) {
          render(cart);
          updateCartCount(cart);
          return cart;
        })
        .catch(function(err) {
          console.error('Cart fetch failed:', err);
        });
    }

    function addToCart(variantId, quantity, properties) {
      quantity = quantity || 1;
      var body = { id: variantId, quantity: quantity };
      if (properties && Object.keys(properties).length > 0) {
        body.properties = properties;
      }
      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      .then(function(r) {
        if (!r.ok) return r.json().then(function(err) { throw new Error(err.description || 'Add to cart failed'); });
        return r.json();
      })
      .then(function() {
        return fetchCart();
      })
      .then(function() {
        openDrawer();
        if (window.theme && window.theme.showToast) {
          window.theme.showToast('Item added to cart!');
        }
      })
      .catch(function(err) {
        console.error('Add to cart error:', err);
        if (window.theme && window.theme.showToast) {
          window.theme.showToast('Failed to add item to cart.');
        }
      });
    }

    function changeQuantity(key, quantity) {
      return fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      })
      .then(function(r) {
        if (!r.ok) throw new Error('Failed to change quantity');
        return r.json();
      })
      .then(function() {
        return fetchCart();
      })
      .catch(function(err) {
        console.error('Change quantity error:', err);
      });
    }

    function removeItem(key) {
      return changeQuantity(key, 0);
    }

    function openDrawer() {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('overflow-hidden');
      refreshCartDrawer();
    }

    function closeDrawer() {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    }

    function refreshCartDrawer() {
      fetch('/cart.js')
        .then(function(r) { return r.json(); })
        .then(function(cart) {
          render(cart);
          updateCartCount(cart);
        })
        .catch(function() {});
    }

    function updateCartCount(cart) {
      var count = cart ? cart.item_count : 0;
      document.querySelectorAll('.cart-count').forEach(function(el) {
        el.textContent = count;
        if (count > 0) {
          el.style.display = 'inline-flex';
        } else {
          el.style.display = 'none';
        }
      });
    }

    function applyPromo() {
      var code = promoInput.value.trim();
      if (!code) return;
      promoApply.disabled = true;
      fetch('/cart/note.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: 'note=' + encodeURIComponent(code)
      })
      .then(function(r) {
        if (r.ok) {
          promoMsg.textContent = 'Note saved! Apply discounts at checkout.';
          promoMsg.className = 'cart-promo-msg success';
        } else {
          promoMsg.textContent = 'Failed to save. Please try again.';
          promoMsg.className = 'cart-promo-msg error';
        }
      })
      .catch(function() {
        promoMsg.textContent = 'Error. Please try again.';
        promoMsg.className = 'cart-promo-msg error';
      })
      .finally(function() {
        promoApply.disabled = false;
      });
    }

    // Bind events
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }
    overlay.addEventListener('click', closeDrawer);

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        window.location.href = '/checkout';
      });
    }

    if (promoApply) {
      promoApply.addEventListener('click', applyPromo);
    }
    if (promoInput) {
      promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') applyPromo();
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });

    // Global API
    window.openCartDrawer = openDrawer;
    window.refreshCartDrawer = refreshCartDrawer;
    window.addToCartDrawer = function(data) {
      if (typeof data === 'object') {
        return addToCart(data.id, data.quantity, data.properties);
      }
      return addToCart(data, 1);
    };

    // Initial fetch
    fetchCart();
  });
})();

/* AMAANIX - Main JavaScript */
/* DOMContentLoaded pattern for safe initialization */
/* No inline scripts - all JS in external file */

// ── Global Helper: XSS Sanitization ──
function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", function() {

    // Event delegation for data-action attributes (supports BOTH naming conventions)
    // [FIX #4] Added kebab-case handlers for collection.html / product.html compatibility
    // [FIX #2] Replaces inline onclick — all actions go through this delegation
    document.body.addEventListener("click", function(e) {
        const actionEl = e.target.closest("[data-action]");
        if (!actionEl) return;

        const handler = actionEl.getAttribute("data-action");
        if (!handler) return;

        switch (handler) {
            // Wishlist drawer — open
            case "openWishlistDrawer(event)":
            case "open-wishlist":
                e.preventDefault();
                openWishlistDrawer(e);
                break;

            // Wishlist drawer — close
            case "closeWishlistDrawer()":
            case "close-wishlist":
                e.preventDefault();
                closeWishlistDrawer();
                break;

            // Guest prompt — hide
            case "hideGuestPrompt()":
            case "hide-guest-prompt":
                e.preventDefault();
                hideGuestPrompt();
                break;

            // Quantity controls
            case "qty-dec":
                e.preventDefault();
                updateQuantity(actionEl, -1);
                break;

            case "qty-inc":
                e.preventDefault();
                updateQuantity(actionEl, 1);
                break;

            // Cart & Wishlist actions
            case "add-to-cart":
                e.preventDefault();
                addToCartFromWishlist(actionEl);
                break;

            case "remove-from-wishlist":
                e.preventDefault();
                removeFromWishlist(actionEl);
                break;

            case "add-all-to-cart":
                e.preventDefault();
                addAllToCart();
                break;
        }
    });

// Announcement Bar - Ticker with Clickable Links, Hover Pause, Swipe & Smooth Dismiss
// [FIX #16] Wrapped entire announcement block in null checks
        const announcementBar = document.getElementById('announcementBar');
        const announcementTrack = document.getElementById('announcementTrack');
        const closeBtn = document.getElementById('closeAnnouncementBtn');

        if (announcementBar && announcementTrack) {
            let announcementCurrentSlide = 0;
            let autoRotateInterval;
            let isHovering = false;
            let isSwiping = false;
            let startX = 0;
            let currentX = 0;

            // Initialize auto-rotation
            function startAutoRotate() {
                autoRotateInterval = setInterval(() => {
                    if (!isHovering && !isSwiping) {
                        nextAnnouncementSlide();
                    }
                }, 5000);
            }

            function nextAnnouncementSlide() {
                announcementCurrentSlide = (announcementCurrentSlide + 1) % 2; // 2 items
                updateAnnouncementTrackPosition();
            }

            function updateAnnouncementTrackPosition() {
                announcementTrack.style.transform = `translateX(-${announcementCurrentSlide * 100}%)`;
            }

            // Hover pause functionality
            announcementBar.addEventListener('mouseenter', () => {
                isHovering = true;
            });

            announcementBar.addEventListener('mouseleave', () => {
                isHovering = false;
            });

            // Swipe support for mobile
            announcementBar.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isSwiping = true;
            }, { passive: true });

            announcementBar.addEventListener('touchmove', (e) => {
                if (!isSwiping) return;
                currentX = e.touches[0].clientX;
            }, { passive: true });

            announcementBar.addEventListener('touchend', (e) => {
                if (!isSwiping) return;
                const diff = startX - currentX;
                const threshold = 50; // Minimum swipe distance

                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        // Swipe left - next
                        nextAnnouncementSlide();
                    } else {
                        // Swipe right - previous
                        announcementCurrentSlide = (announcementCurrentSlide - 1 + 2) % 2;
                        updateAnnouncementTrackPosition();
                    }
                }
                isSwiping = false;
            });

            // Smooth dismiss with animation
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    announcementBar.classList.add('dismissing');
                    setTimeout(() => {
                        announcementBar.style.display = 'none';
                    }, 300); // Match animation duration
                });
            }

            // Start auto-rotation
            startAutoRotate();
        } // end if (announcementBar)

        // Hero Slider
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.hero-dot');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                dots[i].classList.remove('active');
            });
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function changeSlide(index) {
            showSlide(index);
            resetInterval();
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000);
        }

        if (slides.length > 0 && dots.length > 0) {
            slideInterval = setInterval(nextSlide, 6000);

            // Attach click handlers to hero dots (replaces inline onclick)
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-slide'), 10);
                    changeSlide(index);
                });
            });
        }

        // Countdown Timer
        // [FIX #23] Persist countdown end time in localStorage so it doesn't reset on every page load
        const COUNTDOWN_STORAGE_KEY = 'amaanix_countdown_end';
        let countdownDate = localStorage.getItem(COUNTDOWN_STORAGE_KEY);

        if (!countdownDate) {
            // First visit — set the countdown to 2 days 14 hours from now
            countdownDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
            localStorage.setItem(COUNTDOWN_STORAGE_KEY, countdownDate.toString());
        }
        countdownDate = parseInt(countdownDate, 10);

        // [FIX #17] Guard countdown block — only run if countdown elements exist on this page
        const countdownDaysEl = document.getElementById("days");
        if (countdownDaysEl) {
            const countdownHoursEl = document.getElementById("hours");
            const countdownMinutesEl = document.getElementById("minutes");
            const countdownSecondsEl = document.getElementById("seconds");
            const countdownContainer = document.getElementById("countdown");

            const countdownFunction = setInterval(function() {
                const now = new Date().getTime();
                const distance = countdownDate - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownDaysEl.innerHTML = days < 10 ? "0" + days : days;
                if (countdownHoursEl) countdownHoursEl.innerHTML = hours < 10 ? "0" + hours : hours;
                if (countdownMinutesEl) countdownMinutesEl.innerHTML = minutes < 10 ? "0" + minutes : minutes;
                if (countdownSecondsEl) countdownSecondsEl.innerHTML = seconds < 10 ? "0" + seconds : seconds;

                if (distance < 0) {
                    clearInterval(countdownFunction);
                    if (countdownContainer) countdownContainer.innerHTML = "EXPIRED";
                    localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
                }
            }, 1000);
        }

        // Mobile Menu Toggle - Reliable version with DOM ready check
        (function() {
            function initMobileMenu() {
                const mobileToggle = document.getElementById('mobileToggle');
                const mobileMenu = document.getElementById('mobileMenu');
                const mobileOverlay = document.getElementById('mobileOverlay');
                const mobileClose = document.getElementById('mobileClose');

                if (!mobileToggle || !mobileMenu || !mobileOverlay || !mobileClose) return;

                function openMobileMenu() {
                    mobileMenu.classList.add('active');
                    mobileOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }

                function closeMobileMenu() {
                    mobileMenu.classList.remove('active');
                    mobileOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }

                // Simple, reliable click handlers with event prevention
                mobileToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openMobileMenu();
                    return false;
                });

                mobileClose.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeMobileMenu();
                    return false;
                });

                mobileOverlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeMobileMenu();
                    return false;
                });
            }

            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initMobileMenu);
            } else {
                initMobileMenu();
            }
        })();

        // Mobile Profile Dropdown Toggle
        (function() {
            const profileDropdown = document.querySelector('.profile-dropdown');
            if (!profileDropdown) return;

            // Only enable click toggle on mobile
            function isMobile() {
                return window.innerWidth <= 768;
            }

            // Click handler: toggle dropdown on icon click, allow link navigation
            profileDropdown.addEventListener('click', function(e) {
                if (isMobile()) {
                    // If clicking on a menu link, let it navigate normally
                    if (e.target.closest('.profile-menu a')) {
                        return; // Allow default navigation
                    }
                    // Otherwise, toggle the dropdown (icon click or empty space)
                    e.preventDefault();
                    e.stopPropagation();
                    profileDropdown.classList.toggle('active');
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (isMobile() && !profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });

            // Handle window resize to reset state
            window.addEventListener('resize', function() {
                if (!isMobile()) {
                    profileDropdown.classList.remove('active');
                }
            });
        })();

        // Sticky Header Shadow
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 50) {
                    header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                } else {
                    header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                }
            }
        });

        // Footer Accordion for Mobile
        const footerHeaders = document.querySelectorAll('.footer-accordion-header');

        footerHeaders.forEach(header => {
            header.addEventListener('click', () => {
                // Only activate accordion logic on mobile screens
                if (window.innerWidth <= 768) {
                    const content = header.nextElementSibling;
                    if (!content) return;
                    const isOpen = content.classList.contains('open');

                    // Close all other open sections
                    footerHeaders.forEach(otherHeader => {
                        if (otherHeader !== header) {
                            otherHeader.classList.remove('active');
                            if (otherHeader.nextElementSibling) {
                                otherHeader.nextElementSibling.classList.remove('open');
                                otherHeader.nextElementSibling.style.maxHeight = null;
                            }
                        }
                    });

                    // Toggle current section
                    if (isOpen) {
                        header.classList.remove('active');
                        content.classList.remove('open');
                        content.style.maxHeight = null;
                    } else {
                        header.classList.add('active');
                        content.classList.add('open');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                }
            });
        });

        // Handle window resize to reset styles if switching between mobile/desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                footerHeaders.forEach(header => {
                    header.classList.remove('active');
                    const content = header.nextElementSibling;
                    if (content) {
                        content.classList.remove('open');
                        content.style.maxHeight = null;
                    }
                });
            }
        });

// Search Overlay Functionality
        (function() {
            const searchOverlay = document.getElementById('searchOverlay');
            const searchTrigger = document.getElementById('searchTrigger');
            const searchInput = document.getElementById('searchInput');
            const searchClear = document.getElementById('searchClear');
            const searchSubmit = document.getElementById('searchSubmit');
            const searchPlaceholder = document.getElementById('searchPlaceholder');
            const searchSuggestions = document.getElementById('searchSuggestions');
            const searchRecent = document.getElementById('searchRecent');
            const searchResults = document.getElementById('searchResults');
            const noResults = document.getElementById('noResults');
            const searchLoading = document.getElementById('searchLoading');
            const viewAllResults = document.getElementById('viewAllResults');
            const clearRecent = document.getElementById('clearRecent');
            const recentList = document.getElementById('recentList');
            const searchChips = document.querySelectorAll('.search-chip');

            // If no search overlay on this page, skip everything
            if (!searchOverlay) return;

            const placeholderTexts = ['watches', 'earbuds', 'Find your style..', 'desk organizer', 'wellness kit'];
            let placeholderIndex = 0;
            let typingTimeout;

            // Rotate placeholder text
            function rotatePlaceholder() {
                if (searchPlaceholder) {
                    searchPlaceholder.textContent = `Try searching: "${placeholderTexts[placeholderIndex]}"`;
                }
                placeholderIndex = (placeholderIndex + 1) % placeholderTexts.length;
            }
            setInterval(rotatePlaceholder, 3000);
            rotatePlaceholder();

            // Open/close search overlay
            function openSearch() {
                searchOverlay.classList.add('active');
                if (searchInput) searchInput.focus();
                loadRecentSearches();
                showSuggestions();
            }
            function closeSearch() {
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
                if (searchClear) searchClear.classList.remove('visible');
                hideAllSearchStates();
            }

            if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
            if (searchOverlay) {
                searchOverlay.addEventListener('click', (e) => {
                    if (e.target === searchOverlay) closeSearch();
                });
            }
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                    closeSearch();
                }
            });

            // Clear input button
            if (searchInput && searchClear) {
                searchInput.addEventListener('input', function() {
                    searchClear.classList.toggle('visible', this.value.length > 0);
                    if (this.value.length > 0) {
                        hideSuggestions();
                        showLoading();
                        performSearch(this.value);
                    } else {
                        showSuggestions();
                    }
                });
                searchClear.addEventListener('click', () => {
                    searchInput.value = '';
                    searchClear.classList.remove('visible');
                    searchInput.focus();
                    showSuggestions();
                });
            }

            // Search chips click
            searchChips.forEach(chip => {
                chip.addEventListener('click', function() {
                    const query = this.dataset.query;
                    if (searchInput) searchInput.value = query;
                    if (searchClear) searchClear.classList.add('visible');
                    saveRecentSearch(query);
                    performSearch(query);
                });
            });

            // Submit search
            if (searchSubmit) {
                searchSubmit.addEventListener('click', () => {
                    const query = searchInput.value.trim();
                    if (query) {
                        saveRecentSearch(query);
                        window.location.href = `collection.html?q=${encodeURIComponent(query)}`;
                    }
                });
            }
            if (searchInput) {
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const query = searchInput.value.trim();
                        if (query) {
                            saveRecentSearch(query);
                            window.location.href = `collection.html?q=${encodeURIComponent(query)}`;
                        }
                    }
                });
            }

            // View all results
            if (viewAllResults) {
                viewAllResults.addEventListener('click', (e) => {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `collection.html?q=${encodeURIComponent(query)}`;
                    } else {
                        window.location.href = 'collection.html';
                    }
                });
            }

            // Recent searches management
            function loadRecentSearches() {
                if (!searchRecent || !recentList) return;
                const recent = JSON.parse(localStorage.getItem('amaanix_search_history') || '[]');
                if (recent.length === 0) {
                    searchRecent.style.display = 'none';
                    return;
                }
                searchRecent.style.display = 'block';
                recentList.innerHTML = '';
                recent.slice(0, 5).forEach(query => {
                    const li = document.createElement('li');
                    li.className = 'search-recent-item';
                    // [FIX #14] Sanitize query before inserting into innerHTML to prevent XSS
                    li.innerHTML = `<a href="#">${sanitize(query)}</a><span style="color:var(--text-light);font-size:12px">↗</span>`;
                    li.querySelector('a').addEventListener('click', (e) => {
                        e.preventDefault();
                        searchInput.value = query;
                        searchClear.classList.add('visible');
                        performSearch(query);
                    });
                    recentList.appendChild(li);
                });
            }
            function saveRecentSearch(query) {
                let recent = JSON.parse(localStorage.getItem('amaanix_search_history') || '[]');
                recent = recent.filter(q => q.toLowerCase() !== query.toLowerCase());
                recent.unshift(query);
                if (recent.length > 10) recent = recent.slice(0, 10);
                localStorage.setItem('amaanix_search_history', JSON.stringify(recent));
                loadRecentSearches();
            }
            if (clearRecent) {
                clearRecent.addEventListener('click', () => {
                    localStorage.removeItem('amaanix_search_history');
                    loadRecentSearches();
                });
            }

            // Search states
            function hideAllSearchStates() {
                if (searchSuggestions) searchSuggestions.style.display = 'none';
                if (searchRecent) searchRecent.style.display = 'none';
                if (searchResults) searchResults.style.display = 'none';
                if (noResults) noResults.style.display = 'none';
                if (searchLoading) searchLoading.style.display = 'none';
            }
            function showSuggestions() {
                hideAllSearchStates();
                if (searchSuggestions) searchSuggestions.style.display = 'block';
                loadRecentSearches();
                if (JSON.parse(localStorage.getItem('amaanix_search_history') || '[]').length > 0) {
                    if (searchRecent) searchRecent.style.display = 'block';
                }
            }
            function hideSuggestions() {
                if (searchSuggestions) searchSuggestions.style.display = 'none';
            }
            function showLoading() {
                hideAllSearchStates();
                if (searchLoading) searchLoading.style.display = 'flex';
            }
            function showResults(results) {
                hideAllSearchStates();
                if (results.length === 0) {
                    if (noResults) noResults.style.display = 'block';
                } else {
                    if (searchResults) {
                        searchResults.style.display = 'block';
                        // [FIX #15] Sanitize all dynamic content before inserting into innerHTML
                        searchResults.innerHTML = results.map(r => `
                            <div class="search-result-item" data-url="${sanitize(r.url)}">
                                <img src="${sanitize(r.image)}" alt="${sanitize(r.name)}" class="search-result-thumbnail" loading="lazy">
                                <div class="search-result-info">
                                    <div class="search-result-name">${sanitize(r.name)}</div>
                                    <div class="search-result-price">${sanitize(r.price)}</div>
                                </div>
                            </div>
                        `).join('');
                        searchResults.querySelectorAll('.search-result-item').forEach(item => {
                            item.addEventListener('click', () => {
                                window.location.href = item.dataset.url;
                            });
                        });
                    }
                }
            }

            // Mock search function (replace with real API call)
            function performSearch(query) {
                const mockProducts = [
                    { name: 'Premium Desk Organizer', price: '$49.99', image: 'https://image.qwenlm.ai/public_source/0a0ec1e0-e3a4-455f-9213-497e67bf10c4/10a0f67f2-1643-4ff5-99a0-8724f31bd312.png', url: 'product-detail-page.html' },
                    { name: 'Wireless Charging Pad', price: '$34.99', image: 'https://image.qwenlm.ai/public_source/0a0ec1e0-e3a4-455f-9213-497e67bf10c4/100446461-e767-45ca-b1a1-c5806b9fec76.png', url: 'product-detail-page.html' },
                    { name: 'Wellness Essential Kit', price: '$59.99', image: 'https://image.qwenlm.ai/public_source/0a0ec1e0-e3a4-455f-9213-497e67bf10c4/1451dc398-83fa-4b58-96b2-138fda89c53c.png', url: 'product-detail-page.html' },
                    { name: 'Probiotic Capsules', price: '$34.00', image: 'https://image.qwenlm.ai/public_source/0a0ec1e0-e3a4-455f-9213-497e67bf10c4/1f195e9bd-bbad-40b7-9b94-8f14a7c8948d.png', url: 'product-detail-page.html' },
                    { name: 'Collagen Powder', price: '$42.00', image: 'https://image.qwenlm.ai/public_source/0a0ec1e0-e3a4-455f-9213-497e67bf10c4/1db644ff9-912b-4754-b253-28a0b6799c56.png', url: 'product-detail-page.html' }
                ];
                // Simulate async search
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    // [FIX #18] Search filter now only matches against product name/category
                    // Removed the broken "query.includes('watch')" conditions that returned ALL products
                    const results = mockProducts.filter(p =>
                        p.name.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 5);
                    showResults(results);
                }, 300);
            }

            // Initialize
            loadRecentSearches();
        })();

        // Wishlist Drawer Functions
        function openWishlistDrawer(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            const drawer = document.getElementById('wishlistDrawer');
            // [FIX #3] Check for both possible overlay IDs — supports index.html (wishlistDrawerOverlay)
            // and collection.html/product.html (which should be fixed to wishlistDrawerOverlay,
            // but fallback for safety)
            const overlay = document.getElementById('wishlistDrawerOverlay') || document.getElementById('wishlistOverlay');
            if (drawer && overlay) {
                drawer.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                checkUserStatus();
                updateWishlistSummary();
            }
        }

        function closeWishlistDrawer() {
            const drawer = document.getElementById('wishlistDrawer');
            // [FIX #3] Same dual-ID check for closing
            const overlay = document.getElementById('wishlistDrawerOverlay') || document.getElementById('wishlistOverlay');
            if (drawer && overlay) {
                drawer.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeWishlistDrawer();
            }
        });

        // === Wishlist Functionality ===
        function isUserLoggedIn() {
            return localStorage.getItem('amaanix_user') !== null;
        }

        function checkUserStatus() {
            const guestPrompt = document.getElementById('wishlistGuestPrompt');
            if (guestPrompt) {
                guestPrompt.style.display = !isUserLoggedIn() ? 'flex' : 'none';
            }
        }

        function hideGuestPrompt() {
            const guestPrompt = document.getElementById('wishlistGuestPrompt');
            if (guestPrompt) guestPrompt.style.display = 'none';
        }

        function updateWishlistSummary() {
            const items = document.querySelectorAll('#wishlistItemsContainer .wishlist-item');
            let total = 0, count = 0;
            items.forEach(item => {
                const price = parseFloat(item.dataset.price) || 0;
                const qtyEl = item.querySelector('.quantity-value');
                const quantity = qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1;
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
        }

        function updateQuantity(btn, change) {
            const quantitySpan = btn.parentElement.querySelector('.quantity-value');
            if (!quantitySpan) return;
            let quantity = parseInt(quantitySpan.textContent) || 1;
            quantity = Math.max(1, quantity + change);
            quantitySpan.textContent = quantity;
            updateWishlistSummary();
        }

        function removeFromWishlist(btn) {
            const item = btn.closest('.wishlist-item');
            if (item) {
                item.style.opacity = '0.5';
                item.style.pointerEvents = 'none';
                setTimeout(() => {
                    item.remove();
                    updateWishlistSummary();
                    if (!isUserLoggedIn()) saveWishlistToLocalStorage();
                }, 200);
            }
        }

        // [FIX #5] Added fallback selector: .wishlist-item-name OR .wishlist-item-title
        function addToCartFromWishlist(btn) {
            const item = btn.closest('.wishlist-item');
            if (!item) return;
            const nameEl = item.querySelector('.wishlist-item-name') || item.querySelector('.wishlist-item-title');
            const priceEl = item.querySelector('.wishlist-item-price');
            const qtyEl = item.querySelector('.quantity-value');
            const name = nameEl ? nameEl.textContent : 'Unknown Product';
            const price = priceEl ? priceEl.textContent : '$0.00';
            const quantity = qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1;
            alert(`${name} (x${quantity}) added to cart for ${price} each!`);
            btn.textContent = 'Added!';
            btn.style.background = '#27ae60';
            setTimeout(() => { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 1500);
        }

        // [FIX #5] Same fallback selector in addAllToCart
        function addAllToCart() {
            const items = document.querySelectorAll('#wishlistItemsContainer .wishlist-item');
            if (items.length === 0) return;
            let message = 'Added to cart:\n';
            items.forEach(item => {
                const nameEl = item.querySelector('.wishlist-item-name') || item.querySelector('.wishlist-item-title');
                const qtyEl = item.querySelector('.quantity-value');
                const name = nameEl ? nameEl.textContent : 'Unknown Product';
                const quantity = qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1;
                message += `• ${name} (x${quantity})\n`;
            });
            alert(message);
            const btn = document.getElementById('wishlistAddAllBtn');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = 'All Added! ✓';
                btn.style.background = '#27ae60';
                setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 2000);
            }
        }

        // === Guest User: Local Storage Persistence ===
        // [FIX #5] Same fallback selector in saveWishlistToLocalStorage
        function saveWishlistToLocalStorage() {
            const items = [];
            document.querySelectorAll('#wishlistItemsContainer .wishlist-item').forEach(item => {
                const nameEl = item.querySelector('.wishlist-item-name') || item.querySelector('.wishlist-item-title');
                const imgEl = item.querySelector('.wishlist-item-image');
                const qtyEl = item.querySelector('.quantity-value');
                items.push({
                    id: item.dataset.id,
                    name: nameEl ? nameEl.textContent : '',
                    price: item.dataset.price,
                    image: imgEl ? imgEl.src : '',
                    quantity: qtyEl ? (parseInt(qtyEl.textContent) || 1) : 1
                });
            });
            localStorage.setItem('amaanix_wishlist_guest', JSON.stringify(items));
        }

        // [FIX #2] Replaced inline onclick attributes with data-action attributes
        // These now work through the event delegation at the top of this file
        function loadWishlistFromLocalStorage() {
            const saved = localStorage.getItem('amaanix_wishlist_guest');
            if (!saved) return;
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
                    // [FIX #14] Sanitize item.name and item.image before innerHTML
                    // [FIX #2] Use data-action instead of inline onclick — handled by event delegation
                    itemEl.innerHTML = `
                        <img src="${sanitize(item.image)}" alt="${sanitize(item.name)}" class="wishlist-item-image">
                        <div class="wishlist-item-info">
                            <div class="wishlist-item-name">${sanitize(item.name)}</div>
                            <div class="wishlist-item-price">${sanitize(item.price)}</div>
                            <div class="wishlist-quantity">
                                <button class="quantity-btn" data-action="qty-dec">−</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn" data-action="qty-inc">+</button>
                            </div>
                            <div class="wishlist-item-actions">
                                <button class="wishlist-add-cart" data-action="add-to-cart">Add to Cart</button>
                                <button class="wishlist-remove" data-action="remove-from-wishlist">Remove</button>
                            </div>
                        </div>`;
                    container.appendChild(itemEl);
                });
                updateWishlistSummary();
            } catch (e) { console.error('Failed to load wishlist:', e); }
        }

        // === Logged-In User: Sync & Notifications (Frontend Structure) ===
        function syncWishlistWithServer() {
            if (!isUserLoggedIn()) return;
            console.log('Wishlist synced with server (simulated)');
            if (localStorage.getItem('amaanix_email_notifications') === 'true') {
                console.log('Email notification sent (simulated)');
            }
        }

        // [FIX #1] Removed nested DOMContentLoaded — code now runs directly
        // since we're already inside the DOMContentLoaded callback
        // Helper: Set returnUrl in sessionStorage before navigating to auth page
        function navigateToAuth(url) {
            // Store current page as return URL (excluding hash)
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            sessionStorage.setItem('returnUrl', currentPath);
            window.location.href = url;
        }

        // Intercept auth link clicks to set returnUrl
        document.querySelectorAll('a[href^="auth.html"]').forEach(link => {
            link.addEventListener('click', function(e) {
                // Only intercept if not already handled by hash navigation
                const href = this.getAttribute('href');
                if (href && !href.includes('#')) {
                    e.preventDefault();
                    navigateToAuth(href);
                }
                // For hash links like auth.html#register, let browser handle + hashchange will work
            });
        });

        // [FIX #1] This code was inside a nested DOMContentLoaded that never fired.
        // Now it runs directly — guest wishlist and server sync will actually work.
        if (!isUserLoggedIn()) loadWishlistFromLocalStorage();
        else syncWishlistWithServer();

        window.addEventListener('storage', function(e) {
            if (e.key === 'amaanix_wishlist_guest' && !isUserLoggedIn()) {
                loadWishlistFromLocalStorage();
            }
        });
});

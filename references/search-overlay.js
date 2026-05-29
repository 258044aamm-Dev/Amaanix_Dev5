// ── CSS ─────────────────────────────────────────
const css = `
  .search-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); z-index: 3000; display: none;
    align-items: flex-start; justify-content: center; padding-top: 80px; animation: fadeIn 0.3s ease;
  }
  .search-overlay.active { display: flex; }
  .search-container {
    background: var(--white); width: 100%; max-width: 700px; border-radius: var(--radius);
    padding: 25px; position: relative; box-shadow: var(--shadow-hover); margin: 0 20px;
  }
  .search-input-wrapper { position: relative; margin-bottom: 20px; }
  .search-input {
    width: 100%; padding: 15px 50px 15px 20px; border: 2px solid var(--border);
    border-radius: var(--radius); font-size: 16px; font-family: var(--font-body); transition: border-color 0.3s;
  }
  .search-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0, 181, 184, 0.1); }
  .search-icon-btn {
    position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 18px; padding: 5px;
  }
  .search-icon-btn:hover { color: var(--primary); }
  .search-clear-btn {
    position: absolute; right: 45px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 18px; padding: 5px; display: none;
  }
  .search-clear-btn.visible { display: block; }
  .search-clear-btn:hover { color: var(--primary); }
  .search-placeholder-rotator { font-size: 13px; color: var(--text-light); margin-bottom: 15px; min-height: 20px; font-family: var(--font-supporting); }
  .search-suggestions, .search-recent, .search-results-preview { margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border); }
  .search-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-light); margin-bottom: 12px; display: block; }
  .search-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .search-chip {
    padding: 6px 14px; background: var(--bg-light); border-radius: 20px;
    font-size: 13px; color: var(--text-dark); cursor: pointer; transition: all 0.2s; border: 1px solid var(--border);
  }
  .search-chip:hover { background: var(--primary); color: var(--white); border-color: var(--primary); }
  .search-recent-list { list-style: none; }
  .search-recent-item {
    padding: 8px 0; border-bottom: 1px solid var(--border); display: flex;
    justify-content: space-between; align-items: center; font-size: 14px;
  }
  .search-recent-item:last-child { border-bottom: none; }
  .search-recent-item a { color: var(--text-dark); transition: color 0.3s; }
  .search-recent-item a:hover { color: var(--primary); }
  .clear-recent-link { font-size: 12px; color: var(--text-light); cursor: pointer; transition: color 0.3s; }
  .clear-recent-link:hover { color: var(--primary); }
  .search-results-preview { max-height: 300px; overflow-y: auto; }
  .search-result-item {
    display: flex; align-items: center; gap: 15px; padding: 12px 0;
    border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s;
  }
  .search-result-item:hover { background: var(--bg-light); }
  .search-result-item:last-child { border-bottom: none; }
  .search-result-thumbnail { width: 60px; height: 60px; border-radius: var(--radius); object-fit: cover; background: var(--bg-light); }
  .search-result-info { flex: 1; }
  .search-result-name { font-weight: 600; font-size: 14px; color: var(--text-dark); margin-bottom: 4px; font-family: var(--font-body); }
  .search-result-price { font-size: 14px; font-weight: 600; color: var(--primary); }
  .view-all-results {
    display: block; text-align: center; padding: 12px; color: var(--primary); font-weight: 600;
    font-size: 14px; border-top: 1px solid var(--border); margin-top: 15px; cursor: pointer; transition: background 0.2s;
  }
  .view-all-results:hover { background: var(--bg-light); }
  .no-results-message { text-align: center; padding: 30px 20px; color: var(--text-light); font-family: var(--font-supporting); }
  .no-results-message strong { color: var(--text-dark); }
  .search-loading { display: flex; justify-content: center; padding: 30px; color: var(--text-light); }
  .search-spinner { width: 24px; height: 24px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .search-container { padding: 20px 15px; margin: 0 15px; }
    .search-input { padding: 12px 45px 12px 15px; font-size: 15px; }
    .search-result-thumbnail { width: 50px; height: 50px; }
    .search-result-name { font-size: 13px; }
    .search-result-price { font-size: 13px; }
  }
`;

// ── HTML ────────────────────────────────────────
const html = `
  <div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Search products">
    <div class="search-container">
      <div class="search-input-wrapper">
        <label for="searchInput" class="sr-only">Search products</label>
        <input type="text" class="search-input" id="searchInput" placeholder="Search products, brands\u2026" autocomplete="off">
        <button class="search-icon-btn" id="searchSubmit"><i data-lucide="search" class="icon-search" aria-hidden="true"></i></button>
        <button class="search-clear-btn" id="searchClear">\u2715</button>
      </div>
      <div class="search-placeholder-rotator" id="searchPlaceholder"></div>
      <div class="search-suggestions" id="searchSuggestions">
        <span class="search-label">Trending Searches</span>
        <div class="search-chips">
          <span class="search-chip" data-query="watches">watches</span>
          <span class="search-chip" data-query="earbuds">earbuds</span>
          <span class="search-chip" data-query="desk organizer">desk organizer</span>
          <span class="search-chip" data-query="wellness kit">wellness kit</span>
          <span class="search-chip" data-query="eco living">eco living</span>
        </div>
      </div>
      <div class="search-recent" id="searchRecent">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="search-label">Recent Searches</span>
          <span class="clear-recent-link" id="clearRecent">Clear All</span>
        </div>
        <ul class="search-recent-list" id="recentList"></ul>
      </div>
      <div class="search-results-preview" id="searchResults" style="display: none;"></div>
      <div class="no-results-message" id="noResults" style="display: none;">
        <strong>No results found.</strong><br>
        Try another search or browse our <a href="collectionpage.html" class="link-primary">collections</a>.
      </div>
      <div class="search-loading" id="searchLoading" style="display: none;">
        <div class="search-spinner"></div>
        <span>Searching...</span>
      </div>
      <a href="collectionpage.html" class="view-all-results" id="viewAllResults">View All Results \u2192</a>
    </div>
  </div>
`;

// ── JS Logic ────────────────────────────────────
export function renderSearchOverlay(targetId = 'search-overlay-placeholder') {
  if (!document.getElementById('search-overlay-style')) {
    const style = document.createElement('style');
    style.id = 'search-overlay-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;

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
  if (!searchOverlay || !searchTrigger || !searchInput) return;

  let removeSearchTrap = null;
  const placeholderTexts = ['watches', 'earbuds', 'Find your style..', 'desk organizer', 'wellness kit'];
  let placeholderIndex = 0;
  let typingTimeout;

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

  function rotatePlaceholder() {
    searchPlaceholder.textContent = `Try searching: "${placeholderTexts[placeholderIndex]}"`;
    placeholderIndex = (placeholderIndex + 1) % placeholderTexts.length;
  }
  setInterval(rotatePlaceholder, 3000);
  rotatePlaceholder();

  function openSearch() {
    searchOverlay.classList.add('active');
    searchInput.focus();
    loadRecentSearches();
    showSuggestions();
    removeSearchTrap = trapFocus(searchOverlay);
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    if (searchClear) searchClear.classList.remove('visible');
    hideAllSearchStates();
    if (removeSearchTrap) removeSearchTrap();
    searchTrigger.focus();
  }

  searchTrigger.addEventListener('click', openSearch);
  searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  if (searchInput && searchClear) {
    searchInput.addEventListener('input', function() {
      searchClear.classList.toggle('visible', this.value.length > 0);
      if (this.value.length > 0) { hideSuggestions(); showLoading(); performSearch(this.value); }
      else { showSuggestions(); }
    });
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      searchInput.focus();
      showSuggestions();
    });
  }

  searchChips.forEach(chip => chip.addEventListener('click', function() {
    const query = this.dataset.query;
    searchInput.value = query;
    if (searchClear) searchClear.classList.add('visible');
    saveRecentSearch(query);
    performSearch(query);
  }));

  if (searchSubmit) {
    searchSubmit.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (q) { saveRecentSearch(q); window.location.href = `collectionpage.html?q=${encodeURIComponent(q)}`; }
    });
  }
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) { saveRecentSearch(q); window.location.href = `collectionpage.html?q=${encodeURIComponent(q)}`; }
      }
    });
  }
  if (viewAllResults) {
    viewAllResults.addEventListener('click', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      window.location.href = q ? `collectionpage.html?q=${encodeURIComponent(q)}` : 'collectionpage.html';
    });
  }

  function loadRecentSearches() {
    const recent = JSON.parse(localStorage.getItem('amaanix_search_history') || '[]');
    if (recent.length === 0) { searchRecent.style.display = 'none'; return; }
    searchRecent.style.display = 'block';
    recentList.innerHTML = '';
    recent.slice(0, 5).forEach(query => {
      const li = document.createElement('li');
      li.className = 'search-recent-item';
      const a = document.createElement('a');
      a.href = "#";
      a.textContent = query;
      a.addEventListener('click', (e) => { e.preventDefault(); searchInput.value = query; if (searchClear) searchClear.classList.add('visible'); performSearch(query); });
      li.appendChild(a);
      const span = document.createElement('span');
      span.style.cssText = 'color:var(--text-light);font-size:12px';
      span.textContent = '\u2197';
      li.appendChild(span);
      recentList.appendChild(li);
    });
  }

  function saveRecentSearch(query) {
    let recent = JSON.parse(localStorage.getItem('amaanix_search_history') || '[]');
    recent = recent.filter(q => q.toLowerCase() !== query.toLowerCase());
    recent.unshift(query);
    if (recent.length > 10) recent = recent.slice(0, 10);
    try { localStorage.setItem('amaanix_search_history', JSON.stringify(recent)); } catch(e) {}
    loadRecentSearches();
  }

  if (clearRecent) {
    clearRecent.addEventListener('click', () => {
      try { localStorage.removeItem('amaanix_search_history'); } catch(e) {}
      loadRecentSearches();
    });
  }

  function hideAllSearchStates() {
    searchSuggestions.style.display = 'none';
    searchRecent.style.display = 'none';
    searchResults.style.display = 'none';
    noResults.style.display = 'none';
    searchLoading.style.display = 'none';
  }

  function showSuggestions() {
    hideAllSearchStates();
    searchSuggestions.style.display = 'block';
    loadRecentSearches();
    if (JSON.parse(localStorage.getItem('amaanix_search_history') || '[]').length > 0) {
      searchRecent.style.display = 'block';
    }
  }

  function hideSuggestions() { searchSuggestions.style.display = 'none'; }
  function showLoading() { hideAllSearchStates(); searchLoading.style.display = 'flex'; }

  function showResults(results) {
    hideAllSearchStates();
    if (results.length === 0) { noResults.style.display = 'block'; return; }
    searchResults.style.display = 'block';
    searchResults.innerHTML = '';
    results.forEach(r => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      const img = document.createElement('img');
      img.src = r.image; img.alt = r.name; img.className = 'search-result-thumbnail'; img.loading = 'lazy';
      const info = document.createElement('div');
      info.className = 'search-result-info';
      const name = document.createElement('div');
      name.className = 'search-result-name'; name.textContent = r.name;
      const price = document.createElement('div');
      price.className = 'search-result-price'; price.textContent = r.price;
      info.appendChild(name); info.appendChild(price);
      item.appendChild(img); item.appendChild(info);
      item.addEventListener('click', () => window.location.href = r.url);
      searchResults.appendChild(item);
    });
  }

  function performSearch(query) {
    const mockProducts = [
      { name: 'Premium Desk Organizer', price: '$49.99', image: 'assets/images/product-01-main.png', url: 'product-detail-page.html' },
      { name: 'Wireless Charging Pad', price: '$34.99', image: 'assets/images/product-02-main.png', url: 'product-detail-page.html' },
      { name: 'Wellness Essential Kit', price: '$59.99', image: 'assets/images/product-03-main.png', url: 'product-detail-page.html' },
      { name: 'Probiotic Capsules', price: '$34.00', image: 'assets/images/blog-post-01-hero.png', url: 'product-detail-page.html' },
      { name: 'Collagen Powder', price: '$42.00', image: 'assets/images/avatar-emily-rodriguez.png', url: 'product-detail-page.html' }
    ];
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const results = mockProducts.filter(p => p.name.toLowerCase().includes(lowerQuery)).slice(0, 5);
      showResults(results);
    }, 300);
  }

  loadRecentSearches();
}

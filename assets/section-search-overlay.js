(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('searchOverlay');
    var input = document.getElementById('searchInput');
    var submitBtn = document.getElementById('searchSubmit');
    var clearBtn = document.getElementById('searchClear');
    var resultsContainer = document.getElementById('searchResults');
    var noResults = document.getElementById('noResults');
    var loading = document.getElementById('searchLoading');
    var suggestions = document.getElementById('searchSuggestions');
    var recentEl = document.getElementById('searchRecent');
    var recentList = document.getElementById('recentList');
    var clearRecentBtn = document.getElementById('clearRecent');
    var viewAllBtn = document.getElementById('viewAllResults');
    var chips = document.querySelectorAll('.search-chip');

    if (!overlay || !input) return;

    var searchTimeout = null;
    var lastQuery = '';
    var activeRequest = null;
    var RECENT_KEY = 'dawn_search_recent';
    var MAX_RECENT = 5;

    function openOverlay(query) {
      overlay.classList.add('active');
      document.body.classList.add('overflow-hidden');
      if (query) {
        input.value = query;
        performSearch(query);
      }
      setTimeout(function() {
        input.focus();
      }, 100);
      loadRecent();
    }

    function closeOverlay() {
      overlay.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
      clearResults();
    }

    function clearResults() {
      resultsContainer.style.display = 'none';
      noResults.style.display = 'none';
      loading.style.display = 'none';
      suggestions.style.display = 'block';
      recentEl.style.display = 'block';
      resultsContainer.innerHTML = '';
      clearBtn.classList.remove('visible');
    }

    function showLoading() {
      resultsContainer.style.display = 'none';
      noResults.style.display = 'none';
      suggestions.style.display = 'none';
      recentEl.style.display = 'none';
      loading.style.display = 'flex';
    }

    function performSearch(query) {
      query = query.trim();
      if (query.length < 2) {
        clearResults();
        return;
      }

      lastQuery = query;
      clearBtn.classList.add('visible');

      if (activeRequest) {
        activeRequest.abort();
      }

      showLoading();

      var controller = new AbortController();
      activeRequest = controller;

      fetch('/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product&resources[limit]=6', {
        signal: controller.signal,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        activeRequest = null;
        loading.style.display = 'none';

        var items = [];
        if (data.results && Array.isArray(data.results)) {
          items = data.results;
        } else if (data.results && data.results.products) {
          items = data.results.products;
        } else if (data.suggestions && data.resources && data.resources.results) {
          items = data.resources.results.products || [];
        }

        if (items.length === 0) {
          resultsContainer.style.display = 'none';
          noResults.style.display = 'block';
          suggestions.style.display = 'none';
          recentEl.style.display = 'none';
          return;
        }

        noResults.style.display = 'none';
        suggestions.style.display = 'none';
        recentEl.style.display = 'none';
        renderResults(items);
        resultsContainer.style.display = 'block';
        updateViewAllLink(query);
      })
      .catch(function(err) {
        if (err.name === 'AbortError') return;
        activeRequest = null;
        loading.style.display = 'none';
        console.error('Search error:', err);
      });
    }

    function renderResults(items) {
      var html = '';
      items.forEach(function(item) {
        var title = item.stripped_title || item.title || '';
        var price = item.price || '';
        var image = item.image || item.thumbnail || '';
        var url = item.url || '#';
        html += '<a class="search-result-item" href="' + url + '">' +
          (image ? '<img class="search-result-thumbnail" src="' + image + '" alt="' + title + '" loading="lazy" width="60" height="60">' : '') +
          '<div class="search-result-info">' +
            '<div class="search-result-name">' + title + '</div>' +
            (price ? '<div class="search-result-price">' + price + '</div>' : '') +
          '</div>' +
        '</a>';
      });
      resultsContainer.innerHTML = html;
    }

    function updateViewAllLink(query) {
      if (viewAllBtn) {
        viewAllBtn.href = '/search?q=' + encodeURIComponent(query);
      }
    }

    function saveRecent(query) {
      query = query.trim();
      if (!query || query.length < 2) return;
      var recent = getRecent();
      recent = recent.filter(function(q) { return q.toLowerCase() !== query.toLowerCase(); });
      recent.unshift(query);
      if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
      } catch(e) {}
      loadRecent();
    }

    function getRecent() {
      try {
        var data = localStorage.getItem(RECENT_KEY);
        return data ? JSON.parse(data) : [];
      } catch(e) {
        return [];
      }
    }

    function loadRecent() {
      if (!recentList) return;
      var recent = getRecent();
      recentList.innerHTML = '';
      if (recent.length === 0) {
        recentEl.style.display = 'none';
        return;
      }
      recentEl.style.display = 'block';
      recent.forEach(function(q) {
        var li = document.createElement('li');
        li.className = 'search-recent-item';
        li.innerHTML = '<a href="/search?q=' + encodeURIComponent(q) + '">' + q + '</a><span class="clear-recent-link" data-recent="' + q + '">&times;</span>';
        li.querySelector('[data-recent]').addEventListener('click', function(e) {
          e.stopPropagation();
          removeRecent(q);
        });
        recentList.appendChild(li);
      });
    }

    function removeRecent(query) {
      var recent = getRecent().filter(function(q) { return q.toLowerCase() !== query.toLowerCase(); });
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
      } catch(e) {}
      loadRecent();
    }

    function clearAllRecent() {
      try {
        localStorage.removeItem(RECENT_KEY);
      } catch(e) {}
      loadRecent();
    }

    function goToSearch(query) {
      if (query.trim()) {
        saveRecent(query);
        window.location.href = '/search?q=' + encodeURIComponent(query.trim());
      }
    }

    function handleSubmit() {
      var query = input.value.trim();
      if (query) {
        saveRecent(query);
        goToSearch(query);
      }
    }

    // Bind events
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeOverlay();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeOverlay();
      }
    });

    if (input) {
      input.addEventListener('input', function() {
        var query = input.value;
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
          performSearch(query);
        }, 300);
      });

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleSubmit();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        input.value = '';
        clearResults();
        input.focus();
      });
    }

    if (clearRecentBtn) {
      clearRecentBtn.addEventListener('click', clearAllRecent);
    }

    document.addEventListener('click', function(e) {
      var trigger = e.target.closest('#searchTrigger');
      if (trigger) {
        e.preventDefault();
        openOverlay('');
      }
    });

    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        var query = chip.getAttribute('data-query');
        if (query) {
          input.value = query;
          saveRecent(query);
          goToSearch(query);
        }
      });
    });

    // Global API
    window.openSearchOverlay = function(query) {
      openOverlay(query || '');
    };

    window.closeSearchOverlay = closeOverlay;
  });
})();

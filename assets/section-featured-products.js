(function() {
  var grid = document.querySelector('.featured-products-section .product-grid');
  if (!grid) return;

  grid.addEventListener('click', function(e) {
    var card = e.target.closest('.product-card');
    if (card) {
      var link = card.querySelector('.product-link');
      if (link && link.href && link.href !== window.location.href) {
        window.location.href = link.href;
      }
    }
  });

  if ('IntersectionObserver' in window) {
    var cards = grid.querySelectorAll('.product-card');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function(card, i) {
      card.style.transitionDelay = (i * 100) + 'ms';
      observer.observe(card);
    });
  } else {
    grid.querySelectorAll('.product-card').forEach(function(c) { c.classList.add('visible'); });
  }
})();

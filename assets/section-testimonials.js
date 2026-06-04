(function() {
  var cards = document.querySelectorAll('#testimonials-section .testimonial-card');
  if (cards.length === 0) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(function(card) { observer.observe(card); });
  } else {
    cards.forEach(function(c) { c.classList.add('visible'); });
  }
})();

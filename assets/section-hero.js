(function() {
  const heroes = document.querySelectorAll('.hero-banner');
  if (!heroes.length) return;

  heroes.forEach(function(hero) {
    const slides = hero.querySelectorAll('.slide');
    const dots = hero.querySelectorAll('.hero-dot');
    if (!slides.length) return;

    let currentIndex = 0;
    let autoInterval;
    let autoTimeout;
    const AUTO_DELAY = 6000;

    function showSlide(index) {
      slides.forEach(function(s, i) {
        s.classList.toggle('active', i === index);
      });
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    function nextSlide() {
      showSlide((currentIndex + 1) % slides.length);
    }

    function startAuto() {
      stopAuto();
      autoInterval = setInterval(nextSlide, AUTO_DELAY);
    }

    function stopAuto() {
      clearInterval(autoInterval);
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        const index = parseInt(this.dataset.slide);
        if (!isNaN(index)) showSlide(index);
        stopAuto();
        clearTimeout(autoTimeout);
        autoTimeout = setTimeout(startAuto, AUTO_DELAY);
      });
    });

    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);

    startAuto();
  });
})();

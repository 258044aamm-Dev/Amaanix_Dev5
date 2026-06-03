(function() {
  var countdownEl = document.querySelector('.countdown');
  if (!countdownEl) return;

  var sectionId = countdownEl.getAttribute('data-section-id') || 'default';
  var daysEl = document.getElementById('days-' + sectionId);
  var hoursEl = document.getElementById('hours-' + sectionId);
  var minutesEl = document.getElementById('minutes-' + sectionId);
  var secondsEl = document.getElementById('seconds-' + sectionId);
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  var configuredDays = parseInt(countdownEl.getAttribute('data-countdown-days')) || 2;
  var configuredHours = parseInt(countdownEl.getAttribute('data-countdown-hours')) || 14;

  var storageKey = 'amaanix_deal_end_' + sectionId;
  var dealEnd = localStorage.getItem(storageKey);
  if (!dealEnd) {
    var now = new Date();
    var end = new Date(now.getTime() + (configuredDays * 24 * 60 * 60 * 1000) + (configuredHours * 60 * 60 * 1000));
    dealEnd = end.getTime().toString();
    localStorage.setItem(storageKey, dealEnd);
  }

  function updateCountdown() {
    var now = new Date().getTime();
    var distance = parseInt(dealEnd) - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

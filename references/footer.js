// ── CSS ─────────────────────────────────────────
const css = `
  .footer { background-color: #111; color: #aaa; padding: 80px 0 30px; }
  .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 40px; margin-bottom: 60px; text-align: left; }
  .footer-col h4, .footer-accordion-header {
    color: var(--white); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 25px; font-family: var(--font-body); font-weight: 600; cursor: pointer;
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-accordion-icon { font-size: 18px; transition: transform 0.3s ease; color: var(--primary); }
  .footer-accordion-header.active .footer-accordion-icon { transform: rotate(45deg); }
  .footer-accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
  .footer-logo { font-family: var(--font-heading); font-size: 32px; color: var(--primary); margin-bottom: 15px; display: block; }
  .footer-tagline { font-family: var(--font-supporting); font-size: 14px; line-height: 1.8; margin-bottom: 20px; }
  .footer-links li { margin-bottom: 12px; }
  .footer-links a {
    font-size: 14px;
    transition: color 0.3s ease, transform 0.3s ease;
    position: relative;
    display: inline-block;
  }
  .footer-links a:hover {
    color: var(--primary);
    transform: translateX(4px);
  }
  .social-links { display: flex; gap: 15px; margin-top: 20px; }
  .social-icon {
    width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center; color: var(--white); transition: background 0.3s;
  }
  .social-icon:hover { background: var(--primary); }
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;
  }
  .copyright { font-size: 14px; }
  .payment-icons { display: flex; gap: 10px; font-size: 24px; opacity: 0.7; }
  .policy-links { display: flex; gap: 20px; font-size: 13px; }
  .policy-links a:hover { text-decoration: underline; }
  .footer-sections-wrapper { display: flex; flex-direction: column; }

  @media (min-width: 769px) {
    .brand-logos-section { order: 1; border-top: none; padding: 30px 0; background: var(--white); }
    .footer { order: 2; }
    .footer-accordion-header { display: flex !important; cursor: default; pointer-events: none; }
    .footer-accordion-header .footer-accordion-icon { display: none; }
    .footer-accordion-content { max-height: none !important; overflow: visible; }
  }

  @media (max-width: 768px) {
    .footer-sections-wrapper { display: block; }
    .footer-grid { grid-template-columns: 1fr; text-align: center; }
    .footer-col {
      display: flex; flex-direction: column; align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 15px;
    }
    .footer-col:last-child { border-bottom: none; }
    .footer-accordion-header { display: flex; width: 100%; margin-bottom: 0; padding: 10px 0; }
    .footer-accordion-content { width: 100%; }
    .footer-accordion-content.open { max-height: 500px; }
    .footer-links li { padding: 5px 0; }
    .social-links { justify-content: flex-start; margin-top: 10px; }
    .footer-bottom { flex-direction: column; text-align: center; }
    .policy-links { justify-content: center; flex-wrap: wrap; }
    .payment-icons { justify-content: center; }
  }
`;

// ── HTML ────────────────────────────────────────
const html = `
  <footer class="footer" id="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <a href="#" class="footer-logo">AMAANIX</a>
          <p class="footer-tagline"><strong>The Standard Has a Name.</strong><br>Trustworthy products built on integrity & sincerity for your home, office & life.</p>
          <div class="social-links">
            <a href="#" class="social-icon" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
            <a href="#" class="social-icon" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
            <a href="#" class="social-icon" aria-label="Twitter"><i class="fab fa-twitter" aria-hidden="true"></i></a>
            <a href="#" class="social-icon" aria-label="Pinterest"><i class="fab fa-pinterest-p" aria-hidden="true"></i></a>
            <a href="#" class="social-icon" aria-label="YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h3 class="footer-accordion-header">Support <span class="footer-accordion-icon"><i class="fas fa-plus" aria-hidden="true"></i></span></h3>
          <ul class="footer-links footer-accordion-content">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-accordion-header">Amaanix <span class="footer-accordion-icon"><i class="fas fa-plus" aria-hidden="true"></i></span></h3>
          <ul class="footer-links footer-accordion-content">
            <li><a href="collectionpage.html">Collections</a></li>
            <li><a href="#brand-story">About</a></li>
            <li><a href="#">Welcome Discount</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="copyright">&copy; 2026 Amaanix. All Rights Reserved.</div>
        <div class="payment-icons" aria-label="Accepted payment methods">
          <i class="fab fa-cc-visa" aria-hidden="true"></i>
          <i class="fab fa-cc-mastercard" aria-hidden="true"></i>
          <i class="fab fa-cc-amex" aria-hidden="true"></i>
          <i class="fab fa-cc-paypal" aria-hidden="true"></i>
          <i class="fab fa-cc-apple-pay" aria-hidden="true"></i>
          <i class="fab fa-cc-shopify" aria-hidden="true"></i>
        </div>
        <div class="policy-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
`;

// ── JS Logic ────────────────────────────────────
export function renderFooter(targetId = 'footer-placeholder') {
  if (!document.getElementById('footer-style')) {
    const style = document.createElement('style');
    style.id = 'footer-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  const target = document.getElementById(targetId);
  if (target) target.innerHTML = html;

  const footerHeaders = document.querySelectorAll('.footer-accordion-header');
  footerHeaders.forEach(header => {
    header.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        const content = header.nextElementSibling;
        const isOpen = content.classList.contains('open');
        footerHeaders.forEach(otherHeader => {
          if (otherHeader !== header) {
            otherHeader.classList.remove('active');
            otherHeader.nextElementSibling.classList.remove('open');
            otherHeader.nextElementSibling.style.maxHeight = null;
          }
        });
        if (isOpen) {
          header.classList.remove('active');
          content.classList.remove('open');
          content.style.maxHeight = null;
        } else {
          header.classList.add('active');
          content.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });

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
}

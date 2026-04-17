// ============================================
//   STRATUM BUSINESS SOLUTION — Main JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Sticky Navbar ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Mobile Menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) mobileMenu.classList.remove('open');
    });
  }

  // ── Active Nav Link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });

  // ── Scroll Reveal ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Counter Animation ──
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + suffix;
      }
    }, step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  // ── Contact Form Submission (Web3Forms) ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.getElementById('submitBtn');
      const statusEl = document.getElementById('formStatus');
      const agreeBox = document.getElementById('agree');

      // Validate agreement checkbox
      if (!agreeBox.checked) {
        statusEl.style.display = 'block';
        statusEl.style.background = '#fef2f2';
        statusEl.style.color = '#b91c1c';
        statusEl.style.border = '1px solid #fca5a5';
        statusEl.textContent = 'Please agree to be contacted before sending your message.';
        return;
      }

      // Loading state
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      btn.disabled = true;
      statusEl.style.display = 'none';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          // Success state
          btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          btn.style.background = 'var(--green)';
          statusEl.style.display = 'block';
          statusEl.style.background = '#f0fdf4';
          statusEl.style.color = '#15803d';
          statusEl.style.border = '1px solid #86efac';
          statusEl.textContent = '✓ Thank you! Your message has been received. We\'ll respond within one business day.';
          contactForm.reset();
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            statusEl.style.display = 'none';
          }, 5000);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        // Error state
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        statusEl.style.display = 'block';
        statusEl.style.background = '#fef2f2';
        statusEl.style.color = '#b91c1c';
        statusEl.style.border = '1px solid #fca5a5';
        statusEl.textContent = '✗ Something went wrong. Please try again or contact us directly at makotazahra@gmail.com.';
      }
    });
  }

  // ── Smooth section stagger for cards ──
  document.querySelectorAll('.service-card, .testimonial-card, .value-card, .why-item').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

});

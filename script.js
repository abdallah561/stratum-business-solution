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
  const hamburger = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
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

  // ── Contact Form Submission ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.setAttribute('method', 'POST');

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const agreeCheckbox = contactForm.querySelector('#agree');
      if (agreeCheckbox && !agreeCheckbox.checked) {
        alert('Please confirm that you agree to be contacted.');
        return;
      }

      const submitButton = contactForm.querySelector('[type="submit"]');
      const originalButtonText = submitButton ? submitButton.innerHTML : 'Sending...';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
      }

      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
        });

        let success = response.ok;
        if (response.headers.get('content-type')?.includes('application/json')) {
          const json = await response.json();
          success = success && json.success !== false;
        }

        if (success) {
          window.location.href = 'thank-you.html';
        } else {
          throw new Error('Unable to submit the form at this time.');
        }
      } catch (error) {
        console.error('Contact form submission error:', error);
        alert('Sorry, we could not send your message right now. Please try again later or email stratumbusinesssolutions@gmail.com.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    });
  }

  // ── Smooth section stagger for cards ──
  document.querySelectorAll('.service-card, .testimonial-card, .value-card, .why-item').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

  const servicesTrack = document.getElementById('servicesTrack');
  const servicePrev = document.querySelector('.carousel-prev');
  const serviceNext = document.querySelector('.carousel-next');
  if (servicesTrack && servicePrev && serviceNext) {
    const getScrollAmount = () => {
      const card = servicesTrack.querySelector('.service-card');
      return card ? card.offsetWidth + 28 : 340;
    };

    servicePrev.addEventListener('click', () => {
      servicesTrack.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    serviceNext.addEventListener('click', () => {
      servicesTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    let carouselAutoScroll = setInterval(() => {
      servicesTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }, 6000);

    const pauseCarousel = () => clearInterval(carouselAutoScroll);
    const restartCarousel = () => {
      pauseCarousel();
      carouselAutoScroll = setInterval(() => {
        servicesTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }, 6000);
    };

    servicesTrack.addEventListener('mouseenter', pauseCarousel);
    servicesTrack.addEventListener('mouseleave', restartCarousel);
    servicePrev.addEventListener('click', restartCarousel);
    serviceNext.addEventListener('click', restartCarousel);
  }

  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const testimonialsPrev = document.querySelector('.testimonials-carousel .carousel-prev');
  const testimonialsNext = document.querySelector('.testimonials-carousel .carousel-next');
  if (testimonialsTrack && testimonialsPrev && testimonialsNext) {
    const getTestimonialScroll = () => {
      const card = testimonialsTrack.querySelector('.testimonial-card');
      return card ? card.offsetWidth + 28 : 348;
    };

    testimonialsPrev.addEventListener('click', () => {
      testimonialsTrack.scrollBy({ left: -getTestimonialScroll(), behavior: 'smooth' });
    });

    testimonialsNext.addEventListener('click', () => {
      testimonialsTrack.scrollBy({ left: getTestimonialScroll(), behavior: 'smooth' });
    });

    let testimonialAutoScroll = setInterval(() => {
      testimonialsTrack.scrollBy({ left: getTestimonialScroll(), behavior: 'smooth' });
    }, 6000);

    const pauseTestimonialCarousel = () => clearInterval(testimonialAutoScroll);
    const restartTestimonialCarousel = () => {
      pauseTestimonialCarousel();
      testimonialAutoScroll = setInterval(() => {
        testimonialsTrack.scrollBy({ left: getTestimonialScroll(), behavior: 'smooth' });
      }, 6000);
    };

    testimonialsTrack.addEventListener('mouseenter', pauseTestimonialCarousel);
    testimonialsTrack.addEventListener('mouseleave', restartTestimonialCarousel);
    testimonialsPrev.addEventListener('click', restartTestimonialCarousel);
    testimonialsNext.addEventListener('click', restartTestimonialCarousel);
  }

});

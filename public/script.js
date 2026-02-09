// NeuroCaller Landing Page - Premium Interactions

// Nav scroll effect
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
}, { passive: true });

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Initialize scroll animations
document.querySelectorAll('[data-animate], [data-animate-stagger]').forEach(el => {
  animateOnScroll.observe(el);
});

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(start + (target - start) * easeOutQuart);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Counter animation on scroll
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;

      // Parse number from text (handle K+, M, etc.)
      if (text.includes('K')) {
        const num = parseFloat(text) * 1000;
        animateCounter(el, num, 2000);
        el.dataset.suffix = 'K+';
      } else if (text.includes('M')) {
        const num = parseFloat(text);
        animateCounter(el, num * 10, 2000);
        setTimeout(() => el.textContent = text, 2000);
      } else if (!isNaN(parseInt(text))) {
        animateCounter(el, parseInt(text), 2000);
      }

      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

// Observe stat values
document.querySelectorAll('.hero-stat-value, .stat-card-value, .problem-stat-value').forEach(el => {
  counterObserver.observe(el);
});

// Analytics tracking
function trackEvent(event, data = {}) {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data })
  }).catch(() => {});
}

// Track page view
document.addEventListener('DOMContentLoaded', () => {
  trackEvent('page_view', {
    url: window.location.href,
    referrer: document.referrer || 'direct'
  });
});

// Track CTA clicks
document.querySelectorAll('a[href^="#"], .btn-primary, .btn-secondary, .price-btn').forEach(el => {
  el.addEventListener('click', () => {
    trackEvent('cta_click', {
      text: el.textContent.trim(),
      href: el.getAttribute('href')
    });
  });
});

// Form submission
const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      company: form.company.value.trim(),
      note: form.note.value.trim()
    };

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.ok) {
        statusEl.textContent = "Спасибо! Мы свяжемся с вами в течение 24 часов.";
        statusEl.className = 'form-status success';
        form.reset();
        trackEvent('form_success', { name: formData.name });
      } else {
        throw new Error(result.error || 'Что-то пошло не так');
      }
    } catch (error) {
      statusEl.textContent = error.message || 'Не удалось отправить. Напишите нам напрямую.';
      statusEl.className = 'form-status error';
      trackEvent('form_error', { error: error.message });
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // Account for fixed nav
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Parallax effect for hero orbs (subtle)
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.hero-orb');
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

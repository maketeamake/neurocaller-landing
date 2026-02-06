// Scroll Animation Observer
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add staggered delay for multiple elements
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Initialize scroll animations
document.querySelectorAll('[data-animate]').forEach(el => {
  animateOnScroll.observe(el);
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
document.querySelectorAll('[data-track]').forEach(el => {
  el.addEventListener('click', () => {
    trackEvent('cta_click', { action: el.dataset.track });
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
        statusEl.textContent = "Thanks! I'll be in touch soon.";
        statusEl.className = 'form-status success';
        form.reset();
        trackEvent('form_success', { name: formData.name });
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (error) {
      statusEl.textContent = error.message || 'Failed to send. Please try calling instead.';
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
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

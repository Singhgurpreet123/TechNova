/**
 * TechNova Solutions - Main Application JavaScript
 * Clean Vanilla JavaScript for interactive functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initStickyNavbar();
  initMobileNavClose();
  initActiveNavHighlight();
  initAnimatedCounters();
  initContactFormValidation();
  initNewsletterValidation();
  initScrollToTop();
  initDynamicModals();
});

/* ==========================================================================
   1. Sticky Navbar Handler
   ========================================================================== */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar-technova');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

/* ==========================================================================
   2. Mobile Navigation Auto-Collapse
   ========================================================================== */
function initMobileNavClose() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });
}

/* ==========================================================================
   3. Active Navigation Scroll Highlight
   ========================================================================== */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   4. Animated Counter Numbers
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-number');
  if (counterElements.length === 0) return;

  let hasAnimated = false;

  const animateCounters = () => {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // milliseconds
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const counterInterval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(target * easeProgress);

        counter.innerText = currentCount + suffix;

        if (frame >= totalFrames) {
          counter.innerText = target + suffix;
          clearInterval(counterInterval);
        }
      }, frameDuration);
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* ==========================================================================
   5. Contact Form Validation & Submission
   ========================================================================== */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  const alertContainer = document.getElementById('contactAlertContainer');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Field references
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    let isValid = true;

    // Clear previous invalid states
    [fullName, email, phone, subject, message].forEach(input => {
      if (input) input.classList.remove('is-invalid');
    });

    // Validate Full Name
    if (!fullName.value.trim() || fullName.value.trim().length < 2) {
      setError(fullName, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Phone (optional length check, but if provided must be digits/valid)
    const phoneRegex = /^[0-9+\s\-()]{7,15}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
      setError(phone, 'Please enter a valid phone number (7-15 digits).');
      isValid = false;
    }

    // Validate Subject
    if (!subject.value.trim()) {
      setError(subject, 'Please enter a message subject.');
      isValid = false;
    }

    // Validate Message
    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, 'Message must be at least 10 characters long.');
      isValid = false;
    }

    if (isValid) {
      // Show Success Alert
      if (alertContainer) {
        alertContainer.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm" role="alert">
            <i class="fa-solid fa-circle-check me-2"></i>
            <strong>Thank you, ${escapeHTML(fullName.value)}!</strong> Your message has been sent successfully. Our team will contact you within 24 hours.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      }

      form.reset();
    }
  });

  // Handle Form Reset
  form.addEventListener('reset', () => {
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('is-invalid'));
    if (alertContainer) alertContainer.innerHTML = '';
  });

  function setError(element, errorMessage) {
    if (!element) return;
    element.classList.add('is-invalid');
    const feedbackEl = element.nextElementSibling;
    if (feedbackEl && feedbackEl.classList.contains('invalid-feedback-custom')) {
      feedbackEl.innerText = errorMessage;
      feedbackEl.style.display = 'block';
    }
  }
}

/* ==========================================================================
   6. Newsletter Validation
   ========================================================================== */
function initNewsletterValidation() {
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');

  if (!newsletterForm || !newsletterEmail) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailValue = newsletterEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      showToast('Invalid Email', 'Please enter a valid email address to subscribe.', 'danger');
      return;
    }

    // Success response
    showToast('Subscribed!', 'Thank you for subscribing to TechNova Solutions newsletter.', 'success');
    newsletterEmail.value = '';
  });
}

/* ==========================================================================
   7. Back To Top Button
   ========================================================================== */
function initScrollToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Dynamic Modals (Services, Products, Pricing, Read More)
   ========================================================================== */
function initDynamicModals() {
  const globalModalEl = document.getElementById('globalDetailModal');
  if (!globalModalEl) return;

  const modalTitle = document.getElementById('globalModalTitle');
  const modalBody = document.getElementById('globalModalBody');
  const bsModal = new bootstrap.Modal(globalModalEl);

  // Attach triggers for Service "Learn More"
  document.querySelectorAll('.btn-service-learn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-service-title') || 'Service Overview';
      const desc = btn.getAttribute('data-service-desc') || '';
      const details = btn.getAttribute('data-service-details') || 'Comprehensive enterprise IT solutions tailored for modern business scale.';

      modalTitle.innerText = title;
      modalBody.innerHTML = `
        <div class="text-center mb-4">
          <div class="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle p-3 mb-3" style="width:70px; height:70px; font-size:1.8rem;">
            <i class="${btn.getAttribute('data-service-icon') || 'fa-solid fa-gear'}"></i>
          </div>
          <h5 class="text-dark fw-bold">${escapeHTML(title)}</h5>
        </div>
        <p class="text-secondary mb-3">${escapeHTML(desc)}</p>
        <div class="p-3 bg-light rounded-3 border">
          <h6 class="fw-bold text-dark mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i>Key Capabilities:</h6>
          <p class="small text-muted mb-0">${escapeHTML(details)}</p>
        </div>
        <div class="mt-4 text-center">
          <a href="#contact" class="btn btn-technova-primary" data-bs-dismiss="modal">Request Consultation</a>
        </div>
      `;
      bsModal.show();
    });
  });

  // Attach triggers for Product "Explore"
  document.querySelectorAll('.btn-product-explore').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-product-title') || 'Product Details';
      const desc = btn.getAttribute('data-product-desc') || '';
      const features = btn.getAttribute('data-product-features') || 'Cloud deployment, multi-tenant security, REST API integrations, and 24/7 technical monitoring.';

      modalTitle.innerText = title;
      modalBody.innerHTML = `
        <div class="mb-3">
          <img src="${btn.getAttribute('data-product-img') || ''}" alt="${escapeHTML(title)}" class="img-fluid rounded-3 mb-3" style="max-height:220px; width:100%; object-fit:cover;" />
          <h5 class="text-dark fw-bold mb-2">${escapeHTML(title)}</h5>
          <p class="text-secondary">${escapeHTML(desc)}</p>
        </div>
        <div class="p-3 bg-light rounded-3 border mb-3">
          <h6 class="fw-bold text-dark mb-2"><i class="fa-solid fa-cubes text-primary me-2"></i>Core Features:</h6>
          <p class="small text-muted mb-0">${escapeHTML(features)}</p>
        </div>
        <div class="text-end">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Close</button>
          <a href="#contact" class="btn btn-technova-primary" data-bs-dismiss="modal">Schedule Demo</a>
        </div>
      `;
      bsModal.show();
    });
  });

  // Attach triggers for Pricing "Buy Now"
  document.querySelectorAll('.btn-plan-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan-name') || 'Subscription Plan';
      const planPrice = btn.getAttribute('data-plan-price') || '$0';

      modalTitle.innerText = `Subscribe to ${planName}`;
      modalBody.innerHTML = `
        <div class="text-center p-3">
          <div class="badge bg-primary mb-2 px-3 py-2 fs-6">${escapeHTML(planName)}</div>
          <h2 class="display-5 fw-bold text-dark mb-3">${escapeHTML(planPrice)} <span class="fs-6 text-muted">/ month</span></h2>
          <p class="text-muted mb-4">Select your preferred onboarding option. Our account manager will configure your TechNova workspace immediately.</p>
          <div class="d-grid gap-2 col-10 mx-auto">
            <button class="btn btn-technova-primary" onclick="confirmSubscription('${escapeHTML(planName)}')">Proceed to Checkout</button>
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      `;
      bsModal.show();
    });
  });

  // Attach trigger for About Us "Read More"
  const readMoreBtn = document.getElementById('aboutReadMoreBtn');
  if (readMoreBtn) {
    readMoreBtn.addEventListener('click', () => {
      modalTitle.innerText = 'About TechNova Solutions';
      modalBody.innerHTML = `
        <div class="p-2">
          <h5 class="fw-bold text-dark mb-3">Pioneering Enterprise IT & Artificial Intelligence</h5>
          <p class="text-secondary mb-3">Founded over a decade ago, TechNova Solutions has grown from a specialized software boutique into a multi-national technology solutions power player. We empower companies across healthcare, finance, logistics, and retail to digitalize operations and scale intelligently.</p>
          <h6 class="fw-bold text-primary mb-2">Our Execution Standards:</h6>
          <ul class="list-unstyled text-muted small mb-4">
            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i><strong>Zero-Trust Architecture:</strong> Enterprise-grade data protection built into every deployment.</li>
            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i><strong>Agile Delivery:</strong> Rapid 2-week sprint cycles with transparent client dashboards.</li>
            <li><i class="fa-solid fa-check text-success me-2"></i><strong>24/7 Global NOC:</strong> Round-the-clock infrastructure monitoring and reliability assurance.</li>
          </ul>
          <div class="text-end">
            <button class="btn btn-technova-primary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      `;
      bsModal.show();
    });
  }
}

/* ==========================================================================
   Helper Functions
   ========================================================================== */
function showToast(title, message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white bg-${type} border-0 shadow-lg show mb-2`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${escapeHTML(title)}</strong> — ${escapeHTML(message)}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.remove(), 300);
  }, 4000);
}

function confirmSubscription(planName) {
  const modalEl = document.getElementById('globalDetailModal');
  const bsModal = bootstrap.Modal.getInstance(modalEl);
  if (bsModal) bsModal.hide();

  showToast('Plan Selected', `Thank you for choosing the ${planName}! Our billing team will reach out shortly.`, 'success');
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

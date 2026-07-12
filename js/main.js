document.addEventListener('DOMContentLoaded', () => {
  /* Sticky header shadow */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    });
  }

  /* Mobile nav drawer */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.overlay');
  const closeNav = () => { mobileNav?.classList.remove('open'); overlay?.classList.remove('open'); };
  navToggle?.addEventListener('click', () => { mobileNav?.classList.add('open'); overlay?.classList.add('open'); });
  overlay?.addEventListener('click', closeNav);
  document.querySelector('.mobile-nav-close')?.addEventListener('click', closeNav);

  /* Hero slideshow */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots button');
  if (slides.length) {
    let current = 0;
    const show = (i) => {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
      current = i;
    };
    dots.forEach((d, idx) => d.addEventListener('click', () => show(idx)));
    setInterval(() => show((current + 1) % slides.length), 5000);
  }

  /* Accordion (product detail) */
  document.querySelectorAll('.accordion-item button').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('open');
    });
  });

  /* Size chip selection */
  document.querySelectorAll('.size-row').forEach((row) => {
    row.querySelectorAll('.size-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        row.querySelectorAll('.size-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });

  /* Quantity control */
  document.querySelectorAll('.qty-control').forEach((ctrl) => {
    const input = ctrl.querySelector('input');
    ctrl.querySelector('.minus')?.addEventListener('click', () => {
      input.value = Math.max(1, parseInt(input.value || '1', 10) - 1);
    });
    ctrl.querySelector('.plus-btn')?.addEventListener('click', () => {
      input.value = parseInt(input.value || '1', 10) + 1;
    });
  });

  /* Shop tabs */
  document.querySelectorAll('.tab-list').forEach((tabs) => {
    tabs.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  /* Cart counter demo */
  let cartCount = 2;
  document.querySelectorAll('.product-quickadd, .add-to-cart').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cartCount += 1;
      document.querySelectorAll('.cart-count').forEach((el) => (el.textContent = cartCount));
      btn.textContent = 'Added ✓';
      setTimeout(() => {
        btn.textContent = btn.dataset.label || 'Quick Add';
      }, 1500);
    });
  });

  /* Newsletter + contact form fake submit */
  document.querySelectorAll('.newsletter-form, .contact-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Thank You!';
      form.reset();
      setTimeout(() => (btn.textContent = original), 2200);
    });
  });

  /* Wishlist toggle */
  document.querySelectorAll('.product-wishlist').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      btn.style.color = btn.classList.contains('active') ? '#6d1f2b' : '';
    });
  });
});

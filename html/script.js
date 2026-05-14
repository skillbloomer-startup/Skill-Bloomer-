(function () {
  'use strict';

  // ---- header scroll state ----
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- mobile menu ----
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuBtn.querySelector('[data-icon-menu]').style.display = open ? 'none' : 'inline-flex';
      menuBtn.querySelector('[data-icon-close]').style.display = open ? 'inline-flex' : 'none';
    });
    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.querySelector('[data-icon-menu]').style.display = 'inline-flex';
        menuBtn.querySelector('[data-icon-close]').style.display = 'none';
      })
    );
  }

  // ---- reveal on scroll ----
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
  );
  reveals.forEach((el) => io.observe(el));

  // ---- particle field ----
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pts = [];

    function setSize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 14000) + 22;
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
        hue: Math.random() < 0.5 ? 258 : 188,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130) {
            const o = 1 - Math.sqrt(d2) / 130;
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 90%, 70%, ${o * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        g.addColorStop(0, `hsla(${p.hue}, 100%, 75%, 0.9)`);
        g.addColorStop(1, `hsla(${p.hue}, 100%, 75%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, 0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    setSize();
    draw();
    window.addEventListener('resize', setSize);
  }

  // ---- stat counters ----
  const counterEls = document.querySelectorAll('[data-counter]');
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          startCounter(e.target);
          counterIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterEls.forEach((el) => counterIO.observe(el));

  function startCounter(el) {
    const target = parseFloat(el.dataset.counter);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      const formatted = decimals > 0
        ? val.toFixed(decimals)
        : Math.round(val).toLocaleString();
      el.textContent = prefix + formatted + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- testimonials slider ----
  const tWrap = document.querySelector('[data-testimonials]');
  if (tWrap) {
    const slides = tWrap.querySelectorAll('[data-slide]');
    const dots = tWrap.querySelectorAll('[data-dot]');
    const prev = tWrap.querySelector('[data-prev]');
    const next = tWrap.querySelector('[data-next]');
    let i = 0;
    const total = slides.length;
    const show = (n) => {
      i = (n + total) % total;
      slides.forEach((s, idx) => {
        s.style.display = idx === i ? 'block' : 'none';
        s.style.opacity = idx === i ? '1' : '0';
      });
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    };
    prev && prev.addEventListener('click', () => show(i - 1));
    next && next.addEventListener('click', () => show(i + 1));
    dots.forEach((d, idx) => d.addEventListener('click', () => show(idx)));
    show(0);
    setInterval(() => show(i + 1), 7000);
  }

  // ---- pricing toggle ----
  const priceToggle = document.querySelectorAll('[data-billing]');
  const priceEls = document.querySelectorAll('[data-monthly]');
  const periodEls = document.querySelectorAll('[data-period]');
  if (priceToggle.length) {
    let yearly = false;
    const refresh = () => {
      priceEls.forEach((el) => {
        const m = parseInt(el.dataset.monthly, 10);
        const y = parseInt(el.dataset.yearly, 10);
        el.textContent = '$' + (yearly ? y : m).toLocaleString();
      });
      periodEls.forEach((el) => (el.textContent = yearly ? 'year' : 'month'));
      priceToggle.forEach((b) => b.classList.toggle('active', b.dataset.billing === (yearly ? 'yearly' : 'monthly')));
    };
    priceToggle.forEach((b) =>
      b.addEventListener('click', () => {
        yearly = b.dataset.billing === 'yearly';
        refresh();
      })
    );
    refresh();
  }

  // ---- faq accordion ----
  document.querySelectorAll('[data-faq]').forEach((row, idx) => {
    if (idx === 0) row.classList.add('open');
    const q = row.querySelector('.faq-q');
    q.addEventListener('click', () => row.classList.toggle('open'));
  });

  // ---- orbit satellites position ----
  document.querySelectorAll('.satellite').forEach((s, idx) => {
    const angle = idx * 90;
    const r = (s.parentElement && s.parentElement.offsetWidth / 2) || 128;
    s.style.transform = `rotate(${angle}deg) translateY(-${r}px)`;
  });
  window.addEventListener('resize', () => {
    document.querySelectorAll('.satellite').forEach((s, idx) => {
      const angle = idx * 90;
      const r = (s.parentElement && s.parentElement.offsetWidth / 2) || 128;
      s.style.transform = `rotate(${angle}deg) translateY(-${r}px)`;
    });
  });

  // ---- footer year ----
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- init lucide icons ----
  if (window.lucide) window.lucide.createIcons();
})();

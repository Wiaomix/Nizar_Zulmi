/* =========================================
   NIZAR ZULMI PORTFOLIO — script.js
   Optimized for performance
   ========================================= */

/* ============================
   1. LOADING SCREEN
   ============================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 600);
    }
    animateCounters();
  }, 2000);
});

/* ============================
   2. CUSTOM CURSOR
   — Gunakan transform saja (bukan left/top)
     agar berjalan di compositor thread
   ============================ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Dot: langsung (tidak perlu smooth), offset setengah ukuran (4px)
  if (cursorDot) {
    cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  }
}, { passive: true });

// Smooth ring follow — hanya mengubah transform, berjalan di GPU
function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  if (cursorRing) {
    // offset setengah ukuran ring (18px untuk 36px ring)
    cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
  }
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover state
const hoverTargets = document.querySelectorAll(
  'a, button, .skill-card, .cert-card, .channel-card, .tl-card, .edu-main, [data-magnetic]'
);
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'), { passive: true });
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'), { passive: true });
});

/* ============================
   3. MAGNETIC BUTTONS
   — Throttle dengan requestAnimationFrame
   ============================ */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  let rafPending = false;
  let lastEvent  = null;

  el.addEventListener('mousemove', (e) => {
    lastEvent = e;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        if (!lastEvent) { rafPending = false; return; }
        const rect    = el.getBoundingClientRect();
        const cx      = rect.left + rect.width  / 2;
        const cy      = rect.top  + rect.height / 2;
        const dx      = lastEvent.clientX - cx;
        const dy      = lastEvent.clientY - cy;
        const distSq  = dx * dx + dy * dy;
        const maxDist = 80;
        if (distSq < maxDist * maxDist) {
          const dist     = Math.sqrt(distSq);
          const strength = (maxDist - dist) / maxDist;
          el.style.transform = `translate(${dx * strength * 0.35}px, ${dy * strength * 0.35}px)`;
        }
        rafPending = false;
      });
    }
  }, { passive: true });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    lastEvent = null;
  }, { passive: true });
});

/* ============================
   4. NAVBAR — scroll & active
   — Throttle dengan satu rAF flag
   ============================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

let scrollRafPending = false;

window.addEventListener('scroll', () => {
  if (!scrollRafPending) {
    scrollRafPending = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Scrolled class
      navbar.classList.toggle('scrolled', scrollY > 60);

      // Active nav link
      let current = '';
      sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
      });

      scrollRafPending = false;
    });
  }
}, { passive: true });

/* ============================
   5. HAMBURGER / MOBILE DRAWER
   ============================ */
const hamburger    = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileDrawer.classList.toggle('open');
});

function closeDrawer() {
  hamburger.classList.remove('open');
  mobileDrawer.classList.remove('open');
}

/* ============================
   6. THEME TOGGLE
   ============================ */
const themeBtn = document.getElementById('themeBtn');

themeBtn.addEventListener('click', () => {
  const html  = document.documentElement;
  const next  = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

/* ============================
   7. SCROLL REVEAL
   ============================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================
   8. TYPEWRITER EFFECT
   ============================ */
const phrases = ['LMS Developer', 'Linux Enthusiast'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriterText');

function typeWriter() {
  if (!typeEl) return;
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
    setTimeout(typeWriter, 75);
  } else {
    typeEl.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting    = false;
      phraseIdx   = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(typeWriter, 40);
  }
}
setTimeout(typeWriter, 2200);

/* ============================
   9. COUNTER ANIMATION
   ============================ */
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.count);
    let start    = 0;
    const step   = Math.ceil(target / 40);
    const timer  = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target; clearInterval(timer); }
      else                   el.textContent = start;
    }, 40);
  });
}

/* ============================
   10. PARTICLE CANVAS — Optimized
   Perubahan utama:
   - isDark di-cache, diupdate via MutationObserver (bukan per-frame)
   - Jumlah partikel dikurangi (÷15000, max 55)
   - Squared distance check (hindari sqrt hingga benar-benar perlu)
   - Resize di-debounce 200ms
   - Loop tidak re-check theme setiap frame
   ============================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  // Cache theme state — update hanya saat attribute berubah
  let isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  new MutationObserver(() => {
    isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = [];
    // Kurangi jumlah partikel untuk performa lebih baik
    const count = Math.min(Math.floor((W * H) / 15000), 55);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 5;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.3 + 0.1);
      this.r  = Math.random() * 1.8 + 0.4;
      this.a  = Math.random() * 0.35 + 0.05;
      // Pre-compute fill styles agar tidak buat string setiap frame
      this.fillDark  = `rgba(56,189,248,${this.a})`;
      this.fillLight = `rgba(3,105,161,${(this.a * 0.6).toFixed(3)})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? this.fillDark : this.fillLight;
      ctx.fill();
    }
  }

  // Gunakan squared distance untuk menghindari sqrt pada semua pasangan
  const LINE_DIST    = 85;
  const LINE_DIST_SQ = LINE_DIST * LINE_DIST;

  function drawLines() {
    const darkStroke  = 'rgba(56,189,248,';
    const lightStroke = 'rgba(3,105,161,';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dSq  = dx * dx + dy * dy;
        if (dSq < LINE_DIST_SQ) {
          const d     = Math.sqrt(dSq);   // sqrt hanya kalau benar-benar dekat
          const alpha = (1 - d / LINE_DIST) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark
            ? `${darkStroke}${alpha.toFixed(3)})`
            : `${lightStroke}${(alpha * 0.5).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) particles[i].update();
    for (let i = 0; i < particles.length; i++) particles[i].draw();
    drawLines();
    requestAnimationFrame(loop);
  }

  // Debounce resize — hindari rebuild partikel berkali-kali saat drag resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });

  resize();
  loop();
})();

/* ============================
   11. INJECT SVG GRADIENT for Soft Skill Rings
   ============================ */
(function injectSvgGrad() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'svg-defs');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `
    <defs>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#34d399"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(svg);
})();

/* ============================
   12. ANIMATE SKILL RINGS on scroll
   ============================ */
const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.ring-fill').forEach(ring => {
        const pct    = ring.style.getPropertyValue('--pct') || ring.style.cssText.match(/--pct:\s*(\d+)/)?.[1] || '80';
        const circ   = 2 * Math.PI * 34;
        ring.style.strokeDashoffset = circ * (1 - parseInt(pct) / 100);
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.soft-skills-panel').forEach(el => ringObserver.observe(el));

/* ============================
   13. CONTACT FORM VALIDATION & SUBMIT
   ============================ */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = document.getElementById('btnText');
const formToast = document.getElementById('formToast');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.disabled      = true;
    btnText.textContent     = 'Mengirim...';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      submitBtn.style.display = 'none';
      formToast.classList.add('show');
      form.reset();
      clearErrors();

      setTimeout(() => {
        formToast.classList.remove('show');
        submitBtn.style.display = '';
        submitBtn.style.opacity = '';
        submitBtn.disabled      = false;
        btnText.textContent     = 'Kirim Pesan';
      }, 4000);
    }, 1500);
  });

  ['fname', 'femail', 'fmsg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => validateField(id));
      el.addEventListener('blur',  () => validateField(id));
    }
  });
}

function validateForm() {
  return validateField('fname') & validateField('femail') & validateField('fmsg');
}

function validateField(id) {
  const el     = document.getElementById(id);
  const fgMap  = { fname: 'fg-name', femail: 'fg-email', fmsg: 'fg-msg' };
  const errMap = { fname: 'err-name', femail: 'err-email', fmsg: 'err-msg' };
  const fg     = document.getElementById(fgMap[id]);
  const err    = document.getElementById(errMap[id]);
  if (!el || !fg || !err) return true;

  let msg = '';
  const val = el.value.trim();
  if (id === 'fname')  { if (!val) msg = 'Nama tidak boleh kosong.'; }
  if (id === 'femail') {
    if (!val) msg = 'Email tidak boleh kosong.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Format email tidak valid.';
  }
  if (id === 'fmsg') {
    if (!val) msg = 'Pesan tidak boleh kosong.';
    else if (val.length < 10) msg = 'Pesan minimal 10 karakter.';
  }

  err.textContent = msg;
  fg.classList.toggle('error', !!msg);
  return !msg;
}

function clearErrors() {
  ['fg-name','fg-email','fg-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
  ['err-name','err-email','err-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

/* ============================
   14. FOOTER YEAR
   ============================ */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ============================
   15. SMOOTH SCROLL for nav anchors
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 70,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================
   16. TILT EFFECT on Cards
   — Throttle dengan requestAnimationFrame
   ============================ */
document.querySelectorAll('.skill-card, .cert-card, .edu-main, .tl-card').forEach(card => {
  let tiltRaf    = false;
  let lastTiltE  = null;

  card.addEventListener('mousemove', (e) => {
    lastTiltE = e;
    if (!tiltRaf) {
      tiltRaf = true;
      requestAnimationFrame(() => {
        if (!lastTiltE) { tiltRaf = false; return; }
        const rect = card.getBoundingClientRect();
        const dx   = (lastTiltE.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        const dy   = (lastTiltE.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        card.style.transform = `perspective(600px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-4px)`;
        tiltRaf = false;
      });
    }
  }, { passive: true });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    lastTiltE = null;
  }, { passive: true });
});

/* ============================
   17. NAVBAR LINK HOVER
   ============================ */
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.transform = 'translateY(-1px)';
  }, { passive: true });
  link.addEventListener('mouseleave', () => {
    link.style.transform = '';
  }, { passive: true });
});

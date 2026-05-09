/* =========================================
   NIZAR ZULMI PORTFOLIO — script.js
   Full interactivity & animations
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
    // Trigger hero counter animation after load
    animateCounters();
  }, 2000);
});

/* ============================
   2. CUSTOM CURSOR
   ============================ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';
  }
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover state
const hoverTargets = document.querySelectorAll(
  'a, button, .skill-card, .cert-card, .channel-card, .tl-card, .edu-main, [data-magnetic]'
);
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ============================
   3. MAGNETIC BUTTONS
   ============================ */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect   = el.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = e.clientX - cx;
    const dy     = e.clientY - cy;
    const dist   = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 80;
    if (dist < maxDist) {
      const strength = (maxDist - dist) / maxDist;
      const tx = dx * strength * 0.35;
      const ty = dy * strength * 0.35;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    }
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ============================
   4. NAVBAR — scroll & active
   ============================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
});

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
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

themeBtn.addEventListener('click', () => {
  const html    = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Restore saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

/* ============================
   7. SCROLL REVEAL
   ============================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      // Animate skill bars inside revealed elements
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
const phrases = [
  'LMS Developer',
  'Linux Enthusiast',
];
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
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(typeWriter, 40);
  }
}
// Start typewriter after loader
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
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = start;
      }
    }, 40);
  });
}

/* ============================
   10. PARTICLE CANVAS
   ============================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = [];
    const count = Math.min(Math.floor((W * H) / 10000), 100);
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
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset(false);
    }
    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(56,189,248,${this.a})`
        : `rgba(3,105,161,${this.a * 0.6})`;
      ctx.fill();
    }
  }

  function drawLines() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - d / 90) * 0.08;
          ctx.strokeStyle = isDark
            ? `rgba(56,189,248,${alpha})`
            : `rgba(3,105,161,${alpha * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
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
      // rings animate via CSS on .in, but SVG stroke needs a trigger
      entry.target.querySelectorAll('.ring-fill').forEach(ring => {
        const pct  = ring.style.getPropertyValue('--pct') || ring.style.cssText.match(/--pct:\s*(\d+)/)?.[1] || '80';
        const r    = 34;
        const circ = 2 * Math.PI * r;
        const offset = circ * (1 - parseInt(pct) / 100);
        ring.style.strokeDashoffset = offset;
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

    // Loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Mengirim...';
    submitBtn.style.opacity = '0.7';

    // Simulate send
    setTimeout(() => {
      submitBtn.style.display = 'none';
      formToast.classList.add('show');
      form.reset();
      clearErrors();

      // Reset button after 4s
      setTimeout(() => {
        formToast.classList.remove('show');
        submitBtn.style.display = '';
        submitBtn.style.opacity = '';
        submitBtn.disabled = false;
        btnText.textContent = 'Kirim Pesan';
      }, 4000);
    }, 1500);
  });

  // Live validation
  ['fname', 'femail', 'fmsg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => validateField(id));
      el.addEventListener('blur',  () => validateField(id));
    }
  });
}

function validateForm() {
  const ok1 = validateField('fname');
  const ok2 = validateField('femail');
  const ok3 = validateField('fmsg');
  return ok1 && ok2 && ok3;
}

function validateField(id) {
  const el    = document.getElementById(id);
  const fgMap = { fname: 'fg-name', femail: 'fg-email', fmsg: 'fg-msg' };
  const errMap = { fname: 'err-name', femail: 'err-email', fmsg: 'err-msg' };
  const fg  = document.getElementById(fgMap[id]);
  const err = document.getElementById(errMap[id]);
  if (!el || !fg || !err) return true;

  let msg = '';
  const val = el.value.trim();

  if (id === 'fname')  { if (!val) msg = 'Nama tidak boleh kosong.'; }
  if (id === 'femail') { if (!val) msg = 'Email tidak boleh kosong.'; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Format email tidak valid.'; }
  if (id === 'fmsg')   { if (!val) msg = 'Pesan tidak boleh kosong.'; else if (val.length < 10) msg = 'Pesan minimal 10 karakter.'; }

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
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ============================
   16. TILT EFFECT on Cards
   ============================ */
document.querySelectorAll('.skill-card, .cert-card, .edu-main, .tl-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const rotX  = -dy * 5;
    const rotY  =  dx * 5;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================
   17. NAVBAR LINK HOVER UNDERLINE
       (subtle line animation)
   ============================ */
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.transition = 'color 0.2s, background 0.2s, transform 0.2s';
    link.style.transform  = 'translateY(-1px)';
  });
  link.addEventListener('mouseleave', () => {
    link.style.transform = '';
  });
});

'use strict';

// ─── NAV SCROLL EFFECT ───────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', onScroll, { passive: true });

// ─── SCROLL PROGRESS BAR ─────────────────────────────────────────────────────
const scrollProgress = document.getElementById('scrollProgress');

function onScroll() {
  const scrollY = window.scrollY;

  // Nav
  nav.classList.toggle('scrolled', scrollY > 50);

  // Progress bar
  if (scrollProgress) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrollY / total) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', scrollY > 400);
  }
}

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ─── SCROLL TO TOP ────────────────────────────────────────────────────────────
document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── TERMINAL ANIMATION ──────────────────────────────────────────────────────
const terminalLines = [
  { type: 'cmd',  text: 'uptime' },
  { type: 'out',  text: '18 containers running · 99.9% uptime', cls: 't-green' },
  { type: 'cmd',  text: 'ls /services/' },
  { type: 'out',  text: 'grommunio  authentik  wazuh  gitea', cls: 't-cyan' },
  { type: 'out',  text: 'misp  thehive  vaultwarden  matrix', cls: 't-cyan' },
  { type: 'cmd',  text: 'security --status' },
  { type: 'out',  text: '✓ Zero-Trust active', cls: 't-green' },
  { type: 'out',  text: '✓ SIEM monitoring',   cls: 't-green' },
  { type: 'out',  text: '✓ Backup verified',   cls: 't-green' },
];

const terminal = document.getElementById('terminal');
let lineIndex = 0;

function typeChar(el, text, i, callback) {
  if (i <= text.length) {
    el.textContent = text.slice(0, i);
    setTimeout(() => typeChar(el, text, i + 1, callback), 40);
  } else {
    callback();
  }
}

function renderNextLine() {
  if (!terminal || lineIndex >= terminalLines.length) {
    // Add blinking cursor after all lines
    const cursor = document.createElement('div');
    cursor.innerHTML = '<span class="t-prompt">$ </span><span class="t-cursor"></span>';
    terminal?.appendChild(cursor);
    return;
  }

  const line = terminalLines[lineIndex++];
  const el = document.createElement('div');

  if (line.type === 'cmd') {
    el.className = 't-line';
    const prompt = document.createElement('span');
    prompt.className = 't-prompt';
    prompt.textContent = '$ ';
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 't-cmd';
    el.appendChild(prompt);
    el.appendChild(cmdSpan);
    terminal.appendChild(el);
    terminal.scrollTop = terminal.scrollHeight;
    // Type character by character, then pause before next line
    typeChar(cmdSpan, line.text, 0, () => {
      setTimeout(renderNextLine, 500);
    });
  } else {
    // Output lines appear instantly
    el.className = line.cls || 't-out';
    el.style.paddingLeft = '16px';
    el.textContent = line.text;
    terminal.appendChild(el);
    terminal.scrollTop = terminal.scrollHeight;
    setTimeout(renderNextLine, 180);
  }
}

setTimeout(renderNextLine, 600);

// ─── ANIMATED COUNTER FOR STATS ──────────────────────────────────────────────
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  const isZero = target === 0;

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = (isZero ? '0' : current) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const heroStats = document.getElementById('heroStats');
if (heroStats) {
  let countersStarted = false;
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        heroStats.querySelectorAll('.stat-n').forEach(el => {
          const target = parseInt(el.dataset.target ?? el.textContent, 10);
          const suffix = el.dataset.suffix || '';
          // For 0€ we skip animation and just display immediately
          if (target === 0) {
            el.textContent = '0' + suffix;
          } else {
            animateCounter(el, target, suffix, 1400);
          }
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '✓ Nachricht gesendet';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Nachricht senden';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .stack-category, .about-badge').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

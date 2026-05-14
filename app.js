'use strict';

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Terminal animation
const lines = [
  { type: 'cmd', text: 'uptime' },
  { type: 'out', text: '18 containers running · 99.9% uptime', cls: 't-green' },
  { type: 'cmd', text: 'ls /services/' },
  { type: 'out', text: 'grommunio  authentik  wazuh  gitea', cls: 't-cyan' },
  { type: 'out', text: 'misp  thehive  vaultwarden  matrix', cls: 't-cyan' },
  { type: 'cmd', text: 'security --status' },
  { type: 'out', text: '✓ Zero-Trust active', cls: 't-green' },
  { type: 'out', text: '✓ SIEM monitoring', cls: 't-green' },
  { type: 'out', text: '✓ Backup verified', cls: 't-green' },
];

const terminal = document.getElementById('terminal');
let i = 0;

function typeNextLine() {
  if (!terminal || i >= lines.length) return;
  const line = lines[i++];
  const el = document.createElement('div');
  el.className = 'infra-row';

  if (line.type === 'cmd') {
    el.innerHTML = `<span class="t-prompt">$</span><span class="t-cmd"> ${line.text}</span>`;
  } else {
    el.innerHTML = `<span class="${line.cls || 't-out'}" style="padding-left:16px">${line.text}</span>`;
  }

  terminal.appendChild(el);
  terminal.scrollTop = terminal.scrollHeight;

  const delay = line.type === 'cmd' ? 800 : 300;
  setTimeout(typeNextLine, delay);
}

setTimeout(typeNextLine, 600);

// Add cursor at end
setTimeout(() => {
  if (!terminal) return;
  const cursor = document.createElement('div');
  cursor.innerHTML = '<span class="t-prompt">$ </span><span class="t-cursor"></span>';
  terminal.appendChild(cursor);
}, lines.length * 600 + 1500);

// Contact form
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

// Smooth reveal on scroll
const observer = new IntersectionObserver((entries) => {
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
  observer.observe(el);
});

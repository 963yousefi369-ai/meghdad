(() => {
  'use strict';
  const cfg = window.WEDDING_CONFIG || {};
  const fa = (value) => String(value).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));

  document.querySelectorAll('[data-config]').forEach(el => {
    const value = cfg[el.dataset.config];
    if (value) el.textContent = value;
  });

  const mapButton = document.getElementById('mapButton');
  const toast = document.getElementById('toast');
  let toastTimer;
  const notify = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  mapButton.addEventListener('click', (e) => {
    if (!cfg.mapUrl) {
      e.preventDefault();
      notify('لینک نقشه را در config.js وارد کنید');
    } else mapButton.href = cfg.mapUrl;
  });

  const music = document.getElementById('music');
  const musicButton = document.getElementById('musicButton');
  let playing = false;
  musicButton.addEventListener('click', async () => {
    try {
      if (playing) {
        music.pause();
        musicButton.classList.remove('playing');
      } else {
        await music.play();
        musicButton.classList.add('playing');
      }
      playing = !playing;
    } catch (_) {
      notify('فایل assets/music.mp3 را اضافه کنید');
    }
  });

  const countEls = {
    days: document.querySelector('[data-count="days"]'),
    hours: document.querySelector('[data-count="hours"]'),
    minutes: document.querySelector('[data-count="minutes"]')
  };
  const countdownHint = document.getElementById('countdownHint');
  function updateCountdown() {
    if (!cfg.eventDate) return;
    const distance = new Date(cfg.eventDate).getTime() - Date.now();
    if (!Number.isFinite(distance)) return;
    if (distance <= 0) {
      countdownHint.textContent = 'امروز، آغاز قصه‌ی تازه‌ی ماست';
      Object.values(countEls).forEach(el => el.textContent = '۰۰');
      return;
    }
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    countEls.days.textContent = fa(String(days).padStart(2, '0'));
    countEls.hours.textContent = fa(String(hours).padStart(2, '0'));
    countEls.minutes.textContent = fa(String(minutes).padStart(2, '0'));
    countdownHint.textContent = 'تا آغاز جشن ما';
  }
  updateCountdown();
  setInterval(updateCountdown, 30000);

  const stories = [...document.querySelectorAll('.story')];
  const chapters = [...document.querySelectorAll('.chapter')];
  const chapterNo = document.getElementById('chapterNo');
  const chapterName = document.getElementById('chapterName');

  const createParticles = (container, className, count) => {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const node = document.createElement('i');
      node.className = className;
      node.style.left = `${8 + Math.random() * 84}%`;
      node.style.top = `${-15 - Math.random() * 40}%`;
      node.style.width = `${3 + Math.random() * 5}px`;
      node.style.height = `${7 + Math.random() * 9}px`;
      node.style.setProperty('--dur', `${8 + Math.random() * 8}s`);
      node.style.setProperty('--delay', `${-Math.random() * 14}s`);
      node.style.setProperty('--drift', `${-45 + Math.random() * 90}px`);
      container.appendChild(node);
    }
  };
  createParticles(document.querySelector('.petals'), 'petal', 12);
  createParticles(document.querySelector('.sparkles'), 'spark', 18);

  let ticking = false;
  function render() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--page-progress', `${max > 0 ? (y / max) * 100 : 0}%`);

    stories.forEach(section => {
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - innerHeight;
      const p = clamp(-rect.top / Math.max(1, span));
      section.style.setProperty('--p', p.toFixed(4));
    });

    let active = chapters[0];
    let best = Infinity;
    chapters.forEach(ch => {
      const r = ch.getBoundingClientRect();
      const centerDistance = Math.abs((r.top + r.bottom) / 2 - innerHeight / 2);
      if (centerDistance < best) { best = centerDistance; active = ch; }
    });
    chapterNo.textContent = active.dataset.no || '۰۰';
    chapterName.textContent = active.dataset.name || 'آغاز';
    ticking = false;
  }
  const onScroll = () => {
    if (!ticking) { requestAnimationFrame(render); ticking = true; }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  render();
})();

/* =============================================
   ARÁNZAZU · PORTFOLIO — script.js
   ============================================= */
document.addEventListener('DOMContentLoaded', function() {
  console.log(
    '%cᓚ₍ ^. .^₎ .... ᘛ⁐̤ᕐᐷ\nNada que ver aquí, solo un gato cazando ratones',
    'color: hotpink; font-size: 24px; font-weight: bold;'
  );
});

/* -----------------------------------------------
   1. NAVBAR: agrega clase al hacer scroll
   ----------------------------------------------- */
(function initNavbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* -----------------------------------------------
   2. REVEAL ON SCROLL (Intersection Observer)
   ----------------------------------------------- */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          const percent = bar.closest('.skill-bar')?.dataset.percent || 0;
          bar.style.width = percent + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  items.forEach(item => observer.observe(item));
})();

/* -----------------------------------------------
   3. SKILLS TABS
   ----------------------------------------------- */
(function initSkillsTabs() {
  const tabs   = document.querySelectorAll('.skills-tab-btn');
  const panels = document.querySelectorAll('.skills-panel');
  if (!tabs.length) return;

  function animateBarsInPanel(panel) {
    panel.querySelectorAll('.skill-bar-fill').forEach(bar => bar.style.width = '0%');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.querySelectorAll('.skill-bar-fill').forEach(bar => {
          const percent = bar.closest('.skill-bar')?.dataset.percent || 0;
          bar.style.width = percent + '%';
        });
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = 'panel-' + tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
          animateBarsInPanel(panel);
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  const activePanel = document.querySelector('.skills-panel.active');
  if (activePanel) {
    const sectionSkills = document.getElementById('habilidades');
    const firstVisible = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBarsInPanel(activePanel);
          firstVisible.disconnect();
        }
      });
    }, { threshold: 0.2 });
    if (sectionSkills) firstVisible.observe(sectionSkills);
  }
})();

/* -----------------------------------------------
   4. PARALLAX DECORACIONES
   ----------------------------------------------- */
(function initParallax() {
  const items = document.querySelectorAll('.parallax-item');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        items.forEach(item => {
          const speed  = parseFloat(item.dataset.speed) || 0.3;
          const dir    = item.classList.contains('cat-float') ? 1 : -1;
          item.style.transform = `translateY(${scrollY * speed * dir}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* -----------------------------------------------
   5. ACTIVE NAV LINK en scroll
   ----------------------------------------------- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar-aranzazu .nav-link');
  if (!sections.length || !navLinks.length) return;

 const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { 
  threshold: 0,
  rootMargin: '-30% 0px -60% 0px'
});

  sections.forEach(section => observer.observe(section));
})();
/* -----------------------------------------------
   EASTER EGG: Gato aleatorio al presionar Konami Code
   ↑ ↑ ↓ ↓ ← → ← → B A
   ----------------------------------------------- */
(function initKonamiCat() {
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let progress = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konami[progress]) {
      progress++;
      if (progress === konami.length) {
        progress = 0;
        fetchCat();
      }
    } else {
      progress = 0;
    }
  });

  function fetchCat() {
    fetch('https://api.thecatapi.com/v1/images/search')
      .then(res => res.json())
      .then(data => {
        const url = data[0].url;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed; inset: 0; background: rgba(0,0,0,0.75);
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; z-index: 9999; cursor: pointer;
        `;

        overlay.innerHTML = `
          <p style="color: #e8789a; font-size: 1.5rem; margin-bottom: 1rem; font-family: 'Playfair Display', serif;">
            ᓚ₍ ^. .^₎ encontraste el gato secreto ✦
          </p>
          <img src="${url}" style="max-width: 80vw; max-height: 70vh; border-radius: 1rem; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
          <p style="color: rgba(255,255,255,0.5); font-size: 0.8rem; margin-top: 1rem;">
            clic para cerrar
          </p>
        `;

        overlay.addEventListener('click', () => overlay.remove());
        document.body.appendChild(overlay);
      })
      .catch(() => {
        console.log('%cᓚ₍ x. .x₎ el gato no quiso aparecer...', 'color: hotpink');
      });
  }
})();


/* ==========================================================================
   VASANTH KUMAR PORTFOLIO — script.js  (solid & smooth)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
   * SCROLL PROGRESS BAR
   * -------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    if (progressBar) progressBar.style.width = `${Math.min(pct, 100)}%`;
  }, { passive: true });


  /* --------------------------------------------------------
   * SIDEBAR TOGGLE  (mobile)
   * -------------------------------------------------------- */
  const sidebar        = document.getElementById('sidebar');
  const sidebarToggle  = document.getElementById('sidebar-toggle');
  const sidebarClose   = document.getElementById('sidebar-close');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  const openSidebar = () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeSidebar = () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  sidebarToggle  ?.addEventListener('click', openSidebar);
  sidebarClose   ?.addEventListener('click', closeSidebar);
  sidebarOverlay ?.addEventListener('click', closeSidebar);


  /* --------------------------------------------------------
   * ANIMATED STAT COUNTERS
   * -------------------------------------------------------- */
  function animateCounter(el, target, suffix = '') {
    const duration = 1400;
    const start    = performance.now();
    const isFloat  = String(target).includes('.');

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = isFloat
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const countersRan = new Set();
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        if (countersRan.has(bar)) return;
        countersRan.add(bar);

        bar.querySelectorAll('.stat-num').forEach(el => {
          const raw    = el.textContent.trim();
          const suffix = raw.replace(/[\d.]/g, '');
          const num    = parseFloat(raw.replace(/[^\d.]/g, '')) || 0;
          el.textContent = '0' + suffix;
          setTimeout(() => animateCounter(el, num, suffix), 200);
        });
        statsObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  document.querySelector('.stats-bar') && statsObserver.observe(document.querySelector('.stats-bar'));


  /* --------------------------------------------------------
   * SVG CIRCULAR RINGS  (r = 24 → circumference ≈ 150.796)
   * -------------------------------------------------------- */
  const CIRC = 2 * Math.PI * 24;

  function animateRings() {
    document.querySelectorAll('.ring-fill').forEach((circle, i) => {
      const pct    = parseFloat(circle.getAttribute('data-pct')) || 0;
      const offset = CIRC * (1 - pct / 100);
      setTimeout(() => {
        circle.style.strokeDashoffset = offset.toFixed(3);
      }, i * 180);
    });
  }
  // Always fire on desktop; observe for mobile
  setTimeout(animateRings, 300);

  const ringsEl = document.querySelector('.sidebar-rings');
  if (ringsEl) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { animateRings(); }
    }, { threshold: 0.1 }).observe(ringsEl);
  }


  /* --------------------------------------------------------
   * SIDEBAR SKILL BARS
   * -------------------------------------------------------- */
  function animateBars() {
    document.querySelectorAll('.bar-fill').forEach((bar, i) => {
      const w = bar.getAttribute('data-width') || '0';
      setTimeout(() => { bar.style.width = `${w}%`; }, 200 + i * 140);
    });
  }
  setTimeout(animateBars, 450);

  const barsEl = document.querySelector('.sidebar-bars');
  if (barsEl) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) animateBars();
    }, { threshold: 0.2 }).observe(barsEl);
  }


  /* --------------------------------------------------------
   * SERVICE CARDS — staggered reveal
   * -------------------------------------------------------- */
  const cards = document.querySelectorAll('.service-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const index = [...cards].indexOf(card);
        setTimeout(() => card.classList.add('visible'), index * 80);
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.12 });
  cards.forEach(c => cardObserver.observe(c));


  /* --------------------------------------------------------
   * SCROLL REVEAL  (hero text, section blocks, platform items…)
   * -------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.hero-text, .stats-bar, .services-section, ' +
    '.projects-section, .project-card, ' +
    '.dsa-section, .education-section, .contact-section, ' +
    '.edu-card, .platform-item'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s,
                           transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s`;
    revealObserver.observe(el);
  });


  /* --------------------------------------------------------
   * DSA TAG  — staggered hover delay
   * -------------------------------------------------------- */
  document.querySelectorAll('.dsa-tag').forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 0.025}s`;
    tag.addEventListener('mouseleave', () => { tag.style.transitionDelay = '0s'; });
  });


  /* --------------------------------------------------------
   * SMOOTH SCROLL (offset for fixed navbar)
   * -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeSidebar();
      setTimeout(() => {
        const top = target.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({ top, behavior: 'smooth' });
      }, window.innerWidth < 900 ? 320 : 0);
    });
  });


  /* --------------------------------------------------------
   * NAVBAR: scroll-darken + stagger entrance
   * -------------------------------------------------------- */
  const navbar   = document.querySelector('.top-navbar');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const pill     = document.getElementById('nav-pill');
  const desktopNav = document.getElementById('desktop-nav');

  // Darken navbar on scroll
  const onScroll = () => {
    navbar && navbar.classList.toggle('scrolled', window.scrollY > 12);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Staggered entrance animation for nav links
  navLinks.forEach((link, i) => {
    link.style.opacity  = '0';
    link.style.transform = 'translateY(-8px)';
    link.style.transition = `opacity 0.35s ease ${0.08 + i * 0.07}s,
                              transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.08 + i * 0.07}s,
                              color 0.22s ease, letter-spacing 0.22s ease`;
    setTimeout(() => {
      link.style.opacity   = '';
      link.style.transform = '';
    }, 60 + i * 70);
  });


  /* --------------------------------------------------------
   * SLIDING PILL — follows hover, locks on active
   * -------------------------------------------------------- */
  const movePill = (el) => {
    if (!pill || !desktopNav || !el) return;
    const navRect  = desktopNav.getBoundingClientRect();
    const elRect   = el.getBoundingClientRect();
    pill.style.left    = (elRect.left - navRect.left) + 'px';
    pill.style.width   = elRect.width + 'px';
    pill.style.opacity = '1';
  };

  const hidePill = () => {
    // Only hide if no active link is hovered
    const active = document.querySelector('.nav-link-item.active');
    if (active) movePill(active);
    else if (pill) pill.style.opacity = '0';
  };

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => movePill(link));
    link.addEventListener('mouseleave', hidePill);
  });


  /* --------------------------------------------------------
   * ACTIVE SECTION HIGHLIGHT + pill lock
   * -------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], div[id="hero"]');

  const updateActiveLink = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY + 90 >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
    });
    // Lock pill on active link
    const activeLink = document.querySelector('.nav-link-item.active');
    if (activeLink) movePill(activeLink);
    else if (pill) pill.style.opacity = '0';
  };

  updateActiveLink();


  /* --------------------------------------------------------
   * RIPPLE CLICK EFFECT on nav links
   * -------------------------------------------------------- */
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const r  = document.createElement('span');
      const sz = Math.max(link.offsetWidth, link.offsetHeight) * 1.5;
      r.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${sz}px; height:${sz}px;
        left:${e.offsetX - sz/2}px; top:${e.offsetY - sz/2}px;
        background:rgba(250,189,0,0.18);
        transform:scale(0); animation:ripple 0.5s ease-out forwards;
      `;
      link.appendChild(r);
      setTimeout(() => r.remove(), 550);
    });
  });

});

/**
 * ABHINAV.DEV — Futuristic Cybernetic Portfolio Client Logic
 * Implements interactive particles, dynamic data loading, audio synthesizer,
 * terminal emulator, and seamless backend API communication.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Synthesizer (Web Audio API)
  const soundSystem = {
    enabled: true,
    ctx: null,

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    },

    playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    },

    beep() { this.playTone(880, 'sine', 0.06, 0.04); },
    click() { this.playTone(420, 'triangle', 0.04, 0.03); },
    submit() {
      this.playTone(523.25, 'sine', 0.1, 0.05);
      setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.05), 80);
      setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.06), 160);
    },
    error() {
      this.playTone(220, 'sawtooth', 0.15, 0.05);
      setTimeout(() => this.playTone(180, 'sawtooth', 0.2, 0.05), 100);
    }
  };

  // Sound toggle button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundSystem.enabled = !soundSystem.enabled;
      soundToggleBtn.classList.toggle('active', soundSystem.enabled);
      const icon = soundToggleBtn.querySelector('.sound-icon');
      if (icon) {
        icon.textContent = soundSystem.enabled ? '🔊' : '🔇';
      }
      if (soundSystem.enabled) soundSystem.beep();
    });
  }

  // Bind subtle sounds to buttons, pills and nav items
  document.querySelectorAll('button, .nav-link, .filter-btn, .cmd-chip, .btn-motion-primary, .btn-motion-ghost, .studio-badge-item, .studio-quick-pill, .nav-motion-btn, .studio-pill-badge, .hero-avatar-frame, .education-card').forEach(el => {
    el.addEventListener('mouseenter', () => soundSystem.beep());
    el.addEventListener('click', () => soundSystem.click());
  });

  // Dynamic 3D Perspective Tilt on Studio Hero Container
  const heroContainer = document.querySelector('.studio-hero-container');
  if (heroContainer) {
    heroContainer.style.transition = 'transform 0.15s ease-out';
    window.addEventListener('mousemove', (e) => {
      if (window.scrollY > window.innerHeight) return;
      const xRot = (e.clientX / window.innerWidth - 0.5) * 6;
      const yRot = (e.clientY / window.innerHeight - 0.5) * -5;
      heroContainer.style.transform = `perspective(1200px) rotateY(${xRot.toFixed(2)}deg) rotateX(${yRot.toFixed(2)}deg)`;
    });
    window.addEventListener('mouseleave', () => {
      heroContainer.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // 2. Cinematic 3D Neon Motion Ribbon & Infinity Energy Stream (MotionVerse Style)
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - width / 2) / (width / 2);
      mouseY = (e.clientY - height / 2) / (height / 2);
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
    });

    // Ambient floating embers & dust
    const emberCount = Math.min(width < 768 ? 25 : 55, 60);
    const embers = [];
    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.6 - 0.15,
        color: Math.random() > 0.5 ? 'rgba(217, 70, 239, ' : 'rgba(0, 242, 254, ',
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * 0.02 + 0.005
      });
    }

    // Energy photon pulses traveling along the 3D infinity loops
    const photons = [];
    const photonCount = 18;
    for (let i = 0; i < photonCount; i++) {
      photons.push({
        t: (i / photonCount) * Math.PI * 2,
        speed: 0.006 + Math.random() * 0.004,
        strandIdx: Math.floor(Math.random() * 8),
        size: Math.random() * 2.5 + 2
      });
    }

    let globalTime = 0;

    function renderMotionVerseScene() {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;
      globalTime += 0.015;

      const centerX = width / 2;
      // Position the 3D ribbon right behind the hero title
      const centerY = height < 700 ? height * 0.42 : height * 0.45;
      const baseScale = Math.min(width * 0.36, 420);

      // 1. Draw 3D Infinity Ribbons / Light Strands
      const strands = 10;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let s = 0; s < strands; s++) {
        const strandOffset = (s - strands / 2) * 0.07;
        const radiusNoise = Math.sin(globalTime * 0.8 + s) * 12;

        ctx.beginPath();
        const steps = 120;
        let firstPoint = true;

        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2;
          
          // Lemniscate of Bernoulli parametric infinity formula
          const denom = 1 + Math.sin(t) * Math.sin(t);
          let x = (baseScale * Math.cos(t)) / denom;
          let y = (baseScale * Math.sin(t) * Math.cos(t) * 1.55) / denom;
          let z = Math.sin(t * 2 + globalTime + strandOffset) * 90;

          // Add strand wave harmonics
          x += Math.sin(t * 3 + globalTime + s * 0.4) * (8 + radiusNoise * 0.3);
          y += Math.cos(t * 4 + globalTime + s * 0.3) * (10 + radiusNoise * 0.4);

          // 3D Rotation with mouse parallax + continuous gentle roll
          const rotY = currentRotY + Math.sin(globalTime * 0.3) * 0.12;
          const rotX = currentRotX + Math.cos(globalTime * 0.25) * 0.08;

          // Rotate around Y
          let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
          let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);

          // Rotate around X
          let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
          let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

          // Perspective projection
          const fov = 750;
          const perspective = fov / (fov + z2);
          const screenX = centerX + x1 * perspective;
          const screenY = centerY + y2 * perspective;

          if (firstPoint) {
            ctx.moveTo(screenX, screenY);
            firstPoint = false;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        // Dual Neon Gradient: Magenta/Pink on left, Electric Cyan/Teal on right
        const ribbonGrad = ctx.createLinearGradient(centerX - baseScale, centerY, centerX + baseScale, centerY);
        ribbonGrad.addColorStop(0, 'rgba(255, 26, 75, 0.7)');
        ribbonGrad.addColorStop(0.25, 'rgba(217, 70, 239, 0.85)');
        ribbonGrad.addColorStop(0.5, 'rgba(176, 38, 255, 0.75)');
        ribbonGrad.addColorStop(0.75, 'rgba(0, 242, 254, 0.85)');
        ribbonGrad.addColorStop(1, 'rgba(34, 211, 238, 0.7)');

        ctx.strokeStyle = ribbonGrad;
        ctx.lineWidth = s === Math.floor(strands / 2) ? 2.5 : 1.2;
        ctx.shadowBlur = s % 2 === 0 ? 20 : 10;
        ctx.shadowColor = s % 2 === 0 ? 'rgba(217, 70, 239, 0.8)' : 'rgba(0, 242, 254, 0.8)';
        ctx.stroke();
      }

      // 2. Draw Moving Energy Photon Pulses
      photons.forEach(p => {
        p.t += p.speed;
        if (p.t > Math.PI * 2) p.t -= Math.PI * 2;

        const t = p.t;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        let x = (baseScale * Math.cos(t)) / denom;
        let y = (baseScale * Math.sin(t) * Math.cos(t) * 1.55) / denom;
        let z = Math.sin(t * 2 + globalTime) * 90;

        const rotY = currentRotY + Math.sin(globalTime * 0.3) * 0.12;
        const rotX = currentRotX + Math.cos(globalTime * 0.25) * 0.08;

        let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
        let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        const fov = 750;
        const perspective = fov / (fov + z2);
        const screenX = centerX + x1 * perspective;
        const screenY = centerY + y2 * perspective;

        const isLeft = x1 < 0;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size * perspective, 0, Math.PI * 2);
        ctx.fillStyle = isLeft ? '#ff70ea' : '#70f3ff';
        ctx.shadowBlur = 18;
        ctx.shadowColor = isLeft ? '#d946ef' : '#00f2fe';
        ctx.fill();
      });

      ctx.restore();

      // 3. Draw Ambient Floating Embers
      embers.forEach(e => {
        e.x += e.speedX;
        e.y += e.speedY;
        e.opacity += Math.sin(Date.now() * e.pulse) * 0.01;

        if (e.y < 0) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }
        if (e.x < 0) e.x = width;
        if (e.x > width) e.x = 0;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = e.color + Math.max(0.1, Math.min(0.8, e.opacity)) + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = e.color + '0.7)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(renderMotionVerseScene);
    }
    renderMotionVerseScene();
  }

  // 3. Navbar Scrollspy & Mobile Navigation
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic 3D Infinity Ribbon scroll-fade: brilliant in hero, subtle ambient behind roadmap
    if (canvas) {
      const heroHeight = window.innerHeight * 0.9;
      const heroFade = Math.max(0.12, 0.92 - (scrollY / heroHeight) * 0.75);
      canvas.style.opacity = heroFade.toFixed(2);
    }

    let current = '';
    const scrollPos = scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
      });
    });
  }

  // 4. Hero Dynamic Typewriter Effect
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const roles = [
      "Aspiring AI & Software Engineer",
      "Autonomous AI & LLM Systems",
      "Scalable Cloud & Azure Architectures",
      "High-Performance Full-Stack Systems",
      "Competitive Algorithms & Machine Learning"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 80;

    function tick() {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        typewriterText.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeDelay = 40;
      } else {
        typewriterText.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeDelay = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeDelay = 2000; // Pause at full word
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeDelay = 400;
      }

      setTimeout(tick, typeDelay);
    }
    setTimeout(tick, 1000);
  }

  // 5. Hologram Card 3D Tilt Effect
  const holoCard = document.querySelector('.holo-card');
  if (holoCard) {
    holoCard.addEventListener('mousemove', (e) => {
      const rect = holoCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;
      holoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    holoCard.addEventListener('mouseleave', () => {
      holoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // 6. Stats Count-Up Animation (Matching Image 4)
  const statsElements = document.querySelectorAll('.stat-strip-number');
  let statsAnimated = false;

  function runStatsAnimation() {
    if (statsAnimated) return;
    statsElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || el.innerText, 10);
      const isPadded = el.getAttribute('data-pad') === 'true';
      let start = 0;
      const duration = 1500;
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * target);
        el.innerText = isPadded ? String(current).padStart(2, '0') : current;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.innerText = isPadded ? String(target).padStart(2, '0') : target;
        }
      }
      requestAnimationFrame(updateNumber);
    });
    statsAnimated = true;
  }

  // Trigger on scroll into view
  const statsStrip = document.querySelector('.stats-strip-section');
  if (statsStrip) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runStatsAnimation();
      }
    }, { threshold: 0.3 });
    observer.observe(statsStrip);
  }

  // 7. Academic Roadmap: In-Place Horizontal Scroll on Wheel Down-Scroll
  const roadmapSection = document.getElementById('roadmap');
  const roadmapCardsWrapper = document.getElementById('roadmap-cards-wrapper');
  const roadmapProgressBar = document.getElementById('roadmap-progress-bar');
  const roadmapCurrentSem = document.getElementById('roadmap-current-sem');
  const roadmapSemCounter = document.getElementById('roadmap-sem-counter');
  const semesterCards = document.querySelectorAll('.semester-card');
  const viewTimelineBtn = document.getElementById('view-timeline-btn');
  const viewGridBtn = document.getElementById('view-grid-btn');
  const roadmapPrevBtn = document.getElementById('roadmap-prev-btn');
  const roadmapNextBtn = document.getElementById('roadmap-next-btn');

  const semesterMeta = [
    { num: '01', title: 'Foundations', credits: '24 Credits' },
    { num: '02', title: 'Python & DSA', credits: '25 Credits' },
    { num: '03', title: 'Core CS & AI Math', credits: '25 Credits' },
    { num: '04', title: 'AI Architecture & Cloud', credits: '24 Credits' },
    { num: '05', title: 'Deep Learning & Big Data', credits: '23 Credits' },
    { num: '06', title: 'GenAI & Distributed AI', credits: '24 Credits' },
    { num: '07', title: 'Industrial Capstone & Security', credits: '12 Credits' },
    { num: '08', title: 'Industry & Graduation', credits: '13 Credits' }
  ];

  let isRoadmapGrid = false;

  function updateRoadmapScrubberUI() {
    if (!roadmapCardsWrapper || isRoadmapGrid) return;

    const maxScroll = roadmapCardsWrapper.scrollWidth - roadmapCardsWrapper.clientWidth;
    const progress = maxScroll > 0 ? Math.max(0, Math.min(1, roadmapCardsWrapper.scrollLeft / maxScroll)) : 0;

    // Update Progress Bar
    if (roadmapProgressBar) {
      const barPct = Math.max(12.5, progress * 100);
      roadmapProgressBar.style.width = `${barPct.toFixed(1)}%`;
    }

    // Determine currently active card
    const activeIndex = Math.min(7, Math.floor(progress * 7.99));

    if (roadmapCurrentSem && semesterMeta[activeIndex]) {
      const cur = semesterMeta[activeIndex];
      roadmapCurrentSem.innerHTML = `PROGRESSION: <span style="color: var(--neon-cyan)">SEMESTER ${cur.num}</span> // ${cur.title} <span style="opacity: 0.6; margin-left: 8px;">(${cur.credits})</span>`;
    }

    if (roadmapSemCounter && semesterMeta[activeIndex]) {
      roadmapSemCounter.textContent = `${semesterMeta[activeIndex].num} / 08 SEMESTERS`;
    }

    semesterCards.forEach((card, idx) => {
      if (idx === activeIndex) {
        card.classList.add('active-pinned-sem');
      } else {
        card.classList.remove('active-pinned-sem');
      }
    });
  }

  // Smooth wheel hijacking right at roadmap section ONLY WHEN FULLY IN VIEW:
  // 1. User scrolls down until the roadmap section is FULLY on screen (top aligned with navbar).
  // 2. Once FULL on screen, down-scroll scrubs through all 8 semesters horizontally.
  // 3. Once all 8 semesters have been viewed, normal vertical down-scroll smoothly resumes into Azure Certifications!
  if (roadmapSection && roadmapCardsWrapper) {
    let isAutoAligning = false;

    roadmapSection.addEventListener('wheel', (e) => {
      if (isRoadmapGrid) return; // In grid view, normal scroll

      const maxScroll = roadmapCardsWrapper.scrollWidth - roadmapCardsWrapper.clientWidth;
      if (maxScroll <= 0) return;

      const rect = roadmapSection.getBoundingClientRect();
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 72;
      const currentScroll = roadmapCardsWrapper.scrollLeft;

      // Scrolling Down
      if (e.deltaY > 0) {
        // If the roadmap section is NOT yet fully in view (still coming up from the bottom):
        // Allow the page to scroll vertically until the section is fully in view!
        if (rect.top > navbarHeight + 20) {
          if (rect.top < window.innerHeight * 0.75 && !isAutoAligning) {
            isAutoAligning = true;
            window.scrollTo({
              top: window.scrollY + rect.top - navbarHeight,
              behavior: 'smooth'
            });
            setTimeout(() => { isAutoAligning = false; }, 350);
          }
          return; // Let vertical window scroll down!
        }

        // Section is now FULLY in view!
        // Scroll through all 8 semesters horizontally:
        if (currentScroll < maxScroll - 6) {
          e.preventDefault();
          roadmapCardsWrapper.scrollLeft += e.deltaY * 1.15;
          updateRoadmapScrubberUI();
        }
        // Once all 8 semesters are scrolled through:
        // Do NOT preventDefault! Let the page continue scrolling DOWN into Azure!
      }
      // Scrolling Up
      else if (e.deltaY < 0) {
        // If the roadmap section is scrolled above the screen:
        // Allow the page to scroll up until the section is fully aligned in view!
        if (rect.top < navbarHeight - 30) {
          if (rect.top > -window.innerHeight * 0.4 && !isAutoAligning) {
            isAutoAligning = true;
            window.scrollTo({
              top: window.scrollY + rect.top - navbarHeight,
              behavior: 'smooth'
            });
            setTimeout(() => { isAutoAligning = false; }, 350);
          }
          return; // Let vertical window scroll up!
        }

        // Section is FULLY in view!
        // Scroll backwards through the semesters:
        if (currentScroll > 6) {
          e.preventDefault();
          roadmapCardsWrapper.scrollLeft += e.deltaY * 1.15;
          updateRoadmapScrubberUI();
        }
        // Once back at Semester 01:
        // Do NOT preventDefault! Let the page continue scrolling UP into Education!
      }
    }, { passive: false });

    // Track scroll events from mouse, trackpad, drag or touch
    roadmapCardsWrapper.addEventListener('scroll', updateRoadmapScrubberUI, { passive: true });
    window.addEventListener('resize', updateRoadmapScrubberUI, { passive: true });
    setTimeout(updateRoadmapScrubberUI, 150);
  }

  // Prev / Next arrow buttons
  if (roadmapPrevBtn && roadmapCardsWrapper) {
    roadmapPrevBtn.addEventListener('click', () => {
      roadmapCardsWrapper.scrollBy({ left: -320, behavior: 'smooth' });
      soundSystem.click();
    });
  }

  if (roadmapNextBtn && roadmapCardsWrapper) {
    roadmapNextBtn.addEventListener('click', () => {
      roadmapCardsWrapper.scrollBy({ left: 320, behavior: 'smooth' });
      soundSystem.click();
    });
  }

  // View toggle buttons
  if (viewTimelineBtn && viewGridBtn && roadmapCardsWrapper) {
    viewTimelineBtn.addEventListener('click', () => {
      isRoadmapGrid = false;
      viewTimelineBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      roadmapCardsWrapper.classList.remove('grid-layout');
      updateRoadmapScrubberUI();
      soundSystem.click();
    });

    viewGridBtn.addEventListener('click', () => {
      isRoadmapGrid = true;
      viewGridBtn.classList.add('active');
      viewTimelineBtn.classList.remove('active');
      roadmapCardsWrapper.classList.add('grid-layout');
      if (roadmapProgressBar) roadmapProgressBar.style.width = '100%';
      if (roadmapCurrentSem) roadmapCurrentSem.innerHTML = `VIEW: <span style="color: var(--neon-cyan)">COMPLETE 8-SEMESTER MATRIX</span> // Microsoft AI/ML Track`;
      if (roadmapSemCounter) roadmapSemCounter.textContent = `ALL 8 SEMESTERS`;
      semesterCards.forEach(c => c.classList.remove('active-pinned-sem'));
      soundSystem.click();
    });
  }

  // Semester Deep-Dive Modal
  const modalOverlay = document.getElementById('global-modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openModal(title, htmlContent) {
    if (modalTitle && modalContent && modalOverlay) {
      modalTitle.innerHTML = title;
      modalContent.innerHTML = htmlContent;
      modalOverlay.classList.add('active');
      soundSystem.click();
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      soundSystem.click();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Bind click to semester cards for detailed course syllabus review
  document.querySelectorAll('.semester-card').forEach(card => {
    card.addEventListener('click', () => {
      const semTag = card.querySelector('.semester-tag')?.innerText || 'SEMESTER';
      const semTitle = card.querySelector('.semester-main-title')?.innerText || '';
      const semCredits = card.querySelector('.semester-credits-pill')?.innerText || '';
      const semDates = card.querySelector('.semester-date-range')?.innerText || '';
      const courses = Array.from(card.querySelectorAll('.course-item')).map(c => c.innerText.trim());

      const contentHtml = `
        <div style="margin-bottom: 20px;">
          <div style="font-family: var(--font-mono); color: var(--neon-orange); font-size: 0.8rem; margin-bottom: 4px;">TIMEFRAME: ${semDates}</div>
          <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 8px;">${semTitle}</h2>
          <div style="display: inline-block; background: rgba(255, 42, 75, 0.15); border: 1px solid var(--neon-red); color: var(--neon-red); font-family: var(--font-mono); font-size: 0.8rem; padding: 4px 12px; border-radius: 4px;">
            CREDIT WEIGHT: ${semCredits}
          </div>
        </div>
        <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.95rem;">
          Official Microsoft academic track specialization unit covering theoretical principles, architecture, practical labs, and production-level project execution.
        </p>
        <h4 style="font-family: var(--font-mono); color: var(--text-highlight); font-size: 0.85rem; letter-spacing: 0.1em; margin-bottom: 12px;">CURRICULUM MODULES & PRACTICALS:</h4>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 24px;">
          ${courses.map(course => `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--neon-red); box-shadow: 0 0 8px var(--neon-red);"></span>
              <span style="color: #fff; font-size: 0.9rem;">${course}</span>
            </div>
          `).join('')}
        </div>
        <div style="background: rgba(5, 255, 161, 0.06); border: 1px solid rgba(5, 255, 161, 0.2); border-radius: 8px; padding: 14px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-emerald);">
          ✓ Status: Verified Course Module Progression | Microsoft AI/ML Track
        </div>
      `;

      openModal(`${semTag} // ${semTitle}`, contentHtml);
    });
  });

  // 8. Projects Filter
  const projectFilterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 9. Cyber Terminal Emulation
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalBody = document.getElementById('terminal-body');

  function appendTerminalLine(text, status = '') {
    if (!terminalHistory) return;
    const div = document.createElement('div');
    div.className = `term-line-output ${status}`;
    div.textContent = text;
    terminalHistory.appendChild(div);
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  async function handleTerminalCommand(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Show command entered
    appendTerminalLine(`guest@abhinav:~$ ${trimmed}`);

    if (trimmed.toLowerCase() === 'clear') {
      terminalHistory.innerHTML = '';
      return;
    }

    if (trimmed.toLowerCase() === 'matrix') {
      appendTerminalLine('INITIALIZING NEURAL STREAM MATRIX OVERRIDE...', 'SUCCESS');
      const prevOpacity = canvas.style.opacity;
      canvas.style.opacity = '1';
      setTimeout(() => { canvas.style.opacity = prevOpacity || '0.65'; }, 4000);
      return;
    }

    // Call backend API
    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed })
      });
      const data = await res.json();
      appendTerminalLine(data.output, data.status);
      soundSystem.beep();
    } catch (err) {
      appendTerminalLine(`Terminal Error: Unable to query core [${err.message}]`, 'WARN');
      soundSystem.error();
    }
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        handleTerminalCommand(val);
      }
    });
  }

  // Quick Command Chips
  document.querySelectorAll('.cmd-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) handleTerminalCommand(cmd);
    });
  });

  // 10. Contact Form Submission (Real Backend POST with SQLite)
  const contactForm = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  const formAlert = document.getElementById('form-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      soundSystem.click();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const category = document.getElementById('contact-category').value;
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showAlert('Please fill in all mandatory neural transmission coordinates (Name, Email, Message).', 'error');
        soundSystem.error();
        return;
      }

      // Disable button during transmission
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = '<span>⚡ ENCRYPTING & TRANSMITTING...</span>';
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, category, subject, message })
        });

        const result = await res.json();

        if (res.ok && result.success) {
          showAlert('TRANSMISSION CONFIRMED! Your dispatch has been permanently recorded in SQLite neural storage. Abhinav will respond shortly.', 'success');
          contactForm.reset();
          soundSystem.submit();
        } else {
          showAlert(`Transmission Error: ${result.error || 'Failed to dispatch packet'}`, 'error');
          soundSystem.error();
        }
      } catch (err) {
        showAlert(`Neural Relay Offline: ${err.message}. Please check connection.`, 'error');
        soundSystem.error();
      } finally {
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.innerHTML = '<span>TRANSMIT DISPATCH</span> <span style="font-size: 1.1rem;">⚡</span>';
        }
      }
    });
  }

  function showAlert(msg, type) {
    if (!formAlert) return;
    formAlert.textContent = msg;
    formAlert.className = `form-alert-banner ${type}`;
    formAlert.style.display = 'block';
    setTimeout(() => {
      if (type === 'success') formAlert.style.display = 'none';
    }, 8000);
  }

  // 11. Admin / SQLite Inbox Viewer Modal
  const inboxBtn = document.getElementById('admin-inbox-btn');
  if (inboxBtn) {
    inboxBtn.addEventListener('click', async () => {
      soundSystem.click();
      try {
        const res = await fetch('/api/contact');
        const data = await res.json();
        const messages = data.messages || [];

        let html = `
          <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: var(--font-mono); color: var(--neon-emerald); font-size: 0.85rem;">
              ● DATABASE: portfolio.db (SQLite) — Total Entries: ${data.total}
            </span>
          </div>
        `;

        if (messages.length === 0) {
          html += `<div style="text-align: center; color: var(--text-dim); padding: 40px 0; font-family: var(--font-mono);">NO TRANSMISSIONS LOGGED YET. SUBMIT A MESSAGE VIA THE CONTACT FORM!</div>`;
        } else {
          html += `<div style="display: flex; flex-direction: column; gap: 14px;">`;
          messages.forEach(msg => {
            html += `
              <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; position: relative;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <strong style="color: #fff; font-size: 0.95rem;">${escapeHtml(msg.name)}</strong>
                  <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--neon-red);">${escapeHtml(msg.category || 'General')}</span>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
                  From: ${escapeHtml(msg.email)} | Subject: ${escapeHtml(msg.subject || 'N/A')} | ${new Date(msg.created_at).toLocaleString()}
                </div>
                <p style="color: #e2e6f0; font-size: 0.88rem; line-height: 1.5; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 6px;">
                  ${escapeHtml(msg.message)}
                </p>
                <div style="margin-top: 10px; text-align: right;">
                  <button class="delete-msg-btn" data-id="${msg.id}" style="background: none; border: 1px solid rgba(255,42,75,0.4); color: var(--neon-red); font-family: var(--font-mono); font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; cursor: pointer;">
                    Purge Record
                  </button>
                </div>
              </div>
            `;
          });
          html += `</div>`;
        }

        openModal('SQLITE NEURAL INBOX // LIVE ARCHIVE', html);

        // Bind delete action
        document.querySelectorAll('.delete-msg-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            await fetch(`/api/contact/${id}`, { method: 'DELETE' });
            soundSystem.click();
            inboxBtn.click(); // Refresh modal
          });
        });
      } catch (e) {
        openModal('INBOX ERROR', `<p style="color: var(--neon-red);">Failed to retrieve SQLite database records: ${e.message}</p>`);
      }
    });
  }

  // 12. SCROLL REVEAL & STAGGER ANIMATION SYSTEM (AOS ENGINE)
  function initScrollAnimations() {
    // A. Section Headers
    document.querySelectorAll('.section-wrapper').forEach(sec => {
      const indicator = sec.querySelector('.section-indicator');
      const heading = sec.querySelector('.section-heading-large');
      const subheading = sec.querySelector('.section-subheading');
      if (indicator) indicator.classList.add('scroll-reveal');
      if (heading) heading.classList.add('scroll-reveal', 'stagger-1');
      if (subheading) subheading.classList.add('scroll-reveal', 'stagger-2');
    });

    // B. Stats Strip
    const statsStrip = document.getElementById('stats-strip');
    if (statsStrip) {
      statsStrip.classList.add('scroll-reveal');
      statsStrip.querySelectorAll('.stat-strip-col').forEach((col, idx) => {
        col.classList.add('scroll-reveal', `stagger-${idx + 1}`);
      });
    }

    // C. Education Cards (Left & Right Entrance)
    const eduCards = document.querySelectorAll('.education-card');
    if (eduCards.length >= 2) {
      eduCards[0].classList.add('scroll-reveal-left');
      eduCards[1].classList.add('scroll-reveal-right', 'stagger-2');
    } else {
      eduCards.forEach(c => c.classList.add('scroll-reveal'));
    }

    // D. Technical Expertise Cards & Animated Progress Bars
    document.querySelectorAll('.expertise-card').forEach((card, idx) => {
      card.classList.add('scroll-reveal', `stagger-${idx + 1}`);
      card.querySelectorAll('.skill-progress-fill').forEach(bar => {
        const targetW = bar.style.width || '85%';
        bar.style.setProperty('--target-width', targetW);
      });
    });

    // E. 8-Semester Roadmap Cards
    document.querySelectorAll('.semester-card').forEach((card, idx) => {
      card.classList.add('scroll-reveal', `stagger-${(idx % 4) + 1}`);
    });
    const roadmapSection = document.getElementById('roadmap');
    if (roadmapSection) {
      const roadObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          document.querySelectorAll('.semester-card').forEach(c => c.classList.add('revealed'));
        }
      }, { threshold: 0.05 });
      roadObserver.observe(roadmapSection);
    }
    const roadmapBadge = document.querySelector('.credits-capsule-badge');
    if (roadmapBadge) roadmapBadge.classList.add('scroll-reveal-scale', 'stagger-1');

    // F. Azure Certification Cards
    document.querySelectorAll('.cert-card').forEach((card, idx) => {
      card.classList.add('scroll-reveal', `stagger-${(idx % 3) + 1}`);
    });

    // G. Active Engineering Laboratory
    document.querySelectorAll('.pipeline-stage-card').forEach((card, idx) => {
      card.classList.add('scroll-reveal', `stagger-${idx + 1}`);
    });
    const labShowcase = document.querySelector('.lab-repo-showcase');
    if (labShowcase) labShowcase.classList.add('scroll-reveal', 'stagger-2');

    // H. Terminal Window
    const termWindow = document.querySelector('.terminal-window');
    if (termWindow) termWindow.classList.add('scroll-reveal-scale');

    // I. Contact Portal
    const contactChannels = document.querySelector('.contact-channels');
    const contactFormCard = document.querySelector('.contact-form-card');
    if (contactChannels) contactChannels.classList.add('scroll-reveal-left');
    if (contactFormCard) contactFormCard.classList.add('scroll-reveal-right', 'stagger-2');

    // Setup Observer
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    let statsCounted = false;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Trigger stats strip counting
          if (!statsCounted && (entry.target.classList.contains('stat-strip-col') || entry.target.id === 'stats-strip')) {
            statsCounted = true;
            animateStatCounters();
          }

          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        el.classList.add('revealed');
      } else {
        observer.observe(el);
      }
    });
  }

  // Rolling Numeric Counter Animation for Stats Strip
  function animateStatCounters() {
    const statNums = document.querySelectorAll('.stat-strip-number');
    statNums.forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || el.textContent.trim(), 10);
      const isPadded = el.getAttribute('data-pad') === 'true' || target < 10;
      const duration = 1200;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * target);

        el.textContent = isPadded && current < 10 ? `0${current}` : `${current}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = isPadded && target < 10 ? `0${target}` : `${target}`;
        }
      }

      requestAnimationFrame(update);
    });
  }

  initScrollAnimations();

  // 13. INTERACTIVE CYBER VFX SPARK ENGINE & SPOTLIGHT TRACKING
  const sparkColors = ['#00f2fe', '#ff1a4b', '#b026ff', '#05ffa1', '#ffffff'];

  window.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

    const count = 12;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-spark-particle';
      const size = Math.random() * 5 + 3;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      spark.style.backgroundColor = color;
      spark.style.color = color;

      document.body.appendChild(spark);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 60 + 25;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      spark.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${vx}px, ${vy + 20}px) scale(0)`, opacity: 0 }
      ], {
        duration: Math.random() * 300 + 400,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }).onfinish = () => spark.remove();
    }
  });

  // Dynamic Spotlight Glare tracking across all cards
  document.querySelectorAll('.education-card, .expertise-card, .semester-card, .cert-card, .workbench-track-box, .stat-strip-col, .coming-soon-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});


(function() {
  const canvas = document.getElementById('spatial-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  // Light Palette: University of Padua Indigo (#4051b5), Soft indigo (#5c6bc0), Amber (#f09228)
  const colorsLight = [
    'rgba(64, 81, 181, ',  // Indigo
    'rgba(92, 107, 192, ', // Soft indigo
    'rgba(240, 146, 40, ', // Amber
  ];

  // Dark Palette: Bright Indigo (#818cf8), Soft Lavender (#a5b4fc), Warm Amber (#fb923c)
  const colorsDark = [
    'rgba(129, 140, 248, ', // Electric Indigo
    'rgba(165, 180, 252, ', // Soft Lavender
    'rgba(251, 146, 60, ',  // Amber
  ];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseRadius = Math.random() * 2 + 1.2;
      this.radius = this.baseRadius;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.colorIndex = Math.floor(Math.random() * 3);
      this.alpha = Math.random() * 0.35 + 0.35;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around boundaries
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;

      // Mouse repulsion and interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 3.5;
          this.y -= Math.sin(angle) * force * 3.5;
          this.radius = this.baseRadius * (1 + force * 0.8);
        } else {
          this.radius = this.baseRadius;
        }
      }

      // Drone rotor downwash interaction (from js/drone.js)
      if (window.droneState && window.droneState.active) {
        const ddx = window.droneState.x - this.x;
        const ddy = window.droneState.y - this.y;
        const dDist = Math.hypot(ddx, ddy);
        const downwashRadius = 80;

        if (dDist < downwashRadius && dDist > 0.01) {
          const force = (downwashRadius - dDist) / downwashRadius;
          const angle = Math.atan2(ddy, ddx);
          this.x -= Math.cos(angle) * force * 3.2;
          this.y -= Math.sin(angle) * force * 3.2;
        }
      }
    }

    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      const prefix = isDark ? colorsDark[this.colorIndex] : colorsLight[this.colorIndex];
      ctx.fillStyle = prefix + this.alpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 85);
    for (let i = 0; i < Math.max(count, 40); i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections(isDark) {
    const maxDist = 130;
    const pLen = particles.length;
    const strokeBase = isDark ? 'rgba(129, 140, 248, ' : 'rgba(64, 81, 181, ';

    for (let i = 0; i < pLen; i++) {
      const p1 = particles[i];

      // Connect to mouse when nearby
      if (mouse.x !== null && mouse.y !== null) {
        const mDist = Math.hypot(mouse.x - p1.x, mouse.y - p1.y);
        if (mDist < mouse.radius) {
          const lineAlpha = (1 - mDist / mouse.radius) * (isDark ? 0.55 : 0.45);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = strokeBase + lineAlpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect nearby particles to form a graph
      for (let j = i + 1; j < pLen; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * (isDark ? 0.30 : 0.22);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = strokeBase + lineAlpha + ')';
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }
  }

  let lastScrollY = window.pageYOffset || 0;
  window.addEventListener('scroll', function() {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Parallax depth: particles drift slightly on scroll
    for (let i = 0; i < particles.length; i++) {
      particles[i].y -= deltaY * 0.12;
    }
  }, { passive: true });

  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', function() {
    mouse.x = null;
    mouse.y = null;
  }, { passive: true });

  window.addEventListener('resize', resize);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.classList.contains('dark-mode');

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isDark);
    }
    drawConnections(isDark);

    requestAnimationFrame(animate);
  }

  resize();
  animate();
})();

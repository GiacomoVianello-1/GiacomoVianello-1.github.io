(function() {
  const canvas = document.getElementById('spatial-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  // Palette: University of Padua Indigo (#4051b5) and warm amber (#f09228)
  const colors = [
    'rgba(64, 81, 181, ',  // Indigo
    'rgba(92, 107, 192, ', // Soft indigo
    'rgba(240, 146, 40, ', // Amber
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
      this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
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
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.colorPrefix + this.alpha + ')';
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

  function drawConnections() {
    const maxDist = 130;
    const pLen = particles.length;

    for (let i = 0; i < pLen; i++) {
      const p1 = particles[i];

      // Connect to mouse when nearby
      if (mouse.x !== null && mouse.y !== null) {
        const mDist = Math.hypot(mouse.x - p1.x, mouse.y - p1.y);
        if (mDist < mouse.radius) {
          const lineAlpha = (1 - mDist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(64, 81, 181, ' + lineAlpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect nearby particles to form a graph
      for (let j = i + 1; j < pLen; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(64, 81, 181, ' + lineAlpha + ')';
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

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    drawConnections();

    requestAnimationFrame(animate);
  }

  resize();
  animate();
})();


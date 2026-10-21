/**
 * ============================================================================
 * Background Stylized Drone Controller
 * ============================================================================
 * Handles the animation, cinematich, trajectory, and frequency of the drone in the bg
 */

(function() {
  // ==========================================================================
  // DRONE CONFIGURATION DEL DRONE
  // ==========================================================================
  const DRONE_CONFIG = {
    size: 100, // Drone's dimension in pixels (width and height)

    // Appearance frequency (in millisecs)
    firstFlightDelayMs: 3500, // Time before 1st flight
    minIntervalMs: 25000,     // Min wait time between cosecutive flights
    maxIntervalMs: 45000,     // Max wait time between cosecutive flights
    flightDurationMs: 10000,  // Time to travel the screen

    // Max Opacity of the drone
    maxOpacityLight: 0.52,    // Light mode
    maxOpacityDark: 0.62,     // Dark mode

    // Trajectory mode:
    // 'diagonal'   -> attraversa in diagonale (dal basso verso l'alto)
    // 'horizontal' -> attraversa in orizzontale
    // 'vertical'   -> attraversa dritto dal basso verso l'alto
    // 'random'     -> sceglie casualmente una traiettoria diversa ad ogni volo
    trajectory: 'random',
  };

  // Stato condiviso con il canvas (spatial-mesh.js) per l'effetto downwash sui nodi
  window.droneState = {
    active: false,
    x: -200,
    y: -200,
  };

  const droneEl = document.getElementById('drone-container');
  if (!droneEl) return;

  // Applica le dimensioni configurate
  droneEl.style.width = DRONE_CONFIG.size + 'px';
  droneEl.style.height = DRONE_CONFIG.size + 'px';
  const halfSize = DRONE_CONFIG.size / 2;

  let drone = {
    active: false,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    startTime: 0,
    duration: 0,
    waveFreq: 2.5,
    waveAmp: 16,
  };

  function pickTrajectory(w, h, offset) {
    let mode = DRONE_CONFIG.trajectory;
    if (mode === 'random') {
      const modes = ['diagonal', 'horizontal', 'vertical'];
      mode = modes[Math.floor(Math.random() * modes.length)];
    }

    let startX, startY, targetX, targetY;

    if (mode === 'diagonal') {
      const fromLeft = Math.random() > 0.35;
      if (fromLeft) {
        startX = -offset;
        startY = h * (0.65 + Math.random() * 0.35); // parte dal basso a sinistra
        targetX = w + offset;
        targetY = h * (Math.random() * 0.35);        // esce in alto a destra
      } else {
        startX = w + offset;
        startY = h * (0.65 + Math.random() * 0.35); // parte dal basso a destra
        targetX = -offset;
        targetY = h * (Math.random() * 0.35);        // esce in alto a sinistra
      }
    } else if (mode === 'vertical') {
      startX = Math.random() * (w * 0.6) + w * 0.2;
      startY = h + offset;
      targetX = startX + (Math.random() - 0.5) * (w * 0.25);
      targetY = -offset;
    } else { // horizontal
      const fromLeft = Math.random() > 0.3;
      startX = fromLeft ? -offset : w + offset;
      targetX = fromLeft ? w + offset : -offset;
      startY = Math.random() * (h * 0.65) + h * 0.12;
      targetY = startY + (Math.random() - 0.5) * (h * 0.3);
      targetY = Math.max(50, Math.min(h - 50, targetY));
    }

    return { startX, startY, targetX, targetY };
  }

  function launchDrone() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const offset = DRONE_CONFIG.size + 40;

    const coords = pickTrajectory(w, h, offset);
    drone.startX = coords.startX;
    drone.startY = coords.startY;
    drone.targetX = coords.targetX;
    drone.targetY = coords.targetY;

    drone.startTime = performance.now();
    drone.duration = DRONE_CONFIG.flightDurationMs + (Math.random() - 0.5) * 3000;
    drone.waveFreq = 2.2 + Math.random() * 1.4;
    drone.waveAmp = 14 + Math.random() * 10;
    drone.active = true;
    window.droneState.active = true;

    requestAnimationFrame(droneLoop);
  }

  function scheduleNextFlight(delayMs) {
    setTimeout(launchDrone, delayMs);
  }

  function droneLoop(now) {
    if (!drone.active) return;

    const elapsed = now - drone.startTime;
    const progress = elapsed / drone.duration;

    if (progress >= 1) {
      drone.active = false;
      window.droneState.active = false;
      window.droneState.x = -200;
      window.droneState.y = -200;
      droneEl.style.opacity = '0';
      droneEl.style.transform = 'translate3d(-200px, -200px, 0)';

      const nextInterval = DRONE_CONFIG.minIntervalMs + Math.random() * (DRONE_CONFIG.maxIntervalMs - DRONE_CONFIG.minIntervalMs);
      scheduleNextFlight(nextInterval);
      return;
    }

    const isDark = document.documentElement.classList.contains('dark-mode');
    const maxOp = isDark ? DRONE_CONFIG.maxOpacityDark : DRONE_CONFIG.maxOpacityLight;
    const opacity = Math.sin(progress * Math.PI) * maxOp;

    const baseX = drone.startX + (drone.targetX - drone.startX) * progress;
    const baseY = drone.startY + (drone.targetY - drone.startY) * progress;
    const wave = Math.sin(progress * Math.PI * drone.waveFreq) * drone.waveAmp;

    const currentX = baseX;
    const currentY = baseY + wave;

    window.droneState.x = currentX;
    window.droneState.y = currentY;

    // Calcolo angolo orientamento muso (+90 perché l'icona punta in alto)
    const dx = drone.targetX - drone.startX;
    const dy = (drone.targetY - drone.startY) + Math.cos(progress * Math.PI * drone.waveFreq) * drone.waveAmp * 3.5;
    const headingDeg = Math.atan2(dy, dx) * 180 / Math.PI + 90;

    droneEl.style.opacity = opacity.toFixed(3);
    droneEl.style.transform = 'translate3d(' + (currentX - halfSize).toFixed(1) + 'px, ' + (currentY - halfSize).toFixed(1) + 'px, 0) rotate(' + headingDeg.toFixed(1) + 'deg)';

    requestAnimationFrame(droneLoop);
  }

  // Primo volo
  scheduleNextFlight(DRONE_CONFIG.firstFlightDelayMs);
})();


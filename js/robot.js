/**
 * ============================================================================
 * Background Stylized Ground Robot (TurtleBot) Controller
 * ============================================================================
 * Manages the kinematics, trajectory paths, and scheduling of the ground robot.
 */

(function() {
  // ==========================================================================
  // ROBOT CONFIGURATION
  // ==========================================================================
  const ROBOT_CONFIG = {
    size: 88, // Robot diameter in pixels (width and height)

    // Appearance timing (in milliseconds)
    firstPatrolDelayMs: 9000,  // Initial delay before 1st patrol
    minIntervalMs: 26000,      // Minimum delay between consecutive patrols
    maxIntervalMs: 48000,      // Maximum delay between consecutive patrols
    patrolDurationMs: 14000,   // Base duration for robot to traverse its route

    // Maximum opacity based on active theme
    maxOpacityLight: 0.72,
    maxOpacityDark: 0.82,

    // Trajectory type:
    // 'floor-patrol'   -> patrols horizontally across the lower screen area
    // 'diagonal-cross' -> crosses diagonally across the background
    // 'waypoint-curve' -> performs a smooth curved turn through a waypoint
    // 'random'         -> randomly picks one of the above modes each patrol
    trajectory: 'random',
  };

  // Shared state with spatial-mesh.js for obstacle avoidance / proximity interaction
  window.robotState = {
    active: false,
    x: -200,
    y: -200,
  };

  const robotEl = document.getElementById('robot-container');
  if (!robotEl) return;

  // Apply configured dimensions
  robotEl.style.width = ROBOT_CONFIG.size + 'px';
  robotEl.style.height = ROBOT_CONFIG.size + 'px';
  const halfSize = ROBOT_CONFIG.size / 2;

  let currentRoute = {
    active: false,
    p0: { x: 0, y: 0 },
    p1: { x: 0, y: 0 },
    p2: { x: 0, y: 0 },
    startTime: 0,
    duration: 0,
    lastHeading: 0,
  };

  /**
   * Generates start (p0), control (p1), and destination (p2) points
   * for a quadratic Bézier curve trajectory.
   */
  function pickRoute(w, h, offset) {
    let mode = ROBOT_CONFIG.trajectory;
    if (mode === 'random') {
      const modes = ['floor-patrol', 'floor-patrol', 'diagonal-cross', 'waypoint-curve'];
      mode = modes[Math.floor(Math.random() * modes.length)];
    }

    let p0, p1, p2;

    if (mode === 'floor-patrol') {
      // Horizontal ground patrol across the lower third of the viewport
      const fromLeft = Math.random() > 0.5;
      const groundY = h * (0.74 + Math.random() * 0.16);
      const curveDelta = (Math.random() - 0.5) * 70;

      if (fromLeft) {
        p0 = { x: -offset, y: groundY };
        p2 = { x: w + offset, y: groundY + (Math.random() - 0.5) * 40 };
      } else {
        p0 = { x: w + offset, y: groundY };
        p2 = { x: -offset, y: groundY + (Math.random() - 0.5) * 40 };
      }
      p1 = { x: w * 0.5, y: (p0.y + p2.y) * 0.5 + curveDelta };

    } else if (mode === 'diagonal-cross') {
      // Diagonal traversal across the environment
      const fromLeft = Math.random() > 0.5;
      if (fromLeft) {
        p0 = { x: -offset, y: h * (0.65 + Math.random() * 0.25) };
        p2 = { x: w + offset, y: h * (0.28 + Math.random() * 0.25) };
      } else {
        p0 = { x: w + offset, y: h * (0.65 + Math.random() * 0.25) };
        p2 = { x: -offset, y: h * (0.28 + Math.random() * 0.25) };
      }
      p1 = {
        x: w * 0.5 + (Math.random() - 0.5) * (w * 0.2),
        y: (p0.y + p2.y) * 0.5 + (Math.random() - 0.5) * 60,
      };

    } else { // 'waypoint-curve'
      // Enters from bottom or side, curves around a central waypoint, exits smoothly
      const fromLeft = Math.random() > 0.5;
      if (fromLeft) {
        p0 = { x: -offset, y: h * (0.78 + Math.random() * 0.15) };
        p1 = { x: w * (0.35 + Math.random() * 0.25), y: h * (0.58 + Math.random() * 0.18) };
        p2 = { x: w * (0.55 + Math.random() * 0.35), y: h + offset };
      } else {
        p0 = { x: w + offset, y: h * (0.78 + Math.random() * 0.15) };
        p1 = { x: w * (0.40 + Math.random() * 0.25), y: h * (0.58 + Math.random() * 0.18) };
        p2 = { x: w * (0.10 + Math.random() * 0.35), y: h + offset };
      }
    }

    return { p0, p1, p2 };
  }

  /**
   * Starts a new robot patrol mission
   */
  function launchRobot() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const offset = ROBOT_CONFIG.size + 40;

    const route = pickRoute(w, h, offset);
    currentRoute.p0 = route.p0;
    currentRoute.p1 = route.p1;
    currentRoute.p2 = route.p2;

    currentRoute.startTime = performance.now();
    currentRoute.duration = ROBOT_CONFIG.patrolDurationMs + (Math.random() - 0.5) * 4000;
    currentRoute.active = true;
    window.robotState.active = true;

    requestAnimationFrame(robotLoop);
  }

  function scheduleNextPatrol(delayMs) {
    setTimeout(launchRobot, delayMs);
  }

  /**
   * Main animation loop evaluating quadratic Bézier position and differential drive heading
   */
  function robotLoop(now) {
    if (!currentRoute.active) return;

    const elapsed = now - currentRoute.startTime;
    const t = elapsed / currentRoute.duration;

    if (t >= 1) {
      currentRoute.active = false;
      window.robotState.active = false;
      window.robotState.x = -200;
      window.robotState.y = -200;
      robotEl.style.opacity = '0';
      robotEl.style.transform = 'translate3d(-200px, -200px, 0)';

      const nextInterval = ROBOT_CONFIG.minIntervalMs +
        Math.random() * (ROBOT_CONFIG.maxIntervalMs - ROBOT_CONFIG.minIntervalMs);
      scheduleNextPatrol(nextInterval);
      return;
    }

    // Determine opacity with smooth fade-in and fade-out envelope
    const isDark = document.documentElement.classList.contains('dark-mode');
    const maxOp = isDark ? ROBOT_CONFIG.maxOpacityDark : ROBOT_CONFIG.maxOpacityLight;
    const opacity = Math.sin(t * Math.PI) * maxOp;

    // Quadratic Bézier curve evaluation: B(t) = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
    const invT = 1 - t;
    const c0 = invT * invT;
    const c1 = 2 * invT * t;
    const c2 = t * t;

    const currentX = c0 * currentRoute.p0.x + c1 * currentRoute.p1.x + c2 * currentRoute.p2.x;
    const currentY = c0 * currentRoute.p0.y + c1 * currentRoute.p1.y + c2 * currentRoute.p2.y;

    // First derivative for velocity direction: B'(t) = 2*(1-t)*(P1 - P0) + 2*t*(P2 - P1)
    const dx = 2 * invT * (currentRoute.p1.x - currentRoute.p0.x) + 2 * t * (currentRoute.p2.x - currentRoute.p1.x);
    const dy = 2 * invT * (currentRoute.p1.y - currentRoute.p0.y) + 2 * t * (currentRoute.p2.y - currentRoute.p1.y);

    // Calculate heading angle in degrees (+90deg offset since SVG orientation faces upwards)
    let headingDeg = currentRoute.lastHeading;
    if (Math.hypot(dx, dy) > 0.01) {
      headingDeg = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      currentRoute.lastHeading = headingDeg;
    }

    // Update global robot position for spatial canvas interaction
    window.robotState.x = currentX;
    window.robotState.y = currentY;

    // Apply transformation
    robotEl.style.opacity = opacity.toFixed(3);
    robotEl.style.transform = 'translate3d(' + (currentX - halfSize).toFixed(1) + 'px, ' +
      (currentY - halfSize).toFixed(1) + 'px, 0) rotate(' + headingDeg.toFixed(1) + 'deg)';

    requestAnimationFrame(robotLoop);
  }

  // Schedule the initial patrol
  scheduleNextPatrol(ROBOT_CONFIG.firstPatrolDelayMs);
})();


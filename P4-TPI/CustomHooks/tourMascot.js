// Mascota "libreta" del tutorial. SVG line-art generado como string para
// inyectarlo en el popover de driver.js (que es DOM puro, no React).
// Poses: "wave" (saluda), "point" (señala), "celebrate" (festeja).

const FACE = `
  <g class="tour-eye">
    <ellipse cx="26" cy="30" rx="2.4" ry="2.9" fill="#1a1a2e" />
    <ellipse cx="38" cy="30" rx="2.4" ry="2.9" fill="#1a1a2e" />
  </g>`;

const SHELL_TOP = `
  <rect x="15" y="12" width="34" height="40" rx="6" fill="#faf9f7" stroke="#1a1a2e" stroke-width="2.5" />
  <path d="M49 12 L49 20 L41 12 Z" fill="#f0ede8" stroke="#1a1a2e" stroke-width="2.5" stroke-linejoin="round" />
  <line x1="15" y1="21" x2="21" y2="21" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" />
  <line x1="15" y1="30" x2="21" y2="30" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" />
  <line x1="15" y1="39" x2="21" y2="39" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" />
  <line x1="15" y1="48" x2="21" y2="48" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" />`;

const ARM_REST = `
  <path d="M49 33 Q56 33 57 37" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />`;

const svg = (inner) => `
<svg viewBox="0 0 64 64" width="40" height="40" xmlns="http://www.w3.org/2000/svg" class="tour-mascot-svg" aria-hidden="true" focusable="false">
  <g class="tour-mascot-body">
    ${SHELL_TOP}
    ${FACE}
    ${inner}
  </g>
</svg>`;

const POSES = {
  wave: svg(`
    <g class="tour-arm tour-arm-wave" style="transform-origin:15px 35px">
      <path d="M15 35 Q8 31 8 22" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="8" cy="20" r="3.2" fill="#f0ede8" stroke="#1a1a2e" stroke-width="2.5" />
    </g>
    ${ARM_REST}
    <path d="M27 39 Q32 44 37 39" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />`),

  point: svg(`
    <path d="M15 35 Q10 37 9 40" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />
    <g class="tour-arm tour-arm-point" style="transform-origin:49px 32px">
      <path d="M49 32 L57 32" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="59" cy="32" r="3.2" fill="#f0ede8" stroke="#1a1a2e" stroke-width="2.5" />
    </g>
    <path d="M28 40 Q32 42 36 40" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />`),

  celebrate: svg(`
    <g class="tour-arm tour-arm-wave" style="transform-origin:16px 24px">
      <path d="M16 24 Q10 16 7 12" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="6" cy="10" r="3.2" fill="#f0ede8" stroke="#1a1a2e" stroke-width="2.5" />
    </g>
    <g class="tour-arm tour-arm-wave" style="transform-origin:48px 24px">
      <path d="M48 24 Q54 16 57 12" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="58" cy="10" r="3.2" fill="#f0ede8" stroke="#1a1a2e" stroke-width="2.5" />
    </g>
    <path d="M27 39 Q32 46 37 39" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" />
    <g class="tour-sparkle" fill="#f59e0b">
      <path d="M12 6 L13.4 9.6 L17 11 L13.4 12.4 L12 16 L10.6 12.4 L7 11 L10.6 9.6 Z" stroke="none" />
      <path d="M53 3 L54 5.6 L56.6 6.6 L54 7.6 L53 10.2 L52 7.6 L49.4 6.6 L52 5.6 Z" stroke="none" />
    </g>`),
};

export const mascotSvg = (pose) => POSES[pose] || POSES.wave;

export default mascotSvg;

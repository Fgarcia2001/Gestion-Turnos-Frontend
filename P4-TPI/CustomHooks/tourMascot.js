// Mascota "calendario amigable" del tutorial. SVG line-art generado como
// string para colgarlo a nivel document.body (fuera del popover de driver.js).
// Poses: "wave" (saluda), "point" (señala), "celebrate" (festeja).

const SHELL = `
  <rect x="28" y="36" width="104" height="100" rx="16" fill="#ffffff" stroke="#1a1a2e" stroke-width="4" />
  <rect x="52" y="18" width="8" height="28" rx="4" fill="#f0ede8" stroke="#1a1a2e" stroke-width="4" />
  <rect x="100" y="18" width="8" height="28" rx="4" fill="#f0ede8" stroke="#1a1a2e" stroke-width="4" />
  <path d="M28 52 q0-16 16-16 h72 q16 0 16 16 v8 H28 Z" fill="#1a1a2e" />
  <circle cx="44" cy="76" r="4" fill="#e2ddd8" />
  <circle cx="60" cy="76" r="4" fill="#e2ddd8" />
  <circle cx="76" cy="76" r="4" fill="#e2ddd8" />
  <circle cx="92" cy="76" r="4" fill="#e2ddd8" />
  <circle cx="108" cy="76" r="4" fill="#e2ddd8" />
  <circle cx="124" cy="76" r="4.5" fill="#f59e0b" />`;

const FACE = `
  <circle cx="46" cy="116" r="7" fill="#fde3c0" opacity="0.75" />
  <circle cx="114" cy="116" r="7" fill="#fde3c0" opacity="0.75" />
  <g class="tour-eye">
    <ellipse cx="62" cy="106" rx="6" ry="7.5" fill="#1a1a2e" />
    <ellipse cx="98" cy="106" rx="6" ry="7.5" fill="#1a1a2e" />
    <circle cx="64" cy="103.5" r="2" fill="#ffffff" />
    <circle cx="100" cy="103.5" r="2" fill="#ffffff" />
  </g>`;

const ARM_REST_LEFT = `
  <path d="M28 106 Q18 108 14 116" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />
  <circle cx="12" cy="119" r="7" fill="#f0ede8" stroke="#1a1a2e" stroke-width="4" />`;

const ARM_REST_RIGHT = `
  <path d="M132 106 Q142 108 146 116" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />
  <circle cx="148" cy="119" r="7" fill="#f0ede8" stroke="#1a1a2e" stroke-width="4" />`;

const svg = (inner) => `
<svg viewBox="0 0 160 160" width="112" height="112" xmlns="http://www.w3.org/2000/svg" class="tour-mascot-svg" aria-hidden="true" focusable="false">
  <g class="tour-mascot-body">
    ${SHELL}
    ${FACE}
    ${inner}
  </g>
</svg>`;

const POSES = {
  wave: svg(`
    <g class="tour-arm tour-arm-wave" style="transform-origin:28px 106px">
      <path d="M28 106 Q14 100 12 84" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />
      <circle cx="10" cy="80" r="7.5" fill="#f0ede8" stroke="#1a1a2e" stroke-width="4" />
    </g>
    ${ARM_REST_RIGHT}
    <path d="M62 120 Q80 134 98 120" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />`),

  point: svg(`
    ${ARM_REST_LEFT}
    <g class="tour-arm tour-arm-point" style="transform-origin:132px 106px">
      <path d="M132 106 L146 106" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />
      <circle cx="149" cy="106" r="7.5" fill="#f0ede8" stroke="#1a1a2e" stroke-width="4" />
    </g>
    <path d="M64 121 Q80 130 96 121" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />`),

  celebrate: svg(`
    <g class="tour-arm tour-arm-wave" style="transform-origin:28px 106px">
      <path d="M28 106 Q14 96 12 78" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />
      <circle cx="10" cy="74" r="7.5" fill="#f0ede8" stroke="#1a1a2e" stroke-width="4" />
    </g>
    <g class="tour-arm tour-arm-wave" style="transform-origin:132px 106px">
      <path d="M132 106 Q146 96 148 78" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />
      <circle cx="150" cy="74" r="7.5" fill="#f0ede8" stroke="#1a1a2e" stroke-width="4" />
    </g>
    <path d="M62 118 Q80 138 98 118" fill="none" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round" />
    <g class="tour-sparkle" fill="#f59e0b">
      <path d="M22 34 L24 41 L31 43 L24 45 L22 52 L20 45 L13 43 L20 41 Z" />
      <path d="M138 30 L139.6 34.4 L144 36 L139.6 37.6 L138 42 L136.4 37.6 L132 36 L136.4 34.4 Z" />
    </g>`),
};

export const mascotSvg = (pose) => POSES[pose] || POSES.wave;

export default mascotSvg;

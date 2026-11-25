'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { systems } from '@/data/portfolio';

const linkStyle =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8542A] focus-visible:ring-offset-4';

const CUBE_SIZE = 74;
const CUBE_HALF = CUBE_SIZE / 2;
const WIRE_SIZE = 128;
const WIRE_HALF = WIRE_SIZE / 2;

const CUBE_FACES = [
  {
    name: 'front',
    transform: `translateZ(${CUBE_HALF}px)`,
    background: '#E04820',
  },
  {
    name: 'back',
    transform: `rotateY(180deg) translateZ(${CUBE_HALF}px)`,
    background: '#B02C0D',
  },
  {
    name: 'right',
    transform: `rotateY(90deg) translateZ(${CUBE_HALF}px)`,
    background: '#C03010',
  },
  {
    name: 'left',
    transform: `rotateY(-90deg) translateZ(${CUBE_HALF}px)`,
    background: '#D43E1A',
  },
  {
    name: 'top',
    transform: `rotateX(90deg) translateZ(${CUBE_HALF}px)`,
    background: '#F06030',
  },
  {
    name: 'bottom',
    transform: `rotateX(-90deg) translateZ(${CUBE_HALF}px)`,
    background: '#942107',
  },
];

const WIRE_FACES = [
  `translateZ(${WIRE_HALF}px)`,
  `rotateY(180deg) translateZ(${WIRE_HALF}px)`,
  `rotateY(90deg) translateZ(${WIRE_HALF}px)`,
  `rotateY(-90deg) translateZ(${WIRE_HALF}px)`,
  `rotateX(90deg) translateZ(${WIRE_HALF}px)`,
  `rotateX(-90deg) translateZ(${WIRE_HALF}px)`,
];

const NODES = [
  { id: 0, label: 'FRONTEND', x: 235, y: 76, lx: 251, ly: 70, pulseDur: '3.6s' },
  { id: 1, label: 'API LAYER', x: 390, y: 163, lx: 330, ly: 148, pulseDur: '4.3s' },
  { id: 2, label: 'DATABASE', x: 390, y: 335, lx: 325, ly: 362, pulseDur: '3.9s' },
  { id: 3, label: 'DEPLOYMENT', x: 235, y: 423, lx: 251, ly: 443, pulseDur: '4.7s' },
  { id: 4, label: 'BACKEND', x: 80, y: 335, lx: 20, ly: 362, pulseDur: '4.1s' },
  { id: 5, label: 'INTEGRATIONS', x: 80, y: 163, lx: 20, ly: 148, pulseDur: '3.4s' },
];

function useResponsiveTier() {
  const [tier, setTier] = useState('desktop');

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1200) setTier('desktop');
      else if (window.innerWidth >= 768) setTier('tablet');
      else setTier('mobile');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return tier;
}

export default function HeroArtifact() {
  const [active, setActive] = useState(0);
  const [activeNode, setActiveNode] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const reduced = useReducedMotion();
  const tier = useResponsiveTier();

  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const wireRef = useRef(null);
  const shadowRef = useRef(null);
  const topGlossRef = useRef(null);
  const topFlashRef = useRef(null);

  const stateRef = useRef({
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    timeScale: 1,
    targetTimeScale: 1,
    pulseStart: -1,
    elapsed: 0,
    wireElapsed: 0,
    lastFrame: 0,
  });

  // Cycle active orbital node every ~6s (disabled for reduced motion)
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % NODES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reduced]);

  // Sync hover slowdown target
  useEffect(() => {
    stateRef.current.targetTimeScale = isHovered && tier === 'desktop' ? 0.45 : 1;
  }, [isHovered, tier]);

  useEffect(() => {
    let rafId = 0;
    let isVisible = !document.hidden;

    const tick = (now) => {
      if (!isVisible) return;

      const s = stateRef.current;
      if (s.lastFrame === 0) s.lastFrame = now;
      const dt = Math.min(0.05, (now - s.lastFrame) / 1000);
      s.lastFrame = now;

      // Smoothly ease timeScale when observed (hovered) and back on leave
      s.timeScale += (s.targetTimeScale - s.timeScale) * 0.06;
      s.elapsed += dt * s.timeScale;
      s.wireElapsed += dt * s.timeScale;

      const t = s.elapsed;
      const TAU = Math.PI * 2;

      // Magnetic cursor tilt interpolation (smoothly resumes autonomous path on leave)
      s.currentTiltX += (s.targetTiltX - s.currentTiltX) * 0.075;
      s.currentTiltY += (s.targetTiltY - s.currentTiltY) * 0.075;

      // Click energetic pulse: 1.0 -> 1.07 -> 1.0 over 250ms + top face light flash
      let pulseScale = 0;
      let flashOpacity = 0;
      if (s.pulseStart >= 0) {
        const p = (now - s.pulseStart) / 250;
        if (p >= 1) {
          s.pulseStart = -1;
        } else {
          const wave = Math.sin(Math.PI * p);
          pulseScale = wave * 0.07;
          flashOpacity = wave * 0.55;
        }
      }

      let rotY = 36;
      let rotX = -24;
      let floatY = 0;
      let breathScale = 1;

      if (reduced) {
        rotY = 36 + Math.sin((t * TAU) / 16) * 8;
      } else if (tier === 'mobile') {
        rotY = 36 + Math.sin((t * TAU) / 10) * 14;
      } else if (tier === 'tablet') {
        rotY = 36 + Math.sin((t * TAU) / 10) * 15;
        rotX = -24 + Math.sin((t * TAU) / 14 + 0.6) * 4;
        floatY = Math.sin((t * TAU) / 5 + 1.1) * 5;
        breathScale = 1 + 0.015 * (1 - Math.cos((t * TAU) / 4));
      } else {
        // Desktop: 6-layer independent motion stack
        rotY = 36 + Math.sin((t * TAU) / 10) * 25 + s.currentTiltY;
        rotX = -24 + Math.sin((t * TAU) / 14 + 0.6) * 6 + s.currentTiltX;
        floatY = Math.sin((t * TAU) / 5 + 1.1) * 8;
        breathScale = 1 + 0.015 * (1 - Math.cos((t * TAU) / 4));
      }

      const finalScale = breathScale + pulseScale;

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(0px, ${floatY.toFixed(
          2
        )}px, 0) scale3d(${finalScale.toFixed(4)}, ${finalScale.toFixed(
          4
        )}, ${finalScale.toFixed(4)}) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(
          2
        )}deg)`;
      }

      // Wireframe shell rotates slightly slower (12s cycle) for 3D depth separation
      if (wireRef.current) {
        const wireRotY = reduced
          ? 36 - Math.sin((t * TAU) / 18) * 6
          : tier === 'mobile'
            ? 36 + Math.sin((t * TAU) / 12) * 10
            : 36 + Math.sin((s.wireElapsed * TAU) / 12 + 0.85) * 20 + s.currentTiltY * 0.65;
        const wireRotX = reduced
          ? -24
          : tier === 'mobile'
            ? -24
            : -24 + Math.sin((s.wireElapsed * TAU) / 16 + 1.7) * 5 + s.currentTiltX * 0.65;
        const wireScale = 1 + pulseScale * 0.7;

        wireRef.current.style.transform = `translate3d(0px, ${floatY.toFixed(
          2
        )}px, 0) scale3d(${wireScale.toFixed(4)}, ${wireScale.toFixed(
          4
        )}, ${wireScale.toFixed(4)}) rotateX(${wireRotX.toFixed(2)}deg) rotateY(${wireRotY.toFixed(
          2
        )}deg)`;
      }

      // Subtle drop shadow on diagram plane below the cube
      if (shadowRef.current) {
        const shadowScale = 1 - floatY * 0.012;
        const shadowOpacity = 0.16 - floatY * 0.004;
        shadowRef.current.style.transform = `translate3d(-50%, 0, 0) scale(${shadowScale.toFixed(
          3
        )})`;
        shadowRef.current.style.opacity = Math.max(0.08, shadowOpacity).toFixed(3);
      }

      // Specular highlight travelling across top face (8s cycle)
      if (topGlossRef.current && !reduced) {
        const glossPhase = (t % 8) / 8;
        const gx = Math.sin(glossPhase * TAU) * 38;
        const gy = Math.cos(glossPhase * TAU) * 26;
        topGlossRef.current.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(
          1
        )}px, 0) rotate(25deg)`;
      }

      if (topFlashRef.current) {
        topFlashRef.current.style.opacity = flashOpacity.toFixed(3);
      }

      rafId = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(rafId);
      } else {
        isVisible = true;
        stateRef.current.lastFrame = 0;
        rafId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reduced, tier]);

  function handlePointerMove(e) {
    if (reduced || tier !== 'desktop' || e.pointerType !== 'mouse') return;
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    const nx = ((e.clientX - box.left) / box.width - 0.5) * 2;
    const ny = ((e.clientY - box.top) / box.height - 0.5) * 2;
    stateRef.current.targetTiltY = nx * 9; // 8-10° magnetic lean
    stateRef.current.targetTiltX = -ny * 9;
  }

  function handlePointerLeave() {
    setIsHovered(false);
    stateRef.current.targetTiltX = 0;
    stateRef.current.targetTiltY = 0;
  }

  function handlePulse() {
    if (reduced) return;
    stateRef.current.pulseStart = performance.now();
  }

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-[490px] select-none"
    >
      {/* Live System Header */}
      <div className="absolute left-5 top-3 z-30 flex items-center gap-2 font-mono text-xs text-[#62645c]">
        <span className="text-[#E8542A]">//</span>
        INTERACTIVE SYSTEM / V.01
      </div>

      {/* BACK SVG LAYER (z-0): Grid, Hexagon, Connecting Flow Lines, Back Orbitals, Nodes */}
      <svg
        viewBox="0 0 470 490"
        className="relative z-0 w-full"
        role="img"
        aria-label={`Interactive full-stack architecture, highlighting ${systems[active].name}`}
      >
        <defs>
          <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r=".7" fill="#a8aa9d" opacity=".45" />
          </pattern>
          <clipPath id="orbit-back-clip">
            <rect x="0" y="0" width="470" height="250" />
          </clipPath>
        </defs>

        <rect x="10" y="40" width="450" height="410" fill="url(#dots)" />

        {/* Outer hexagonal frame */}
        <path
          d="M235 76 390 163 390 335 235 423 80 335 80 163Z"
          stroke="#aaad9e"
          strokeWidth="1"
          fill="none"
        />

        {/* Animated dashed connecting lines from nodes to core */}
        <g fill="none">
          {NODES.map((node) => {
            const isNodeHighlighted = hoveredNode === node.id || (!reduced && activeNode === node.id);
            return (
              <line
                key={`conn-${node.id}`}
                x1={node.x}
                y1={node.y}
                x2="235"
                y2="250"
                stroke={isNodeHighlighted ? '#E8542A' : '#aaad9e'}
                strokeWidth={isNodeHighlighted ? '1.35' : '1'}
                strokeOpacity={isNodeHighlighted ? '0.75' : '0.85'}
                strokeDasharray="4 5"
              >
                {!reduced && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-18"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
            );
          })}
        </g>

        {/* Back half of orbital ellipses (behind the 3D cube) */}
        <g clipPath="url(#orbit-back-clip)" fill="none" stroke="#b9bbaf" strokeWidth="1">
          <ellipse cx="235" cy="250" rx="205" ry="75" transform="rotate(-30 235 250)" />
          <ellipse cx="235" cy="250" rx="205" ry="75" transform="rotate(30 235 250)" />
        </g>

        {/* Orbital Node Dots with Independent Glow Beats */}
        {NODES.map((node) => {
          const isNodeActive = !reduced && activeNode === node.id;
          const isNodeHovered = hoveredNode === node.id;
          return (
            <g key={`node-${node.id}`}>
              {!reduced && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  fill="none"
                  stroke={isNodeActive || isNodeHovered ? '#E8542A' : '#afb2a3'}
                  strokeWidth="1"
                  opacity="0.45"
                >
                  <animate
                    attributeName="r"
                    values={isNodeActive ? '8;15;8' : '9;12;9'}
                    dur={node.pulseDur}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values={isNodeActive ? '0.65;0.1;0.65' : '0.4;0.15;0.4'}
                    dur={node.pulseDur}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={isNodeActive || isNodeHovered ? '5.5' : '4.5'}
                fill={isNodeActive || isNodeHovered ? '#E8542A' : '#f5f4ed'}
                stroke={isNodeActive || isNodeHovered ? '#E8542A' : '#797c6f'}
                strokeWidth="1.2"
              />
            </g>
          );
        })}

        {/* Interactive Node Labels */}
        <g fontFamily="monospace" fontSize="11">
          {NODES.map((node) => {
            const isHighlighted = hoveredNode === node.id || (!reduced && activeNode === node.id);
            return (
              <text
                key={`label-${node.id}`}
                x={node.lx}
                y={node.ly}
                fill={isHighlighted ? '#c83c1b' : '#4e5147'}
                className="cursor-pointer transition-colors duration-200"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setActiveNode(node.id)}
              >
                {node.label}
              </text>
            );
          })}
        </g>
      </svg>

      {/* MIDDLE LAYER (z-10): Drop Shadow + Wireframe Shell + Chamfered 3D Cube */}
      <button
        type="button"
        onClick={handlePulse}
        aria-label="Pulse 3D architectural cube"
        className="absolute left-1/2 top-[51%] z-10 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8542A]"
        style={{ perspective: '900px' }}
      >
        {/* Subtle drop shadow projected onto the diagram plane below */}
        <div
          ref={shadowRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-1/2 h-7 w-28 rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(37, 40, 32, 0.55) 0%, transparent 72%)',
            transform: 'translate3d(-50%, 0, 0)',
            opacity: 0.16,
          }}
        />

        {/* Outer Wireframe Shell (20% stroke opacity, no fill, slower 12s rotation) */}
        <div
          ref={wireRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {WIRE_FACES.map((transform, i) => (
            <div
              key={`wire-${i}`}
              className={`absolute rounded-[14px] border bg-transparent transition-colors duration-300 ${
                isHovered ? 'border-[#E8542A]/35' : 'border-[#E8542A]/20'
              }`}
              style={{
                width: `${WIRE_SIZE}px`,
                height: `${WIRE_SIZE}px`,
                transform,
              }}
            />
          ))}
        </div>

        {/* Inner Chamfered Solid Cube (centered with ~21% margin inside cage) */}
        <div
          ref={coreRef}
          aria-hidden="true"
          className="pointer-events-none relative flex items-center justify-center will-change-transform"
          style={{
            width: `${WIRE_SIZE}px`,
            height: `${WIRE_SIZE}px`,
            transformStyle: 'preserve-3d',
          }}
        >
          {CUBE_FACES.map((face) => (
            <div
              key={face.name}
              className="absolute flex items-center justify-center overflow-hidden rounded-[8px] border border-[#a82c0e]/50"
              style={{
                width: `${CUBE_SIZE}px`,
                height: `${CUBE_SIZE}px`,
                background: face.background,
                transform: face.transform,
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Top face: travelling specular gloss + click light flash */}
              {face.name === 'top' && (
                <>
                  <div
                    ref={topGlossRef}
                    className="pointer-events-none absolute -inset-6 will-change-transform"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.45) 50%, transparent 70%)',
                    }}
                  />
                  <div
                    ref={topFlashRef}
                    className="pointer-events-none absolute inset-0 bg-white will-change-opacity"
                    style={{ opacity: 0 }}
                  />
                </>
              )}

              {/* Front face: subtle inner engraved square */}
              {face.name === 'front' && (
                <span className="h-7 w-7 rounded-[4px] border border-[#ffd1bb]/35" />
              )}
            </div>
          ))}
        </div>
      </button>

      {/* FRONT SVG LAYER (z-20): Front half of orbital ellipses passing in front of the cube */}
      <svg
        viewBox="0 0 470 490"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 w-full"
      >
        <defs>
          <clipPath id="orbit-front-clip">
            <rect x="0" y="250" width="470" height="240" />
          </clipPath>
        </defs>
        <g clipPath="url(#orbit-front-clip)" fill="none" stroke="#b9bbaf" strokeWidth="1" strokeOpacity="0.85">
          <ellipse cx="235" cy="250" rx="205" ry="75" transform="rotate(-30 235 250)" />
          <ellipse cx="235" cy="250" rx="205" ry="75" transform="rotate(30 235 250)" />
        </g>
      </svg>

      {/* Interactive System Selector */}
      <div className="relative z-30 -mt-5 flex justify-center gap-1">
        {systems.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={`min-h-11 px-3 font-mono text-xs transition-colors ${linkStyle} ${
              active === i ? 'text-[#c83c1b]' : 'text-[#65675c] hover:text-black'
            }`}
          >
            {s.number} {active === i && s.name}
            <span
              className={`mx-auto mt-1 block h-px ${
                active === i ? 'bg-[#E8542A]' : 'bg-transparent'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { exhibitionProjects, projectCategories } from '@/data/portfolio';
import { EditorialSplitReveal, ScrambleText } from '@/components/TextReveal';

const ease = [0.22, 1, 0.36, 1];
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4512b] focus-visible:ring-offset-4';

function useViewportTier() {
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

function ProjectPreview({ project, compact = false, hideCta = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: project.color }}
    >
      {/* Minimal editorial browser bar */}
      <div className="flex h-6 shrink-0 items-center justify-between border-b border-[#535a4722] bg-[#f4f3ec]/75 px-2.5">
        <span aria-hidden="true" className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-[#717962]/60" />
          <span className="h-1 w-1 rounded-full bg-[#717962]/40" />
          <span className="h-1 w-1 rounded-full bg-[#717962]/40" />
        </span>
        <span className="truncate font-mono text-[9px] tracking-[.08em] text-[#59634d]">
          {project.domain}
        </span>
      </div>

      {/* Visual body */}
      <div className="relative flex-1 overflow-hidden">
        {project.screenshot && !failed ? (
          <img
            src={project.screenshot}
            onError={() => setFailed(true)}
            alt={`${project.name} preview`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className={`relative flex h-full w-full flex-col justify-between ${compact ? 'p-2.5' : 'p-4 md:p-5'
              }`}
          >
            <svg
              viewBox="0 0 320 200"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full text-[#6a735c]/15"
              preserveAspectRatio="none"
            >
              <line x1="0" y1="66" x2="320" y2="66" stroke="currentColor" strokeWidth="0.75" />
              <line x1="0" y1="134" x2="320" y2="134" stroke="currentColor" strokeWidth="0.75" />
              <line x1="106" y1="0" x2="106" y2="200" stroke="currentColor" strokeWidth="0.75" />
              <line x1="214" y1="0" x2="214" y2="200" stroke="currentColor" strokeWidth="0.75" />
            </svg>

            <div className="relative flex items-center justify-between font-mono text-[9px] tracking-[.12em] text-[#59624c]">
              <span className="truncate">{compact ? project.name : project.tag}</span>
              <span>/{project.id}</span>
            </div>

            <div className="relative my-auto flex items-end justify-between gap-2">
              {!compact && (
                <div className="space-y-2">
                  <div className="h-1.5 w-24 rounded-full bg-[#252820]/15 md:w-28" />
                  <div className="h-1.5 w-16 rounded-full bg-[#252820]/10 md:w-20" />
                </div>
              )}
              <span
                className={`ml-auto font-serif italic leading-none tracking-[-.06em] text-[#3a432f]/85 select-none ${compact ? 'text-2xl' : 'text-4xl md:text-5xl'
                  }`}
              >
                {project.id}
                <span className="text-[#f4512b]">.</span>
              </span>
            </div>

            {!compact && (
              <div className="relative flex items-center justify-between border-t border-[#535a4722] pt-2 font-mono text-[9px] tracking-[.08em] text-[#5c654f]">
                <span>CLIENT PROJECT</span>
                {project.liveUrl && (
                  <span className="flex items-center gap-1 text-[#b83b1d]">
                    LIVE <ArrowUpRight className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Subtle "View Project" hover affordance */}
        {!compact && !hideCta && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end p-3 opacity-0 transition-all duration-300 ease-out translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <span className="inline-flex items-center gap-1.5 bg-[#252820] px-3 py-1.5 font-mono text-[10px] tracking-[.08em] text-[#f4f3ec] shadow-lg">
              VIEW PROJECT <ArrowUpRight className="h-3 w-3 text-[#f4512b]" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectOverlay({ active, onClose }) {
  const reduced = useReducedMotion();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, onClose]);

  if (!active) return null;
  const { project, rect } = active;

  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const initialX = rect ? rect.left + rect.width / 2 - viewportW / 2 : 0;
  const initialY = rect ? rect.top + rect.height / 2 - viewportH / 2 : 24;
  const initialScale = rect
    ? Math.max(0.45, Math.min(0.88, rect.width / Math.min(540, viewportW - 32)))
    : 0.92;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#252820]/55 p-4 backdrop-blur-xs md:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`overlay-title-${project.id}`}
        onClick={(e) => e.stopPropagation()}
        initial={
          reduced
            ? { opacity: 0 }
            : { x: initialX, y: initialY, scale: initialScale, opacity: 0 }
        }
        animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        exit={
          reduced
            ? { opacity: 0 }
            : { x: initialX, y: initialY, scale: initialScale, opacity: 0 }
        }
        transition={{ duration: reduced ? 0 : 0.36, ease }}
        className="relative max-h-[90vh] w-full max-w-[540px] overflow-y-auto border border-[#56604b]/40 bg-[#282d25] p-6 text-[#f4f3ec] shadow-2xl md:p-8"
      >
        <div className="flex items-center justify-between border-b border-[#56604b] pb-3.5">
          <div className="flex items-center gap-3 font-mono text-xs tracking-[.1em] text-[#c4cdb6]">
            <span className="text-[#f4512b]">/{project.id}</span>
            <span>CLIENT PROJECT · {project.tag}</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className={`flex h-9 w-9 items-center justify-center text-[#c4cdb6] transition-colors hover:text-white ${focusRing}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {project.screenshot && (
          <div className="mt-4 aspect-[16/9] w-full overflow-hidden border border-[#56604b]/60">
            <ProjectPreview project={project} hideCta />
          </div>
        )}

        <h3
          id={`overlay-title-${project.id}`}
          className="mt-5 text-2xl font-medium tracking-[-.04em] text-[#f4f3ec] md:text-3xl"
        >
          {project.name}
          <span className="text-[#f4512b]">.</span>
        </h3>

        <dl className="mt-5 space-y-4 text-sm leading-6">
          <div>
            <dt className="font-mono text-[10px] tracking-[.12em] text-[#f78a69]">ROLE</dt>
            <dd className="mt-0.5 text-[#f4f3ec]">{project.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[.12em] text-[#c4cdb6]">CONTEXT</dt>
            <dd className="mt-0.5 text-[#d2d7c9]">{project.context}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[.12em] text-[#c4cdb6]">OUTCOME</dt>
            <dd className="mt-0.5 text-[#d2d7c9]">{project.outcome}</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center justify-between border-t border-[#56604b] pt-4">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-10 items-center gap-2.5 border-b border-[#f4512b] text-sm text-[#f4f3ec] transition-colors hover:text-[#f78a69] ${focusRing}`}
            >
              Visit {project.domain}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          ) : (
            <span className="font-mono text-xs text-[#c4cdb6]">
              PRIVATE CLIENT PLATFORM
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectExhibition({ onProjectHover }) {
  const [activeCategory, setActiveCategory] = useState('products');
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayState, setOverlayState] = useState(null);
  const stageRef = useRef(null);
  const reduced = useReducedMotion();
  const tier = useViewportTier();

  const filtered = exhibitionProjects.filter((p) => p.category === activeCategory);
  const activeProject = filtered[activeIndex] || filtered[0];
  const nextProject =
    filtered.length > 1 ? filtered[(activeIndex + 1) % filtered.length] : null;

  const canTilt = tier === 'desktop' && !reduced;
  const parallaxRange = reduced || tier === 'mobile' ? 0 : tier === 'desktop' ? 20 : 8;

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [parallaxRange, -parallaxRange]);

  const rotateX = useSpring(0, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 24 });

  function handleCategoryChange(catId) {
    setActiveCategory(catId);
    setActiveIndex(0);
  }

  function handlePointerMove(e) {
    if (!canTilt || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(py * -8);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    onProjectHover?.(false);
  }

  function handleOpen(project, rect, triggerEl) {
    onProjectHover?.(false);
    setOverlayState({ project, rect, triggerEl });
  }

  function handleClose() {
    const triggerEl = overlayState?.triggerEl;
    setOverlayState(null);
    requestAnimationFrame(() => triggerEl?.focus());
  }

  return (
    <section
      id="work"
      className="mx-auto max-w-[1360px] scroll-mt-8 px-6 py-12 md:px-12 lg:px-16 lg:py-16"
    >
      {/* Section Header */}
      <motion.div
        initial={{ y: reduced ? 0 : 20 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-4 font-mono text-xs tracking-[.12em] text-[#60615a]">
          <span className="text-[#f4512b]">/01</span>
          <ScrambleText text="CLIENT WORK / AN EDITORIAL EXHIBITION" />
        </div>
        <div className="mb-6 mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-medium leading-[1.05] tracking-[-.055em] md:text-5xl">
            <EditorialSplitReveal text="Real problems." wordClassName="hover:text-[#f4512b]" />{' '}
            <EditorialSplitReveal
              text="Considered"
              delay={0.14}
              className="font-serif italic text-[#747b65]"
              wordClassName="hover:text-[#252820]"
            />{' '}
            <EditorialSplitReveal
              text="solutions."
              delay={0.22}
              wordClassName="hover:text-[#f4512b]"
            />
          </h2>
          <p className="max-w-[260px] text-xs leading-5 text-[#626559] md:text-sm">
            Client products and websites crafted for clarity and longevity.
          </p>
        </div>
      </motion.div>

      {/* Category Switcher */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#ccd0c1] py-2 md:mb-10">
        <div role="tablist" aria-label="Client project categories" className="flex flex-wrap gap-x-7 gap-y-1">
          {projectCategories.map((cat) => {
            const count = exhibitionProjects.filter((p) => p.category === cat.id).length;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleCategoryChange(cat.id)}
                className={`relative flex min-h-10 items-center gap-2.5 text-sm transition-colors ${focusRing} ${isSelected ? 'text-[#a93316]' : 'text-[#626559] hover:text-[#252820]'
                  }`}
              >
                {cat.label}
                <span className="font-mono text-xs">{String(count).padStart(2, '0')}</span>
                {isSelected && (
                  <motion.span
                    layoutId="exhibition-tab-indicator"
                    transition={{ duration: reduced ? 0 : 0.32, ease }}
                    className="absolute inset-x-0 bottom-0 h-px bg-[#c03d1d]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Editorial Index + Asymmetrical Visual Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -8 }}
          transition={{ duration: reduced ? 0 : 0.28, ease }}
          className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10"
        >
          {/* Left: Compact Client Project Index */}
          <div className="divide-y divide-[#ccd0c1] border-y border-[#ccd0c1] md:col-span-5">
            {filtered.map((project, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  onClick={(e) =>
                    handleOpen(project, e.currentTarget.getBoundingClientRect(), e.currentTarget)
                  }
                  className={`group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors ${focusRing}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs transition-colors ${isCurrent ? 'text-[#f4512b]' : 'text-[#7c8073]'
                          }`}
                      >
                        /{project.id}
                      </span>
                      <span
                        className={`truncate text-lg font-medium tracking-[-.035em] transition-colors md:text-xl ${isCurrent
                          ? 'text-[#252820]'
                          : 'text-[#626559] group-hover:text-[#252820]'
                          }`}
                      >
                        {project.name}
                        <span className="text-[#f4512b]">.</span>
                      </span>
                    </div>
                    <p className="mt-1 pl-8 font-mono text-[10px] tracking-[.1em] text-[#73776a]">
                      {project.tag}
                    </p>
                  </div>

                  <span
                    className={`flex shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-[.08em] transition-all duration-200 ${isCurrent
                      ? 'translate-x-0 text-[#b83b1d] opacity-100'
                      : '-translate-x-1 text-[#626559] opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`}
                  >
                    VIEW <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Compact Asymmetrical Visual Stage */}
          {activeProject && (
            <div ref={stageRef} className="relative md:col-span-7 md:pl-4">
              <motion.div
                style={{ y: parallaxY }}
                className="relative mx-auto max-w-[560px] will-change-transform"
              >
                <button
                  type="button"
                  onClick={(e) =>
                    handleOpen(
                      activeProject,
                      e.currentTarget.getBoundingClientRect(),
                      e.currentTarget
                    )
                  }
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') onProjectHover?.(true);
                  }}
                  onPointerMove={handlePointerMove}
                  onPointerLeave={handlePointerLeave}
                  aria-label={`View ${activeProject.name} project details`}
                  className={`group block w-full text-left ${focusRing}`}
                >
                  <div className="[perspective:1000px]">
                    <motion.div
                      key={activeProject.id}
                      initial={{
                        clipPath: reduced ? 'inset(0)' : 'inset(0 0 10% 0)',
                        opacity: 0.7,
                      }}
                      animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                      transition={{ duration: reduced ? 0 : 0.4, ease }}
                      style={
                        canTilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined
                      }
                      whileHover={canTilt ? { scale: 1.03 } : undefined}
                      className="relative aspect-[16/10] w-full overflow-hidden border border-[#68725538] shadow-[0_20px_44px_-28px_rgba(37,40,32,0.28)] transition-shadow duration-300 group-hover:shadow-[0_28px_54px_-24px_rgba(37,40,32,0.36)]"
                    >
                      <ProjectPreview project={activeProject} />
                    </motion.div>
                  </div>
                </button>

                {/* Deliberate overlapping offset thumbnail of next project */}
                {nextProject && (
                  <button
                    type="button"
                    onClick={() => setActiveIndex((activeIndex + 1) % filtered.length)}
                    aria-label={`Preview next project: ${nextProject.name}`}
                    className={`group absolute -bottom-4 -left-4 z-20 hidden aspect-[4/3] w-36 overflow-hidden border-2 border-[#f4f3ec] shadow-[0_18px_34px_-16px_rgba(37,40,32,0.35)] transition-transform duration-300 hover:-translate-y-1 md:block lg:w-44 ${focusRing}`}
                  >
                    <ProjectPreview project={nextProject} compact />
                  </button>
                )}

                {/* Concise one-line description */}
                <div className="mt-5 flex items-baseline justify-between gap-4 md:pl-36 lg:pl-44">
                  <p className="text-xs leading-5 text-[#5b5d53] md:text-sm">
                    {activeProject.oneLiner}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Compact Overlay */}
      <AnimatePresence>
        {overlayState && <ProjectOverlay active={overlayState} onClose={handleClose} />}
      </AnimatePresence>
    </section>
  );
}

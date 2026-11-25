'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Menu,
  X,
  Check,
  Copy,
  Globe2 as Linkedin,
} from 'lucide-react';
import { systems } from '@/data/portfolio';
import ProjectExhibition from '@/components/ProjectExhibition';
import HeroArtifact from '@/components/HeroArtifact';
import PortfolioChat from '@/components/PortfolioChat';
import { EditorialSplitReveal, ScrambleText } from '@/components/TextReveal';

const ease = [0.22, 1, 0.36, 1];
const linkStyle =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4512b] focus-visible:ring-offset-4';

function Reveal({ children, className = '' }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ y: reduced ? 0 : 26 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ number, children, light = false }) {
  return (
    <div
      className={`flex items-center gap-4 font-mono text-xs tracking-[.12em] ${
        light ? 'text-[#c4c5be]' : 'text-[#60615a]'
      }`}
    >
      <span className="text-[#f4512b]">/{number}</span>
      {typeof children === 'string' ? <ScrambleText text={children} /> : children}
    </div>
  );
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [activeSystem, setActiveSystem] = useState(0);
  const [copied, setCopied] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [projectHover, setProjectHover] = useState(false);
  const reduced = useReducedMotion();
  const menuButton = useRef(null);
  const s = systems[activeSystem];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  async function copyIntro() {
    const message =
      'Hi Ashin, I’d like to discuss a project with you.\n\nProject overview:\nTimeline:\nHow to reach me:';
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:ashinrajeevan319@gmail.com?subject=Let’s build something&body=${encodeURIComponent(
        message
      )}`;
    }
  }

  return (
    <div
      onPointerMove={(e) => {
        if (e.pointerType === 'mouse') setCursor({ x: e.clientX, y: e.clientY });
      }}
      className="overflow-x-hidden bg-[#f4f3ec] font-sans text-[#252820] selection:bg-[#f4512b] selection:text-white"
    >
      <a href="#work" className="sr-only z-50 bg-white p-4 focus:not-sr-only focus:fixed">
        Skip to selected work
      </a>
      {!reduced && (
        <motion.div
          aria-hidden="true"
          animate={{
            x: cursor.x - (projectHover ? 26 : 5),
            y: cursor.y - (projectHover ? 26 : 5),
            width: projectHover ? 52 : 10,
            height: projectHover ? 52 : 10,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          className={`pointer-events-none fixed left-0 top-0 z-50 hidden items-center justify-center rounded-full lg:flex ${
            projectHover
              ? 'bg-[#252820] text-[#f4f3ec] shadow-lg'
              : 'bg-[#f4512b] mix-blend-multiply'
          }`}
        >
          {projectHover && (
            <span className="font-mono text-[10px] tracking-[.12em]">VIEW</span>
          )}
        </motion.div>
      )}
      <header className="relative z-40 mx-auto flex h-24 max-w-[1600px] items-center justify-between border-b border-[#d5d6cc] px-6 md:mx-12 md:px-0 lg:mx-16">
        <a href="#" aria-label="Ashin Raj home" className={`flex items-center gap-3 ${linkStyle}`}>
          <span className="text-[42px] leading-none text-[#f4512b]">✳</span>
          <span className="text-lg font-semibold tracking-[-.05em]">
            ashin raj<span className="text-[#f4512b]">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
          {[
            ['Work', '#work'],
            ['About', '#about'],
            ['Approach', '#approach'],
          ].map(([t, h]) => (
            <a
              key={h}
              href={h}
              className={`group relative flex min-h-11 items-center text-sm ${linkStyle}`}
            >
              {t}
              <span className="absolute bottom-1 left-0 h-px w-0 bg-[#f4512b] transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={`hidden min-h-11 items-center gap-7 text-sm md:flex ${linkStyle}`}
        >
          Let’s talk <ArrowUpRight className="h-4 w-4" />
        </a>
        <button
          ref={menuButton}
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-label={menu ? 'Close navigation' : 'Open navigation'}
          className={`flex h-11 w-11 items-center justify-center md:hidden ${linkStyle}`}
        >
          {menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <AnimatePresence>
          {menu && (
            <motion.nav
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              aria-label="Mobile navigation"
              className="absolute left-0 right-0 top-full overflow-hidden border-b border-[#cccfc0] bg-[#f4f3ec] px-6 shadow-xl md:hidden"
            >
              {[
                ['Selected work', '#work'],
                ['A little about me', '#about'],
                ['My approach', '#approach'],
                ['Let’s talk', '#contact'],
              ].map(([t, h], i) => (
                <a
                  onClick={() => setMenu(false)}
                  key={h}
                  href={h}
                  className={`flex min-h-16 items-center justify-between border-b border-black/10 text-xl ${linkStyle}`}
                >
                  {t}
                  <span className="font-mono text-xs">0{i + 1}</span>
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <main>
        <section className="relative mx-auto max-w-[1600px] px-6 pb-8 pt-10 md:px-12 md:pt-14 lg:px-16">
          <motion.div
            initial={{ y: reduced ? 0 : 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease }}
            className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-[.1em] text-[#62645a]"
          >
            <ScrambleText text="INDEPENDENT MIND. FULL-STACK CRAFT." triggerOnMount />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#788666]" /> AVAILABLE FOR THE RIGHT
              OPPORTUNITY
            </span>
          </motion.div>
          <div className="relative mt-10 grid lg:grid-cols-[1.45fr_1fr] lg:items-center">
            <div className="relative z-10">
              <h1 className="text-[clamp(3.5rem,6.9vw,7.8rem)] font-medium uppercase leading-[.98] tracking-[-.075em]">
                {['Crafting fast,', 'SEO-ready', 'products', 'end to end.'].map((line, i) => (
                  <span
                    key={line}
                    className={`block ${i === 2 ? 'whitespace-nowrap' : ''} ${
                      i === 3 ? 'text-[#ef512f]' : ''
                    }`}
                  >
                    <EditorialSplitReveal
                      text={line}
                      triggerOnMount
                      delay={0.1 + i * 0.12}
                      stagger={0.07}
                      wordClassName={
                        i === 3 ? 'hover:text-[#252820]' : 'hover:text-[#ef512f]'
                      }
                    />
                    {i === 2 && (
                      <motion.span
                        initial={reduced ? { opacity: 1 } : { opacity: 0, x: -8, y: 8 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45, ease }}
                        className="inline-block align-baseline"
                      >
                        <ArrowUpRight
                          aria-hidden="true"
                          className="ml-5 inline h-[.6em] w-[.6em] text-[#6c735e]"
                          strokeWidth={1}
                        />
                      </motion.span>
                    )}
                  </span>
                ))}
              </h1>
              <div className="mt-7 flex items-start gap-4">
                <span className="mt-2 h-px w-8 shrink-0 bg-[#919581]" />
                <p className="max-w-[390px] text-sm leading-7 text-[#5e6156]">
                  I’m <strong className="font-medium text-[#252820]">Ashin Raj M.</strong>, a
                  Full-Stack Developer.
                  <br />
                  Clean interfaces. Dependable APIs.
                  <br className="sm:hidden" /> SEO-friendly websites built for production.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-7">
                <a
                  href="#work"
                  className={`group flex min-h-12 items-center gap-8 bg-[#282c23] px-5 text-sm text-[#f4f3ec] transition-colors hover:bg-[#f4512b] ${linkStyle}`}
                >
                  Explore my work{' '}
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                </a>
                <a
                  href="#contact"
                  className={`flex min-h-11 items-center gap-3 border-b border-[#7b7e70] text-sm ${linkStyle}`}
                >
                  Let’s work together <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 1, scale: reduced ? 1 : 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease }}
              className="mt-12 lg:-ml-7 lg:mt-0"
            >
              <HeroArtifact />
            </motion.div>
          </div>
          <div className="mt-14 flex items-center justify-between border-t border-[#d0d2c6] pt-5 font-mono text-xs text-[#65685a]">
            <ScrambleText text="PYTHON · DJANGO · REACT · NEXT.JS" triggerOnMount />
            <a href="#work" className={`flex min-h-11 items-center gap-5 ${linkStyle}`}>
              <span className="hidden sm:inline">SCROLL TO DISCOVER</span>
              <ArrowDown className="h-4 w-4" />
            </a>
            <ScrambleText
              text="DESIGNED WITH INTENT. BUILT WITH CARE."
              className="hidden md:inline-block"
              triggerOnMount
            />
          </div>
        </section>
        <ProjectExhibition onProjectHover={setProjectHover} />
        <section id="about" className="bg-[#e9ebdf] px-6 py-20 md:px-12 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1472px] gap-12 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <SectionLabel number="02">THE PERSON BEHIND THE CODE</SectionLabel>
              <div className="mt-14 flex h-44 w-44 rotate-[-8deg] items-center justify-center border border-[#a8ae99]">
                <span className="text-8xl font-medium tracking-[-.13em] text-[#69765a]">
                  ar<span className="text-[#ed512d]">.</span>
                </span>
              </div>
              <p className="mt-7 font-mono text-xs text-[#606650]">
                DEVELOPER BY TRADE. BUILDER BY NATURE.
              </p>
            </div>
            <Reveal>
              <h2 className="max-w-[800px] text-3xl font-medium leading-[1.25] tracking-[-.045em] md:text-5xl">
                Good software isn’t just what’s on the screen.
                <br />
                <span className="text-[#687359]">It’s everything that makes it work.</span>
              </h2>
              <div className="mt-8 grid gap-6 text-sm leading-7 text-[#555e49] md:grid-cols-2">
                <p>
                  I’m Ashin, a full-stack developer working across the entire product—from the
                  interface someone touches to the systems they never see. I build SEO-friendly
                  websites, web applications, backend systems, APIs, and integrations.
                </p>
                <p>
                  My work connects Python and Django with React and Next.js, backed by PostgreSQL
                  and production infrastructure. I care about clear decisions, maintainable code,
                  and shipping things that are genuinely useful.
                </p>
              </div>
              <div className="mt-12 border-t border-[#bbc2ac] pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-[#616951]">EXPERIENCE / 01</span>
                    <h3 className="mt-3 text-2xl font-medium tracking-[-.03em]">
                      Full-Stack Development
                    </h3>
                  </div>
                  <span className="pt-1 font-mono text-xs text-[#616951]">JAN 2024 — PRESENT</span>
                </div>
                <div className="mt-5 max-w-2xl space-y-4 text-sm leading-7 text-[#555e49]">
                  <p>
                    Full-Stack Developer with professional and freelance experience since 2024,
                    specializing in building scalable web applications, SEO-friendly websites, and
                    business-focused digital products. Experienced in developing backend systems
                    using Python, Django, and Django REST Framework, designing RESTful APIs, and
                    integrating PostgreSQL databases with modern frontend applications built using
                    React and Next.js.
                  </p>
                  <p>
                    Hands-on experience delivering production-ready applications across multiple
                    domains, including finance management platforms, Learning Management Systems
                    (LMS), and online assessment platforms. Skilled in authentication, role-based
                    access control, database design, API integration, technical SEO, performance
                    optimization, and deployment using Linux, Nginx, Gunicorn, and cloud
                    infrastructure.
                  </p>
                  <p>
                    Passionate about building reliable, maintainable, and user-friendly digital
                    solutions, taking projects from initial development through deployment and
                    production.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <section id="approach" className="bg-[#282d25] px-6 py-20 text-[#f3f3e9] md:px-12 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1472px]">
            <SectionLabel number="03" light>
              HOW I THINK. HOW I BUILD.
            </SectionLabel>
            <Reveal className="mb-14 mt-7 flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-5xl font-medium leading-[1.05] tracking-[-.055em] md:text-7xl">
                <EditorialSplitReveal text="One product." wordClassName="hover:text-[#fc784f]" />
                <br />
                <EditorialSplitReveal
                  text="Every layer."
                  delay={0.18}
                  className="font-serif italic text-[#b1ba9e]"
                  wordClassName="hover:text-[#f3f3e9]"
                />
              </h2>
              <p className="max-w-xs text-sm leading-7 text-[#c0c6b5]">
                The best experiences happen when the whole system works together. Here’s how I
                connect the dots.
              </p>
            </Reveal>
            <div className="grid border-y border-[#515846] lg:grid-cols-[1fr_1.1fr]">
              <div role="tablist" aria-label="Engineering layers" className="py-5 lg:pr-12">
                {systems.map((item, i) => (
                  <button
                    key={item.name}
                    id={`tab-${i}`}
                    role="tab"
                    aria-selected={activeSystem === i}
                    aria-controls="system-panel"
                    onClick={() => setActiveSystem(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        setActiveSystem((i + 1) % 4);
                        e.currentTarget.parentElement?.children[(i + 1) % 4]?.focus();
                      }
                      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        setActiveSystem((i + 3) % 4);
                        e.currentTarget.parentElement?.children[(i + 3) % 4]?.focus();
                      }
                    }}
                    className={`group flex min-h-20 w-full items-center gap-6 border-b border-[#444b3c] px-3 text-left transition-colors last:border-none ${linkStyle} ${
                      activeSystem === i ? 'text-[#fc784f]' : 'text-[#c0c6b5] hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-xs">{item.number}</span>
                    <span className="text-2xl tracking-[-.035em] md:text-3xl">{item.name}</span>
                    <ArrowRight
                      className={`ml-auto h-5 w-5 transition-transform ${
                        activeSystem === i ? '-rotate-45' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div
                id="system-panel"
                role="tabpanel"
                aria-labelledby={`tab-${activeSystem}`}
                className="relative flex min-h-[360px] flex-col justify-between border-t border-[#515846] p-6 lg:border-l lg:border-t-0 lg:p-10"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSystem}
                    initial={{ x: reduced ? 0 : 14 }}
                    animate={{ x: 0 }}
                    exit={{ x: reduced ? 0 : -14 }}
                    transition={{ duration: 0.25 }}
                  >
                    <s.icon className="mb-6 h-8 w-8 text-[#c0caac]" strokeWidth={1} />
                    <h3 className="text-2xl tracking-[-.03em]">{s.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#c0c6b5]">{s.copy}</p>
                    <p className="mt-5 font-mono text-xs leading-6 text-[#e4e8d9]">{s.tech}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-9 flex items-center gap-3 border-t border-[#515846] pt-5 font-mono text-xs text-[#bdc7a9]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#fc784f]" />
                  {s.code}
                </div>
              </div>
            </div>
            <p className="mt-6 text-right font-mono text-xs text-[#bdc5af]">
              NO SILOS. NO BLACK BOXES. JUST CONNECTED THINKING.
            </p>
          </div>
        </section>
        <section
          id="contact"
          className="relative mx-auto max-w-[1600px] px-6 pb-7 pt-20 md:px-12 lg:px-16 lg:pt-28"
        >
          <SectionLabel number="04">
            THE NEXT GOOD THING STARTS WITH A CONVERSATION
          </SectionLabel>
          <Reveal className="mt-10">
            <h2 className="text-[clamp(3.5rem,8.8vw,9rem)] font-medium uppercase leading-[.98] tracking-[-.07em]">
              <EditorialSplitReveal
                text="Have a project"
                wordClassName="hover:text-[#ed512d]"
              />
              <br />
              <EditorialSplitReveal
                text="in mind?"
                delay={0.14}
                wordClassName="hover:text-[#ed512d]"
              />{' '}
              <span className="text-[#ed512d]">
                <EditorialSplitReveal
                  text="Let’s"
                  delay={0.24}
                  wordClassName="hover:text-[#252820]"
                />
                <br className="md:hidden" />{' '}
                <EditorialSplitReveal
                  text="build it."
                  delay={0.3}
                  wordClassName="hover:text-[#252820]"
                />
              </span>
              <ArrowUpRight className="ml-3 inline h-[.7em] w-[.7em]" strokeWidth={1.3} />
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 border-b border-[#cccfc0] pb-14 md:grid-cols-2">
            <p className="max-w-md text-sm leading-7 text-[#616557]">
              An ambitious product, a complex problem, or a team doing meaningful work. I’d like to
              hear about it.
              <span className="mt-3 block font-mono text-xs text-[#252820]">
                ashinrajeevan319@gmail.com
              </span>
            </p>
            <div className="flex flex-wrap items-start gap-x-7 gap-y-3 md:justify-end">
              <a
                href="mailto:ashinrajeevan319@gmail.com?subject=Let%E2%80%99s%20build%20something&body=Hi%20Ashin%2C%0A%0AI%E2%80%99d%20like%20to%20discuss%20a%20project.%0A%0A"
                className={`flex min-h-12 items-center gap-8 bg-[#f4512b] px-5 text-sm text-[#252820] transition-colors hover:bg-[#ff784e] ${linkStyle}`}
              >
                Start an email <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                onClick={copyIntro}
                className={`flex min-h-12 items-center gap-3 text-sm ${linkStyle}`}
              >
                {copied ? 'Introduction copied' : 'Copy introduction'}
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <p className="w-full text-xs text-[#65685c] md:text-right">
                Opens a direct email draft to ashinrajeevan319@gmail.com.
              </p>
            </div>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-6 py-6 text-xs text-[#63675a]">
            <span suppressHydrationWarning>© {new Date().getFullYear()} ASHIN RAJ M.</span>
            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/in/ashin-raj-m-9201251ba/"
                target="_blank"
                rel="noreferrer"
                aria-label="Ashin Raj M. on LinkedIn"
                className={`flex min-h-11 items-center gap-2 ${linkStyle}`}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
            <a href="#" className={`flex min-h-11 items-center gap-4 font-mono ${linkStyle}`}>
              BACK TO TOP <ArrowUpRight className="h-4 w-4 -rotate-45" />
            </a>
          </footer>
        </section>
      </main>
      <PortfolioChat />
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const ease = [0.22, 1, 0.36, 1];
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_·';

/**
 * Smooth blur-to-sharp editorial word reveal (never leaves blank clipped boxes)
 * with interactive hover micro-lift on each word.
 */
export function EditorialSplitReveal({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.035,
  interactive = true,
  triggerOnMount = false,
}) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, idx) => {
        const animProps = triggerOnMount
          ? { animate: { y: 0, opacity: 1, filter: 'blur(0px)' } }
          : {
              whileInView: { y: 0, opacity: 1, filter: 'blur(0px)' },
              viewport: { once: true, amount: 0.1 },
            };

        return (
          <span key={`${word}-${idx}`} className="inline-block align-baseline">
            <motion.span
              initial={
                reduced
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { y: 10, opacity: 0.08, filter: 'blur(5px)' }
              }
              {...animProps}
              transition={{
                duration: reduced ? 0 : 0.48,
                delay: reduced ? 0 : delay + idx * stagger,
                ease,
              }}
              whileHover={
                interactive && !reduced
                  ? { y: -3, transition: { duration: 0.18, ease } }
                  : undefined
              }
              className={`inline-block will-change-transform ${
                interactive ? 'transition-colors duration-200' : ''
              } ${wordClassName}`}
            >
              {word}
            </motion.span>
            {idx < words.length - 1 && ' '}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Monospace technical label: clean fade-in on view (always readable),
 * with interactive glyph decode on hover.
 */
export function ScrambleText({ text, className = '', triggerOnMount = false }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(0);

  const runScramble = () => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = Math.min(520, Math.max(280, text.length * 14));

    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const revealedCount = Math.floor(progress * text.length);

      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === '·' || ch === '/' || ch === '.') {
          out += ch;
        } else if (i < revealedCount) {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  const viewProps = triggerOnMount
    ? { animate: { opacity: 1, y: 0 } }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.1 },
      };

  return (
    <motion.span
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 4 }}
      {...viewProps}
      transition={{ duration: reduced ? 0 : 0.4, ease }}
      onMouseEnter={runScramble}
      className={`inline-block ${className}`}
    >
      {display}
    </motion.span>
  );
}

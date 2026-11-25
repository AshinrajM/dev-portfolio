'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useSpring } from 'motion/react';
import { X, ArrowUpRight, Send } from 'lucide-react';
import { answerPortfolioQuestion, starterQuestions } from '@/data/portfolioAssistant';

const ease = [0.22, 1, 0.36, 1];
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4512b] focus-visible:ring-offset-2';

export default function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi! Ask me about Ashin’s projects, tech stack, SEO-friendly websites, or how to get in touch.',
      suggestions: starterQuestions,
    },
  ]);

  const reduced = useReducedMotion();
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const btnRotateX = useSpring(0, { stiffness: 260, damping: 20 });
  const btnRotateY = useSpring(0, { stiffness: 260, damping: 20 });

  function handleButtonMove(e) {
    if (reduced || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    btnRotateY.set(px * 18);
    btnRotateX.set(py * -18);
  }

  function handleButtonLeave() {
    btnRotateX.set(0);
    btnRotateY.set(0);
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  function askQuestion(questionText) {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };
    const reply = answerPortfolioQuestion(trimmed);
    const botMsg = {
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      ...reply,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    askQuestion(input);
  }

  return (
    <div className="fixed bottom-9 right-5 z-40 flex flex-col items-end gap-3 md:bottom-12 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Portfolio Q&A Assistant"
            initial={{ opacity: 0, y: reduced ? 0 : 14, scale: reduced ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.96 }}
            transition={{ duration: reduced ? 0 : 0.24, ease }}
            className="flex h-[460px] max-h-[75vh] w-[calc(100vw-2.5rem)] flex-col overflow-hidden border border-[#b9bdb0] bg-[#f4f3ec] shadow-2xl sm:w-[370px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3c4236] bg-[#282d25] px-4 py-3 text-[#f4f3ec]">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#f4512b]" />
                <div>
                  <p className="text-sm font-medium leading-none tracking-[-.02em]">
                    Ashin’s Assistant
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-[.1em] text-[#c4cdb6]">
                    INSTANT LOCAL Q&A
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close portfolio chat"
                className={`flex h-8 w-8 items-center justify-center text-[#c4cdb6] transition-colors hover:text-white ${focusRing}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-line px-3.5 py-2.5 text-[13px] leading-6 ${
                      msg.sender === 'user'
                        ? 'bg-[#282d25] text-[#f4f3ec]'
                        : 'border border-[#d0d3c6] bg-white/75 text-[#252820]'
                    }`}
                  >
                    {msg.text}

                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-3 border-t border-[#d0d3c6] pt-2">
                        {msg.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noreferrer' : undefined}
                            onClick={() => {
                              if (!link.external) setOpen(false);
                            }}
                            className={`inline-flex items-center gap-1 font-mono text-[11px] text-[#b83b1d] underline-offset-4 hover:underline ${focusRing}`}
                          >
                            {link.label}
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => askQuestion(s)}
                          className={`border border-[#c7cabe] bg-[#e9ebdf]/80 px-2.5 py-1 font-mono text-[10px] text-[#4e5346] transition-colors hover:border-[#f4512b] hover:text-[#252820] ${focusRing}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-[#ccd0c1] bg-[#ecece3] p-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, stack, SEO..."
                aria-label="Ask a question about Ashin's portfolio"
                className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-[#252820] placeholder:text-[#73776a] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send question"
                className={`flex h-9 w-9 shrink-0 items-center justify-center bg-[#282d25] text-[#f4f3ec] transition-colors hover:bg-[#f4512b] ${focusRing}`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Interactive 3D Chat-Bubble Toggle Button */}
      <div className="[perspective:700px]">
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onPointerMove={handleButtonMove}
          onPointerLeave={handleButtonLeave}
          style={
            reduced
              ? undefined
              : { rotateX: btnRotateX, rotateY: btnRotateY, transformStyle: 'preserve-3d' }
          }
          whileHover={reduced ? undefined : { y: -3, scale: 1.04 }}
          whileTap={reduced ? undefined : { y: 1, scale: 0.96 }}
          transition={{ duration: 0.2, ease }}
          aria-expanded={open}
          aria-label={open ? 'Close portfolio chat' : 'Open portfolio chat'}
          className={`group relative flex items-center gap-3 overflow-hidden border border-[#56604b] bg-[#282d25] text-sm text-[#f4f3ec] shadow-[0_6px_0_#171a14,0_16px_30px_-10px_rgba(37,40,32,0.55)] transition-all duration-200 hover:border-[#f4512b]/80 hover:shadow-[0_8px_0_#171a14,0_22px_36px_-10px_rgba(244,81,43,0.38)] active:shadow-[0_2px_0_#171a14,0_8px_16px_-6px_rgba(37,40,32,0.5)] ${
            open ? 'h-12 w-12 justify-center rounded-full' : 'h-13 rounded-full rounded-br-[6px] px-5'
          } ${focusRing}`}
        >
          {/* Specular sheen sweep on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />

          {open ? (
            <X className="relative z-10 h-4 w-4 text-[#f4f3ec]" />
          ) : (
            <>
              {/* Interactive Chat-Bubble Icon with Animated Typing Dots */}
              <span
                aria-hidden="true"
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full rounded-br-[3px] bg-[#f4512b] text-[#f4f3ec] shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ transform: 'translateZ(12px)' }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <circle
                    cx="7"
                    cy="12"
                    r="1.7"
                    className={
                      reduced
                        ? ''
                        : 'animate-[bounce_1.4s_ease-in-out_infinite] group-hover:animate-[bounce_0.8s_ease-in-out_infinite]'
                    }
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="1.7"
                    className={
                      reduced
                        ? ''
                        : 'animate-[bounce_1.4s_ease-in-out_0.2s_infinite] group-hover:animate-[bounce_0.8s_ease-in-out_0.15s_infinite]'
                    }
                  />
                  <circle
                    cx="17"
                    cy="12"
                    r="1.7"
                    className={
                      reduced
                        ? ''
                        : 'animate-[bounce_1.4s_ease-in-out_0.4s_infinite] group-hover:animate-[bounce_0.8s_ease-in-out_0.3s_infinite]'
                    }
                  />
                </svg>
              </span>

              <span
                className="relative z-10 font-mono text-xs tracking-[.08em]"
                style={{ transform: 'translateZ(8px)' }}
              >
                ASK ASHIN
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

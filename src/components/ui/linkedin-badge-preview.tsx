"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useState } from "react";

function LinkedInCard({ isDark }: { isDark: boolean }) {
  const bg          = isDark ? '#1d2226' : '#ffffff';
  const headerBg    = isDark ? '#283038' : '#f3f2ef';
  const border      = isDark ? '#38434f' : '#dce6f0';
  const text        = isDark ? '#f3f2ef' : '#191919';
  const sub         = isDark ? '#a9a9a9' : '#666666';
  const btnColor    = '#0a66c2';

  return (
    <div style={{
      width: 300,
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 8,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    }}>
      <div style={{ background: headerBg, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a66c2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: text }}>LinkedIn</span>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatar.png"
            alt="Ayan Bin Saif"
            width={52}
            height={52}
            style={{ borderRadius: '50%', flexShrink: 0, border: `1px solid ${border}` }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: text, lineHeight: 1.2 }}>
              Ayan Bin Saif
            </div>
            <div style={{ fontSize: 12, color: sub, marginTop: 4, lineHeight: 1.45 }}>
              Engineering @ TERN | Applied Math + Computing + Machine Learning @ University of Waterloo
            </div>
            <div style={{ fontSize: 11, color: sub, marginTop: 3 }}>
              TERN · University of Waterloo
            </div>
          </div>
        </div>

        <a
          href="https://linkedin.com/in/stitches"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '6px',
            border: `1.5px solid ${btnColor}`,
            borderRadius: 20,
            color: btnColor,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          View profile
        </a>
      </div>
    </div>
  );
}

export function LinkedInBadgePreview({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isOpen, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) / 2);
  };

  return (
    <HoverCardPrimitive.Root openDelay={50} closeDelay={100} onOpenChange={setOpen}>
      <HoverCardPrimitive.Trigger asChild>
        <a
          href="https://linkedin.com/in/stitches"
          onMouseMove={handleMouseMove}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
        side="top"
        align="center"
        sideOffset={10}
        style={{ zIndex: 9999 }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{ x: translateX }}
            >
              <LinkedInCard isDark={isDark} />
            </motion.div>
          )}
        </AnimatePresence>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
}

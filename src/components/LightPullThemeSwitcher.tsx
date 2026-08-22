'use client'
import { motion, useMotionValue, useTransform } from "motion/react";

// Distance from the top of the wrapper down to the knob at rest.
const CORD_REST = 64;

export function LightPullThemeSwitcher() {
    const toggleDarkMode = () => {
        const root = document.documentElement;
        const isDark = root.classList.toggle("dark");
        // layout.tsx's boot script reads this back before first paint, so without
        // it a pulled theme reverts on the next navigation.
        try {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch {}
    };

    // The cord stretches with the drag rather than moving with the knob. A cord
    // parented to the knob translates instead, which needs an overflow-hidden
    // ancestor to hide its end -- and that same clip then cuts off the knob once
    // it is pulled past the container.
    const y = useMotionValue(0);
    const cordHeight = useTransform(y, (v) => Math.max(0, CORD_REST + v));

    return (
      /* Positioned against .site-nav, not laid out in its flex row: the rope has to
         start at y=0 even when the nav links wrap, and right-12 keeps the 120px
         hint box inside the viewport instead of forcing a horizontal scroll. */
      <div className="absolute right-12 top-0 pt-16">
        {/* Stationary hint: a sibling of the knob rather than a child, pinned to the
            knob's rest centre (16px across, 48px down). It comes first in the DOM so
            the cord and knob paint over it when pulled. The arc runs left-to-right
            under the circle (sweep-flag 0 in SVG's y-down space), which is what keeps
            the glyphs upright instead of inverted. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="pointer-events-none absolute left-1/2 top-[80px] z-0 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
        >
          <path id="theme-pull-arc" d="M 12 60 A 48 48 0 0 0 108 60" fill="none" />
          <text fill="currentColor" fontSize="8.5" letterSpacing="1.1" textAnchor="middle">
            <textPath href="#theme-pull-arc" startOffset="50%">
              pull down to change theme
            </textPath>
          </text>
        </svg>
        <motion.div
          aria-hidden="true"
          style={{ height: cordHeight }}
          className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 bg-neutral-200 dark:bg-neutral-700"
        />
        <motion.div
          drag="y"
          dragDirectionLock
          style={{ y }}
          onDragEnd={(event, info) => {
            if (info.offset.y > 0) {
              toggleDarkMode();
            }
          }}
          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
          dragElastic={0.075}
          whileDrag={{ cursor: "grabbing" }}
          // drag alone leaves this unusable by keyboard, and a tap reports an
          // offset of 0 so it would never toggle on touch.
          role="button"
          tabIndex={0}
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleDarkMode();
            }
          }}
          className="relative z-10 w-8 h-8 rounded-full cursor-grab
               bg-[radial-gradient(circle_at_center,_#facc15,_#fcd34d,_#fef9c3)] 
               dark:bg-[radial-gradient(circle_at_center,_#4b5563,_#1f2937,_#000)] 
               shadow-[0_0_20px_8px_rgba(250,204,21,0.5)] 
               dark:shadow-[0_0_20px_6px_rgba(31,41,55,0.7)]"
        />
      </div>
    );
}

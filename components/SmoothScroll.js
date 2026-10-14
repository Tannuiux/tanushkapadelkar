"use client";
// Lenis gives the whole page smooth, eased scrolling (the same library Divyansh uses).
// MotionConfig reducedMotion="user" turns animations off for people who ask their device for less motion.
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -20 } }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}

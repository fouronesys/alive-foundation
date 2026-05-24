import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

interface AnimatedLogoProps {
  size?: number;
  className?: string;
  /** If false, play the sequence once. If true, replay every (holdDuration + animation) seconds. Default: true. */
  loop?: boolean;
  /** Seconds the logo stays visible before the whirlpool plays again. Default: 60 (loop) / 1.4 (one-shot). */
  holdDuration?: number;
  /** Fired once when whirl + reveal finishes and the logo is fully visible. */
  onComplete?: () => void;
}

// "Gota" — teardrop pointing toward the center of the whirlpool
function Drop({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 40 56"
      aria-hidden
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}
    >
      <path
        d="M20 2 C 6 22, 2 36, 20 54 C 38 36, 34 22, 20 2 Z"
        fill={color}
      />
    </svg>
  );
}

// 8 drops alternating brand colors, evenly spaced around a circle
const BRAND_COLORS = ["#F5821F", "#F5C400", "#00B5CC", "#1A2F4E"];
const DROP_COUNT = 8;

const WHIRL_DURATION = 2.4; // seconds spinning before logo reveal
const REVEAL_DURATION = 0.7;
const REVEAL_TOTAL = WHIRL_DURATION + REVEAL_DURATION; // ≈ 3.1s
const DEFAULT_HOLD_LOOP = 60; // default hold time in loop mode (1 minute)
const DEFAULT_HOLD_ONESHOT = 1.4; // default hold time in one-shot mode

/**
 * Plays the whirlpool → logo reveal sequence ONCE. Logo stays visible at the
 * end. `cycleSeconds` is just used to scale framer-motion's normalized `times`
 * — the keyframes always end with the logo fully visible, no exit frame.
 */
function OneShotAnimation({
  size,
  cycleSeconds,
  onRevealComplete,
}: {
  size: number;
  cycleSeconds: number;
  onRevealComplete?: () => void;
}) {
  const orbitRadius = size * 0.7;
  const dropSize = size * 0.18;

  const tWhirlEnd = WHIRL_DURATION / cycleSeconds;
  const tRevealEnd = REVEAL_TOTAL / cycleSeconds;

  useEffect(() => {
    if (!onRevealComplete) return;
    const id = window.setTimeout(onRevealComplete, REVEAL_TOTAL * 1000);
    return () => window.clearTimeout(id);
  }, [onRevealComplete]);

  return (
    <>
      {/* Whirlpool — rotating container holding all drops */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
        initial={{ rotate: 0, scale: 1.15, opacity: 0 }}
        animate={{
          rotate: [0, -540, -900],
          scale: [1.15, 0.45, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: cycleSeconds,
          times: [0, tWhirlEnd * 0.7, tWhirlEnd],
          ease: ["easeIn", "easeIn"],
        }}
      >
        {Array.from({ length: DROP_COUNT }).map((_, i) => {
          const angle = (i / DROP_COUNT) * Math.PI * 2;
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;
          const pointAtCenter = (angle * 180) / Math.PI + 90;
          const color = BRAND_COLORS[i % BRAND_COLORS.length];
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${pointAtCenter}deg)`,
              }}
            >
              <Drop color={color} size={dropSize} />
            </div>
          );
        })}
      </motion.div>

      {/* Color flash where the whirlpool collapses — bridges whirl → logo reveal */}
      <motion.div
        aria-hidden
        className="absolute rounded-full bg-gradient-to-tr from-brand-orange via-brand-yellow to-brand-aqua blur-2xl"
        style={{ width: size * 1.2, height: size * 1.2 }}
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{
          opacity: [0, 0, 0.9, 0.3, 0],
          scale: [0.1, 0.1, 1.2, 1, 0.6],
        }}
        transition={{
          duration: cycleSeconds,
          times: [0, tWhirlEnd * 0.95, tWhirlEnd, tRevealEnd, 1],
          ease: "easeInOut",
        }}
      />

      {/* The real logo — bursts out from the whirlpool's center and stays */}
      <motion.img
        src={logo}
        alt="Alive Foundation"
        className="relative rounded-full object-cover border-4 border-white shadow-2xl"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{
          opacity: [0, 0, 1, 1],
          scale: [0, 0, 1, 1],
          rotate: [-180, -180, 0, 0],
        }}
        transition={{
          duration: cycleSeconds,
          times: [0, tWhirlEnd, tRevealEnd, 1],
          ease: [0.34, 1.56, 0.64, 1],
        }}
      />
    </>
  );
}

export default function AnimatedLogo({
  size = 130,
  className = "",
  loop = true,
  holdDuration,
  onComplete,
}: AnimatedLogoProps) {
  const holdDur =
    holdDuration ?? (loop ? DEFAULT_HOLD_LOOP : DEFAULT_HOLD_ONESHOT);
  // Total time of one cycle: whirl + reveal + visible hold
  const cycleSeconds = REVEAL_TOTAL + holdDur;

  // When loop=true, force the inner animation to remount every `cycleSeconds`
  // by incrementing this counter — much more reliable than framer-motion's
  // repeat:Infinity for very long durations.
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (!loop) return;
    const id = window.setInterval(
      () => setCycle((c) => c + 1),
      cycleSeconds * 1000,
    );
    return () => window.clearInterval(id);
  }, [loop, cycleSeconds]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size * 2.2, height: size * 2.2 }}
    >
      <OneShotAnimation
        key={cycle}
        size={size}
        cycleSeconds={cycleSeconds}
        onRevealComplete={onComplete}
      />
    </div>
  );
}

import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

// A teardrop / "gota" SVG path
function Drop({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 40 54"
      aria-hidden
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}
    >
      <path
        d="M20 2 C 6 22, 2 34, 20 52 C 38 34, 34 22, 20 2 Z"
        fill={color}
      />
    </svg>
  );
}

// Drop config: starts from a random offset/angle outside the logo, spirals into a final position around it
const DROPS = [
  {
    color: "#F5821F", // orange
    fromX: -180,
    fromY: -160,
    fromRot: -540,
    // Final = arranged in a partial arc above the logo
    toX: -52,
    toY: -64,
    toRot: -30,
    delay: 0,
  },
  {
    color: "#F5C400", // yellow
    fromX: 200,
    fromY: -180,
    fromRot: 540,
    toX: 14,
    toY: -78,
    toRot: 10,
    delay: 0.15,
  },
  {
    color: "#00B5CC", // aqua
    fromX: 220,
    fromY: 160,
    fromRot: 720,
    toX: 60,
    toY: -32,
    toRot: 55,
    delay: 0.3,
  },
  {
    color: "#1A2F4E", // navy
    fromX: -220,
    fromY: 180,
    fromRot: -720,
    toX: -68,
    toY: -10,
    toRot: -65,
    delay: 0.45,
  },
];

const ASSEMBLY_DURATION = 1.4; // s
const HOLD_BEFORE_LOGO = 0.25;
const LOGO_REVEAL_DURATION = 0.8;
const LOOP_INTERVAL = 9; // s — restart the whole animation every 9s

export default function AnimatedLogo({
  size = 130,
  className = "",
}: AnimatedLogoProps) {
  const logoRevealStart =
    ASSEMBLY_DURATION + HOLD_BEFORE_LOGO; // after drops settle
  const logoFullyVisible = logoRevealStart + LOGO_REVEAL_DURATION;
  // Drops fade out as logo reveals
  const dropFadeOutStart = logoRevealStart + 0.1;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size * 1.8, height: size * 1.8 }}
    >
      {/* Animated colored drops */}
      {DROPS.map((d, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={{
            x: d.fromX,
            y: d.fromY,
            rotate: d.fromRot,
            opacity: 0,
            scale: 0.4,
          }}
          animate={{
            x: [d.fromX, d.toX, d.toX, d.fromX * 0.4],
            y: [d.fromY, d.toY, d.toY, d.fromY * 0.4],
            rotate: [d.fromRot, d.toRot, d.toRot, d.fromRot * 0.6],
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 1, 0.6],
          }}
          transition={{
            duration: LOOP_INTERVAL,
            times: [
              0,
              (ASSEMBLY_DURATION + d.delay) / LOOP_INTERVAL,
              dropFadeOutStart / LOOP_INTERVAL,
              (dropFadeOutStart + 0.5) / LOOP_INTERVAL,
            ],
            repeat: Infinity,
            ease: ["easeOut", "easeInOut", "easeIn"],
          }}
        >
          <Drop color={d.color} size={size * 0.22} />
        </motion.div>
      ))}

      {/* Soft glow that pulses when logo appears */}
      <motion.div
        aria-hidden
        className="absolute rounded-full bg-gradient-to-tr from-brand-orange/60 via-brand-yellow/40 to-brand-aqua/60 blur-2xl"
        style={{ width: size * 1.1, height: size * 1.1 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: [0, 0, 0.6, 0.4, 0.6, 0],
          scale: [0.6, 0.6, 1.1, 1, 1.1, 0.6],
        }}
        transition={{
          duration: LOOP_INTERVAL,
          times: [
            0,
            logoRevealStart / LOOP_INTERVAL,
            logoFullyVisible / LOOP_INTERVAL,
            (logoFullyVisible + 1.5) / LOOP_INTERVAL,
            (logoFullyVisible + 3) / LOOP_INTERVAL,
            (LOOP_INTERVAL - 0.3) / LOOP_INTERVAL,
          ],
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* The real logo — appears after drops are assembled, holds, then fades for the next loop */}
      <motion.img
        src={logo}
        alt="Alive Foundation"
        className="relative rounded-full object-cover border-4 border-white shadow-2xl"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          scale: [0.4, 0.4, 1, 1.04, 0.7],
          rotate: [-25, -25, 0, 0, 15],
        }}
        transition={{
          duration: LOOP_INTERVAL,
          times: [
            0,
            logoRevealStart / LOOP_INTERVAL,
            logoFullyVisible / LOOP_INTERVAL,
            (LOOP_INTERVAL - 0.8) / LOOP_INTERVAL,
            (LOOP_INTERVAL - 0.1) / LOOP_INTERVAL,
          ],
          repeat: Infinity,
          ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot when revealing
        }}
      />
    </div>
  );
}

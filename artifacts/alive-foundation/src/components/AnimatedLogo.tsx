import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

interface AnimatedLogoProps {
  size?: number;
  className?: string;
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
const HOLD_DURATION = 60; // logo visible duration (1 minute)
const EXIT_DURATION = 0.6; // logo fades out
const LOOP = WHIRL_DURATION + REVEAL_DURATION + HOLD_DURATION + EXIT_DURATION;
//        ≈ 2.4 + 0.7 + 5.5 + 0.6 = 9.2s

export default function AnimatedLogo({
  size = 130,
  className = "",
}: AnimatedLogoProps) {
  const orbitRadius = size * 0.7; // initial orbit radius (outside the logo)
  const dropSize = size * 0.18;

  // Key timing breakpoints (normalized 0..1 across LOOP)
  const tWhirlEnd = WHIRL_DURATION / LOOP;
  const tRevealEnd = (WHIRL_DURATION + REVEAL_DURATION) / LOOP;
  const tHoldEnd =
    (WHIRL_DURATION + REVEAL_DURATION + HOLD_DURATION) / LOOP;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size * 2.2, height: size * 2.2 }}
    >
      {/* Whirlpool — rotating container holding all drops */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
        initial={{ rotate: 0, scale: 1.15, opacity: 0 }}
        animate={{
          // Counter-clockwise: negative rotation, accelerating to 3 full revs
          rotate: [0, -540, -900, -900, -900],
          // Whirlpool collapses inward: scale shrinks toward center
          scale: [1.15, 0.45, 0, 0, 0],
          // Visible only during the whirl phase
          opacity: [0, 1, 0, 0, 0],
        }}
        transition={{
          duration: LOOP,
          times: [
            0,
            tWhirlEnd * 0.7,
            tWhirlEnd,
            tHoldEnd,
            1,
          ],
          repeat: Infinity,
          ease: ["easeIn", "easeIn", "linear", "linear"],
        }}
      >
        {Array.from({ length: DROP_COUNT }).map((_, i) => {
          const angle = (i / DROP_COUNT) * Math.PI * 2;
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;
          // Orient drop so its point faces the center
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
          opacity: [0, 0, 0.9, 0.5, 0.5, 0],
          scale: [0.1, 0.1, 1.2, 1, 1, 0.4],
        }}
        transition={{
          duration: LOOP,
          times: [
            0,
            tWhirlEnd * 0.95,
            tWhirlEnd,
            tRevealEnd,
            tHoldEnd,
            1,
          ],
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* The real logo — bursts out from the whirlpool's center */}
      <motion.img
        src={logo}
        alt="Alive Foundation"
        className="relative rounded-full object-cover border-4 border-white shadow-2xl"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          scale: [0, 0, 1, 1.03, 0.7],
          // Logo emerges counter-spinning the last bit of the whirlpool
          rotate: [-180, -180, 0, 0, 30],
        }}
        transition={{
          duration: LOOP,
          times: [
            0,
            tWhirlEnd,
            tRevealEnd,
            tHoldEnd,
            1,
          ],
          repeat: Infinity,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      />
    </div>
  );
}

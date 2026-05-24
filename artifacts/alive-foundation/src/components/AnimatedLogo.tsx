import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

interface AnimatedLogoProps {
  size?: number;
  withRings?: boolean;
  className?: string;
}

export default function AnimatedLogo({
  size = 160,
  withRings = true,
  className = "",
}: AnimatedLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size * 1.6, height: size * 1.6 }}
    >
      {withRings && (
        <>
          {/* Pulsing concentric rings — brand colors */}
          {[0, 0.6, 1.2].map((delay, i) => (
            <motion.span
              key={i}
              aria-hidden
              className={`absolute rounded-full border-[3px] ${
                i === 0
                  ? "border-brand-orange"
                  : i === 1
                    ? "border-brand-aqua"
                    : "border-brand-yellow"
              }`}
              style={{ width: size, height: size }}
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Soft glow halo */}
          <motion.span
            aria-hidden
            className="absolute rounded-full bg-gradient-to-tr from-brand-orange via-brand-yellow to-brand-aqua blur-2xl"
            style={{ width: size * 1.2, height: size * 1.2 }}
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Logo with breathing + subtle rotation */}
      <motion.img
        src={logo}
        alt="Alive Foundation"
        className="relative rounded-full object-cover border-4 border-white shadow-2xl"
        style={{ width: size, height: size }}
        initial={{ scale: 0.85, opacity: 0, rotate: -10 }}
        animate={{
          scale: [1, 1.04, 1],
          opacity: 1,
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.8 },
        }}
        whileHover={{ scale: 1.08, rotate: 0, transition: { duration: 0.3 } }}
      />
    </div>
  );
}

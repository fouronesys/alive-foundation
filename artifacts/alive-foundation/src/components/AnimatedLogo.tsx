import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

export default function AnimatedLogo({
  size = 120,
  className = "",
}: AnimatedLogoProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <motion.img
        src={logo}
        alt="Alive Foundation"
        className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
        animate={{
          // Heartbeat: double-pump scale (lub-dub) then rest
          scale: [1, 1.08, 1, 1.06, 1, 1, 1],
          // Gentle greeting sway
          rotate: [0, -5, 5, -3, 3, 0, 0],
        }}
        transition={{
          duration: 2.6,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.55, 1],
          repeat: Infinity,
          repeatDelay: 0.8,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.15,
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.6, ease: "easeInOut" },
        }}
      />
    </motion.div>
  );
}

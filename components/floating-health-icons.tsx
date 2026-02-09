"use client";

import {
  Pill,
  PillBottle,
  HeartPulse,
  Bandage,
  SquarePlus,
  Dna,
  Stethoscope,
  Thermometer,
  Droplet,
  Syringe,
  Activity,
  TestTube,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const ICONS = [
  Pill,
  PillBottle,
  HeartPulse,
  Bandage,
  SquarePlus,
  Dna,
  Stethoscope,
  Thermometer,
  Droplet,
  Syringe,
  Activity,
  TestTube,
];

const MAX_ICONS = 12;

type IconConfig = {
  id: number;
  Icon: (typeof ICONS)[number];
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  xOffset: [number, number];
  rotate: [number, number];
  scale: [number, number, number, number];
};

function generateConfig(): IconConfig[] {
  const configs: IconConfig[] = [];
  for (let i = 0; i < MAX_ICONS; i++) {
    configs.push({
      id: i,
      Icon: ICONS[i % ICONS.length],
      left: Math.random() * 100,
      top: Math.random() * 120 - 10,
      size: 24 + Math.random() * 40,
      opacity: 0.12 + Math.random() * 0.16,
      delay: 0.5 + Math.random() * 4.5,
      duration: 12 + Math.random() * 13,
      xOffset: [Math.random() * 40 - 20, Math.random() * 40 - 20],
      rotate: [Math.random() * 20 - 10, Math.random() * 20 - 10 + 15],
      scale: [0.6 + Math.random() * 0.5, 1.05, 0.92, 0.98 + Math.random() * 0.2],
    });
  }
  return configs;
}

/**
 * Subtle floating medication/health icons in the background.
 * Gentle upward drift + horizontal sway + scale/rotation bob.
 * Respects reduced motion; max 12 icons; low opacity; behind content (z-index -10).
 */
export function FloatingHealthIcons() {
  const reducedMotion = useReducedMotion();
  const [configs, setConfigs] = useState<IconConfig[]>([]);

  useEffect(() => {
    setConfigs(generateConfig());
  }, []);

  const containerClass = useMemo(
    () =>
      "pointer-events-none fixed inset-0 z-[-10] overflow-hidden text-muted/30",
    []
  );

  if (configs.length === 0) return null;

  return (
    <div aria-hidden className={containerClass}>
      {configs.map((cfg) => (
        <FloatingIcon key={cfg.id} config={cfg} reducedMotion={!!reducedMotion} />
      ))}
    </div>
  );
}

function FloatingIcon({
  config,
  reducedMotion,
}: {
  config: IconConfig;
  reducedMotion: boolean;
}) {
  const { Icon, left, top, size, opacity, delay, duration, xOffset, rotate, scale } = config;

  if (reducedMotion) {
    return (
      <div
        className="absolute opacity-[0.08]"
        style={{
          left: `${left}vw`,
          top: `${Math.min(top, 100)}vh`,
          width: size,
          height: size,
          willChange: "auto",
        }}
      >
        <Icon className="h-full w-full" size={size} />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: `${left}vw`,
        top: `${top}vh`,
        width: size,
        height: size,
        opacity,
        willChange: "transform",
      }}
      initial={{
        x: 0,
        y: 0,
        rotate: rotate[0],
        scale: scale[0],
      }}
      animate={{
        y: ["0vh", "-35vh"],
        x: [`${xOffset[0] * 0.15}vw`, `${xOffset[1] * 0.15}vw`],
        rotate: [rotate[0], rotate[1]],
        scale: scale,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      <Icon className="h-full w-full" size={size} />
    </motion.div>
  );
}

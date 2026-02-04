"use client"

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type MotionMainProps = HTMLMotionProps<"main"> & { children?: React.ReactNode };
export function MotionMain({ children, className, ...props }: MotionMainProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.main>
  );
}

type MotionButtonProps = HTMLMotionProps<"button"> & { children?: React.ReactNode };
export function MotionButton({ children, className, ...props }: MotionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default MotionMain;

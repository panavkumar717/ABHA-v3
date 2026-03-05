"use client"

import { motion } from "framer-motion"

export function AbhaLogo({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 28, text: "text-xl" },
    md: { icon: 36, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  }
  const s = sizes[size]

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="relative flex items-center justify-center rounded-xl"
        style={{ width: s.icon + 16, height: s.icon + 16, background: "linear-gradient(135deg, #0A7764, #12B88A)" }}
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path d="M20 8h8v12h12v8H28v12h-8V28H8v-8h12V8z" fill="#F8FFFE" />
        </svg>
        <div
          className="absolute inset-0 rounded-xl"
          style={{ boxShadow: "0 0 30px rgba(18, 184, 138, 0.4)" }}
        />
      </div>
      <div>
        <h1 className={`${s.text} font-bold tracking-tight text-foreground`}>
          ABHA<span className="text-primary-light">+</span>
        </h1>
      </div>
    </motion.div>
  )
}

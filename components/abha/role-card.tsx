"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface RoleCardProps {
  icon: LucideIcon
  label: string
  sublabel: string
  href: string
  color: string
  glowColor: string
  delay: number
}

export function RoleCard({ icon: Icon, label, sublabel, href, color, glowColor, delay }: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 200, damping: 20 }}
    >
      <Link href={href} className="block group h-full">
        <motion.div
          className="glass-card relative rounded-2xl p-8 flex flex-col items-center gap-5 cursor-pointer overflow-hidden h-full"
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{ boxShadow: `0 0 60px ${glowColor}, inset 0 0 60px ${glowColor}` }}
          />

          {/* Icon with pulse ring */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
              style={{ background: `${color}20` }}
            >
              <Icon size={36} style={{ color }} />
            </div>

            {/* Animated pulse rings */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${color}`,
                animation: "pulse-ring 2s ease-out infinite",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${color}`,
                animation: "pulse-ring 2s ease-out infinite 0.4s",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${color}`,
                animation: "pulse-ring 2s ease-out infinite 0.8s",
              }}
            />
          </div>

          <div className="text-center relative z-10">
            <h3 className="text-xl font-bold text-foreground mb-1">{label}</h3>
            <p className="text-sm text-muted-foreground">{sublabel}</p>
          </div>

          {/* Animated border glow on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ border: `1px solid ${color}50` }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

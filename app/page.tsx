"use client"

import { motion } from "framer-motion"
import { Building2, Stethoscope, Heart } from "lucide-react"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { AbhaLogo } from "@/components/abha/logo"
import { RoleCard } from "@/components/abha/role-card"
import { ThemeToggle } from "@/components/abha/theme-toggle"

const roles = [
  {
    icon: Building2,
    label: "Hospital / OPD Counter",
    sublabel: "Government Hospital Login",
    href: "/login/hospital",
    color: "#0A7764",
    glowColor: "rgba(18, 184, 138, 0.35)",
  },
  {
    icon: Stethoscope,
    label: "Doctor Portal",
    sublabel: "Patient Consultation",
    href: "/login/doctor",
    color: "#1A6EBF",
    glowColor: "rgba(26, 110, 191, 0.35)",
  },
  {
    icon: Heart,
    label: "Patient Access",
    sublabel: "Login with Mobile OTP",
    href: "/login/patient",
    color: "#E63946",
    glowColor: "rgba(230, 57, 70, 0.35)",
  },
]

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <AnimatedBackground />

      {/* Theme Toggle - top right */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-4xl">
        {/* Logo + Tagline */}
        <div className="text-center flex flex-col items-center gap-4">
          <AbhaLogo size="lg" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-1"
          >
            <p className="text-lg md:text-xl font-medium text-primary tracking-wide">
              Swasthya Seva, Powered by AI
            </p>
            <p className="text-sm text-muted-foreground">
              India&apos;s next-generation hospital management platform
            </p>
          </motion.div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {roles.map((role, i) => (
            <RoleCard key={role.label} {...role} delay={0.4 + i * 0.15} />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-muted-foreground/60 text-center"
        >
          Powered by National Health Authority, Government of India
        </motion.p>
      </div>
    </main>
  )
}

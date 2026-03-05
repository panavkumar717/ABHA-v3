"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Eye, EyeOff, ArrowLeft, Activity, Users, Server } from "lucide-react"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { AbhaLogo } from "@/components/abha/logo"
import { ThemeToggle } from "@/components/abha/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

const floatingStats = [
  { icon: Users, label: "2,341 Patients Today", delay: 0 },
  { icon: Activity, label: "99.2% Uptime", delay: 0.3 },
  { icon: Server, label: "14 Departments Active", delay: 0.6 },
]

export default function HospitalLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [hospitalId, setHospitalId] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/hospital/opd")
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden">
      <AnimatedBackground />

      {/* Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex flex-col justify-center items-center relative z-10 w-[60%] p-12">
        <div className="flex flex-col items-center gap-8">
          <AbhaLogo size="lg" />

          {/* Abstract hospital silhouette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-64 h-48"
          >
            <svg viewBox="0 0 260 200" className="w-full h-full" aria-hidden="true">
              <rect x="70" y="60" width="120" height="120" rx="8" fill="#0A7764" opacity="0.3" />
              <rect x="90" y="30" width="80" height="150" rx="6" fill="#0A7764" opacity="0.5" />
              <rect x="118" y="45" width="24" height="8" rx="2" fill="#12B88A" />
              <rect x="126" y="37" width="8" height="24" rx="2" fill="#12B88A" />
              <rect x="100" y="70" width="16" height="16" rx="3" fill="#1A6EBF" opacity="0.4" />
              <rect x="122" y="70" width="16" height="16" rx="3" fill="#1A6EBF" opacity="0.4" />
              <rect x="144" y="70" width="16" height="16" rx="3" fill="#1A6EBF" opacity="0.4" />
              <rect x="100" y="96" width="16" height="16" rx="3" fill="#1A6EBF" opacity="0.3" />
              <rect x="122" y="96" width="16" height="16" rx="3" fill="#1A6EBF" opacity="0.3" />
              <rect x="144" y="96" width="16" height="16" rx="3" fill="#1A6EBF" opacity="0.3" />
              <rect x="117" y="140" width="26" height="40" rx="4" fill="#12B88A" opacity="0.6" />
              <line x1="30" y1="100" x2="70" y2="80" stroke="#12B88A" strokeWidth="1" opacity="0.4" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="190" y1="90" x2="230" y2="70" stroke="#1A6EBF" strokeWidth="1" opacity="0.4" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.2s" repeatCount="indefinite" />
              </line>
            </svg>
          </motion.div>

          {/* Floating stat pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {floatingStats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + stat.delay, duration: 0.5 }}
                className="glass-card rounded-full px-4 py-2 flex items-center gap-2"
                style={{ animation: "float 4s ease-in-out infinite", animationDelay: `${stat.delay}s` }}
              >
                <stat.icon size={14} className="text-primary-light" />
                <span className="text-xs font-medium text-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated waveform at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-20">
          <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 L1200,100 L0,100 Z" fill="#12B88A">
              <animate attributeName="d" dur="4s" repeatCount="indefinite"
                values="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 L1200,100 L0,100 Z;
                        M0,50 Q150,80 300,50 T600,50 T900,50 T1200,50 L1200,100 L0,100 Z;
                        M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 L1200,100 L0,100 Z" />
            </path>
          </svg>
        </div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[40%] relative z-10 p-6 md:p-12">
        <Link href="/" className="absolute top-6 left-6">
          <motion.div
            whileHover={{ x: -3 }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 md:p-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <AbhaLogo size="md" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Building2 size={24} className="text-primary-light" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Hospital Login</h2>
              <p className="text-sm text-muted-foreground">OPD Counter Access</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="hospitalId" className="text-sm font-medium text-foreground/80">Hospital ID</label>
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 2px #12B88A40" }}
                id="hospitalId"
                type="text"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                placeholder="GOV-HOSP-001"
                className="font-mono bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary-light transition-colors text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</label>
              <div className="relative">
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px #12B88A40" }}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary-light transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative mt-2 w-full py-3.5 rounded-xl font-semibold text-primary-foreground overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0A7764, #12B88A)" }}
            >
              <span className="relative z-10">Enter OPD System</span>
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
            </motion.button>
          </form>

          <p className="text-center text-xs text-muted-foreground/50 mt-6">
            Powered by National Health Authority
          </p>
        </motion.div>
      </div>
    </main>
  )
}

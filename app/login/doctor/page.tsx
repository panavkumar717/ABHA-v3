"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Stethoscope, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { AbhaLogo } from "@/components/abha/logo"
import { ThemeToggle } from "@/components/abha/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DoctorLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [doctorId, setDoctorId] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/doctor/dashboard")
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden">
      <AnimatedBackground />

      {/* Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Left Panel - ECG Animation */}
      <div className="hidden lg:flex flex-col justify-center items-center relative z-10 w-[60%] p-12 overflow-hidden">
        <div className="flex flex-col items-center gap-8">
          <AbhaLogo size="lg" />

          {/* ECG Line */}
          <div className="relative w-full max-w-lg h-40 overflow-hidden">
            <svg viewBox="0 0 600 120" className="w-full h-full" aria-hidden="true">
              <path
                d="M0,60 L100,60 L120,60 L130,20 L140,100 L150,40 L160,80 L170,60 L200,60 L300,60 L320,60 L330,15 L340,105 L350,35 L360,85 L370,60 L400,60 L500,60 L520,60 L530,20 L540,100 L550,40 L560,80 L570,60 L600,60"
                fill="none"
                stroke="#1A6EBF"
                strokeWidth="2"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                opacity="0.8"
              >
                <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="3s" repeatCount="indefinite" />
              </path>
              <path
                d="M0,60 L100,60 L120,60 L130,20 L140,100 L150,40 L160,80 L170,60 L200,60 L300,60 L320,60 L330,15 L340,105 L350,35 L360,85 L370,60 L400,60 L500,60 L520,60 L530,20 L540,100 L550,40 L560,80 L570,60 L600,60"
                fill="none"
                stroke="#1A6EBF"
                strokeWidth="4"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                opacity="0.2"
                filter="blur(4px)"
              >
                <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="3s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1A6EBF20, #1A6EBF10)" }}>
              <Stethoscope size={48} className="text-accent" />
            </div>
          </motion.div>

          <p className="text-center text-muted-foreground max-w-sm">
            Secure access to patient records, AI-powered consultation summaries, and comprehensive health insights.
          </p>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[40%] relative z-10 p-6 md:p-12">
        <Link href="/" className="absolute top-6 left-6">
          <motion.div whileHover={{ x: -3 }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
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
          <div className="lg:hidden flex justify-center mb-6">
            <AbhaLogo size="md" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#1A6EBF20" }}>
              <Stethoscope size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Doctor Login</h2>
              <p className="text-sm text-muted-foreground">Consultation Portal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="doctorId" className="text-sm font-medium text-foreground/80">Doctor ID</label>
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 2px rgba(26, 110, 191, 0.3)" }}
                id="doctorId"
                type="text"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                placeholder="DR-2024-001"
                className="font-mono bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="doctorPassword" className="text-sm font-medium text-foreground/80">Password</label>
              <div className="relative">
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(26, 110, 191, 0.3)" }}
                  id="doctorPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors pr-12"
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
              style={{ background: "linear-gradient(135deg, #1A6EBF, #0A7764)" }}
            >
              <span className="relative z-10">Enter Doctor Portal</span>
            </motion.button>
          </form>

          <p className="text-center text-xs text-muted-foreground/50 mt-6">Powered by National Health Authority</p>
        </motion.div>
      </div>
    </main>
  )
}

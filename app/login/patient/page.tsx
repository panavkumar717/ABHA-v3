"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Phone } from "lucide-react"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { AbhaLogo } from "@/components/abha/logo"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PatientLoginPage() {
  const [phone, setPhone] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(30)
  const [otpError, setOtpError] = useState(false)
  const [otpComplete, setOtpComplete] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    if (otpSent && resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [otpSent, resendTimer])

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length >= 10) {
      setOtpSent(true)
      setResendTimer(30)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    setOtpError(false)
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if all filled
    if (newOtp.every((d) => d !== "")) {
      setOtpComplete(true)
      setTimeout(() => router.push("/patient/dashboard"), 800)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const resendCircumference = 2 * Math.PI * 14
  const resendProgress = (resendTimer / 30) * resendCircumference

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <AnimatedBackground />

      <Link href="/" className="absolute top-6 left-6 z-20">
        <motion.div whileHover={{ x: -3 }} className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </motion.div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 glass-card rounded-3xl p-8 md:p-10 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <AbhaLogo size="md" />
        </div>

        <AnimatePresence mode="wait">
          {!otpSent ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className="text-xl font-bold text-foreground text-center mb-1">Patient Login</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">Enter your mobile number to receive OTP</p>

              <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground/80">Mobile Number</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-3 bg-surface border border-border rounded-xl text-muted-foreground text-sm">
                      <Phone size={14} />
                      +91
                    </div>
                    <motion.input
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(230,57,70,0.3)" }}
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-destructive transition-colors text-lg font-mono tracking-wider"
                      maxLength={10}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={phone.length < 10}
                  className="relative w-full py-3.5 rounded-xl font-semibold text-white overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #0A7764, #12B88A)" }}
                >
                  Send OTP
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-xl font-bold text-foreground text-center mb-1">Enter OTP</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Sent to +91 {phone.slice(0, 4)}****{phone.slice(-2)}
              </p>

              {/* OTP Boxes */}
              <div className="flex gap-3 mb-6">
                {otp.map((digit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                  >
                    <motion.input
                      ref={(el) => { inputRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      animate={
                        otpError ? { x: [-4, 4, -4, 4, 0] } :
                          digit ? { scale: [1, 1.1, 1] } :
                            {}
                      }
                      transition={{ duration: otpError ? 0.3 : 0.2 }}
                      className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-mono font-bold bg-surface rounded-xl border-2 focus:outline-none transition-colors ${otpError ? "border-destructive text-destructive" :
                          digit ? "border-primary-light text-foreground" :
                            "border-border text-foreground"
                        } focus:border-primary-light`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Completion animation */}
              <AnimatePresence>
                {otpComplete && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center">
                      <motion.svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          fill="none"
                          stroke="#12B88A"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4 }}
                        />
                      </motion.svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resend */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {resendTimer > 0 ? (
                  <>
                    <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" className="stroke-muted" strokeWidth="2" />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke="#E63946"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={resendCircumference}
                        strokeDashoffset={resendCircumference - resendProgress}
                        style={{ transition: "stroke-dashoffset 1s linear" }}
                      />
                    </svg>
                    <span>Resend in {resendTimer}s</span>
                  </>
                ) : (
                  <button
                    onClick={() => { setResendTimer(30); setOtp(["", "", "", "", "", ""]); setOtpError(false) }}
                    className="text-primary-light hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">Powered by National Health Authority</p>
      </motion.div>
    </main>
  )
}

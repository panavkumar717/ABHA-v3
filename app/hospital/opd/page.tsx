"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Volume2, Loader2, CheckCircle2, Printer, ArrowRight, LogOut } from "lucide-react"
import { AbhaLogo } from "@/components/abha/logo"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { ThemeToggle } from "@/components/abha/theme-toggle"
import Link from "next/link"

type Status = "idle" | "listening" | "processing" | "speaking" | "complete"

interface Message {
  role: "patient" | "ai"
  text: string
}

const demoConversation: Message[] = [
  { role: "ai", text: "Namaste! Welcome to ABHA+ OPD Registration. Please state your name and reason for visit." },
  { role: "patient", text: "Namaste, mera naam Rajesh Kumar hai. Mujhe bukhar aur sar dard hai teen din se." },
  { role: "ai", text: "Dhanyavaad, Rajesh ji. I'm registering you for OPD. Let me confirm: Name - Rajesh Kumar, Symptoms - Fever and headache for 3 days. Is this correct?" },
  { role: "patient", text: "Haan, sahi hai." },
  { role: "ai", text: "Perfect. I've registered you in the General Medicine department. Your token number is GM-047. Please proceed to Counter 3." },
]

export default function OPDDashboard() {
  const [status, setStatus] = useState<Status>("idle")
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [showComplete, setShowComplete] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "idle") return
    if (currentMsgIndex >= demoConversation.length) {
      setTimeout(() => setShowComplete(true), 500)
      return
    }

    const msg = demoConversation[currentMsgIndex]
    let charIndex = 0
    setDisplayedText("")

    if (msg.role === "ai") setStatus("speaking")
    else setStatus("listening")

    const interval = setInterval(() => {
      if (charIndex < msg.text.length) {
        setDisplayedText(msg.text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(interval)
        setMessages((prev) => [...prev, msg])
        setDisplayedText("")
        setCurrentMsgIndex((prev) => prev + 1)
        setStatus("processing")
      }
    }, 30)

    return () => clearInterval(interval)
  }, [status, currentMsgIndex])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, displayedText])

  const startConversation = () => {
    setStatus("listening")
    setMessages([])
    setCurrentMsgIndex(0)
    setShowComplete(false)
  }

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedBackground />

      {/* Topbar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 glass-card border-b border-border">
        <AbhaLogo size="sm" />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:block">OPD Registration Kiosk</span>
          <ThemeToggle />
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Logout">
            <LogOut size={18} />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Panel - AI Voice Visualizer */}
        <div className="flex-1 lg:w-[55%] flex flex-col items-center justify-center gap-8">
          {/* Orb */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full border border-primary-light/20"
              style={{ animation: status !== "idle" ? "orb-breathe 4s ease-in-out infinite" : undefined }}
            />
            <div
              className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full border border-primary-light/30"
              style={{ animation: status !== "idle" ? "orb-breathe 5s ease-in-out infinite 0.5s" : undefined }}
            />

            {status === "listening" && (
              <>
                <div className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border-2 border-primary-light" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
                <div className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border-2 border-primary-light" style={{ animation: "pulse-ring 2s ease-out infinite 0.4s" }} />
                <div className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border-2 border-primary-light" style={{ animation: "pulse-ring 2s ease-out infinite 0.8s" }} />
              </>
            )}

            <motion.div
              className="w-36 h-36 md:w-48 md:h-48 rounded-full flex items-center justify-center relative"
              style={{
                background: `radial-gradient(circle at 35% 35%, #12B88A, #0A7764, #1A6EBF)`,
                boxShadow: status !== "idle" ? "0 0 60px rgba(18,184,138,0.4), 0 0 120px rgba(18,184,138,0.2)" : "0 0 30px rgba(18,184,138,0.2)",
              }}
              animate={
                status === "speaking"
                  ? { scale: [1, 1.05, 1, 1.08, 1], borderRadius: ["50%", "47%", "50%", "48%", "50%"] }
                  : status === "idle"
                    ? { scale: [1, 1.03, 1] }
                    : {}
              }
              transition={{ duration: status === "speaking" ? 1.2 : 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {status === "speaking" && (
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 md:w-2 bg-foreground rounded-full"
                      animate={{ height: [8, 32, 16, 28, 8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              )}

              {(status === "idle" || status === "processing") && (
                <div className="text-foreground">
                  {status === "processing" ? <Loader2 size={32} className="animate-spin" /> : <Volume2 size={36} />}
                </div>
              )}

              {status === "listening" && <Mic size={36} className="text-foreground" />}
            </motion.div>
          </div>

          {/* Status pill */}
          <motion.div
            className="px-5 py-2 rounded-full text-sm font-medium text-foreground"
            style={{
              background: status === "listening" ? "linear-gradient(90deg, #0A7764, #12B88A)" :
                status === "speaking" ? "linear-gradient(90deg, #1A6EBF, #0A7764)" :
                  status === "processing" ? "linear-gradient(90deg, #6B8F86, #0A7764)" :
                    undefined,
              backgroundSize: status === "processing" ? "200% 100%" : undefined,
              animation: status === "processing" ? "shimmer 1.5s infinite" : undefined,
            }}
          >
            <span className={status === "idle" ? "text-muted-foreground" : ""}>
              {status === "idle" && "Tap to Start Registration"}
              {status === "listening" && "Listening..."}
              {status === "speaking" && "Speaking..."}
              {status === "processing" && "Processing..."}
              {status === "complete" && "Registration Complete"}
            </span>
          </motion.div>

          {/* Instruction text */}
          <div className="text-center px-4">
            {status === "idle" ? (
              <motion.button
                onClick={startConversation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl font-semibold text-lg text-white"
                style={{ background: "linear-gradient(135deg, #0A7764, #12B88A)" }}
              >
                <span className="flex items-center gap-2">
                  <Mic size={20} />
                  Start Registration
                </span>
              </motion.button>
            ) : (
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
                {status === "listening" ? "Please speak clearly..." : status === "speaking" ? "AI is responding..." : ""}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Hindi", "English", "Tamil", "Telugu"].map((lang) => (
                <span key={lang} className="px-3 py-1 rounded-full text-xs text-muted-foreground border border-muted-foreground/20 glass-card">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Conversation Log */}
        <div className="flex-1 lg:w-[45%] flex flex-col glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <div className="w-2.5 h-2.5 rounded-full bg-primary-light animate-pulse" />
            <h2 className="text-lg font-semibold text-foreground">Live Conversation</h2>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 min-h-[300px] max-h-[60vh]">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "patient"
                    ? "bg-destructive/10 border-l-[3px] border-destructive text-foreground"
                    : "text-foreground bg-muted"
                    }`}
                    style={msg.role === "ai" ? { background: "linear-gradient(135deg, #0A776420, transparent)" } : {}}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {displayedText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex ${demoConversation[currentMsgIndex]?.role === "patient" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${demoConversation[currentMsgIndex]?.role === "patient"
                    ? "bg-destructive/10 border-l-[3px] border-destructive text-foreground"
                    : "text-foreground bg-muted"
                    }`}
                  style={demoConversation[currentMsgIndex]?.role === "ai" ? { background: "linear-gradient(135deg, #0A776420, transparent)" } : {}}
                >
                  <p className="text-sm leading-relaxed">
                    {displayedText}
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              </motion.div>
            )}

            {messages.length === 0 && !displayedText && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground/50 text-sm">Conversation will appear here...</p>
              </div>
            )}
          </div>

          {/* Registration Complete Card */}
          <AnimatePresence>
            {showComplete && (
              <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="border-t border-border p-6 bg-muted"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle2 size={40} className="text-primary-light" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">Registration Complete</h3>
                    <div className="mt-2 flex flex-col gap-1 text-sm">
                      <p className="text-muted-foreground">Patient: <span className="text-foreground">Rajesh Kumar</span></p>
                      <p className="text-muted-foreground">ABHA ID: <span className="text-primary-light font-mono">14-3267-8901-2345</span></p>
                      <p className="text-muted-foreground">Token: <span className="text-foreground text-2xl font-bold">GM-047</span></p>
                      <p className="text-muted-foreground">Department: <span className="text-foreground">General Medicine - Counter 3</span></p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                        style={{ background: "linear-gradient(135deg, #0A7764, #12B88A)" }}
                      >
                        <Printer size={14} /> Print Token
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={startConversation}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-foreground border border-foreground/20 hover:border-foreground/40 transition-colors"
                      >
                        Next Patient <ArrowRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

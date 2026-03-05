"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QrCode, LogOut, Camera, X, Users, Clock, CalendarDays } from "lucide-react"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { AbhaLogo } from "@/components/abha/logo"
import { ThemeToggle } from "@/components/abha/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

const recentPatients = [
  { name: "Priya Sharma", token: "GM-045", time: "10:15 AM", dept: "General Medicine" },
  { name: "Anil Verma", token: "GM-046", time: "10:32 AM", dept: "General Medicine" },
  { name: "Sunita Devi", token: "CD-012", time: "10:48 AM", dept: "Cardiology" },
]

export default function DoctorDashboard() {
  const [showScanner, setShowScanner] = useState(false)
  const router = useRouter()

  const handleScan = () => {
    setShowScanner(false)
    router.push("/doctor/consult/patient-001")
  }

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedBackground />

      {/* Topbar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border glass-card">
        <AbhaLogo size="sm" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
            <span className="text-sm text-foreground hidden md:block">Dr. Ananya Mehta</span>
            <span className="text-xs text-muted-foreground hidden md:block">| General Medicine</span>
          </div>
          <ThemeToggle />
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Logout">
            <LogOut size={18} />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
          {[
            { icon: Users, label: "Patients Today", value: "12" },
            { icon: Clock, label: "Avg. Consultation", value: "18min" },
            { icon: CalendarDays, label: "Queue", value: "5" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 text-center"
            >
              <stat.icon size={20} className="text-accent" />
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* QR Scan Button */}
        <motion.button
          onClick={() => setShowScanner(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer group"
          style={{ background: "linear-gradient(135deg, #1A6EBF20, #0A776420)" }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160" aria-hidden="true">
            <circle
              cx="80" cy="80" r="76"
              fill="none"
              stroke="#1A6EBF"
              strokeWidth="2"
              strokeDasharray="12 8"
              opacity="0.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 80 80"
                to="360 80 80"
                dur="20s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          <div className="absolute inset-2 rounded-full group-hover:shadow-[0_0_40px_rgba(26,110,191,0.4)] transition-shadow duration-300" />

          <div className="flex flex-col items-center gap-2 relative z-10">
            <QrCode size={40} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Scan Token</span>
          </div>
        </motion.button>

        <p className="text-muted-foreground text-sm">Scan patient token QR to begin consultation</p>

        {/* Recent patients */}
        <div className="w-full max-w-lg">
          <h3 className="text-sm font-semibold text-foreground/70 mb-3">Recent Patients</h3>
          <div className="flex flex-col gap-2">
            {recentPatients.map((patient, i) => (
              <motion.div
                key={patient.token}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-foreground/5 transition-colors"
                onClick={() => router.push("/doctor/consult/patient-001")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                    {patient.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.dept}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-accent">{patient.token}</p>
                  <p className="text-xs text-muted-foreground">{patient.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="glass-card rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Scan Patient Token</h3>
                <button onClick={() => setShowScanner(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close scanner">
                  <X size={20} />
                </button>
              </div>

              <div className="relative w-full aspect-square bg-background/50 rounded-2xl overflow-hidden mb-4">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg" />

                <div
                  className="absolute left-4 right-4 h-0.5 bg-accent/80"
                  style={{ animation: "scanline 2s linear infinite", boxShadow: "0 0 10px #1A6EBF" }}
                />

                <div className="absolute inset-8 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: "linear-gradient(#1A6EBF 1px, transparent 1px), linear-gradient(90deg, #1A6EBF 1px, transparent 1px)",
                    backgroundSize: "20% 20%",
                  }} />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera size={32} className="text-muted-foreground/50" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleScan}
                className="w-full py-3 rounded-xl font-semibold text-primary-foreground"
                style={{ background: "linear-gradient(135deg, #1A6EBF, #0A7764)" }}
              >
                Simulate Scan
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Mic, Square, Pause, CheckCircle2, Edit3, LogOut,
  Heart, Brain, Dumbbell, Apple, ChevronDown, ChevronUp, Search, Pill
} from "lucide-react"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { AbhaLogo } from "@/components/abha/logo"
import Link from "next/link"

type RecordingState = "idle" | "recording" | "paused" | "summarizing" | "done"

const patientData = {
  name: "Rajesh Kumar",
  age: 45,
  gender: "Male",
  abhaId: "14-3267-8901-2345",
  conditions: [
    { label: "Diabetic", severity: "moderate" },
    { label: "Hypertensive", severity: "critical" },
    { label: "Stable BMI", severity: "stable" },
  ],
  healthScore: 74,
  subScores: [
    { label: "Heart", icon: Heart, score: 68, color: "#E63946" },
    { label: "Mental", icon: Brain, score: 82, color: "#1A6EBF" },
    { label: "Physical", icon: Dumbbell, score: 71, color: "#12B88A" },
    { label: "Nutrition", icon: Apple, score: 65, color: "#E6A817" },
  ],
  visits: [
    { date: "Feb 12, 2026", type: "Follow-up", doctor: "Dr. Ananya Mehta", complaint: "Blood pressure check, medication review" },
    { date: "Jan 05, 2026", type: "Emergency", doctor: "Dr. Rajiv Nair", complaint: "Chest pain, shortness of breath" },
    { date: "Nov 20, 2025", type: "Routine", doctor: "Dr. Ananya Mehta", complaint: "Diabetes management, HbA1c test" },
  ],
}

const summaryData = {
  complaint: "Patient reports persistent headache (3 days), mild fever (100.2F), body aches. No respiratory symptoms.",
  findings: "BP: 150/95 mmHg (elevated), Temp: 100.2F, Heart rate: 82 bpm regular. No neck stiffness.",
  diagnosis: "Viral fever with tension-type headache. Hypertension not well controlled.",
  plan: "Paracetamol 500mg TDS x 5 days. Increase Amlodipine to 10mg OD. Review in 1 week. Advise rest and hydration.",
}

const prescriptions = [
  { name: "Metformin 500mg", dosage: "Twice daily", duration: "Ongoing", active: true, date: "Feb 12, 2026" },
  { name: "Amlodipine 5mg", dosage: "Once daily", duration: "Ongoing", active: true, date: "Jan 05, 2026" },
  { name: "Paracetamol 500mg", dosage: "As needed", duration: "5 days", active: false, date: "Nov 20, 2025" },
]

export default function ConsultationPage() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [timer, setTimer] = useState(0)
  const [expandedVisit, setExpandedVisit] = useState<number | null>(null)
  const [summaryVisible, setSummaryVisible] = useState(false)
  const [visibleSections, setVisibleSections] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [healthScoreAnimated, setHealthScoreAnimated] = useState(0)

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (recordingState === "recording") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [recordingState])

  // Health score animation
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthScoreAnimated((prev) => {
        if (prev >= patientData.healthScore) {
          clearInterval(interval)
          return patientData.healthScore
        }
        return prev + 1
      })
    }, 20)
    return () => clearInterval(interval)
  }, [])

  // Summary reveal
  useEffect(() => {
    if (summaryVisible && visibleSections < 4) {
      const timeout = setTimeout(() => setVisibleSections((v) => v + 1), 600)
      return () => clearTimeout(timeout)
    }
  }, [summaryVisible, visibleSections])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0")
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${h}:${m}:${sec}`
  }

  const handleStop = () => {
    setRecordingState("summarizing")
    setTimeout(() => {
      setRecordingState("done")
      setSummaryVisible(true)
    }, 2000)
  }

  const severityColor = (s: string) => s === "critical" ? "bg-destructive/20 text-destructive" : s === "moderate" ? "bg-[#E6A817]/20 text-[#E6A817]" : "bg-primary-light/20 text-primary-light"

  const scoreColor = healthScoreAnimated >= 80 ? "#12B88A" : healthScoreAnimated >= 60 ? "#E6A817" : "#E63946"
  const circumference = 2 * Math.PI * 52
  const strokeDashoffset = circumference - (healthScoreAnimated / 100) * circumference

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedBackground />

      {/* Topbar */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link href="/doctor/dashboard">
            <motion.div whileHover={{ x: -3 }} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
            </motion.div>
          </Link>
          <AbhaLogo size="sm" />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
            <span className="text-sm text-foreground">Dr. Ananya Mehta</span>
          </div>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Logout">
            <LogOut size={18} />
          </Link>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-auto">
        {/* Column 1 - Patient Snapshot */}
        <div className="lg:w-[280px] xl:w-[300px] flex flex-col gap-4 shrink-0">
          {/* Patient Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold text-accent">
                RK
              </div>
              <div>
                <h3 className="font-bold text-foreground">{patientData.name}</h3>
                <p className="text-xs text-muted-foreground">{patientData.age}y, {patientData.gender}</p>
                <p className="text-xs font-mono text-primary-light">{patientData.abhaId}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {patientData.conditions.map((c) => (
                <span key={c.label} className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(c.severity)}`}>
                  {c.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Health Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Health Score</h4>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" className="stroke-muted" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={scoreColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 0.3s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{healthScoreAnimated}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {patientData.subScores.map((sub, i) => (
                <div key={sub.label} className="flex items-center gap-2">
                  <sub.icon size={14} style={{ color: sub.color }} />
                  <span className="text-xs text-muted-foreground w-16">{sub.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: sub.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${sub.score}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
                    />
                  </div>
                  <span className="text-xs text-foreground/60 w-6 text-right">{sub.score}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visit Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-5 hidden lg:block"
          >
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Previous Visits</h4>
            <div className="flex flex-col gap-0">
              {patientData.visits.map((visit, i) => (
                <div key={i} className="relative pl-5">
                  {/* Timeline line */}
                  {i < patientData.visits.length - 1 && (
                    <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />
                  )}
                  {/* Node */}
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary-light bg-dark" />
                  <button
                    onClick={() => setExpandedVisit(expandedVisit === i ? null : i)}
                    className="w-full text-left pb-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-primary-light">{visit.date}</span>
                      {expandedVisit === i ? <ChevronUp size={12} className="text-muted-foreground" /> : <ChevronDown size={12} className="text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-foreground/80">{visit.type} - {visit.doctor}</p>
                    <AnimatePresence>
                      {expandedVisit === i && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-xs text-muted-foreground mt-1"
                        >
                          {visit.complaint}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Column 2 - Live Consultation */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-5 flex-1 flex flex-col"
          >
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Prescriptions</h4>
            <div className="flex flex-col gap-2">
              {prescriptions.map((rx, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 border-l-[3px] ${rx.active ? "border-primary-light bg-primary-light/5" : "border-muted-foreground/20 bg-muted/60 opacity-60"}`}
                >
                  <div className="flex items-start gap-2">
                    <Pill size={14} className={rx.active ? "text-primary-light mt-0.5" : "text-muted-foreground mt-0.5"} />
                    <div>
                      <p className={`text-sm font-medium ${rx.active ? "text-foreground" : "text-muted-foreground line-through"}`}>
                        {rx.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{rx.dosage} - {rx.duration}</p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{rx.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Column 3 - Patient History */}
        <div className="lg:w-[280px] xl:w-[300px] flex flex-col gap-4 shrink-0">
          {/* Previous Summaries */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-5"
          >
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Previous Summaries</h4>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary-light"
              />
            </div>
            <div className="flex flex-col gap-2">
              {patientData.visits.map((visit, i) => (
                <button
                  key={i}
                  onClick={() => setExpandedVisit(expandedVisit === i + 10 ? null : i + 10)}
                  className="w-full text-left glass-card rounded-lg p-3 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-primary-light">{visit.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">{visit.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{visit.doctor}</p>
                  <AnimatePresence>
                    {expandedVisit === i + 10 && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-xs text-foreground/60 mt-2"
                      >
                        {visit.complaint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Prescription History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-5 flex-1 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Live Consultation</h3>
              {recordingState !== "idle" && (
                <span className="text-sm font-mono text-muted-foreground">{formatTime(timer)}</span>
              )}
            </div>

            {/* Waveform Visualizer */}
            {recordingState === "recording" && (
              <div className="flex items-center justify-center gap-0.5 h-24 mb-4">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{ background: `linear-gradient(to top, #0A7764, #1A6EBF)` }}
                    animate={{
                      height: [8, Math.random() * 60 + 20, 12, Math.random() * 50 + 15, 8],
                    }}
                    transition={{
                      duration: 0.8 + Math.random() * 0.4,
                      repeat: Infinity,
                      delay: i * 0.03,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Summarizing state */}
            {recordingState === "summarizing" && (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-2 border-primary-light border-t-transparent"
                />
                <p className="text-sm text-muted-foreground">AI Summarizing consultation...</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {recordingState === "idle" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRecordingState("recording")}
                  className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center"
                  style={{ boxShadow: "0 0 30px rgba(230, 57, 70, 0.4)" }}
                >
                  <Mic size={24} className="text-white" />
                </motion.button>
              )}
              {recordingState === "recording" && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRecordingState("paused")}
                    className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"
                  >
                    <Pause size={20} className="text-foreground" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStop}
                    className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center"
                    style={{ animation: "pulse-ring 2s ease-out infinite", boxShadow: "0 0 30px rgba(230, 57, 70, 0.4)" }}
                  >
                    <Square size={20} className="text-white" />
                  </motion.button>
                </>
              )}
              {recordingState === "paused" && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRecordingState("recording")}
                    className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center"
                  >
                    <Mic size={24} className="text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStop}
                    className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"
                  >
                    <Square size={20} className="text-foreground" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Transcript area */}
            {(recordingState === "recording" || recordingState === "paused") && (
              <div className="flex-1 bg-muted/50 rounded-xl p-4 overflow-y-auto max-h-48">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Patient reports headache for the past three days, mild fever since yesterday evening. No history of trauma. Has been taking paracetamol but no relief. Blood pressure reading shows elevated...
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-primary-light ml-0.5 align-middle"
                  />
                </p>
              </div>
            )}

            {/* AI Summary Card */}
            <AnimatePresence>
              {recordingState === "done" && summaryVisible && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="rounded-xl overflow-hidden bg-muted"
                >
                  <div className="p-4 flex flex-col gap-3">
                    {[
                      { key: "complaint", label: "Chief Complaint", color: "#E63946", data: summaryData.complaint },
                      { key: "findings", label: "Findings", color: "#E6A817", data: summaryData.findings },
                      { key: "diagnosis", label: "Diagnosis", color: "#12B88A", data: summaryData.diagnosis },
                      { key: "plan", label: "Plan", color: "#1A6EBF", data: summaryData.plan },
                    ].map((section, i) => (
                      <AnimatePresence key={section.key}>
                        {i < visibleSections && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex gap-3"
                          >
                            <div className="w-1 rounded-full shrink-0" style={{ background: section.color }} />
                            <div>
                              <h5 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: section.color }}>
                                {section.label}
                              </h5>
                              <p className="text-sm text-foreground/80 leading-relaxed">{section.data}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}

                    {visibleSections >= 4 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3 mt-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                          style={{ background: "linear-gradient(135deg, #0A7764, #12B88A)" }}
                        >
                          <CheckCircle2 size={14} /> Confirm & Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-foreground border border-border"
                        >
                          <Edit3 size={14} /> Edit Summary
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

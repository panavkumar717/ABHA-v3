"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home, FileText, Pill, Bot, CalendarPlus, ClipboardList, FolderOpen, AlertTriangle,
  ChevronDown, ChevronUp, Bell, LogOut
} from "lucide-react"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { AbhaLogo } from "@/components/abha/logo"
import Link from "next/link"

type Tab = "home" | "consultations" | "prescriptions" | "ai"

const consultations = [
  { doctor: "Dr. Ananya Mehta", specialty: "General Medicine", date: "Mar 3, 2026", summary: "Follow-up for viral fever. Symptoms resolved. BP slightly elevated. Advised continued monitoring.", diagnosis: "Resolved viral fever, HTN monitoring" },
  { doctor: "Dr. Rajiv Nair", specialty: "Cardiology", date: "Jan 5, 2026", summary: "Emergency visit for chest pain. ECG normal. Likely stress-related. Advised lifestyle changes.", diagnosis: "Non-cardiac chest pain" },
  { doctor: "Dr. Ananya Mehta", specialty: "General Medicine", date: "Nov 20, 2025", summary: "Routine diabetes check. HbA1c: 7.2%. Adjusted Metformin dosage.", diagnosis: "T2DM management" },
]

const medications = [
  { name: "Metformin 500mg", dosage: "Twice daily", daysLeft: 45, totalDays: 90, active: true },
  { name: "Amlodipine 10mg", dosage: "Once daily", daysLeft: 28, totalDays: 30, active: true },
  { name: "Paracetamol 500mg", dosage: "As needed", daysLeft: 0, totalDays: 5, active: false },
]

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [expandedConsult, setExpandedConsult] = useState<number | null>(null)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const tabs = [
    { id: "home" as Tab, label: "Home", icon: Home },
    { id: "consultations" as Tab, label: "Visits", icon: FileText },
    { id: "prescriptions" as Tab, label: "Rx", icon: Pill },
    { id: "ai" as Tab, label: "AI Health", icon: Bot },
  ]

  return (
    <main className="relative min-h-screen flex flex-col pb-20 md:pb-0 overflow-hidden">
      <AnimatedBackground />

      {/* Topbar (desktop) */}
      <div className="relative z-10 hidden md:flex items-center justify-between px-6 py-4 border-b border-[#F8FFFE]/10 glass-card">
        <AbhaLogo size="sm" />
        <div className="flex items-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.id === "ai" ? undefined : setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-primary/20 text-primary-light" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.id === "ai" ? (
                <Link href="/patient/ai-health" className="flex items-center gap-2">
                  <tab.icon size={16} />
                  {tab.label}
                </Link>
              ) : (
                <>
                  <tab.icon size={16} />
                  {tab.label}
                </>
              )}
            </button>
          ))}
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors ml-2" aria-label="Logout">
            <LogOut size={18} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {getGreeting()}, Rajesh
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Your health journey at a glance</p>
              </div>

              {/* Health Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card-light rounded-2xl p-6"
                style={{ background: "linear-gradient(135deg, rgba(10,119,100,0.15), rgba(26,110,191,0.1))" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Visit</p>
                    <p className="text-sm text-foreground font-medium mt-0.5">Mar 3, 2026 - Dr. Ananya Mehta</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Next Appointment</p>
                    <p className="text-sm text-primary-light font-medium mt-0.5">Mar 10, 2026</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: CalendarPlus, label: "Book Visit", color: "#0A7764" },
                  { icon: ClipboardList, label: "View Prescriptions", color: "#1A6EBF" },
                  { icon: FolderOpen, label: "My Records", color: "#12B88A" },
                  { icon: AlertTriangle, label: "Emergency", color: "#E63946" },
                ].map((action, i) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (action.label === "View Prescriptions") setActiveTab("prescriptions")
                    }}
                    className="glass-card rounded-xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${action.color}20` }}
                    >
                      <action.icon size={22} style={{ color: action.color }} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* AI Health link */}
              <Link href="/patient/ai-health">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, rgba(18,184,138,0.15), rgba(26,110,191,0.1))" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-light/20 flex items-center justify-center">
                    <Bot size={24} className="text-primary-light" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground">AI Health Companions</h3>
                    <p className="text-xs text-muted-foreground">Chat with 13 specialized AI health guides</p>
                  </div>
                  <ChevronDown size={16} className="text-muted-foreground rotate-[-90deg]" />
                </motion.div>
              </Link>
            </motion.div>
          )}

          {/* CONSULTATIONS TAB */}
          {activeTab === "consultations" && (
            <motion.div
              key="consultations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold text-foreground">Past Consultations</h2>
              {consultations.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedConsult(expandedConsult === i ? null : i)}
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        {c.doctor.split(" ").slice(1).map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.doctor}</p>
                        <p className="text-xs text-muted-foreground">{c.specialty} - {c.date}</p>
                      </div>
                    </div>
                    {expandedConsult === i ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {expandedConsult === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="pt-2 border-t border-[#F8FFFE]/10 flex flex-col gap-2">
                          <div>
                            <p className="text-xs text-primary-light font-semibold uppercase">Summary</p>
                            <p className="text-sm text-foreground/80 leading-relaxed mt-0.5">{c.summary}</p>
                          </div>
                          <div>
                            <p className="text-xs text-accent font-semibold uppercase">Diagnosis</p>
                            <p className="text-sm text-foreground/80 mt-0.5">{c.diagnosis}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* PRESCRIPTIONS TAB */}
          {activeTab === "prescriptions" && (
            <motion.div
              key="prescriptions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold text-foreground">My Prescriptions</h2>
              {medications.map((med, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass-card rounded-xl p-4 border-l-[3px] ${med.active ? "border-primary-light" : "border-muted-sage/30 opacity-60"}`}
                  style={med.active ? { boxShadow: "0 0 20px rgba(18,184,138,0.1)" } : {}}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-base font-semibold ${med.active ? "text-foreground" : "text-muted-foreground line-through"}`}>
                        {med.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent inline-block mt-1">
                        {med.dosage}
                      </span>
                    </div>
                    {med.active && med.daysLeft <= 7 && (
                      <Bell size={16} className="text-destructive animate-pulse" />
                    )}
                  </div>
                  {med.active && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{med.daysLeft} days left</span>
                        <span>{med.totalDays} days total</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#F8FFFE]/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: med.daysLeft <= 7 ? "#E63946" : "#12B88A" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(med.daysLeft / med.totalDays) * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.15 }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 md:hidden glass-card border-t border-[#F8FFFE]/10 safe-bottom">
        <div className="flex items-center justify-around py-2 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "ai") {
                  window.location.href = "/patient/ai-health"
                } else {
                  setActiveTab(tab.id)
                }
              }}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors min-w-[64px] ${
                activeTab === tab.id ? "text-primary-light" : "text-muted-sage"
              }`}
            >
              <tab.icon size={20} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="h-0.5 w-6 rounded-full bg-primary-light mt-0.5"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

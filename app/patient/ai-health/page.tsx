"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/abha/animated-background"
import { AbhaLogo } from "@/components/abha/logo"

const companions = [
  { id: "yoga-trainer", name: "Yoga Trainer", desc: "Guided yoga & asanas for daily wellness", gradient: "from-[#6C5CE7] to-[#4834D4]", emoji: "person_in_lotus_position", featured: true },
  { id: "diet-planner", name: "Diet Planner", desc: "Personalized nutrition plans for Indian diet", gradient: "from-[#00B894] to-[#55E6A5]", emoji: "green_salad", featured: true },
  { id: "mental-health", name: "Mental Health Companion", desc: "Supportive conversations for emotional well-being", gradient: "from-[#74B9FF] to-[#A29BFE]", emoji: "person_getting_massage" },
  { id: "fitness-coach", name: "Fitness Coach", desc: "Exercise routines tailored to your health", gradient: "from-[#F0932B] to-[#FDCB6E]", emoji: "flexed_biceps" },
  { id: "pregnancy-care", name: "Pregnancy Care", desc: "Guidance through every trimester", gradient: "from-[#FD79A8] to-[#E84393]", emoji: "breast_feeding" },
  { id: "elderly-care", name: "Elderly Care Assistant", desc: "Health management for senior citizens", gradient: "from-[#B8860B] to-[#DAA520]", emoji: "older_person" },
  { id: "diabetes-manager", name: "Diabetes Manager", desc: "Blood sugar tracking & diet guidance", gradient: "from-[#00CEC9] to-[#0ABDE3]", emoji: "stethoscope" },
  { id: "first-aid", name: "First Aid Guide", desc: "Emergency first aid instructions", gradient: "from-[#FF6B6B] to-[#EE5A24]", emoji: "ambulance" },
  { id: "post-surgery", name: "Post-Surgery Care", desc: "Recovery guidance after procedures", gradient: "from-[#636E72] to-[#2D3436]", emoji: "hospital" },
  { id: "child-health", name: "Child Health Advisor", desc: "Pediatric health tips & vaccination reminders", gradient: "from-[#FFEAA7] to-[#FDCB6E]", emoji: "baby" },
  { id: "stress-relief", name: "Stress Relief Coach", desc: "Breathing exercises & relaxation techniques", gradient: "from-[#81ECEC] to-[#55E6C1]", emoji: "wind_face" },
  { id: "meditation-guide", name: "Meditation Guide", desc: "Guided meditation for inner peace", gradient: "from-[#6C5CE7] to-[#2C2C54]", emoji: "person_in_lotus_position" },
  { id: "nutrition-advisor", name: "Nutrition Advisor", desc: "Micronutrient tracking & dietary supplements", gradient: "from-[#00B894] to-[#0A7764]", emoji: "broccoli" },
]

const emojiMap: Record<string, string> = {
  person_in_lotus_position: "YT",
  green_salad: "DP",
  person_getting_massage: "MH",
  flexed_biceps: "FC",
  breast_feeding: "PC",
  older_person: "EC",
  stethoscope: "DM",
  ambulance: "FA",
  hospital: "PS",
  baby: "CH",
  wind_face: "SR",
  broccoli: "NA",
}

export default function AIHealthPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden pb-6">
      <AnimatedBackground />

      {/* Topbar */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-4 glass-card border-b border-[#F8FFFE]/10">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard">
            <motion.div whileHover={{ x: -3 }} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
            </motion.div>
          </Link>
          <AbhaLogo size="sm" />
        </div>
      </div>

      <div className="relative z-10 flex-1 p-4 md:p-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">Your AI Health Companions</h1>
          <p className="text-muted-foreground text-sm mt-2">Choose your personal health guide</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {companions.map((companion, i) => (
            <motion.div
              key={companion.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 200, damping: 20 }}
            >
              <Link href={`/patient/ai-health/${companion.id}`} className="block group">
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative glass-card overflow-hidden p-5 flex flex-col gap-4 ${i % 3 === 0 ? "rounded-2xl" : i % 3 === 1 ? "rounded-3xl" : "rounded-xl"
                    }`}
                >
                  {/* Featured ribbon */}
                  {companion.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#F8FFFE]"
                      style={{ background: "linear-gradient(90deg, #12B88A, #1A6EBF)" }}
                    >
                      <Sparkles size={10} /> Most Used
                    </div>
                  )}

                  {/* Avatar */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${companion.gradient} flex items-center justify-center text-lg font-bold text-[#F8FFFE] group-hover:scale-110 transition-transform duration-300`}
                  >
                    {emojiMap[companion.emoji] || companion.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground">{companion.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{companion.desc}</p>
                  </div>

                  <div
                    className={`inline-flex self-start items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-[#F8FFFE] bg-gradient-to-r ${companion.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                  >
                    Chat Now
                  </div>

                  {/* Gradient hover effect */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${companion.gradient}`}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}

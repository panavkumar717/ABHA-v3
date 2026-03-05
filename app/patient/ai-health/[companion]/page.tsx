"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, Mic } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Message {
  role: "user" | "ai"
  text: string
}

const companionData: Record<string, { name: string; gradient: string; initials: string; greeting: string }> = {
  "yoga-trainer": { name: "Yoga Trainer", gradient: "from-[#6C5CE7] to-[#4834D4]", initials: "YT", greeting: "Namaste! I'm your Yoga Trainer. I can guide you through asanas, breathing exercises, and help build a daily yoga routine. What would you like to work on today?" },
  "diet-planner": { name: "Diet Planner", gradient: "from-[#00B894] to-[#55E6A5]", initials: "DP", greeting: "Hello! I'm your Diet Planner. I specialize in Indian dietary plans that balance nutrition with taste. Tell me about your health goals and dietary preferences!" },
  "mental-health": { name: "Mental Health Companion", gradient: "from-[#74B9FF] to-[#A29BFE]", initials: "MH", greeting: "Hi there. I'm here to listen and support you. Whether you're feeling stressed, anxious, or just need someone to talk to, I'm here for you. How are you feeling today?" },
  "fitness-coach": { name: "Fitness Coach", gradient: "from-[#F0932B] to-[#FDCB6E]", initials: "FC", greeting: "Hey! Ready to get moving? I'll create exercise routines based on your fitness level and health conditions. What's your current activity level?" },
  "pregnancy-care": { name: "Pregnancy Care", gradient: "from-[#FD79A8] to-[#E84393]", initials: "PC", greeting: "Welcome! I'm here to support you through your pregnancy journey. I can help with nutrition, exercises, and answer your questions. Which trimester are you in?" },
  "elderly-care": { name: "Elderly Care Assistant", gradient: "from-[#B8860B] to-[#DAA520]", initials: "EC", greeting: "Namaste ji! I'm here to help with health management for senior citizens. I can assist with medication reminders, gentle exercises, and daily health tips. How can I help you today?" },
  "diabetes-manager": { name: "Diabetes Manager", gradient: "from-[#00CEC9] to-[#0ABDE3]", initials: "DM", greeting: "Hello! I'm your Diabetes Manager. I can help track your blood sugar, suggest diet modifications, and remind you about medications. What's your latest blood sugar reading?" },
  "first-aid": { name: "First Aid Guide", gradient: "from-[#FF6B6B] to-[#EE5A24]", initials: "FA", greeting: "Hello! I'm your First Aid Guide. In case of an emergency, I can provide step-by-step first aid instructions. What situation do you need help with?" },
  "post-surgery": { name: "Post-Surgery Care", gradient: "from-[#636E72] to-[#2D3436]", initials: "PS", greeting: "Welcome. I'm here to help with your post-surgery recovery. I can guide you through wound care, activity restrictions, and medication schedules. What procedure did you have?" },
  "child-health": { name: "Child Health Advisor", gradient: "from-[#FFEAA7] to-[#FDCB6E]", initials: "CH", greeting: "Hello! I'm your Child Health Advisor. I can help with pediatric health tips, vaccination schedules, and nutrition for your little ones. How old is your child?" },
  "stress-relief": { name: "Stress Relief Coach", gradient: "from-[#81ECEC] to-[#55E6C1]", initials: "SR", greeting: "Hi! Take a deep breath. I'm your Stress Relief Coach. I can guide you through breathing exercises, progressive muscle relaxation, and more. Ready to feel calmer?" },
  "meditation-guide": { name: "Meditation Guide", gradient: "from-[#6C5CE7] to-[#2C2C54]", initials: "MG", greeting: "Om Shanti. I'm your Meditation Guide. I can lead you through guided meditations, mindfulness exercises, and help you find inner peace. Shall we begin?" },
  "nutrition-advisor": { name: "Nutrition Advisor", gradient: "from-[#00B894] to-[#0A7764]", initials: "NA", greeting: "Hello! I'm your Nutrition Advisor. I specialize in micronutrient tracking and can suggest dietary supplements based on your health needs. Tell me about your current diet." },
}

const demoReplies = [
  "That's a great question! Based on your health profile, I'd recommend starting with gentle exercises and gradually increasing intensity. Here's what I suggest...",
  "I understand your concern. Let me provide some helpful information based on the latest medical guidelines for your condition.",
  "Great progress! Keep maintaining your current routine. Here are some additional tips that might help you further...",
]

export default function CompanionChatPage() {
  const params = useParams()
  const companionId = params.companion as string
  const companion = companionData[companionId] || companionData["yoga-trainer"]

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: companion.greeting },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: userMsg }])
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: demoReplies[prev.length % demoReplies.length] },
      ])
    }, 1500)
  }

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className={`fixed inset-0 opacity-20 bg-gradient-to-br ${companion.gradient}`} />

      {/* Top Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-3 border-b border-border glass-card">
        <Link href="/patient/ai-health">
          <motion.div whileHover={{ x: -3 }} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </motion.div>
        </Link>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${companion.gradient} flex items-center justify-center text-sm font-bold text-white`}>
          {companion.initials}
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">{companion.name}</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-light" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Companion Avatar Card */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mx-auto mt-4 mb-2"
      >
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${companion.gradient} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
          {companion.initials}
        </div>
      </motion.div>

      {/* Chat Area */}
      <div ref={chatRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "ai" && (
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${companion.gradient} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                    {companion.initials}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${msg.role === "user"
                      ? "bg-accent text-white rounded-br-sm"
                      : "text-foreground bg-muted rounded-bl-sm"
                    }`}
                  style={msg.role === "ai" ? { background: `linear-gradient(135deg, ${companion.gradient.includes('#6C5CE7') ? '#6C5CE7' : companion.gradient.includes('#00B894') ? '#00B894' : companion.gradient.includes('#74B9FF') ? '#74B9FF' : companion.gradient.includes('#F0932B') ? '#F0932B' : companion.gradient.includes('#FD79A8') ? '#FD79A8' : companion.gradient.includes('#B8860B') ? '#B8860B' : companion.gradient.includes('#00CEC9') ? '#00CEC9' : companion.gradient.includes('#FF6B6B') ? '#FF6B6B' : companion.gradient.includes('#636E72') ? '#636E72' : companion.gradient.includes('#FFEAA7') ? '#FFEAA7' : companion.gradient.includes('#81ECEC') ? '#81ECEC' : '#0A7764'}20, transparent)` } : {}}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-2"
          >
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${companion.gradient} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
              {companion.initials}
            </div>
            <div className="glass-card rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-sage"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Bar */}
      <div className="relative z-10 px-4 py-3 border-t border-border glass-card safe-bottom">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage() }}
          className="flex items-center gap-2"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Voice input"
          >
            <Mic size={18} />
          </motion.button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-surface border border-border rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary-light transition-colors"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-30"
            style={{ background: "linear-gradient(135deg, #0A7764, #12B88A)" }}
            aria-label="Send message"
          >
            <Send size={16} />
          </motion.button>
        </form>
      </div>
    </main>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bot, Send, User, Loader2, AlertCircle } from 'lucide-react'

interface Message { id?: string; role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
    'What is diabetes?',
    'What does high cholesterol mean?',
    'Why do I need to take my medicine with food?',
    'What is a normal blood pressure reading?',
    'What are symptoms of anemia?',
]

export default function ChatPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated') {
            fetch('/api/chat').then(r => r.json()).then(data => {
                if (Array.isArray(data)) setMessages(data)
            })
        }
    }, [status, router])

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return
        const userMsg: Message = { role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: messages.slice(-6) })
            })
            const data = await res.json()
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
    if (!session) return null

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-4 sticky top-16 z-10">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900">AI Health Assistant</h1>
                        <p className="text-xs text-slate-500">Educational information only — not medical advice</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Bot className="w-8 h-8 text-violet-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Ask Me Anything Health-Related</h2>
                        <p className="text-slate-500 text-sm mb-6">I can explain medical terms, lab results, and medications in plain language.</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {SUGGESTIONS.map(s => (
                                <button key={s} onClick={() => sendMessage(s)} className="text-sm bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 mt-1">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white rounded-tr-sm'
                                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm'
                            }`}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 bg-slate-200 rounded-xl flex items-center justify-center shrink-0 mt-1">
                                <User className="w-4 h-4 text-slate-600" />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Disclaimer */}
            <div className="max-w-3xl mx-auto w-full px-4 pb-2">
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">For educational purposes only. Not a substitute for professional medical advice.</p>
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-100 px-4 py-4 sticky bottom-0">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                        placeholder="Ask about a symptom, medication, or lab result..."
                        className="input-field flex-1 text-sm"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className="w-11 h-11 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-md shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

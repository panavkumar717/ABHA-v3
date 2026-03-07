'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, Type, Contrast, Volume2, Moon, Sun, Check } from 'lucide-react'

export default function AccessibilityPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [settings, setSettings] = useState({
        largeText: false,
        highContrast: false,
        simplifiedText: false,
        voiceReading: false,
        darkMode: false,
    })

    if (status === 'unauthenticated') { router.push('/auth/login'); return null }
    if (!session) return null

    const toggle = (key: keyof typeof settings) => {
        const next = { ...settings, [key]: !settings[key] }
        setSettings(next)
        // Apply changes to document
        if (key === 'largeText') document.documentElement.style.fontSize = next.largeText ? '120%' : ''
        if (key === 'highContrast') document.documentElement.setAttribute('data-contrast', next.highContrast ? 'high' : '')
        if (key === 'darkMode') document.documentElement.setAttribute('data-theme', next.darkMode ? 'dark' : '')
    }

    const options = [
        { key: 'largeText' as const, icon: Type, label: 'Large Text', description: 'Increase font size across the app for easier reading', color: 'text-blue-600', bg: 'bg-blue-50' },
        { key: 'highContrast' as const, icon: Contrast, label: 'High Contrast', description: 'Enhance color contrast for better visibility', color: 'text-purple-600', bg: 'bg-purple-50' },
        { key: 'simplifiedText' as const, icon: Eye, label: 'Simplified Text', description: 'Use plainer language and reduce jargon throughout the app', color: 'text-teal-600', bg: 'bg-teal-50' },
        { key: 'voiceReading' as const, icon: Volume2, label: 'Voice Reading', description: 'Read page content aloud when hovering over text blocks', color: 'text-orange-600', bg: 'bg-orange-50' },
        { key: 'darkMode' as const, icon: Moon, label: 'Dark Mode', description: 'Reduce eye strain with a darker color scheme', color: 'text-slate-700', bg: 'bg-slate-100' },
    ]

    const anyEnabled = Object.values(settings).some(Boolean)

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><span className="text-3xl">♿</span> Accessibility</h1>
                    <p className="text-slate-500 mt-1">Customize the app for your visual and reading preferences</p>
                </div>

                {/* Status banner */}
                {anyEnabled && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><Check className="w-4 h-4 text-cyan-600" /></div>
                        <p className="text-cyan-800 text-sm font-medium">Accessibility mode is active — {Object.values(settings).filter(Boolean).length} setting{Object.values(settings).filter(Boolean).length !== 1 ? 's' : ''} enabled</p>
                    </div>
                )}

                {/* Settings cards */}
                <div className="space-y-3">
                    {options.map(({ key, icon: Icon, label, description, color, bg }) => (
                        <div key={key} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 transition-all ${settings[key] ? 'border-cyan-200' : 'border-slate-100'}`}>
                            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <Icon className={`w-6 h-6 ${color}`} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">{label}</p>
                                <p className="text-slate-500 text-sm">{description}</p>
                            </div>
                            <button
                                onClick={() => toggle(key)}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${settings[key] ? 'bg-cyan-500' : 'bg-slate-200'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${settings[key] ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Text size preview */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500" /> Preview</h3>
                    <p className={settings.largeText ? 'text-xl text-slate-700 leading-relaxed' : 'text-base text-slate-700 leading-relaxed'}>
                        {settings.simplifiedText
                            ? 'Your health data is stored safely. You can see all your records here.'
                            : 'Your medical records are securely stored and accessible through your personal health dashboard.'}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {Object.entries(settings).filter(([, v]) => v).map(([k]) => (
                            <span key={k} className="text-xs bg-cyan-100 text-cyan-700 px-2.5 py-1 rounded-full font-medium">{k}</span>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-slate-400 text-center">Settings apply instantly and are stored locally in this browser session.</p>
            </div>
        </div>
    )
}

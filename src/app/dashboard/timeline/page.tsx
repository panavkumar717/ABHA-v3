'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, FileText, Stethoscope, Pill, AlertTriangle, Info } from 'lucide-react'

interface TimelineItem { id: string; type: 'report' | 'visit' | 'prescription' | 'alert'; title: string; description?: string; date: string; severity: string }

const typeConfig = {
    report: { icon: FileText, bg: 'bg-blue-100', color: 'text-blue-600', dot: 'bg-blue-500', label: 'Report' },
    visit: { icon: Stethoscope, bg: 'bg-teal-100', color: 'text-teal-600', dot: 'bg-teal-500', label: 'Doctor Visit' },
    prescription: { icon: Pill, bg: 'bg-purple-100', color: 'text-purple-600', dot: 'bg-purple-500', label: 'Prescription' },
    alert: { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-600', dot: 'bg-amber-500', label: 'Health Alert' },
}

export default function TimelinePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [items, setItems] = useState<TimelineItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated') {
            fetch('/api/timeline').then(r => r.json()).then(d => { if (Array.isArray(d)) { setItems(d) } }).finally(() => setLoading(false))
        }
    }, [status, router])

    const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

    const groupedByMonth: Record<string, TimelineItem[]> = {}
    filtered.forEach(item => {
        const key = new Date(item.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        if (!groupedByMonth[key]) groupedByMonth[key] = []
        groupedByMonth[key].push(item)
    })

    if (status === 'loading' || loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
    if (!session) return null

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><span className="text-3xl">📅</span> Health Timeline</h1>
                    <p className="text-slate-500 mt-1">Your complete health history in chronological order</p>
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 flex-wrap">
                    {['all', 'report', 'visit', 'prescription', 'alert'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                            {f === 'all' ? 'All Events' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <Info className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No events found</p>
                        <p className="text-sm">Upload reports, record visits, or add prescriptions to see your timeline</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedByMonth).map(([month, monthItems]) => (
                            <div key={month}>
                                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{month}</h2>
                                <div className="relative">
                                    {/* Vertical line */}
                                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
                                    <div className="space-y-4">
                                        {monthItems.map(item => {
                                            const cfg = typeConfig[item.type] || typeConfig.report
                                            const Icon = cfg.icon
                                            return (
                                                <div key={item.id} className="flex gap-4 relative">
                                                    {/* Dot */}
                                                    <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center shrink-0 z-10 shadow-sm`}>
                                                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                                                    </div>
                                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} inline-block mb-1`}>{cfg.label}</span>
                                                                <p className="font-semibold text-slate-900 leading-tight">{item.title}</p>
                                                                {item.description && <p className="text-slate-500 text-sm mt-1 line-clamp-2">{item.description}</p>}
                                                            </div>
                                                            <p className="text-xs text-slate-400 shrink-0">{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

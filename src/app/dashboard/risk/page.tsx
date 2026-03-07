'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, TrendingUp, ShieldAlert, ShieldCheck, RefreshCw, Info } from 'lucide-react'
import toast from 'react-hot-toast'

interface RiskAlert { metric: string; trend: string; severity: 'info' | 'warning' | 'critical'; recommendation: string }

const severityConfig = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: ShieldCheck, iconColor: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', label: 'Stable' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: ShieldAlert, iconColor: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', label: 'Watch' },
    critical: { bg: 'bg-red-50', border: 'border-red-200', icon: ShieldAlert, iconColor: 'text-red-600', badge: 'bg-red-100 text-red-700', label: 'Critical' },
}

export default function RiskPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [alerts, setAlerts] = useState<RiskAlert[]>([])
    const [hasData, setHasData] = useState(true)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [message, setMessage] = useState('')

    const runAnalysis = async (showToast = false) => {
        setRefreshing(true)
        try {
            const res = await fetch('/api/risk-detect')
            const data = await res.json()
            if (data.message) { setMessage(data.message); setHasData(false) }
            else { setAlerts(data.alerts || []); setHasData(true) }
            if (showToast) toast.success('Risk analysis updated')
        } catch { toast.error('Analysis failed') }
        finally { setRefreshing(false); setLoading(false) }
    }

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated') runAnalysis()
    }, [status, router])

    if (status === 'loading' || loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
    if (!session) return null

    const critical = alerts.filter(a => a.severity === 'critical').length
    const warnings = alerts.filter(a => a.severity === 'warning').length

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><span className="text-3xl">🔬</span> Health Risk Detection</h1>
                        <p className="text-slate-500 mt-1">AI analysis of your health trends and risk factors</p>
                    </div>
                    <button onClick={() => runAnalysis(true)} disabled={refreshing} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>

                {/* Summary cards */}
                {hasData && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                            <p className="text-3xl font-black text-red-600">{critical}</p>
                            <p className="text-red-700 text-sm font-semibold mt-1">Critical</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                            <p className="text-3xl font-black text-amber-600">{warnings}</p>
                            <p className="text-amber-700 text-sm font-semibold mt-1">Warnings</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                            <p className="text-3xl font-black text-green-600">{alerts.length - critical - warnings}</p>
                            <p className="text-green-700 text-sm font-semibold mt-1">Stable</p>
                        </div>
                    </div>
                )}

                {!hasData ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                        <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="font-semibold text-slate-700 mb-1">No Data Yet</h3>
                        <p className="text-slate-500 text-sm">{message || 'Upload and extract values from reports to enable risk analysis.'}</p>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                        <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="font-bold text-green-800">All Clear!</h3>
                        <p className="text-green-700 text-sm mt-1">No concerning health trends detected.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {['critical', 'warning', 'info'].map(sev => {
                            const sevAlerts = alerts.filter(a => a.severity === sev)
                            if (sevAlerts.length === 0) return null
                            return sevAlerts.map((alert, i) => {
                                const cfg = severityConfig[alert.severity]
                                const Icon = cfg.icon
                                return (
                                    <div key={`${sev}-${i}`} className={`${cfg.bg} ${cfg.border} border rounded-2xl p-5 space-y-3`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                                                <h3 className="font-bold text-slate-900">{alert.metric}</h3>
                                            </div>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                                        </div>
                                        <div className="bg-white/60 rounded-xl p-3">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Trend</p>
                                            <p className="text-slate-800 text-sm">{alert.trend}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Recommendation</p>
                                            <p className="text-slate-700 text-sm">{alert.recommendation}</p>
                                        </div>
                                    </div>
                                )
                            })
                        })}
                    </div>
                )}

                <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500">This analysis is for informational purposes only. Always consult your doctor before making health decisions.</p>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, Pill, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

interface Medicine { name: string; dosage: string; frequency: string; purpose: string; warnings: string }
interface Prescription { id: string; imageUrl: string | null; medicines: string; analyzedAt: string }

export default function PrescriptionsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [mode, setMode] = useState<'image' | 'text'>('image')
    const [manualText, setManualText] = useState('')
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated') fetch('/api/prescriptions').then(r => r.json()).then(d => Array.isArray(d) && setPrescriptions(d))
    }, [status, router])

    const analyze = async (file?: File) => {
        setUploading(true)
        const fd = new FormData()
        if (file) fd.append('image', file)
        else fd.append('text', manualText)
        try {
            const res = await fetch('/api/prescriptions', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) { toast.error(data.error); return }
            setPrescriptions(prev => [data, ...prev])
            setExpanded(data.id)
            setManualText('')
            toast.success('Prescription analyzed!')
        } catch { toast.error('Analysis failed') }
        finally { setUploading(false) }
    }

    const parseMeds = (medicines: string): Medicine[] => { try { const p = JSON.parse(medicines); return Array.isArray(p) ? p : [] } catch { return [] } }

    if (status === 'loading') return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
    if (!session) return null

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><span className="text-3xl">💊</span> AI Prescription Analyzer</h1>
                    <p className="text-slate-500 mt-1">Upload a prescription image or paste text to extract medicine details</p>
                </div>

                {/* Upload Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
                        {(['image', 'text'] as const).map(m => (
                            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === m ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
                                {m === 'image' ? '🖼️ Upload Image' : '📝 Paste Text'}
                            </button>
                        ))}
                    </div>

                    {mode === 'image' ? (
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragOver ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'} ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                            onClick={() => fileRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) analyze(f) }}
                        >
                            <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf" onChange={e => { const f = e.target.files?.[0]; if (f) analyze(f) }} />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-3"><Loader2 className="w-10 h-10 text-cyan-500 animate-spin" /><p className="text-slate-600">Analyzing prescription…</p></div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center"><Upload className="w-6 h-6 text-cyan-500" /></div>
                                    <div><p className="font-semibold text-slate-800">Drop prescription image or tap to upload</p><p className="text-slate-400 text-xs mt-1">JPG, PNG, PDF — max 10MB</p></div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <textarea value={manualText} onChange={e => setManualText(e.target.value)} rows={5} className="input-field resize-none" placeholder="Paste your prescription text here…&#10;e.g. Tab Metformin 500mg BD x 30 days" />
                            <button onClick={() => analyze()} disabled={uploading || !manualText.trim()} className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-60 transition-all">
                                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : '🔍 Analyze Prescription'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Prescription list */}
                {prescriptions.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-800">Analyzed Prescriptions</h2>
                        {prescriptions.map(rx => {
                            const meds = parseMeds(rx.medicines)
                            const isOpen = expanded === rx.id
                            return (
                                <div key={rx.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <button className="w-full flex items-center justify-between p-5" onClick={() => setExpanded(isOpen ? null : rx.id)}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><Pill className="w-5 h-5 text-purple-600" /></div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900">{meds.length} Medicine{meds.length !== 1 ? 's' : ''} Found</p>
                                                <p className="text-slate-500 text-xs">{new Date(rx.analyzedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 border-t border-slate-50 space-y-3">
                                            {meds.map((med, i) => (
                                                <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base">💊</span>
                                                        <span className="font-bold text-slate-900">{med.name}</span>
                                                        <span className="badge-med ml-auto">{med.dosage}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600"><span className="font-medium text-slate-700">Frequency:</span> {med.frequency}</p>
                                                    {med.purpose && <p className="text-sm text-slate-600"><span className="font-medium text-slate-700">Purpose:</span> {med.purpose}</p>}
                                                    {med.warnings && (
                                                        <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-2.5">
                                                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                            <p className="text-xs text-amber-700">{med.warnings}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {prescriptions.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <div className="text-5xl mb-3">💊</div>
                        <p className="font-medium">No prescriptions analyzed yet</p>
                        <p className="text-sm">Upload a prescription image above to get started</p>
                    </div>
                )}

                <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">Reminders are automatically created for each medicine based on the dosage schedule.</p>
                </div>
            </div>
        </div>
    )
}

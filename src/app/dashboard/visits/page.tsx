'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mic, MicOff, Loader2, FileText, ChevronDown, ChevronUp, Calendar, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface Visit {
    id: string; doctorName: string; visitDate: string; diagnosis: string
    medicines: string; instructions: string; followUpDate: string; transcript: string
}

export default function VisitsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [visits, setVisits] = useState<Visit[]>([])
    const [recording, setRecording] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [doctorName, setDoctorName] = useState('')
    const [manualText, setManualText] = useState('')
    const [mode, setMode] = useState<'record' | 'text'>('record')
    const mediaRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated') fetch('/api/visits').then(r => r.json()).then(d => Array.isArray(d) && setVisits(d))
    }, [status, router])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mr = new MediaRecorder(stream)
            chunksRef.current = []
            mr.ondataavailable = e => chunksRef.current.push(e.data)
            mr.start()
            mediaRef.current = mr
            setRecording(true)
        } catch { toast.error('Microphone access denied') }
    }

    const stopAndProcess = async () => {
        if (!mediaRef.current) return
        mediaRef.current.stop()
        mediaRef.current.stream.getTracks().forEach(t => t.stop())
        setRecording(false)
        setProcessing(true)

        await new Promise<void>(resolve => { if (mediaRef.current) mediaRef.current.onstop = () => resolve() })

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const fd = new FormData()
        fd.append('audio', blob, 'recording.webm')
        if (doctorName) fd.append('doctorName', doctorName)

        try {
            const res = await fetch('/api/visits', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) { toast.error(data.error); return }
            setVisits(prev => [data, ...prev])
            setExpandedId(data.id)
            toast.success('Visit summary generated!')
        } catch { toast.error('Failed to process recording') }
        finally { setProcessing(false) }
    }

    const submitText = async () => {
        if (!manualText.trim()) { toast.error('Please enter transcript text'); return }
        setProcessing(true)
        const fd = new FormData()
        fd.append('text', manualText)
        if (doctorName) fd.append('doctorName', doctorName)
        try {
            const res = await fetch('/api/visits', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) { toast.error(data.error); return }
            setVisits(prev => [data, ...prev])
            setExpandedId(data.id)
            setManualText('')
            toast.success('Visit summary generated!')
        } catch { toast.error('Failed to generate summary') }
        finally { setProcessing(false) }
    }

    if (status === 'loading') return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
    if (!session) return null

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="text-3xl">🩺</span> Doctor Visit Recorder
                    </h1>
                    <p className="text-slate-500 mt-1">Record consultations and get AI-generated summaries</p>
                </div>

                {/* Recorder Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <div>
                        <label className="label">Doctor Name (optional)</label>
                        <input type="text" placeholder="Dr. Sharma" className="input-field" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
                        {(['record', 'text'] as const).map(m => (
                            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === m ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
                                {m === 'record' ? '🎙️ Record Audio' : '✍️ Enter Text'}
                            </button>
                        ))}
                    </div>

                    {mode === 'record' ? (
                        <div className="text-center py-6">
                            <button
                                onClick={recording ? stopAndProcess : startRecording}
                                disabled={processing}
                                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg ${recording ? 'bg-red-500 hover:bg-red-600 animate-pulse-ring' : 'bg-gradient-to-br from-cyan-500 to-teal-600 hover:opacity-90'}`}
                            >
                                {processing ? <Loader2 className="w-10 h-10 text-white animate-spin" /> : recording ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
                            </button>
                            <p className="text-slate-600 mt-4 font-medium">{processing ? 'Generating AI summary…' : recording ? 'Recording… tap to stop' : 'Tap to start recording'}</p>
                        </div>
                    ) : (
                        <div>
                            <label className="label">Consultation Notes / Transcript</label>
                            <textarea value={manualText} onChange={e => setManualText(e.target.value)} rows={5} className="input-field resize-none" placeholder="Type or paste the consultation notes here…" />
                            <button onClick={submitText} disabled={processing} className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-60 transition-all">
                                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : '✨ Generate AI Summary'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Past Visits */}
                {visits.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-3">Past Visits ({visits.length})</h2>
                        <div className="space-y-3">
                            {visits.map(v => {
                                const meds = (() => { try { return JSON.parse(v.medicines) } catch { return [] } })()
                                const isOpen = expandedId === v.id
                                return (
                                    <div key={v.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setExpandedId(isOpen ? null : v.id)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-teal-600" /></div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{v.doctorName ? `Dr. ${v.doctorName}` : 'Doctor Visit'}</p>
                                                    <p className="text-slate-500 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(v.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 pb-5 space-y-4 border-t border-slate-50">
                                                {v.diagnosis && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Diagnosis</p><p className="text-slate-800 font-medium">{v.diagnosis}</p></div>}
                                                {meds.length > 0 && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Prescribed Medicines</p><ul className="space-y-1">{meds.map((m: string, i: number) => <li key={i} className="text-slate-700 text-sm flex items-start gap-2"><span className="text-cyan-500 mt-0.5">•</span>{m}</li>)}</ul></div>}
                                                {v.instructions && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Doctor Instructions</p><p className="text-slate-700 text-sm">{v.instructions}</p></div>}
                                                {v.followUpDate && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Follow-up</p><p className="text-slate-700 text-sm flex items-center gap-1.5"><Calendar className="w-4 h-4 text-cyan-500" />{v.followUpDate}</p></div>}
                                                {v.transcript && <details className="text-xs text-slate-400"><summary className="cursor-pointer hover:text-slate-600">View raw transcript</summary><p className="mt-2 text-slate-600 leading-relaxed">{v.transcript}</p></details>}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {visits.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No visits recorded yet</p>
                        <p className="text-sm">Record your next doctor consultation above</p>
                    </div>
                )}
            </div>
        </div>
    )
}

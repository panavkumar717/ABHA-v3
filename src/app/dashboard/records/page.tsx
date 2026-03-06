'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FileText, Upload, Clock, Brain, Download, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface MedicalRecord {
    id: string
    fileName: string
    fileType: string
    fileUrl: string
    uploadedAt: string
    aiSummary?: string
}

interface AISummary {
    summary: string
    indicators: string[]
    implications: string[]
    nextSteps: string[]
}

export default function RecordsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [records, setRecords] = useState<MedicalRecord[]>([])
    const [uploading, setUploading] = useState(false)
    const [expandedSummary, setExpandedSummary] = useState<string | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated') fetchRecords()
    }, [status])

    const fetchRecords = async () => {
        const res = await fetch('/api/records')
        const data = await res.json()
        setRecords(data.records || [])
    }

    const handleUpload = async (file: File) => {
        if (!file) return
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('userId', session?.user?.id || '')
            const res = await fetch('/api/records/upload', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) { toast.error(data.error); return }
            toast.success('File uploaded successfully!')
            fetchRecords()
        } catch {
            toast.error('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const parseSummary = (aiSummary?: string): AISummary | null => {
        if (!aiSummary) return null
        try { return JSON.parse(aiSummary) } catch { return null }
    }

    if (status === 'loading') return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" /></div>
    if (!session) return null

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-cyan-600" />
                        Medical Records
                    </h1>
                    <p className="text-slate-500 mt-1">{records.length} record{records.length !== 1 ? 's' : ''} in your health timeline</p>
                </div>

                {/* Upload Zone */}
                <div
                    className={`bg-white rounded-3xl border-2 border-dashed p-10 text-center mb-8 cursor-pointer transition-all duration-200 ${dragOver ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f) }}
                >
                    <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
                            <p className="text-slate-600 font-medium">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center">
                                <Upload className="w-7 h-7 text-cyan-500" />
                            </div>
                            <div>
                                <p className="text-slate-800 font-semibold">Drop a file here or click to upload</p>
                                <p className="text-slate-400 text-sm mt-1">Supports PDF, JPG, PNG · Max 10MB</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Records Timeline */}
                {records.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                        <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-slate-600 font-semibold text-lg">No records yet</h3>
                        <p className="text-slate-400 text-sm mt-2">Upload your first medical record above, or share your QR with a doctor.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {records.map((record, idx) => {
                            const summary = parseSummary(record.aiSummary)
                            const isExpanded = expandedSummary === record.id
                            return (
                                <div key={record.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-5 flex items-start gap-4">
                                        {/* Timeline indicator */}
                                        <div className="flex flex-col items-center shrink-0">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${record.fileType === 'application/pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                                                <FileText className={`w-5 h-5 ${record.fileType === 'application/pdf' ? 'text-red-500' : 'text-blue-500'}`} />
                                            </div>
                                            {idx < records.length - 1 && <div className="w-px h-4 bg-slate-200 mt-2" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 truncate">{record.fileName}</h3>
                                                    <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(record.uploadedAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors" title="Download">
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    {summary && (
                                                        <button
                                                            onClick={() => setExpandedSummary(isExpanded ? null : record.id)}
                                                            className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            <Brain className="w-3.5 h-3.5" />
                                                            AI Summary
                                                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* AI Summary Expanded */}
                                            {isExpanded && summary && (
                                                <div className="mt-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-purple-800 font-bold text-sm mb-1.5">📋 Summary of Findings</h4>
                                                            <p className="text-slate-700 text-sm leading-relaxed">{summary.summary}</p>
                                                        </div>
                                                        {summary.indicators?.length > 0 && (
                                                            <div>
                                                                <h4 className="text-purple-800 font-bold text-sm mb-1.5">🔍 Key Indicators</h4>
                                                                <ul className="space-y-1">{summary.indicators.map((i, idx) => <li key={idx} className="text-slate-700 text-sm flex items-start gap-2"><span className="text-purple-400 mt-0.5">•</span>{i}</li>)}</ul>
                                                            </div>
                                                        )}
                                                        {summary.implications?.length > 0 && (
                                                            <div>
                                                                <h4 className="text-purple-800 font-bold text-sm mb-1.5">💡 Health Implications</h4>
                                                                <ul className="space-y-1">{summary.implications.map((i, idx) => <li key={idx} className="text-slate-700 text-sm flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span>{i}</li>)}</ul>
                                                            </div>
                                                        )}
                                                        {summary.nextSteps?.length > 0 && (
                                                            <div>
                                                                <h4 className="text-purple-800 font-bold text-sm mb-1.5">✅ Recommended Next Steps</h4>
                                                                <ul className="space-y-1">{summary.nextSteps.map((i, idx) => <li key={idx} className="text-slate-700 text-sm flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span>{i}</li>)}</ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

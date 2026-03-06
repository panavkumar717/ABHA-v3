'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Upload, CheckCircle, Heart, FileText, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ScanPage() {
    const { userId } = useParams() as { userId: string }
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (file: File) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
        if (!allowed.includes(file.type)) {
            toast.error('Only PDF, JPG, and PNG files are allowed')
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File must be under 10MB')
            return
        }

        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('userId', userId)
            const res = await fetch('/api/records/upload', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) { toast.error(data.error || 'Upload failed'); return }
            setUploaded(true)
            toast.success('Record uploaded successfully!')
        } catch {
            toast.error('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-medical-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Card */}
                <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-3xl p-6 text-white mb-6 text-center shadow-xl">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-xl font-bold mb-1">ABHA HealthQR</h1>
                    <p className="text-cyan-100 text-sm">Upload patient medical records</p>
                </div>

                {uploaded ? (
                    <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Upload Successful!</h2>
                        <p className="text-slate-500 mb-6">The medical record has been securely added to the patient's health timeline.</p>
                        <button
                            onClick={() => { setUploaded(false) }}
                            className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all"
                        >
                            Upload Another
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Upload Medical Record</h2>
                            <p className="text-slate-500 text-sm">Upload a prescription, lab report, or diagnosis summary for this patient.</p>
                        </div>

                        {/* Upload Zone */}
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${dragOver ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'} ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                            onClick={() => fileRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f) }}
                        >
                            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />

                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
                                    <p className="text-slate-600 font-medium">Uploading securely...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center">
                                        <Upload className="w-7 h-7 text-cyan-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Tap to select file</p>
                                        <p className="text-slate-400 text-xs mt-1">or drag & drop here</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* File Types */}
                        <div className="flex items-center justify-center gap-4 mt-4">
                            {['PDF', 'JPG', 'PNG'].map((t) => (
                                <div key={t} className="flex items-center gap-1.5 text-slate-500 text-xs">
                                    <FileText className="w-3.5 h-3.5" />
                                    {t}
                                </div>
                            ))}
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-500 text-xs">Max 10MB</span>
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 bg-slate-50 rounded-xl p-4 flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Files uploaded here will be stored securely and only accessible to the patient via their ABHA HealthQR account.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

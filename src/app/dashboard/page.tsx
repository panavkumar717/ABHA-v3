'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    QrCode, Upload, FileText, ShieldAlert, ArrowRight, Clock, Brain
} from 'lucide-react'
import toast from 'react-hot-toast'

interface MedicalRecord {
    id: string
    fileName: string
    fileType: string
    fileUrl: string
    uploadedAt: string
    aiSummary?: string
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [records, setRecords] = useState<MedicalRecord[]>([])
    const [qrDataUrl, setQrDataUrl] = useState<string>('')
    const [loadingQr, setLoadingQr] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        else if (status === 'authenticated' && (session?.user as any)?.role === 'DOCTOR') {
            router.push('/doctor/dashboard')
        }
    }, [status, session, router])

    useEffect(() => {
        if (status === 'authenticated') {
            // Fetch QR
            fetch('/api/qr/generate')
                .then((r) => r.json())
                .then((d) => { setQrDataUrl(d.qrDataUrl); setLoadingQr(false) })
                .catch(() => setLoadingQr(false))

            // Fetch records
            fetch('/api/records')
                .then((r) => r.json())
                .then((d) => setRecords(d.records || []))
                .catch(() => toast.error('Failed to fetch records'))
        }
    }, [status])

    if (status === 'loading') return <DashboardSkeleton />
    if (!session) return null

    const firstName = session.user?.name?.split(' ')[0] || 'there'

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Good evening, <span className="text-cyan-600">{firstName}</span> 👋
                    </h1>
                    <p className="text-slate-500 mt-1">Manage your health records and QR identity</p>
                </div>

                {/* Top 2-col grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Health QR Card */}
                    <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-6">
                                <QrCode className="w-6 h-6" />
                                <h2 className="font-bold text-lg">My Health QR</h2>
                            </div>
                            <div className="flex items-center gap-6">
                                {loadingQr ? (
                                    <div className="w-24 h-24 bg-white/20 rounded-xl animate-pulse" />
                                ) : qrDataUrl ? (
                                    <div className="bg-white rounded-xl p-2 shadow-lg">
                                        <img src={qrDataUrl} alt="Health QR Code" className="w-20 h-20" />
                                    </div>
                                ) : null}
                                <div>
                                    <p className="text-white/80 text-sm mb-3">Share this QR with your doctor to receive medical records directly.</p>
                                    <Link href="/dashboard/qr" className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 text-sm font-semibold transition-colors">
                                        View Full QR <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Upload Card */}
                    <Link href="/dashboard/records" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                                <Upload className="w-5 h-5 text-violet-600" />
                            </div>
                            <h2 className="font-bold text-slate-900 text-lg">Upload Report</h2>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed flex-1">
                            Upload a medical report and get an AI-powered plain-language explanation instantly.
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-violet-600 font-semibold text-sm group-hover:gap-3 transition-all">
                            Upload now <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Bottom 3-col grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Medical Records */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-slate-500" />
                                <h2 className="font-bold text-slate-900">Recent Records</h2>
                            </div>
                            <Link href="/dashboard/records" className="text-cyan-600 text-sm font-semibold hover:text-cyan-700">
                                View all
                            </Link>
                        </div>

                        {records.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium">No records yet</p>
                                <p className="text-slate-400 text-sm mt-1">Share your QR with a doctor to start receiving records</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {records.slice(0, 4).map((record) => (
                                    <div key={record.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${record.fileType === 'application/pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                                            <FileText className={`w-4 h-4 ${record.fileType === 'application/pdf' ? 'text-red-500' : 'text-blue-500'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 text-sm truncate">{record.fileName}</p>
                                            <p className="text-slate-400 text-xs flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(record.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        {record.aiSummary && (
                                            <div className="shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center" title="AI Summary available">
                                                <Brain className="w-3.5 h-3.5 text-purple-600" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        {/* Emergency Passport */}
                        <Link href="/dashboard/emergency" className="group block bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Emergency Passport</h3>
                            <p className="text-slate-400 text-xs">Set up critical health info for emergencies</p>
                            <div className="flex items-center gap-1 mt-3 text-red-500 text-xs font-semibold group-hover:gap-2 transition-all">
                                Set up now <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>

                        {/* AI Explainer */}
                        <Link href="/dashboard/ai-report" className="group block bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
                                <Brain className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">AI Report Explainer</h3>
                            <p className="text-slate-400 text-xs">Understand your medical reports in plain language</p>
                            <div className="flex items-center gap-1 mt-3 text-purple-500 text-xs font-semibold group-hover:gap-2 transition-all">
                                Try now <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>

                        {/* Stats */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                            <p className="text-slate-400 text-xs font-medium mb-3">Health Summary</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">Total Records</span>
                                    <span className="font-bold text-lg">{records.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">AI Summaries</span>
                                    <span className="font-bold text-lg">{records.filter(r => r.aiSummary).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="h-10 w-64 bg-slate-200 rounded-xl animate-shimmer mb-2" />
                <div className="h-5 w-48 bg-slate-100 rounded-lg animate-shimmer mb-8" />
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="h-48 bg-slate-200 rounded-3xl animate-shimmer" />
                    <div className="h-48 bg-slate-200 rounded-3xl animate-shimmer" />
                </div>
            </div>
        </div>
    )
}

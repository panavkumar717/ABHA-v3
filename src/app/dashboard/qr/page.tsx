'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { QrCode, Download, Share2, RefreshCw, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function QRPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [qrData, setQrData] = useState<{ qrDataUrl: string; scanUrl: string; abhaId?: string; userName?: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    const fetchQR = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/qr/generate')
            const data = await res.json()
            setQrData(data)
        } catch {
            toast.error('Failed to generate QR code')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated') fetchQR()
    }, [status, router, fetchQR])

    const handleDownload = () => {
        if (!qrData?.qrDataUrl) return
        const link = document.createElement('a')
        link.download = 'abha-healthqr.png'
        link.href = qrData.qrDataUrl
        link.click()
        toast.success('QR code downloaded!')
    }

    const handleCopy = async () => {
        if (!qrData?.scanUrl) return
        await navigator.clipboard.writeText(qrData.scanUrl)
        setCopied(true)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Generating your Health QR...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <QrCode className="w-8 h-8 text-cyan-600" />
                        My Health QR
                    </h1>
                    <p className="text-slate-500 mt-1">Share this QR with any doctor to give them instant upload access</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* QR Display */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                        <div className="inline-block bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-6 border-2 border-dashed border-cyan-200 mb-6">
                            {qrData?.qrDataUrl && (
                                <img src={qrData.qrDataUrl} alt="Health QR Code" className="w-56 h-56" />
                            )}
                        </div>

                        <div className="space-y-2 mb-6">
                            <p className="font-bold text-slate-900 text-lg">
                                {qrData?.userName || session?.user?.name}
                            </p>
                            {qrData?.abhaId && (
                                <p className="text-slate-500 text-sm font-mono bg-slate-50 rounded-lg px-3 py-1.5 inline-block">
                                    ABHA: {qrData.abhaId}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition-colors"
                            >
                                <Download className="w-4 h-4" /> Download
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                            >
                                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                        <button
                            onClick={fetchQR}
                            className="mt-3 w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 text-sm py-2 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Regenerate QR
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <h2 className="font-bold text-slate-900 text-lg mb-5">How It Works</h2>
                            <div className="space-y-4">
                                {[
                                    { step: '1', title: 'Show your QR', desc: 'Show the QR code to your doctor or healthcare provider at the clinic.' },
                                    { step: '2', title: 'Doctor scans QR', desc: 'The doctor scans your QR code using any smartphone camera.' },
                                    { step: '3', title: 'Upload records', desc: 'The doctor uploads prescriptions, lab reports, or diagnosis notes.' },
                                    { step: '4', title: 'Sync to your account', desc: 'Records appear instantly in your medical timeline on your dashboard.' },
                                ].map((item) => (
                                    <div key={item.step} className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                                            {item.step}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                                            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scan URL */}
                        {qrData?.scanUrl && (
                            <div className="bg-cyan-50 rounded-2xl p-5 border border-cyan-100">
                                <p className="text-cyan-700 font-semibold text-sm mb-2">Doctor Upload Link</p>
                                <div className="bg-white rounded-xl p-3 border border-cyan-100 flex items-center gap-2">
                                    <p className="text-slate-600 text-xs font-mono flex-1 truncate">{qrData.scanUrl}</p>
                                    <a href={qrData.scanUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                        <ExternalLink className="w-4 h-4 text-cyan-500 hover:text-cyan-700" />
                                    </a>
                                </div>
                                <p className="text-cyan-600 text-xs mt-2">Doctors can also open this link directly — no app needed.</p>
                            </div>
                        )}

                        {/* Share */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <p className="font-semibold text-slate-800 text-sm mb-3">Share with a Doctor</p>
                            <button
                                onClick={() => {
                                    if (navigator.share && qrData?.scanUrl) {
                                        navigator.share({ title: 'My Health QR', text: 'Please use this link to upload my medical records.', url: qrData.scanUrl })
                                    } else handleCopy()
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-sm"
                            >
                                <Share2 className="w-4 h-4" /> Share Upload Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

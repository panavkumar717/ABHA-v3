'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, Check, X, Clock, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccessRequestsPage() {
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/patient/access-requests')
            if (res.ok) {
                const data = await res.json()
                setRequests(data)
            }
        } catch {
            toast.error('Failed to load requests')
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/patient/access-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: id, status })
            })
            if (res.ok) {
                toast.success(`Access ${status.toLowerCase()}`)
                fetchRequests()
            } else {
                toast.error('Failed to update')
            }
        } catch {
            toast.error('Error')
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center p-8"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-cyan-500" />
                        Access Requests
                    </h1>
                    <p className="text-slate-500 mt-1">Manage which doctors can access your health profile</p>
                </div>

                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-slate-900 font-medium">No Access Requests</h3>
                            <p className="text-slate-500 text-sm mt-1">When a doctor requests access to your profile, it will appear here.</p>
                        </div>
                    ) : (
                        requests.map(req => (
                            <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shrink-0">
                                        <Stethoscope className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{req.doctor.user.name}</h3>
                                        <p className="text-sm text-slate-500">{req.doctor.specialty} • {req.doctor.hospital}</p>
                                        <div className="mt-2 text-xs">
                                            Status: <span className={`font-semibold ${req.status === 'APPROVED' ? 'text-emerald-600' : req.status === 'PENDING' ? 'text-amber-600' : 'text-slate-500'}`}>{req.status}</span>
                                        </div>
                                    </div>
                                </div>

                                {req.status === 'PENDING' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => updateStatus(req.id, 'APPROVED')} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium">
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button onClick={() => updateStatus(req.id, 'DENIED')} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors text-sm font-medium">
                                            <X className="w-4 h-4" /> Deny
                                        </button>
                                    </div>
                                )}
                                {req.status === 'APPROVED' && (
                                    <button onClick={() => updateStatus(req.id, 'REVOKED')} className="flex items-center justify-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors text-sm font-medium">
                                        <X className="w-4 h-4" /> Revoke Access
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, UserPlus, FileText, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function PatientSearch() {
    const { data: session } = useSession()
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [requesting, setRequesting] = useState<string | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim().length < 2) return

        setLoading(true)
        try {
            const res = await fetch(`/api/doctor/patients?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            setResults(Array.isArray(data) ? data : [])
        } catch {
            toast.error('Search failed')
        } finally {
            setLoading(false)
        }
    }

    const requestAccess = async (patientId: string) => {
        setRequesting(patientId)
        try {
            const res = await fetch('/api/doctor/access-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId })
            })
            if (res.ok) {
                toast.success('Access request sent!')
                setResults(results.map(r => r.id === patientId ? { ...r, accessStatus: 'PENDING' } : r))
            } else {
                toast.error('Failed to request access')
            }
        } catch {
            toast.error('Error sending request')
        } finally {
            setRequesting(null)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Patient Directory</h1>
                    <p className="text-slate-500 mt-1">Search patients by name, email, or ABHA ID</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Enter name, email, or ABHA ID..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    {results.length === 0 && query && !loading && (
                        <div className="text-center py-12 text-slate-500">
                            No patients found matching "{query}"
                        </div>
                    )}

                    {results.map((patient) => (
                        <div key={patient.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {patient.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{patient.name}</h3>
                                    <p className="text-sm text-slate-500">ABHA: {patient.abhaId || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {patient.accessStatus === 'APPROVED' ? (
                                    <Link href={`/doctor/patients/${patient.id}`} className="flex items-center gap-2 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-2 rounded-lg font-medium transition-colors">
                                        <FileText className="w-4 h-4" /> View Profile
                                    </Link>
                                ) : patient.accessStatus === 'PENDING' ? (
                                    <span className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg font-medium">
                                        <Clock className="w-4 h-4" /> Request Pending
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => requestAccess(patient.id)}
                                        disabled={requesting === patient.id}
                                        className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        <UserPlus className="w-4 h-4" /> Request Access
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

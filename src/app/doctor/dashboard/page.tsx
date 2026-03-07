'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, Search, Activity, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DoctorDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState({ totalPatients: 0, pendingRequests: 0 })
    const [recentPatients, setRecentPatients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated' || (session && (session.user as any).role !== 'DOCTOR')) {
            router.push('/auth/login')
        }
    }, [status, session, router])

    useEffect(() => {
        if (status === 'authenticated' && (session.user as any).role === 'DOCTOR') {
            fetchDashboardData()
        }
    }, [status, session])

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/doctor/access-request')
            if (res.ok) {
                const requests = await res.json()
                const pending = requests.filter((r: any) => r.status === 'PENDING').length
                const approved = requests.filter((r: any) => r.status === 'APPROVED')

                setStats({ totalPatients: approved.length, pendingRequests: pending })

                // Get unique patients from approved requests
                const patientsList = approved.map((r: any) => r.patient)
                setRecentPatients(patientsList.slice(0, 5))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{session?.user?.name}</h1>
                        <p className="text-slate-500 mt-1">Doctor Portal Overview</p>
                    </div>
                    <Link href="/doctor/patients" className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md">
                        <Search className="w-4 h-4" /> Search Patients
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">My Patients</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalPatients}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Requests</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.pendingRequests}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Recent Activity</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">Active</h3>
                        </div>
                    </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Recent Patients</h2>
                        <Link href="/doctor/patients" className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentPatients.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No patients yet. Search for a patient to request access.
                            </div>
                        ) : (
                            recentPatients.map((patient: any) => (
                                <Link key={patient.id} href={`/doctor/patients/${patient.id}`} className="block hover:bg-slate-50 transition-colors">
                                    <div className="px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                                                {patient.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{patient.name}</p>
                                                <p className="text-sm text-slate-500">{patient.abhaId || patient.email}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

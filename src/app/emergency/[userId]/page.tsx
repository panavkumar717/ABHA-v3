import { notFound } from 'next/navigation'
import { Phone, Droplets, AlertTriangle, Pill, HeartPulse, User } from 'lucide-react'

interface EmergencyData {
    name: string
    abhaId?: string
    bloodGroup: string
    allergies: string
    chronicConditions: string
    medications: string
    emergencyContactName: string
    emergencyContactPhone: string
}

async function getEmergencyData(userId: string): Promise<EmergencyData | null> {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/emergency/${userId}`, { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

function parseList(text: string): string[] {
    if (!text.trim()) return []
    return text.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean)
}

export default async function EmergencyPassportPage({ params }: { params: { userId: string } }) {
    const data = await getEmergencyData(params.userId)
    if (!data) notFound()

    const allergies = parseList(data.allergies)
    const conditions = parseList(data.chronicConditions)
    const medications = parseList(data.medications)

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
            {/* Emergency Header */}
            <div className="bg-red-600 text-white py-4 px-4">
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HeartPulse className="w-6 h-6 animate-pulse" />
                        <span className="font-bold text-lg">EMERGENCY HEALTH PASSPORT</span>
                    </div>
                    <span className="text-red-200 text-xs bg-red-700 px-2 py-1 rounded-full">ABHA HealthQR</span>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
                {/* Patient Identity */}
                <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-md">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">{data.name}</h1>
                            {data.abhaId && (
                                <p className="text-slate-500 text-sm font-mono mt-0.5">ABHA: {data.abhaId}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Blood Group — Most Critical */}
                <div className="bg-red-600 rounded-2xl p-6 text-white text-center shadow-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Droplets className="w-5 h-5" />
                        <span className="font-semibold uppercase tracking-wider text-sm">Blood Group</span>
                    </div>
                    <div className="text-6xl font-black">{data.bloodGroup || '—'}</div>
                </div>

                {/* Allergies */}
                <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                        </div>
                        <h2 className="font-bold text-slate-800">⚠️ Allergies</h2>
                    </div>
                    {allergies.length === 0 ? (
                        <p className="text-slate-400 text-sm">No known allergies recorded</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {allergies.map((allergy, i) => (
                                <span key={i} className="badge-allergy">{allergy}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chronic Conditions */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                            <HeartPulse className="w-4 h-4 text-rose-600" />
                        </div>
                        <h2 className="font-bold text-slate-800">Chronic Conditions</h2>
                    </div>
                    {conditions.length === 0 ? (
                        <p className="text-slate-400 text-sm">No chronic conditions recorded</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {conditions.map((c, i) => (
                                <span key={i} className="badge-condition">{c}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Medications */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Pill className="w-4 h-4 text-blue-600" />
                        </div>
                        <h2 className="font-bold text-slate-800">Current Medications</h2>
                    </div>
                    {medications.length === 0 ? (
                        <p className="text-slate-400 text-sm">No medications recorded</p>
                    ) : (
                        <div className="space-y-2">
                            {medications.map((med, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="badge-med">{med}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Emergency Contact */}
                {(data.emergencyContactName || data.emergencyContactPhone) && (
                    <div className="bg-white rounded-2xl p-5 border border-green-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Phone className="w-4 h-4 text-green-600" />
                            </div>
                            <h2 className="font-bold text-slate-800">Emergency Contact</h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900">{data.emergencyContactName || '—'}</p>
                                <p className="text-slate-500 text-sm">{data.emergencyContactPhone}</p>
                            </div>
                            {data.emergencyContactPhone && (
                                <a
                                    href={`tel:${data.emergencyContactPhone}`}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
                                >
                                    <Phone className="w-4 h-4" /> Call
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center py-6">
                    <p className="text-slate-400 text-xs">
                        Generated by ABHA HealthQR · Ayushman Bharat Digital Mission
                    </p>
                    <p className="text-slate-300 text-xs mt-1">
                        This is a read-only emergency profile. Last updated in real-time.
                    </p>
                </div>
            </div>
        </div>
    )
}

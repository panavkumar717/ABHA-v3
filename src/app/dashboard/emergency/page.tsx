'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, Save, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface EmergencyProfile {
    bloodGroup: string
    allergies: string
    chronicConditions: string
    medications: string
    emergencyContactName: string
    emergencyContactPhone: string
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']

export default function EmergencySettingsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<EmergencyProfile>({
        bloodGroup: '',
        allergies: '',
        chronicConditions: '',
        medications: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
    })

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated' && session?.user?.id) {
            fetch(`/api/emergency/${session.user.id}`)
                .then(r => r.json())
                .then(d => {
                    if (!d.error) setProfile({
                        bloodGroup: d.bloodGroup || '',
                        allergies: d.allergies || '',
                        chronicConditions: d.chronicConditions || '',
                        medications: d.medications || '',
                        emergencyContactName: d.emergencyContactName || '',
                        emergencyContactPhone: d.emergencyContactPhone || '',
                    })
                })
        }
    }, [status, session, router])

    const handleSave = async () => {
        if (!session?.user?.id) return
        setSaving(true)
        try {
            const res = await fetch(`/api/emergency/${session.user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            })
            const data = await res.json()
            if (!res.ok) { toast.error(data.error); return }
            toast.success('Emergency profile saved!')
        } catch {
            toast.error('Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    if (status === 'loading') return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" /></div>
    if (!session) return null

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                            Emergency Passport
                        </h1>
                        <p className="text-slate-500 mt-1">This information is shown to doctors in case of emergencies</p>
                    </div>
                    <Link
                        href={`/emergency/${session.user.id}`}
                        target="_blank"
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                        <ExternalLink className="w-4 h-4" /> Preview
                    </Link>
                </div>

                {/* Warning Banner */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-800 font-semibold text-sm">Important for Emergencies</p>
                        <p className="text-red-600 text-xs mt-0.5">This page will be publicly accessible via your QR code for emergency responders. Only enter information that is safe to share.</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                    {/* Blood Group */}
                    <div>
                        <label className="label">Blood Group <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-5 gap-2 mt-1">
                            {BLOOD_GROUPS.map((bg) => (
                                <button
                                    key={bg}
                                    type="button"
                                    onClick={() => setProfile({ ...profile, bloodGroup: bg })}
                                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${profile.bloodGroup === bg
                                            ? 'bg-red-600 border-red-600 text-white shadow-md'
                                            : 'bg-white border-slate-200 text-slate-700 hover:border-red-200 hover:bg-red-50'
                                        }`}
                                >
                                    {bg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Allergies */}
                    <div>
                        <label className="label">Allergies</label>
                        <textarea
                            value={profile.allergies}
                            onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                            placeholder="e.g. Penicillin, Aspirin, Peanuts, Shellfish"
                            rows={3}
                            className="input-field resize-none"
                        />
                        <p className="text-xs text-slate-400 mt-1.5">List all known drug and food allergies, separated by commas</p>
                    </div>

                    {/* Chronic Conditions */}
                    <div>
                        <label className="label">Chronic Conditions</label>
                        <textarea
                            value={profile.chronicConditions}
                            onChange={(e) => setProfile({ ...profile, chronicConditions: e.target.value })}
                            placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Current Medications */}
                    <div>
                        <label className="label">Current Medications</label>
                        <textarea
                            value={profile.medications}
                            onChange={(e) => setProfile({ ...profile, medications: e.target.value })}
                            placeholder="e.g. Metformin 500mg twice daily, Amlodipine 5mg once daily"
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <label className="label font-bold text-slate-800">Emergency Contact</label>
                        <div className="grid sm:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="label">Contact Name</label>
                                <input
                                    type="text"
                                    placeholder="Priya Sharma (Wife)"
                                    className="input-field"
                                    value={profile.emergencyContactName}
                                    onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Contact Phone</label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="input-field"
                                    value={profile.emergencyContactPhone}
                                    onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? 'Saving...' : 'Save Emergency Profile'}
                    </button>
                </div>
            </div>
        </div>
    )
}

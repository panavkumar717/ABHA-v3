'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Bell, BellOff, Clock, Pill, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Reminder { id: string; medicineName: string; dosage: string; times: string; active: boolean; startDate: string }

export default function RemindersPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [form, setForm] = useState({ medicineName: '', dosage: '', time1: '08:00', time2: '' })

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
        if (status === 'authenticated') {
            fetch('/api/reminders').then(r => r.json()).then(d => Array.isArray(d) && setReminders(d)).finally(() => setLoading(false))
        }
    }, [status, router])

    const toggleReminder = async (id: string, active: boolean) => {
        const res = await fetch('/api/reminders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active: !active }) })
        if (res.ok) {
            setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !active } : r))
            toast.success(active ? 'Reminder paused' : 'Reminder activated')
        }
    }

    const addReminder = async () => {
        if (!form.medicineName || !form.dosage) { toast.error('Medicine name and dosage required'); return }
        const times = [form.time1, form.time2].filter(Boolean)
        const res = await fetch('/api/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ medicineName: form.medicineName, dosage: form.dosage, times }) })
        const data = await res.json()
        if (res.ok) {
            setReminders(prev => [data, ...prev])
            setShowAdd(false)
            setForm({ medicineName: '', dosage: '', time1: '08:00', time2: '' })
            toast.success('Reminder added!')
        }
    }

    const parseTimes = (timesJson: string): string[] => { try { return JSON.parse(timesJson) } catch { return [] } }

    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const getNextDose = (times: string[]): string => {
        const upcoming = times.find(t => t > currentTime)
        return upcoming ? `Today at ${upcoming}` : `Tomorrow at ${times[0]}`
    }

    if (status === 'loading' || loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
    if (!session) return null

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><span className="text-3xl">⏰</span> Medicine Reminders</h1>
                        <p className="text-slate-500 mt-1">Track your daily medication schedule</p>
                    </div>
                    <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm shadow-sm">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>

                {/* Add Form */}
                {showAdd && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                        <h3 className="font-semibold text-slate-800">Add New Reminder</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="label">Medicine Name</label><input className="input-field" placeholder="Metformin" value={form.medicineName} onChange={e => setForm({ ...form, medicineName: e.target.value })} /></div>
                            <div><label className="label">Dosage</label><input className="input-field" placeholder="500mg" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} /></div>
                            <div><label className="label">First Dose Time</label><input type="time" className="input-field" value={form.time1} onChange={e => setForm({ ...form, time1: e.target.value })} /></div>
                            <div><label className="label">Second Dose (optional)</label><input type="time" className="input-field" value={form.time2} onChange={e => setForm({ ...form, time2: e.target.value })} /></div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={addReminder} className="flex-1 bg-cyan-600 text-white font-bold py-2.5 rounded-xl hover:bg-cyan-700 transition-all">Save Reminder</button>
                            <button onClick={() => setShowAdd(false)} className="px-4 bg-slate-100 text-slate-700 font-medium py-2.5 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Time indicator */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-5 flex items-center gap-4 text-white">
                    <Clock className="w-8 h-8 text-cyan-400" />
                    <div>
                        <p className="text-slate-400 text-sm">Current Time</p>
                        <p className="text-2xl font-bold">{now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-slate-400 text-sm">Active Reminders</p>
                        <p className="text-2xl font-bold">{reminders.filter(r => r.active).length}</p>
                    </div>
                </div>

                {/* Reminders List */}
                {reminders.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <Pill className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No reminders yet</p>
                        <p className="text-sm">Analyze a prescription or add a reminder manually</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reminders.map(r => {
                            const times = parseTimes(r.times)
                            return (
                                <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 transition-all ${r.active ? 'border-slate-100' : 'border-slate-100 opacity-60'}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${r.active ? 'bg-cyan-100' : 'bg-slate-100'}`}>
                                        <Pill className={`w-6 h-6 ${r.active ? 'text-cyan-600' : 'text-slate-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900">{r.medicineName} <span className="text-slate-500 font-normal text-sm">{r.dosage}</span></p>
                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                            {times.map(t => (
                                                <span key={t} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                                                    <Clock className="w-3 h-3" />{t}
                                                </span>
                                            ))}
                                        </div>
                                        {r.active && <p className="text-xs text-cyan-600 mt-1">Next: {getNextDose(times)}</p>}
                                    </div>
                                    <button onClick={() => toggleReminder(r.id, r.active)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${r.active ? 'bg-green-100 hover:bg-red-100' : 'bg-slate-100 hover:bg-green-100'}`}>
                                        {r.active ? <Bell className="w-5 h-5 text-green-600" /> : <BellOff className="w-5 h-5 text-slate-400" />}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

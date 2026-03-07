'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Heart, Mail, Lock, User, CreditCard, ArrowRight, Eye, EyeOff, Stethoscope, Building, FileBadge } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const router = useRouter()
    const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT')
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', password: '', abhaId: '',
        specialty: '', hospital: '', licenseNumber: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        setLoading(true)
        try {
            const apiEndpoint = role === 'DOCTOR' ? '/api/doctor/register' : '/api/auth/register'
            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'Registration failed')
                return
            }

            const signInResult = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            })

            if (signInResult?.error) {
                toast.error('Account created but sign-in failed. Please log in manually.')
                router.push('/auth/login')
            } else {
                toast.success('Account created! 🎉')
                router.push(role === 'DOCTOR' ? '/doctor/dashboard' : '/dashboard')
                router.refresh()
            }
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-medical-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('PATIENT')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'PATIENT' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <User className="w-4 h-4" /> Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('DOCTOR')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'DOCTOR' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Stethoscope className="w-4 h-4" /> Doctor
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={role === 'DOCTOR' ? "Dr. Rahul Sharma" : "Rahul Sharma"}
                                    className="input-field"
                                    style={{ paddingLeft: '2.75rem' }}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input-field"
                                    style={{ paddingLeft: '2.75rem' }}
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {role === 'PATIENT' && (
                            <div>
                                <label className="label">ABHA ID <span className="text-slate-400 font-normal">(optional)</span></label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="XX-XXXX-XXXX-XXXX"
                                        className="input-field"
                                        style={{ paddingLeft: '2.75rem' }}
                                        value={form.abhaId}
                                        onChange={(e) => setForm({ ...form, abhaId: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {role === 'DOCTOR' && (
                            <>
                                <div>
                                    <label className="label">Specialty</label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Cardiologist"
                                            className="input-field"
                                            style={{ paddingLeft: '2.75rem' }}
                                            value={form.specialty}
                                            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="label">Hospital</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Hospital Name"
                                                className="input-field !text-sm"
                                                style={{ paddingLeft: '2.25rem' }}
                                                value={form.hospital}
                                                onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label">License No.</label>
                                        <div className="relative">
                                            <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="License"
                                                className="input-field !text-sm"
                                                style={{ paddingLeft: '2.25rem' }}
                                                value={form.licenseNumber}
                                                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="At least 8 characters"
                                    className="input-field"
                                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex mt-2 items-center justify-center gap-2 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${role === 'DOCTOR' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700' : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create {role === 'DOCTOR' ? 'Doctor' : ''} Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-5">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-cyan-600 font-semibold hover:text-cyan-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

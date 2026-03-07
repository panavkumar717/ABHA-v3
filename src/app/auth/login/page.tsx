'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Heart, Mail, Lock, ArrowRight, Eye, EyeOff, User, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const router = useRouter()
    const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT')
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            })
            if (result?.error) {
                toast.error('Invalid email or password')
            } else {
                toast.success('Welcome back!')
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
        <div className="min-h-[calc(100vh-64px)] bg-medical-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                        <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
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

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="input-field"
                                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
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
                            className={`w-full flex items-center justify-center gap-2 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${role === 'DOCTOR' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700' : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-cyan-600 font-semibold hover:text-cyan-700">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Heart, Mail, Lock, User, CreditCard, ArrowRight, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        abhaId: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/auth/register', {
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
                toast.success('Account created! Welcome to ABHA HealthQR 🎉')
                router.push('/dashboard')
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
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                        <p className="text-slate-500 text-sm mt-1">Free forever · No credit card required</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="label">Full name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rahul Sharma"
                                    className="input-field"
                                    style={{ paddingLeft: '2.75rem' }}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
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

                        {/* ABHA ID */}
                        <div>
                            <label className="label">
                                ABHA ID <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
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
                            <p className="text-xs text-slate-400 mt-1.5">Your 14-digit Ayushman Bharat Health Account ID</p>
                        </div>

                        {/* Password */}
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
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                        <p className="text-xs text-slate-400 text-center">
                            By signing up, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
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

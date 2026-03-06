'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Heart, QrCode, Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react'

export function Navbar() {
    const { data: session } = useSession()
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <Heart className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 text-lg">
                            ABHA <span className="text-cyan-600">HealthQR</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-slate-600 hover:text-cyan-600 font-medium text-sm transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/records"
                                    className="text-slate-600 hover:text-cyan-600 font-medium text-sm transition-colors"
                                >
                                    Records
                                </Link>
                                <Link
                                    href="/dashboard/ai-report"
                                    className="text-slate-600 hover:text-cyan-600 font-medium text-sm transition-colors"
                                >
                                    AI Explainer
                                </Link>

                                {/* User Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors"
                                    >
                                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {session.user?.name?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        {session.user?.name?.split(' ')[0]}
                                        <ChevronDown className="w-3 h-3" />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/dashboard/qr"
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <QrCode className="w-4 h-4 text-slate-400" />
                                                My Health QR
                                            </Link>
                                            <Link
                                                href="/dashboard/emergency"
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <User className="w-4 h-4 text-slate-400" />
                                                Emergency Profile
                                            </Link>
                                            <hr className="my-2 border-slate-100" />
                                            <button
                                                onClick={() => { signOut({ callbackUrl: '/' }); setDropdownOpen(false) }}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-slate-600 hover:text-cyan-600 font-medium text-sm transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 border-t border-slate-100 mt-0">
                        <div className="pt-4 space-y-2">
                            {session ? (
                                <>
                                    <Link href="/dashboard" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                                    <Link href="/dashboard/records" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Medical Records</Link>
                                    <Link href="/dashboard/ai-report" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>AI Explainer</Link>
                                    <Link href="/dashboard/qr" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Health QR</Link>
                                    <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">Sign Out</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Sign In</Link>
                                    <Link href="/auth/register" className="block px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium text-center" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

import Link from 'next/link'
import { ArrowRight, QrCode, Brain, ShieldAlert, CheckCircle, Users, FileText, Zap, Heart, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-200 text-sm font-medium">Ayushman Bharat Digital Mission</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Your Health.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300">
                One QR Away.
              </span>
            </h1>
            <p className="text-xl text-cyan-100/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              ABHA HealthQR makes India&apos;s digital health ecosystem work for everyone — through instant QR-based records, AI-powered explanations, and emergency health profiles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-cyan-700 hover:bg-cyan-50 font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                Create Your Health QR
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-200 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10">
              {[
                { number: '50Cr+', label: 'ABHA IDs Created' },
                { number: '3 secs', label: 'Record Access Time' },
                { number: '100%', label: 'Data Privacy' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-black text-white">{stat.number}</div>
                  <div className="text-cyan-200/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">The Problem</span>
            <h2 className="section-heading mt-3 mb-4">India Has A Digital Health Crisis</h2>
            <p className="section-subheading">
              50 crore ABHA IDs created, yet most Indians still carry paper prescriptions to every hospital visit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Lost Medical History',
                stat: '73%',
                desc: 'of patients lose critical medical documents or carry incomplete records to consultations.',
                color: 'text-red-500',
                bg: 'bg-red-50',
              },
              {
                icon: Zap,
                title: 'Emergency Delays',
                stat: '4.5 min',
                desc: 'average time wasted in emergencies gathering patient history — every second counts.',
                color: 'text-amber-500',
                bg: 'bg-amber-50',
              },
              {
                icon: Users,
                title: 'Low Adoption',
                stat: '12%',
                desc: 'of ABHA ID holders actively use digital health records. The rest still use paper.',
                color: 'text-purple-500',
                bg: 'bg-purple-50',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className={`text-4xl font-black ${item.color} mb-2`}>{item.stat}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">The Solution</span>
              <h2 className="section-heading mt-3 mb-6">
                Health Records That Work Like a QR Code
              </h2>
              <p className="section-subheading mb-8">
                ABHA HealthQR bridges the gap between your ABHA ID and practical healthcare. One scan and any doctor instantly has everything they need — securely and simply.
              </p>

              <div className="space-y-4">
                {[
                  'Patient generates their personal Health QR',
                  'Doctor scans QR at any clinic or hospital',
                  'Doctor uploads prescriptions & reports',
                  'Patient views all records in their dashboard',
                  'AI explains complex reports in plain language',
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual QR Demo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
                  <QrCode className="w-40 h-40 text-white/80" />
                </div>
                {/* Floating info cards */}
                <div className="absolute -right-8 top-8 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-slate-800">Dr. Priya uploaded records</span>
                  </div>
                  <span className="text-xs text-slate-400 ml-7">2 minutes ago</span>
                </div>
                <div className="absolute -left-8 bottom-16 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-semibold text-slate-800">AI Summary ready</span>
                  </div>
                  <span className="text-xs text-slate-400 ml-7">Blood report explained</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-medical-gradient">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="section-heading mt-3 mb-4">Three Tools. One Platform.</h2>
            <p className="section-subheading">
              Everything you need to make your digital health record actually useful.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: QrCode,
                title: 'ABHA Health QR',
                desc: 'Generate a personal QR code linked to your ABHA profile. Doctors scan it to securely upload prescriptions and lab reports directly to your health timeline.',
                color: 'from-cyan-500 to-cyan-600',
                href: '/auth/register',
                highlights: ['Instant record upload', 'Secure & encrypted', 'Works in any clinic'],
              },
              {
                icon: Brain,
                title: 'AI Report Simplifier',
                desc: 'Upload any medical report and get a plain-language explanation. No medical jargon — just clear answers about what your reports actually mean for your health.',
                color: 'from-violet-500 to-purple-600',
                href: '/auth/register',
                highlights: ['Plain English explanations', 'Key health indicators', 'Next steps guidance'],
              },
              {
                icon: ShieldAlert,
                title: 'Emergency Passport',
                desc: 'A public profile for emergencies. Doctors instantly see your blood group, allergies, medications, and emergency contacts when you need help most.',
                color: 'from-rose-500 to-red-600',
                href: '/auth/register',
                highlights: ['Always accessible', 'No login required', 'Mobile-optimized'],
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{feature.desc}</p>
                <ul className="space-y-2 mb-6">
                  {feature.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={feature.href}
                  className="flex items-center gap-1.5 text-cyan-600 font-semibold text-sm hover:gap-3 transition-all"
                >
                  Get started <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Join the Digital Health Revolution
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Create your ABHA HealthQR account in under 2 minutes. Free forever for patients.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">ABHA <span className="text-cyan-400">HealthQR</span></span>
            </div>
            <p className="text-slate-500 text-sm">
              Built for Ayushman Bharat Digital Mission · Hackathon 2026
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/auth/register" className="hover:text-cyan-400 transition-colors">Register</Link>
              <Link href="/auth/login" className="hover:text-cyan-400 transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

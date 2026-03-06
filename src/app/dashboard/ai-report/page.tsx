'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Brain, Upload, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

interface AISummary {
    summary: string
    indicators: string[]
    implications: string[]
    nextSteps: string[]
}

export default function AIReportPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [reportText, setReportText] = useState('')
    const [loading, setLoading] = useState(false)
    const [explanation, setExplanation] = useState<AISummary | null>(null)
    const [isMock, setIsMock] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/login')
    }, [status, router])

    const handleAnalyze = async () => {
        if (reportText.trim().length < 10) {
            toast.error('Please enter some report text to analyze')
            return
        }
        setLoading(true)
        setExplanation(null)
        try {
            const fd = new FormData()
            fd.append('reportText', reportText)
            const res = await fetch('/api/ai/explain', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) { toast.error(data.error); return }
            setExplanation(data.explanation)
            setIsMock(data.isMock || false)
        } catch {
            toast.error('Failed to analyze the report')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
        </div>
    )
    if (!session) return null

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Brain className="w-8 h-8 text-violet-600" />
                        AI Report Simplifier
                    </h1>
                    <p className="text-slate-500 mt-1">Paste your medical report text and get a plain-language explanation</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Input Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <label className="label">Medical Report Text</label>
                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="Paste the text from your medical report, lab results, prescription, or diagnosis here...&#10;&#10;Example:&#10;Hemoglobin: 11.2 g/dL (Low)&#10;WBC: 9,200 /μL (Normal)&#10;Blood Glucose: 210 mg/dL (High)&#10;..."
                                rows={12}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none text-sm transition-all"
                            />
                            <p className="text-xs text-slate-400 mt-2">{reportText.length} characters</p>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || reportText.trim().length < 10}
                                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg"
                            >
                                {loading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4" /> Explain This Report</>
                                )}
                            </button>
                        </div>

                        {/* Tips */}
                        <div className="bg-violet-50 rounded-2xl p-5 border border-violet-100">
                            <p className="text-violet-800 font-semibold text-sm mb-3">💡 Tips for best results</p>
                            <ul className="space-y-2 text-violet-700 text-xs">
                                <li>• Include all lab values with their units</li>
                                <li>• Paste the complete report, not just one section</li>
                                <li>• Works with blood tests, urine tests, X-ray descriptions, prescriptions</li>
                                <li>• Include reference ranges if available</li>
                            </ul>
                        </div>
                    </div>

                    {/* Results Column */}
                    <div className="lg:col-span-3">
                        {!explanation && !loading && (
                            <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
                                    <Brain className="w-8 h-8 text-violet-400" />
                                </div>
                                <h3 className="text-slate-600 font-semibold text-lg mb-2">Ready to analyze</h3>
                                <p className="text-slate-400 text-sm max-w-xs">Paste your medical report text on the left and click &quot;Explain This Report&quot;</p>
                            </div>
                        )}

                        {loading && (
                            <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-6" />
                                <h3 className="text-slate-700 font-semibold text-lg">Analyzing your report...</h3>
                                <p className="text-slate-400 text-sm mt-2">AI is reading your results and preparing a simple explanation</p>
                            </div>
                        )}

                        {explanation && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6">
                                    <div className="flex items-center gap-2 text-white">
                                        <Sparkles className="w-5 h-5" />
                                        <h2 className="font-bold text-lg">AI Explanation</h2>
                                    </div>
                                    {isMock && (
                                        <div className="mt-2 bg-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
                                            <AlertCircle className="w-3.5 h-3.5 text-yellow-200" />
                                            <span className="text-yellow-100 text-xs">Demo mode — Add OpenAI key for real analysis</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Summary */}
                                    <div>
                                        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
                                            <span className="text-lg">📋</span> Summary of Findings
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4">{explanation.summary}</p>
                                    </div>

                                    {/* Indicators */}
                                    {explanation.indicators?.length > 0 && (
                                        <div>
                                            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
                                                <span className="text-lg">🔬</span> Important Indicators
                                            </h3>
                                            <ul className="space-y-2">
                                                {explanation.indicators.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 bg-blue-50 rounded-xl p-3">
                                                        <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                                                        <span className="text-slate-700 text-sm">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Implications */}
                                    {explanation.implications?.length > 0 && (
                                        <div>
                                            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
                                                <span className="text-lg">💡</span> Possible Health Implications
                                            </h3>
                                            <ul className="space-y-2">
                                                {explanation.implications.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                                                        <span className="text-amber-400 mt-1 shrink-0">▸</span>{item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Next Steps */}
                                    {explanation.nextSteps?.length > 0 && (
                                        <div>
                                            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
                                                <span className="text-lg">✅</span> Recommended Next Steps
                                            </h3>
                                            <ul className="space-y-2">
                                                {explanation.nextSteps.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                        <span className="text-slate-700 text-sm">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-amber-50 border-t border-amber-100 p-4">
                                    <p className="text-amber-700 text-xs text-center">
                                        ⚠️ This explanation is for informational purposes only. Always consult your doctor for medical advice.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { FileText, Plus, Upload, Brain, ChevronLeft, Calendar, FileCheck, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function PatientProfile() {
    const { id } = useParams()
    const router = useRouter()
    const { data: session } = useSession()

    const [patient, setPatient] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'records'>('overview')

    // Notes state
    const [noteContent, setNoteContent] = useState('')
    const [savingNote, setSavingNote] = useState(false)

    // Upload state
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    // AI state
    const [aiSummary, setAiSummary] = useState('')
    const [generatingAi, setGeneratingAi] = useState(false)

    useEffect(() => {
        fetchPatient()
    }, [id])

    const fetchPatient = async () => {
        try {
            const res = await fetch(`/api/doctor/patient/${id}`)
            if (res.ok) {
                const data = await res.json()
                setPatient(data)
            } else {
                toast.error('Access denied or patient not found')
                router.push('/doctor/patients')
            }
        } catch {
            toast.error('Error loading patient')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveNote = async () => {
        if (!noteContent.trim()) return
        setSavingNote(true)
        try {
            const res = await fetch(`/api/doctor/patient/${id}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: noteContent })
            })
            if (res.ok) {
                toast.success('Note saved')
                setNoteContent('')
                fetchPatient()
            }
        } catch {
            toast.error('Failed to save note')
        } finally {
            setSavingNote(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('reportType', 'report')

            const res = await fetch(`/api/doctor/patient/${id}/upload`, {
                method: 'POST',
                body: formData
            })
            if (res.ok) {
                toast.success('Document uploaded')
                setFile(null)
                fetchPatient()
            }
        } catch {
            toast.error('Failed to upload')
        } finally {
            setUploading(false)
        }
    }

    const generateAiOverview = async () => {
        setGeneratingAi(true)
        try {
            const res = await fetch(`/api/doctor/patient/${id}/ai-overview`, { method: 'POST' })
            if (res.ok) {
                const data = await res.json()
                setAiSummary(data.summary)
                toast.success('AI Overview generated')
            }
        } catch {
            toast.error('Failed to generate AI overview')
        } finally {
            setGeneratingAi(false)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>
    if (!patient) return null

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/doctor/patients" className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
                            <p className="text-slate-500 text-sm">ABHA ID: {patient.abhaId || 'N/A'}</p>
                        </div>
                    </div>
                    <button
                        onClick={generateAiOverview}
                        disabled={generatingAi}
                        className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                        {generatingAi ? <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-700 rounded-full animate-spin" /> : <Brain className="w-4 h-4" />}
                        AI Overview
                    </button>
                </div>

                {/* AI Summary Banner */}
                {aiSummary && (
                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-6 flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 bg-purple-200/50 rounded-xl flex items-center justify-center shrink-0">
                            <Brain className="w-5 h-5 text-purple-700" />
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900 leading-none">AI Insight</h3>
                            <p className="text-purple-800 text-sm mt-2">{aiSummary}</p>
                        </div>
                    </div>
                )}

                {/* Patient Vitals/Emergency */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Blood Group</p>
                        <p className="font-bold text-red-600 text-lg">{patient.emergencyProfile?.bloodGroup || '--'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm md:col-span-3">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Conditions & Allergies</p>
                        <p className="font-medium text-slate-700">
                            {patient.emergencyProfile?.chronicConditions || 'None reported'}
                            {patient.emergencyProfile?.allergies ? ` • Allergies: ${patient.emergencyProfile.allergies}` : ''}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-6 space-x-8">
                    <button onClick={() => setActiveTab('overview')} className={`pb-3 font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'text-teal-600 border-teal-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
                        Overview
                    </button>
                    <button onClick={() => setActiveTab('notes')} className={`pb-3 font-medium transition-colors border-b-2 ${activeTab === 'notes' ? 'text-teal-600 border-teal-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
                        Clinical Notes ({patient.clinicalNotes?.length || 0})
                    </button>
                    <button onClick={() => setActiveTab('records')} className={`pb-3 font-medium transition-colors border-b-2 ${activeTab === 'records' ? 'text-teal-600 border-teal-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
                        Patient Records
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-teal-600" /> Recent Prescriptions</h3>
                            {patient.prescriptions?.length === 0 ? <p className="text-sm text-slate-500">No prescriptions found.</p> : (
                                <ul className="space-y-3">
                                    {patient.prescriptions?.slice(0, 3).map((p: any) => (
                                        <li key={p.id} className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{p.medicines}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-3">Add Note</h3>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 min-h-[120px]"
                                    placeholder="Write clinical observations..."
                                    value={noteContent}
                                    onChange={e => setNoteContent(e.target.value)}
                                />
                                <button
                                    onClick={handleSaveNote}
                                    disabled={savingNote || !noteContent.trim()}
                                    className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                                >
                                    <Plus className="w-4 h-4" /> Save Note
                                </button>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            {patient.clinicalNotes?.length === 0 ? (
                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-500 text-sm">No notes recorded yet.</p>
                                </div>
                            ) : (
                                patient.clinicalNotes?.map((note: any) => (
                                    <div key={note.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </div>
                                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{note.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'records' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-3">Upload Document</h3>
                                <form onSubmit={handleUpload}>
                                    <input
                                        type="file"
                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 mb-4"
                                    />
                                    <button
                                        type="submit"
                                        disabled={uploading || !file}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload File'}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            {[...(patient.medicalRecords || []), ...(patient.doctorUploads || [])].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).length === 0 ? (
                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-500 text-sm">No records uploaded.</p>
                                </div>
                            ) : (
                                [...(patient.medicalRecords || []), ...(patient.doctorUploads || [])]
                                    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
                                    .map((doc: any) => (
                                        <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 text-sm">{doc.fileName}</p>
                                                    <p className="text-xs text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {doc.fileUrl && (
                                                <a href={doc.fileUrl} target="_blank" className="text-teal-600 hover:text-teal-700 text-sm font-medium mr-2">View</a>
                                            )}
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

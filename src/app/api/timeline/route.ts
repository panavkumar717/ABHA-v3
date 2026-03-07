import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [records, visits, prescriptions, alerts] = await Promise.all([
        prisma.medicalRecord.findMany({ where: { userId: session.user.id }, orderBy: { uploadedAt: 'desc' } }),
        prisma.visitSummary.findMany({ where: { userId: session.user.id }, orderBy: { visitDate: 'desc' } }),
        prisma.prescription.findMany({ where: { userId: session.user.id }, orderBy: { analyzedAt: 'desc' } }),
        prisma.healthEvent.findMany({ where: { userId: session.user.id, type: 'alert' }, orderBy: { eventDate: 'desc' } }),
    ])

    const timeline = [
        ...records.map(r => ({ id: r.id, type: 'report' as const, title: r.fileName, description: r.aiSummary || 'Medical report uploaded', date: r.uploadedAt, severity: 'info' })),
        ...visits.map(v => ({ id: v.id, type: 'visit' as const, title: `Doctor Visit${v.doctorName ? ` — Dr. ${v.doctorName}` : ''}`, description: v.diagnosis || v.transcript?.slice(0, 100), date: v.visitDate, severity: 'info' })),
        ...prescriptions.map(p => ({ id: p.id, type: 'prescription' as const, title: 'Prescription Added', description: `${JSON.parse(p.medicines).length} medicines analyzed`, date: p.analyzedAt, severity: 'info' })),
        ...alerts.map(a => ({ id: a.id, type: 'alert' as const, title: a.title, description: a.description, date: a.eventDate, severity: a.severity || 'warning' })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(timeline)
}

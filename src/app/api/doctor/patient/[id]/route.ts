import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patientId = params.id

    const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } })
    if (!doctor) return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 })

    // Check permission
    const permission = await prisma.accessPermission.findFirst({
        where: { doctorId: doctor.id, patientId: patientId, status: 'APPROVED' }
    })
    if (!permission) return NextResponse.json({ error: 'Access denied or pending' }, { status: 403 })

    // Fetch patient data
    const patient = await prisma.user.findUnique({
        where: { id: patientId, role: 'PATIENT' },
        select: {
            id: true, name: true, email: true, abhaId: true,
            emergencyProfile: true,
            medicalRecords: { orderBy: { uploadedAt: 'desc' } },
            visitSummaries: { orderBy: { visitDate: 'desc' } },
            prescriptions: { orderBy: { analyzedAt: 'desc' }, include: { reminders: true } },
            doctorUploads: { orderBy: { uploadedAt: 'desc' } },
        }
    })

    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 })

    // Fetch notes separately
    const clinicalNotes = await prisma.clinicalNote.findMany({
        where: { doctorId: doctor.id, patientId },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ ...patient, clinicalNotes })
}

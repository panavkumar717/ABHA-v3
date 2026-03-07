import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { patientId, message } = await req.json()
    if (!patientId) return NextResponse.json({ error: 'patientId required' }, { status: 400 })

    const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } })
    if (!doctor) return NextResponse.json({ error: 'Doctor profile missing' }, { status: 404 })

    const existing = await prisma.accessPermission.findFirst({
        where: { doctorId: doctor.id, patientId, status: { in: ['PENDING', 'APPROVED'] } }
    })
    if (existing) return NextResponse.json({ error: 'Request already exists', status: existing.status }, { status: 409 })

    const permission = await prisma.accessPermission.create({
        data: {
            doctorId: doctor.id,
            patientId,
            message: message || '',
            status: 'PENDING',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    })
    return NextResponse.json(permission, { status: 201 })
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } })
    if (!doctor) return NextResponse.json([])

    const requests = await prisma.accessPermission.findMany({
        where: { doctorId: doctor.id },
        include: { patient: { select: { id: true, name: true, email: true, emergencyProfile: { select: { bloodGroup: true } } } } },
        orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(requests)
}

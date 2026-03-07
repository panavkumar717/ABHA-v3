import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role?: string })?.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const q = req.nextUrl.searchParams.get('q') || ''
    if (q.length < 2) return NextResponse.json([])

    const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } })
    if (!doctor) return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 })

    const patients = await prisma.user.findMany({
        where: {
            role: 'PATIENT',
            OR: [
                { name: { contains: q } },
                { email: { contains: q } },
                { abhaId: { contains: q } },
            ]
        },
        select: {
            id: true, name: true, email: true, abhaId: true,
            emergencyProfile: { select: { bloodGroup: true, chronicConditions: true } },
            accessPermissions: { where: { doctorId: doctor.id }, select: { status: true } }
        },
        take: 20
    })

    return NextResponse.json(patients.map(p => ({
        ...p,
        accessStatus: p.accessPermissions[0]?.status ?? 'NONE',
        accessPermissions: undefined
    })))
}

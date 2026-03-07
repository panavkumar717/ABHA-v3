import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'PATIENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requests = await prisma.accessPermission.findMany({
        where: { patientId: session.user.id },
        include: { doctor: { include: { user: { select: { name: true, email: true } } } } },
        orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(requests)
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'PATIENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId, status } = await req.json()
    if (!['APPROVED', 'DENIED', 'REVOKED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Verify it belongs to the patient
    const existing = await prisma.accessPermission.findUnique({ where: { id: requestId } })
    if (!existing || existing.patientId !== session.user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updated = await prisma.accessPermission.update({
        where: { id: requestId },
        data: { status }
    })
    return NextResponse.json(updated)
}

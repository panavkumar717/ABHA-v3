import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } })
    if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const notes = await prisma.clinicalNote.findMany({
        where: { doctorId: doctor.id, patientId: params.id },
        orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(notes)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } })
    if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const { content } = body

    const note = await prisma.clinicalNote.create({
        data: {
            doctorId: doctor.id,
            patientId: params.id,
            content
        }
    })
    return NextResponse.json(note)
}

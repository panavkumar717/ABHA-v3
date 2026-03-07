import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const reminders = await prisma.medicineReminder.findMany({
        where: { userId: session.user.id, active: true },
        orderBy: { createdAt: 'asc' },
        include: { prescription: true }
    })
    return NextResponse.json(reminders)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { medicineName, dosage, times, prescriptionId } = await req.json()
    const reminder = await prisma.medicineReminder.create({
        data: { userId: session.user.id, medicineName, dosage, times: JSON.stringify(times), prescriptionId }
    })
    return NextResponse.json(reminder)
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id, active } = await req.json()
    const reminder = await prisma.medicineReminder.update({
        where: { id },
        data: { active }
    })
    return NextResponse.json(reminder)
}

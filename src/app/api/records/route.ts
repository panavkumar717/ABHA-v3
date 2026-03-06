import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const records = await prisma.medicalRecord.findMany({
            where: { userId: session.user.id },
            orderBy: { uploadedAt: 'desc' },
        })

        return NextResponse.json({ records })
    } catch (error) {
        console.error('Fetch records error:', error)
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 })
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const scanUrl = `${baseUrl}/scan/${session.user.id}`

        const qrDataUrl = await QRCode.toDataURL(scanUrl, {
            width: 400,
            margin: 2,
            color: {
                dark: '#0f172a',
                light: '#ffffff',
            },
        })

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { abhaId: true, name: true },
        })

        return NextResponse.json({
            qrDataUrl,
            scanUrl,
            abhaId: user?.abhaId,
            userName: user?.name,
        })
    } catch (error) {
        console.error('QR generation error:', error)
        return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 })
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const emergencySchema = z.object({
    bloodGroup: z.string().max(10),
    allergies: z.string().max(1000),
    chronicConditions: z.string().max(1000),
    medications: z.string().max(1000),
    emergencyContactName: z.string().max(100),
    emergencyContactPhone: z.string().max(20),
})

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const profile = await prisma.emergencyProfile.findUnique({
            where: { userId: params.userId },
            include: {
                user: {
                    select: { name: true, abhaId: true },
                },
            },
        })

        if (!profile) {
            return NextResponse.json({ error: 'Emergency profile not found' }, { status: 404 })
        }

        // Return only safe, non-private data for the public emergency page
        return NextResponse.json({
            name: profile.user.name,
            abhaId: profile.user.abhaId,
            bloodGroup: profile.bloodGroup,
            allergies: profile.allergies,
            chronicConditions: profile.chronicConditions,
            medications: profile.medications,
            emergencyContactName: profile.emergencyContactName,
            emergencyContactPhone: profile.emergencyContactPhone,
        })
    } catch (error) {
        console.error('Emergency profile fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch emergency profile' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id || session.user.id !== params.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = emergencySchema.parse(body)

        const profile = await prisma.emergencyProfile.upsert({
            where: { userId: params.userId },
            update: validatedData,
            create: { userId: params.userId, ...validatedData },
        })

        return NextResponse.json({ profile, message: 'Emergency profile updated' })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        console.error('Emergency profile update error:', error)
        return NextResponse.json({ error: 'Failed to update emergency profile' }, { status: 500 })
    }
}

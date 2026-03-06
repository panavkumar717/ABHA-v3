import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    abhaId: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = registerSchema.parse(body)

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            )
        }

        if (validatedData.abhaId) {
            const existingAbha = await prisma.user.findUnique({
                where: { abhaId: validatedData.abhaId },
            })
            if (existingAbha) {
                return NextResponse.json(
                    { error: 'This ABHA ID is already registered' },
                    { status: 409 }
                )
            }
        }

        const passwordHash = await bcrypt.hash(validatedData.password, 12)

        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                passwordHash,
                abhaId: validatedData.abhaId || null,
                emergencyProfile: {
                    create: {
                        bloodGroup: '',
                        allergies: '',
                        chronicConditions: '',
                        medications: '',
                        emergencyContactName: '',
                        emergencyContactPhone: '',
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                abhaId: true,
                createdAt: true,
            },
        })

        return NextResponse.json({ user, message: 'Account created successfully' }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

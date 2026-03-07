import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, specialty, hospital, licenseNumber } = await req.json()
        if (!name || !email || !password || !specialty) {
            return NextResponse.json({ error: 'Name, email, password and specialty are required' }, { status: 400 })
        }
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

        const passwordHash = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: 'DOCTOR',
                doctor: {
                    create: { specialty, hospital: hospital || '', licenseNumber: licenseNumber || '' }
                }
            },
            include: { doctor: true }
        })
        return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }
}

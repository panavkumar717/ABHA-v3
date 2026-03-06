import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const userId = formData.get('userId') as string

        if (!file || !userId) {
            return NextResponse.json({ error: 'File and userId are required' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Only PDF and image files (JPG, PNG) are allowed' },
                { status: 400 }
            )
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be under 10MB' }, { status: 400 })
        }

        // Verify user exists
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Save file to disk
        const uploadDir = join(process.cwd(), 'public', 'uploads', userId)
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, buffer)

        const fileUrl = `/uploads/${userId}/${fileName}`

        const record = await prisma.medicalRecord.create({
            data: {
                userId,
                fileUrl,
                fileName: file.name,
                fileType: file.type,
            },
        })

        return NextResponse.json({ record, message: 'File uploaded successfully' }, { status: 201 })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}

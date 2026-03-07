import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'
import fs from 'fs'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } })
    if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const patientId = params.id
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const reportType = formData.get('reportType') as string || 'report'

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', patientId)
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    const uniqueName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, uniqueName)
    await writeFile(filePath, buffer)
    const fileUrl = `/uploads/${patientId}/${uniqueName}`

    const upload = await prisma.doctorUpload.create({
        data: {
            doctorId: doctor.id,
            patientId,
            fileName: file.name,
            fileUrl,
            fileType: file.type,
            reportType
        }
    })

    return NextResponse.json(upload)
}

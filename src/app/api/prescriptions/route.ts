import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'mock' })

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const imageFile = formData.get('image') as File | null
    const rawText = formData.get('text') as string | null

    let imageUrl: string | null = null
    let extractedText = rawText || ''

    if (imageFile) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', session.user.id, 'prescriptions')
        await mkdir(uploadDir, { recursive: true })
        const filename = `rx_${Date.now()}_${imageFile.name}`
        await writeFile(path.join(uploadDir, filename), buffer)
        imageUrl = `/uploads/${session.user.id}/prescriptions/${filename}`
    }

    type Medicine = { name: string; dosage: string; frequency: string; purpose: string; warnings: string }
    let medicines: Medicine[] = []

    const hasMockKey = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here'

    if (hasMockKey) {
        medicines = [
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily (morning & evening)', purpose: 'Controls blood sugar levels in Type 2 Diabetes', warnings: 'Take with food. Avoid alcohol.' },
            { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (morning)', purpose: 'Lowers blood pressure', warnings: 'May cause dizziness when standing up. Consult doctor before stopping.' },
            { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily (night)', purpose: 'Reduces cholesterol levels', warnings: 'Avoid grapefruit juice. Report muscle pain immediately.' },
        ]
    } else {
        const prompt = imageUrl
            ? `You are analyzing a prescription image. Extract all medicines and return a JSON array: [{ "name": "", "dosage": "", "frequency": "", "purpose": "", "warnings": "" }]. Image URL: ${imageUrl}`
            : `Extract all medicines from this prescription text and return JSON array: [{ "name": "", "dosage": "", "frequency": "", "purpose": "", "warnings": "" }]. Text: "${extractedText}"`
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        })
        try {
            const parsed = JSON.parse(response.choices[0]?.message?.content || '{}')
            medicines = parsed.medicines || parsed.items || []
        } catch { medicines = [] }
    }

    const prescription = await prisma.prescription.create({
        data: {
            userId: session.user.id,
            imageUrl,
            rawText: extractedText,
            medicines: JSON.stringify(medicines),
        }
    })

    // Create health event
    await prisma.healthEvent.create({
        data: {
            userId: session.user.id,
            type: 'prescription',
            title: `Prescription Added (${medicines.length} medicines)`,
            severity: 'info',
            prescriptionId: prescription.id,
        }
    })

    // Auto-generate reminders from medicines
    for (const med of medicines) {
        const times = parseTimesFromFrequency(med.frequency)
        if (times.length > 0) {
            await prisma.medicineReminder.create({
                data: {
                    userId: session.user.id,
                    prescriptionId: prescription.id,
                    medicineName: med.name,
                    dosage: med.dosage,
                    times: JSON.stringify(times),
                }
            })
        }
    }

    return NextResponse.json({ ...prescription, medicines })
}

function parseTimesFromFrequency(freq: string): string[] {
    const f = freq.toLowerCase()
    if (f.includes('twice') || f.includes('2 times') || f.includes('bd')) return ['08:00', '20:00']
    if (f.includes('three') || f.includes('3 times') || f.includes('tds')) return ['08:00', '14:00', '20:00']
    if (f.includes('once') || f.includes('1 time') || f.includes('od')) return ['08:00']
    if (f.includes('four') || f.includes('4 times') || f.includes('qds')) return ['07:00', '12:00', '17:00', '22:00']
    return ['08:00']
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const prescriptions = await prisma.prescription.findMany({
        where: { userId: session.user.id },
        orderBy: { analyzedAt: 'desc' },
        include: { reminders: true }
    })
    return NextResponse.json(prescriptions)
}

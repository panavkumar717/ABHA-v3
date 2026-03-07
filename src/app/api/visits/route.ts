import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'mock' })

// POST: Create new visit summary from audio or text
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const audioFile = formData.get('audio') as File | null
    const manualText = formData.get('text') as string | null
    const doctorName = formData.get('doctorName') as string || ''
    const visitDate = formData.get('visitDate') as string || new Date().toISOString()

    let transcript = manualText || ''
    let audioUrl: string | null = null

    // Save audio if provided
    if (audioFile) {
        const bytes = await audioFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', session.user.id, 'audio')
        await mkdir(uploadDir, { recursive: true })
        const filename = `visit_${Date.now()}.webm`
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)
        audioUrl = `/uploads/${session.user.id}/audio/${filename}`

        // Transcribe with Whisper if API key present
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
            const file = new File([buffer], filename, { type: audioFile.type })
            const transcription = await openai.audio.transcriptions.create({ model: 'whisper-1', file })
            transcript = transcription.text
        } else {
            transcript = '[Mock transcript] Patient reports mild chest discomfort for 3 days. Doctor recommends ECG and Aspirin 75mg daily. Follow up in 1 week.'
        }
    }

    if (!transcript) return NextResponse.json({ error: 'No audio or text provided' }, { status: 400 })

    // Generate summary with AI
    let summary = { diagnosis: '', medicines: [] as string[], instructions: '', followUpDate: '' }

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
        const prompt = `Analyze this doctor visit transcript and extract key information in JSON format:
Transcript: "${transcript}"
Return JSON: { "diagnosis": "...", "medicines": ["..."], "instructions": "...", "followUpDate": "..." }`
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        })
        try { summary = JSON.parse(response.choices[0]?.message?.content || '{}') } catch { /* use default */ }
    } else {
        summary = {
            diagnosis: 'Mild chest discomfort — likely musculoskeletal',
            medicines: ['Aspirin 75mg — once daily', 'Pantoprazole 40mg — before breakfast'],
            instructions: 'Avoid heavy lifting, rest adequately, reduce caffeine intake',
            followUpDate: 'In 1 week'
        }
    }

    const visit = await prisma.visitSummary.create({
        data: {
            userId: session.user.id,
            audioUrl,
            transcript,
            diagnosis: summary.diagnosis,
            medicines: JSON.stringify(summary.medicines),
            instructions: summary.instructions,
            followUpDate: summary.followUpDate,
            doctorName,
            visitDate: new Date(visitDate),
        }
    })

    // Create health event
    await prisma.healthEvent.create({
        data: {
            userId: session.user.id,
            type: 'visit',
            title: `Doctor Visit${doctorName ? ` — Dr. ${doctorName}` : ''}`,
            description: summary.diagnosis,
            severity: 'info',
            visitId: visit.id,
        }
    })

    return NextResponse.json(visit)
}

// GET: List visits
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const visits = await prisma.visitSummary.findMany({
        where: { userId: session.user.id },
        orderBy: { visitDate: 'desc' }
    })
    return NextResponse.json(visits)
}

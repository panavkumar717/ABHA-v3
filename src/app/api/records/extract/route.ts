import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'mock' })

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { recordId, text } = await req.json()
    if (!recordId || !text) return NextResponse.json({ error: 'recordId and text required' }, { status: 400 })

    const hasMockKey = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here'

    let extracted: Record<string, string | number> = {}

    if (hasMockKey) {
        extracted = {
            cholesterol_total: 185, cholesterol_ldl: 115, cholesterol_hdl: 52,
            hemoglobin: 13.8, blood_sugar_fasting: 98, blood_pressure_systolic: 122,
            blood_pressure_diastolic: 80, triglycerides: 145, creatinine: 0.9,
        }
    } else {
        const prompt = `Extract all lab values from this medical report text. Return JSON with snake_case keys and numeric values where possible. Include: cholesterol_total, cholesterol_ldl, cholesterol_hdl, hemoglobin, blood_sugar_fasting, blood_sugar_pp, blood_pressure_systolic, blood_pressure_diastolic, triglycerides, creatinine, uric_acid, tsh, vitamin_d, vitamin_b12, and any other values found.
Text: "${text.slice(0, 3000)}"`
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        })
        try { extracted = JSON.parse(response.choices[0]?.message?.content || '{}') } catch { extracted = {} }
    }

    // Update the medical record with extracted data
    await prisma.medicalRecord.update({
        where: { id: recordId },
        data: { extractedData: JSON.stringify(extracted) }
    })

    return NextResponse.json({ extracted })
}

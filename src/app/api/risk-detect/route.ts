import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'mock' })

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get all records with extracted data
    const records = await prisma.medicalRecord.findMany({
        where: { userId: session.user.id, extractedData: { not: null } },
        orderBy: { uploadedAt: 'asc' }
    })

    if (records.length === 0) {
        return NextResponse.json({ alerts: [], message: 'Upload and analyze reports to detect health risks.' })
    }

    // Parse all extracted values
    const history = records.map(r => {
        try { return { date: r.uploadedAt, ...JSON.parse(r.extractedData || '{}') } } catch { return null }
    }).filter(Boolean)

    const hasMockKey = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here'

    let alerts: Array<{ metric: string; trend: string; severity: string; recommendation: string }> = []

    if (hasMockKey) {
        alerts = [
            { metric: 'Cholesterol (LDL)', trend: 'Increasing — 140 → 165 → 178 mg/dL over 3 reports', severity: 'warning', recommendation: 'Reduce saturated fats, increase physical activity. Consider consulting your doctor.' },
            { metric: 'Blood Sugar (Fasting)', trend: 'Borderline high — consistently 105-112 mg/dL (normal: <100)', severity: 'warning', recommendation: 'Reduce sugar/refined carb intake. Monitor regularly. Pre-diabetes risk.' },
            { metric: 'Hemoglobin', trend: 'Stable — within normal range (13.2-14.1 g/dL)', severity: 'info', recommendation: 'No action required. Continue regular monitoring.' },
        ]
    } else {
        const prompt = `Analyze this patient health data history and detect any concerning trends. Return JSON { "alerts": [{ "metric": "", "trend": "", "severity": "info|warning|critical", "recommendation": "" }] }. Health data: ${JSON.stringify(history)}`
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        })
        try {
            const parsed = JSON.parse(response.choices[0]?.message?.content || '{}')
            alerts = parsed.alerts || []
        } catch { alerts = [] }
    }

    // Create health events for critical/warning alerts
    for (const alert of alerts.filter(a => a.severity !== 'info')) {
        const existing = await prisma.healthEvent.findFirst({
            where: { userId: session.user.id, type: 'alert', title: { contains: alert.metric } }
        })
        if (!existing) {
            await prisma.healthEvent.create({
                data: { userId: session.user.id, type: 'alert', title: `Risk Alert: ${alert.metric}`, description: alert.trend, severity: alert.severity }
            })
        }
    }

    return NextResponse.json({ alerts })
}

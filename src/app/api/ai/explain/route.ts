import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const reportText = formData.get('reportText') as string
        const recordId = formData.get('recordId') as string | null

        if (!reportText || reportText.trim().length < 10) {
            return NextResponse.json({ error: 'Report text is required and must be meaningful' }, { status: 400 })
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
            // Return a mock explanation for demo purposes
            const mockExplanation = {
                summary: "This appears to be a medical report containing health information. Based on the content provided, your results show values that your doctor will review with you.",
                indicators: [
                    "Lab values have been recorded and are within or outside normal reference ranges",
                    "Vital signs and other measurements have been documented",
                    "Clinical observations noted by your healthcare provider"
                ],
                implications: [
                    "These results provide a snapshot of your current health status",
                    "Some values may require follow-up or monitoring",
                    "Your doctor will interpret these in the context of your overall health"
                ],
                nextSteps: [
                    "Schedule a follow-up appointment with your doctor to discuss these results",
                    "Continue any prescribed medications as directed",
                    "Maintain a healthy lifestyle with regular exercise and balanced diet",
                    "Report any new or worsening symptoms to your healthcare provider"
                ]
            }

            if (recordId) {
                await prisma.medicalRecord.update({
                    where: { id: recordId, userId: session.user.id },
                    data: { aiSummary: JSON.stringify(mockExplanation) },
                })
            }

            return NextResponse.json({ explanation: mockExplanation, isMock: true })
        }

        const prompt = `You are a medical professional helping a patient understand their medical report. Analyze the following medical report and provide a clear, jargon-free explanation.

Medical Report:
${reportText}

Please provide a structured explanation in the following JSON format:
{
  "summary": "A 2-3 sentence plain English summary of the overall findings",
  "indicators": ["List of key health indicators found in the report, explained simply"],
  "implications": ["List of what these findings might mean for the patient's health"],
  "nextSteps": ["List of recommended actions the patient should consider"]
}

Keep all explanations simple enough for a non-medical person to understand. Avoid technical jargon. Be reassuring yet accurate.`

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful medical communication specialist who explains medical reports in simple, clear language.' },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
        })

        const explanationText = completion.choices[0].message.content
        if (!explanationText) {
            throw new Error('No response from AI')
        }

        const explanation = JSON.parse(explanationText)

        // Save AI summary to database if recordId provided
        if (recordId) {
            await prisma.medicalRecord.update({
                where: { id: recordId, userId: session.user.id },
                data: { aiSummary: JSON.stringify(explanation) },
            })
        }

        return NextResponse.json({ explanation })
    } catch (error) {
        console.error('AI explain error:', error)
        return NextResponse.json({ error: 'Failed to analyze report' }, { status: 500 })
    }
}

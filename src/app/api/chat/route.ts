import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'mock' })

const SYSTEM_PROMPT = `You are a friendly AI health education assistant. 
Help users understand medical terms, conditions, and medications in simple, clear language.
Always add a brief disclaimer that your responses are for educational purposes only and not medical advice.
Keep responses concise (under 200 words). Be warm and reassuring.`

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { message, history = [] } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

    // Save user message
    await prisma.chatMessage.create({
        data: { userId: session.user.id, role: 'user', content: message }
    })

    let reply = ''

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
        // Mock responses
        const mocks: Record<string, string> = {
            default: `I'm your AI health assistant! I can help explain medical terms, medications, and health concepts in simple language. For example, ask me "What is diabetes?" or "What does high cholesterol mean?"\n\n*This is for educational purposes only — not medical advice.*`,
            diabetes: `**Diabetes** is a condition where your body can't properly regulate blood sugar (glucose). Type 1 means your body doesn't produce insulin. Type 2 (more common) means your body doesn't use insulin effectively. Managed with diet, exercise, and sometimes medication.\n\n*For educational purposes only — not medical advice.*`,
            cholesterol: `**Cholesterol** is a fatty substance in your blood. You need some, but too much can clog arteries. HDL ("good") carries it away from arteries. LDL ("bad") builds up on artery walls. Total cholesterol below 200 mg/dL is generally considered healthy.\n\n*For educational purposes only — not medical advice.*`,
        }
        const key = Object.keys(mocks).find(k => message.toLowerCase().includes(k)) || 'default'
        reply = mocks[key]
    } else {
        const messages = [
            { role: 'system' as const, content: SYSTEM_PROMPT },
            ...history.slice(-6).map((m: { role: string; content: string }) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
            { role: 'user' as const, content: message }
        ]
        const response = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages, max_tokens: 300 })
        reply = response.choices[0]?.message?.content || 'I could not generate a response.'
    }

    // Save assistant reply
    await prisma.chatMessage.create({
        data: { userId: session.user.id, role: 'assistant', content: reply }
    })

    return NextResponse.json({ reply })
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const messages = await prisma.chatMessage.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'asc' },
        take: 50
    })
    return NextResponse.json(messages)
}

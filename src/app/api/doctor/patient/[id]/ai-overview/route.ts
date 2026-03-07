import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'DOCTOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simulate AI delay
    await new Promise(r => setTimeout(r, 1500))

    const summary = "AI Note: Patient shows stable vitals but has a history of hypertension. Recommended to follow up on recent lipid profile and adjusting dosage of Statins if LDL remains > 100 mg/dL. Monitor blood pressure weekly."

    return NextResponse.json({ summary })
}

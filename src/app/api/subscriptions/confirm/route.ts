import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const sessionAuth = await auth()
    if (!sessionAuth?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { sessionId } = await req.json()
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const articleId = session.metadata?.articleId
    const userId = session.metadata?.userId
    const amountTotal = session.amount_total

    if (!articleId || !userId || !amountTotal) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // セッションのユーザーとメタデータのユーザーが一致するか検証
    if (userId !== sessionAuth.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.subscription.upsert({
      where: { userId_articleId: { userId, articleId } },
      update: {
        amount: amountTotal,
        status: 'completed',
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string | null,
      },
      create: {
        userId,
        articleId,
        amount: amountTotal,
        status: 'completed',
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string | null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Confirm subscription error:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

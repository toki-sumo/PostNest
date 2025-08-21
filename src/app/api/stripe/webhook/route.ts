import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let event
  try {
    const rawBody = await req.text()
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const articleId: string | undefined = session.metadata?.articleId
        const userId: string | undefined = session.metadata?.userId
        const amountTotal: number | undefined = session.amount_total
        const stripeSessionId: string | undefined = session.id
        const stripePaymentIntentId: string | undefined = session.payment_intent as string | undefined

        if (!articleId || !userId || !amountTotal) break

        await db.subscription.upsert({
          where: { userId_articleId: { userId, articleId } },
          update: {
            amount: amountTotal,
            status: 'completed',
            stripeSessionId,
            stripePaymentIntentId,
          },
          create: {
            userId,
            articleId,
            amount: amountTotal,
            status: 'completed',
            stripeSessionId,
            stripePaymentIntentId,
          },
        })
        break
      }
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('Webhook handling error:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

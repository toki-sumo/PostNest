import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { articleId } = await req.json()
    if (!articleId) {
      return NextResponse.json({ error: 'articleId is required' }, { status: 400 })
    }

    const article = await db.article.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, isPremium: true, price: true }
    })

    if (!article || !article.isPremium || !article.price) {
      return NextResponse.json({ error: 'Invalid article' }, { status: 400 })
    }

    // すでに購読済みかチェック
    const existing = await db.subscription.findUnique({
      where: { userId_articleId: { userId: session.user.id, articleId } },
      select: { id: true, status: true }
    })
    if (existing?.status === 'completed') {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: { name: `有料記事: ${article.title}` },
            unit_amount: article.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        articleId: articleId,
        userId: session.user.id,
      },
      success_url: `${baseUrl}/articles/${articleId}?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/articles/${articleId}?canceled=1`,
    })

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url })
  } catch (e) {
    console.error('Checkout error:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

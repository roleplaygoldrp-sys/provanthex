import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/db'

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!user.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'Você não possui uma assinatura ativa' },
        { status: 400 }
      )
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.cancel(user.stripeSubscriptionId)

    // Update user to FREE (will be handled by webhook, but do it here too for immediate effect)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: 'FREE',
        subscriptionStatus: 'CANCELED',
        stripeSubscriptionId: null,
        credits: 50,
        proExpiresAt: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Erro ao cancelar assinatura' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/db'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const userId = session.metadata?.userId
        
        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Update user to PRO
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: 'PRO',
            subscriptionStatus: 'ACTIVE',
            stripeSubscriptionId: subscription.id,
            credits: 999999, // Unlimited for Pro
            proExpiresAt: new Date(subscription.current_period_end * 1000),
          },
        })

        // Create payment record
        await prisma.payment.create({
          data: {
            userId,
            stripePaymentId: session.payment_intent as string,
            amount: session.amount_total || 9700,
            currency: session.currency || 'brl',
            status: 'COMPLETED',
            plan: 'PRO',
          },
        })

        console.log(`User ${userId} upgraded to PRO`)
        break
      }

      case 'invoice.payment_succeeded': {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Find user by customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: session.customer as string },
        })

        if (user) {
          // Update subscription status
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'ACTIVE',
              proExpiresAt: new Date(subscription.current_period_end * 1000),
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by subscription ID
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (user) {
          // Downgrade to FREE
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

          console.log(`User ${user.id} downgraded to FREE (subscription canceled)`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const customerId = session.customer as string

        // Find user by customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          // Mark subscription as past due
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'PAST_DUE',
            },
          })

          console.log(`User ${user.id} subscription is past due`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

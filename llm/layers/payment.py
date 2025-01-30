# payments_layer.py
from typing import Dict, List

class PaymentsLayerGenerator:
    def _generate_payment_layer(self, tech_stack: Dict[str, str]) -> List[Dict[str, str]]:
        files = []
        payments = tech_stack.get("payments", "").lower()
        frontend = tech_stack.get("frontend", "").lower()

        if not payments:
            return files

        payment_handlers = {
            "stripe": self._handle_stripe_setup,
            "paypal": self._handle_paypal_setup
        }

        if payments in payment_handlers:
            files.extend(payment_handlers[payments](frontend))

        return files

    def _handle_stripe_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/lib/stripe.ts",
                "content": self._stripe_config_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/webhook/route.ts",
                "content": self._stripe_webhook_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/checkout/route.ts",
                "content": self._stripe_checkout_template(),
                "language": "typescript"
            }
        ]

    def _handle_paypal_setup(self, frontend: str) -> List[Dict[str, str]]:
        return [
            {
                "filename": "app/lib/paypal.ts",
                "content": self._paypal_config_template(),
                "language": "typescript"
            },
            {
                "filename": "app/api/webhook/route.ts",
                "content": self._paypal_webhook_template(),
                "language": "typescript"
            }
        ]

    def _stripe_config_template(self):
        return '''
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})'''

    def _stripe_webhook_template(self):
        return '''
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
 
export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string
 
  let event: Stripe.Event
 
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(
      `Webhook Error: ${error.message}`,
      { status: 400 }
    )
  }
 
  const session = event.data.object as Stripe.Checkout.Session
 
  if (event.type === 'checkout.session.completed') {
    // Handle successful payment
  }
 
  return new NextResponse(null, { status: 200 })
}'''

    def _stripe_checkout_template(self):
        return '''
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { price, quantity = 1 } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price,
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/canceled`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    console.error("Error creating checkout session:", err)
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    )
  }
}'''

    def _paypal_config_template(self):
        return '''
import checkoutNodeJssdk from '@paypal/checkout-server-sdk'

const clientId = process.env.PAYPAL_CLIENT_ID
const clientSecret = process.env.PAYPAL_CLIENT_SECRET

const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
  clientId,
  clientSecret
)
const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment)

export default client'''

    def _paypal_webhook_template(self):
        return '''
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import paypalClient from '@/lib/paypal'
 
export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = headers()
    
    // Verify webhook signature
    // Handle webhook event
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing PayPal webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}'''
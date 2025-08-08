
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_URL}/upgrade/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/upgrade`,
    metadata: {
      userId: session.user.id,
    },
  })

  return new Response(JSON.stringify({ url: checkoutSession.url }), { status: 200 })
}

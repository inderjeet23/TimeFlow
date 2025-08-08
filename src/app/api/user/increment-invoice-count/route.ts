import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { users } from "@/lib/user-store"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const user = users.find(u => u.id === session.user.id)

  if (user) {
    user.invoiceCount += 1
    return new Response(JSON.stringify({ invoiceCount: user.invoiceCount }), { status: 200 })
  } else {
    return new Response("User not found", { status: 404 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import { isAdminFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAdminFromRequest(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json({ orders })
  } catch (error: any) {
    const message = String(error?.message || '')
    const dbUnavailable = /MONGODB_URI manquant|ECONN|authentication failed|bad auth/i.test(message)

    if (dbUnavailable) {
      return NextResponse.json({ orders: [], warning: 'Base de donnees indisponible' })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

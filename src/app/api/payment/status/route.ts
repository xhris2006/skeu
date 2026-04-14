import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import { checkPaymentStatus } from '@/lib/fapshi'

// GET /api/payment/status?transId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const transId = searchParams.get('transId')

    if (!transId) return NextResponse.json({ error: 'transId requis' }, { status: 400 })

    await connectDB()

    // Check Fapshi
    const fapshiStatus = await checkPaymentStatus(transId)

    // Update order in DB
    const order = await Order.findOneAndUpdate(
      { fapshiTransId: transId },
      { paymentStatus: fapshiStatus.status },
      { new: true }
    )

    return NextResponse.json({
      status:      fapshiStatus.status,
      amount:      fapshiStatus.amount,
      transId:     fapshiStatus.transId,
      orderNumber: order?.orderNumber,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/payment/status  – Fapshi webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { transId, status } = body

    if (!transId) return NextResponse.json({ error: 'transId manquant' }, { status: 400 })

    await connectDB()
    await Order.findOneAndUpdate(
      { fapshiTransId: transId },
      { paymentStatus: status || 'SUCCESSFUL' }
    )

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

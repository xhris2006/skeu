import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import { createPaymentLink, generateWhatsAppMessage } from '@/lib/fapshi'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, phone, email, notes, items, total } = body

    if (!name || !phone || !items?.length) {
      return NextResponse.json({ error: 'Donnees manquantes' }, { status: 400 })
    }

    const orderNumber = `BS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    const order = await Order.create({
      orderNumber,
      clientName: name,
      clientPhone: phone,
      clientEmail: email || undefined,
      items: items.map((i: any) => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal: total,
      total,
      paymentStatus: 'PENDING',
      notes: notes || undefined,
    })

    let paymentLink: string | undefined
    let transId: string | undefined

    try {
      const fapshiRes = await createPaymentLink({
        amount: total,
        externalId: orderNumber,
        userId: phone,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order=${orderNumber}`,
        message: `skeucosmetique - Commande ${orderNumber}`,
      })

      paymentLink = fapshiRes.link
      transId = fapshiRes.transId

      await Order.findByIdAndUpdate(order._id, {
        fapshiTransId: transId,
        fapshiLink: paymentLink,
      })
    } catch (fapshiErr: any) {
      console.error('Fapshi error:', fapshiErr.message)
    }

    const waLink = generateWhatsAppMessage({
      clientName: name,
      phone,
      products: items.map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total,
      transId: transId || orderNumber,
    })

    return NextResponse.json({
      success: true,
      orderNumber,
      paymentLink,
      transId,
      waLink,
    })
  } catch (error: any) {
    console.error('Payment initiate error:', error)
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}

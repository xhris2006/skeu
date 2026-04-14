import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { isAdminFromRequest } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const product = await Product.findById(params.id).lean()
    if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminFromRequest(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    await connectDB()
    const body    = await req.json()
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
    if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminFromRequest(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    await connectDB()
    await Product.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'Produit supprimé' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

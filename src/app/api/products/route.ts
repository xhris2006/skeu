import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { isAdminFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const badge    = searchParams.get('badge')
    const featured = searchParams.get('featured')
    const sort     = searchParams.get('sort') || 'popular'
    const limit    = parseInt(searchParams.get('limit') || '20')
    const search   = searchParams.get('q')

    const query: Record<string, any> = { active: true }

    if (category)  query.category = { $regex: category, $options: 'i' }
    if (badge)     query.badge    = { $regex: badge, $options: 'i' }
    if (featured === 'true') query.featured = true
    if (search)    query.$text = { $search: search }

    const sortMap: Record<string, any> = {
      popular:    { featured: -1, createdAt: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      newest:     { createdAt: -1 },
    }

    const products = await Product.find(query)
      .sort(sortMap[sort] || sortMap.popular)
      .limit(limit)
      .lean()

    return NextResponse.json({ products, total: products.length })
  } catch (error: any) {
    const message = String(error?.message || '')
    const dbUnavailable = /MONGODB_URI manquant|ECONN|authentication failed|bad auth|MongoServerError/i.test(message)

    if (dbUnavailable) {
      return NextResponse.json({ products: [], total: 0, warning: 'Base de donnees indisponible' })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminFromRequest(req)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }
  try {
    await connectDB()
    const body = await req.json()

    const product = await Product.create(body)
    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    const message = String(error?.message || '')
    const dbUnavailable = /MONGODB_URI manquant|ECONN|authentication failed|bad auth|MongoServerError/i.test(message)

    if (dbUnavailable) {
      return NextResponse.json({ error: 'Base de donnees indisponible. Reessayez plus tard.' }, { status: 503 })
    }

    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

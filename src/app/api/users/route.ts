import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { isAdminFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!isAdminFromRequest(req)) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  try {
    await connectDB()
    const users = await User.find({}, { name: 1, email: 1, phone: 1, role: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ users })
  } catch (error: any) {
    const message = String(error?.message || '')
    const dbUnavailable = /MONGODB_URI manquant|ECONN|authentication failed|bad auth/i.test(message)

    if (dbUnavailable) {
      return NextResponse.json({ users: [], warning: 'Base de donnees indisponible' })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

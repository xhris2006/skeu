import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@skeucosmetique.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2024!'

    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
    }

    let valid = false
    if (adminPassword.startsWith('$2')) {
      valid = await bcrypt.compare(password, adminPassword)
    } else {
      valid = password === adminPassword
    }

    if (!valid) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
    }

    const token = signToken({ role: 'admin', email }, '7d')

    const response = NextResponse.json({ success: true, message: 'Connexion reussie' })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('auth_token')
  return response
}

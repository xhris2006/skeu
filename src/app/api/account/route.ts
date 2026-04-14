import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getTokenFromRequest, signToken, verifyToken } from '@/lib/auth'

function buildAuthResponse(payload: { email: string; role: 'customer' | 'admin'; name: string }) {
  const token = signToken(payload, '7d')
  const response = NextResponse.json({ success: true, user: payload })
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ user: null })

    const decoded = verifyToken(token) as any
    if (!decoded?.email) return NextResponse.json({ user: null })

    if (decoded.role === 'admin') {
      return NextResponse.json({
        user: {
          name: decoded.name || 'Administrateur',
          email: decoded.email,
          role: 'admin',
        },
      })
    }

    await connectDB()
    const user = await User.findOne({ email: decoded.email }).lean()
    if (!user) return NextResponse.json({ user: null })

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
      },
    })
  } catch {
    return NextResponse.json({ user: null, warning: 'Session indisponible temporairement' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, name, email, password, phone } = await req.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const trimmedName = String(name || '').trim()
    const rawPassword = String(password || '')

    if (!normalizedEmail || !rawPassword) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }


    const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const adminPassword = String(process.env.ADMIN_PASSWORD || '')

    if (
      adminEmail &&
      adminPassword &&
      normalizedEmail === adminEmail &&
      rawPassword === adminPassword
    ) {
      return buildAuthResponse({ email: normalizedEmail, role: 'admin', name: trimmedName || 'Administrateur' })
    }
    await connectDB()

    if (action === 'register') {
      if (!trimmedName) {
        return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
      }

      const existingUser = await User.findOne({ email: normalizedEmail })
      if (existingUser) {
        return NextResponse.json({ error: 'Un compte existe deja avec cet email' }, { status: 409 })
      }

      const role: 'customer' | 'admin' = adminEmail && normalizedEmail === adminEmail ? 'admin' : 'customer'

      const hashedPassword = await bcrypt.hash(rawPassword, 10)
      const createdUser = await User.create({
        name: trimmedName,
        email: normalizedEmail,
        phone: String(phone || '').trim(),
        password: hashedPassword,
        role,
      })

      return buildAuthResponse({
        email: createdUser.email,
        role,
        name: createdUser.name,
      })
    }

    if (action === 'login') {
      const user = await User.findOne({ email: normalizedEmail })
      if (!user) {
        return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
      }

      const validPassword = await bcrypt.compare(rawPassword, user.password)
      if (!validPassword) {
        return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
      }

      return buildAuthResponse({
        email: user.email,
        role: user.role,
        name: user.name,
      })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (error: any) {
    const message = String(error?.message || '')
    if (/MONGODB_URI manquant|ECONN|authentication failed|bad auth/i.test(message)) {
      return NextResponse.json({ error: 'Base de donnees indisponible. Reessayez plus tard.' }, { status: 503 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('auth_token')
  return response
}

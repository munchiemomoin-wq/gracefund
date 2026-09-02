import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Login failed' }, { status: 401 })
    }

    // Find or create app User record
    let appUser = await db.user.findUnique({
      where: { authUserId: authData.user.id },
    })

    if (!appUser) {
      // Auto-create app user record (for existing Supabase Auth users)
      appUser = await db.user.create({
        data: {
          authUserId: authData.user.id,
          email,
          name: authData.user.user_metadata?.name || null,
          role: 'donor',
          status: 'active',
        },
      })
    }

    if (appUser.status === 'banned') {
      // Sign out and reject
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'Your account has been suspended' }, { status: 403 })
    }

    return NextResponse.json({
      user: {
        id: appUser.id,
        email: appUser.email,
        name: appUser.name,
        role: appUser.role,
        status: appUser.status,
        verificationLevel: appUser.verificationLevel,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

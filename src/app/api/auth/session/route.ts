import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ user: null })
    }

    const appUser = await db.user.findUnique({
      where: { authUserId: authUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        status: true,
        verificationLevel: true,
      },
    })

    if (!appUser || appUser.status === 'banned') {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: appUser })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}

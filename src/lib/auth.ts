import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
  status: string
  verificationLevel: string
}

/**
 * Get the current authenticated user from Supabase Auth + app User record.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) return null

  const appUser = await db.user.findUnique({
    where: { authUserId: authUser.id },
    select: { id: true, email: true, name: true, role: true, status: true, verificationLevel: true },
  })

  if (!appUser) return null
  if (appUser.status === 'suspended' || appUser.status === 'banned') return null

  return {
    id: appUser.id,
    email: appUser.email,
    name: appUser.name,
    role: appUser.role,
    status: appUser.status,
    verificationLevel: appUser.verificationLevel,
  }
}

/**
 * Require authentication. Returns user or throws 401.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new AuthError(401, 'Authentication required')
  }
  return user
}

/**
 * Require admin role. Returns user or throws 403.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    throw new AuthError(403, 'Admin access required')
  }
  return user
}

/**
 * Require specific role(s).
 */
export async function requireRole(...roles: string[]): Promise<AuthUser> {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new AuthError(403, 'Insufficient permissions')
  }
  return user
}

/**
 * Check if user owns a resource (campaign, organization, etc.)
 */
export async function requireOwnership(resourceType: 'campaign' | 'organization' | 'withdrawal', resourceId: string): Promise<AuthUser> {
  const user = await requireAuth()
  if (user.role === 'admin') return user // admins bypass ownership

  let owner
  switch (resourceType) {
    case 'campaign': {
      const campaign = await db.campaign.findUnique({ where: { id: resourceId }, select: { organizerId: true } })
      owner = campaign?.organizerId
      break
    }
    case 'organization': {
      const org = await db.organization.findUnique({ where: { id: resourceId }, select: { ownerId: true } })
      owner = org?.ownerId
      break
    }
    case 'withdrawal': {
      const w = await db.withdrawalRequest.findUnique({ where: { id: resourceId }, select: { requesterId: true } })
      owner = w?.requesterId
      break
    }
  }

  if (owner !== user.id) {
    throw new AuthError(403, 'You do not have permission to access this resource')
  }
  return user
}

export class AuthError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'AuthError'
  }
}

/**
 * Create audit log entry. Must be called from server-side code.
 */
export async function createAuditLog(params: {
  adminId?: string
  action: string
  entityType: string
  entityId?: string
  previousValue?: unknown
  newValue?: unknown
  metadata?: unknown
}) {
  await db.auditLog.create({
    data: {
      adminId: params.adminId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      previousValue: params.previousValue ? JSON.stringify(params.previousValue) : null,
      newValue: params.newValue ? JSON.stringify(params.newValue) : null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    },
  })
}
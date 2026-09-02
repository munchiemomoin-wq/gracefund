import { requireAuth, requireAdmin, createAuditLog } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { AuthError } from '@/lib/auth'

/**
 * Generate a temporary signed URL for a private document.
 * Only the document uploader or an admin can access.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const doc = await db.privateDocument.findUnique({ where: { id } })
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Only uploader or admin can access
    if (doc.uploadedById !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const adminClient = await createAdminClient()
    const { data, error } = await adminClient.storage
      .from(doc.storageBucket || 'private-documents')
      .createSignedUrl(doc.storagePath, 300) // 5 minutes

    if (error || !data) {
      console.error('Signed URL error:', error)
      return NextResponse.json({ error: 'Failed to generate access URL' }, { status: 500 })
    }

    // Log access for sensitive documents
    if (user.role === 'admin') {
      await createAuditLog({
        adminId: user.id,
        action: 'document_accessed',
        entityType: 'private_document',
        entityId: id,
        metadata: { fileName: doc.fileName, documentType: doc.documentType },
      })
    }

    return NextResponse.json({ signedUrl: data.signedUrl, expiresIn: 300 })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Signed URL error:', error)
    return NextResponse.json({ error: 'Failed to generate access URL' }, { status: 500 })
  }
}

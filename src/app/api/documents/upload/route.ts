import { requireAuth, createAuditLog } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { AuthError } from '@/lib/auth'

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const entityType = formData.get('entityType') as string | null
    const entityId = formData.get('entityId') as string | null
    const documentType = formData.get('documentType') as string | null

    if (!file || !entityType || !entityId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, entityType, entityId, documentType' },
        { status: 400 }
      )
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Use JPG, PNG, GIF, WebP, or PDF.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Verify ownership of the entity
    if (entityType === 'campaign') {
      const campaign = await db.campaign.findUnique({ where: { id: entityId } })
      if (!campaign || (campaign.organizerId !== user.id && user.role !== 'admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    // Determine bucket
    const isMedical = documentType === 'medical_document'
    const bucket = 'private-documents'

    // Build storage path
    const ext = file.name.split('.').pop()
    const storagePath = `${entityType}/${entityId}/${documentType}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    // Upload to Supabase Storage using admin client
    const adminClient = await createAdminClient()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await adminClient.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
    }

    // Create PrivateDocument record
    const doc = await db.privateDocument.create({
      data: {
        entityType,
        entityId,
        documentType,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        storagePath,
        storageBucket: bucket,
        uploadedById: user.id,
        accessLevel: isMedical ? 'admin_only' : 'reviewer_only',
        status: 'pending',
      },
    })

    await createAuditLog({
      adminId: user.id,
      action: 'document_uploaded',
      entityType: 'private_document',
      entityId: doc.id,
      metadata: { fileName: file.name, documentType, entityType, entityId },
    })

    return NextResponse.json({
      id: doc.id,
      fileName: doc.fileName,
      documentType: doc.documentType,
      status: doc.status,
      message: 'Document uploaded successfully',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Document upload error:', error)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

/**
 * Storage bucket setup — admin only.
 * Ensures required Supabase Storage buckets exist.
 * Call POST once after initial deployment.
 */
import { requireAdmin, AuthError } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const REQUIRED_BUCKETS = [
  {
    name: 'campaign-media',
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  },
  {
    name: 'private-documents',
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
    ],
  },
]

export async function POST() {
  try {
    await requireAdmin()
    const adminClient = await createAdminClient()
    const results: { bucket: string; status: string; error?: string }[] = []

    for (const bucket of REQUIRED_BUCKETS) {
      try {
        // Try to create the bucket
        const { error: createError } = await adminClient.storage.createBucket(bucket.name, {
          public: bucket.public,
          fileSizeLimit: bucket.fileSizeLimit,
          allowedMimeTypes: bucket.allowedMimeTypes,
        })

        if (createError) {
          // Bucket might already exist — check
          const { error: listError } = await adminClient.storage.getBucket(bucket.name)
          if (listError) {
            results.push({ bucket: bucket.name, status: 'error', error: createError.message })
          } else {
            results.push({ bucket: bucket.name, status: 'already_exists' })
          }
        } else {
          results.push({ bucket: bucket.name, status: 'created' })
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        results.push({ bucket: bucket.name, status: 'error', error: message })
      }
    }

    return NextResponse.json({ buckets: results })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Storage bucket setup error:', error)
    return NextResponse.json({ error: 'Failed to setup storage buckets' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await requireAdmin()
    const adminClient = await createAdminClient()
    const { data: buckets, error } = await adminClient.storage.listBuckets()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ buckets })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error listing buckets:', error)
    return NextResponse.json({ error: 'Failed to list buckets' }, { status: 500 })
  }
}

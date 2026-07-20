import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const MAX_SIZE = 8 * 1024 * 1024

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json({ error: 'Unsupported file type. Use JPEG, PNG, WebP or GIF.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 8MB.' }, { status: 400 })
  }

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}

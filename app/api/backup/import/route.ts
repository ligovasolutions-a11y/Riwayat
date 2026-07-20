import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import extractZip from 'extract-zip'
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'riwaayat.db')
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_SIZE = 500 * 1024 * 1024

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No backup file provided.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Backup file is too large.' }, { status: 400 })
  }

  const workDir = path.join(DATA_DIR, 'backups', `restore-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`)
  fs.mkdirSync(workDir, { recursive: true })
  const zipPath = path.join(workDir, 'upload.zip')
  fs.writeFileSync(zipPath, Buffer.from(await file.arrayBuffer()))

  try {
    await extractZip(zipPath, { dir: workDir })

    const restoredDbPath = path.join(workDir, 'riwaayat.db')
    if (!fs.existsSync(restoredDbPath)) {
      return NextResponse.json({ error: 'Invalid backup file: riwaayat.db not found in archive.' }, { status: 400 })
    }

    // Sanity-check the uploaded file is really a Riwaayat database before touching anything live.
    try {
      const check = new Database(restoredDbPath, { readonly: true })
      const tables = check.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[]
      check.close()
      const names = new Set(tables.map((t) => t.name))
      if (!names.has('settings') || !names.has('products') || !names.has('admin_users')) {
        return NextResponse.json({ error: 'Invalid backup file: unexpected database structure.' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid backup file: could not read database.' }, { status: 400 })
    }

    // Release the live connection's file handles before swapping the database file on disk.
    db.pragma('wal_checkpoint(TRUNCATE)')
    db.close()

    fs.copyFileSync(restoredDbPath, DB_PATH)
    for (const sidecar of ['-wal', '-shm']) {
      const p = DB_PATH + sidecar
      if (fs.existsSync(p)) fs.unlinkSync(p)
    }

    const restoredUploadsDir = path.join(workDir, 'uploads')
    if (fs.existsSync(restoredUploadsDir)) {
      fs.rmSync(UPLOADS_DIR, { recursive: true, force: true })
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
      fs.cpSync(restoredUploadsDir, UPLOADS_DIR, { recursive: true })
    }

    return NextResponse.json({
      ok: true,
      message: 'Backup restored successfully. Please restart the application for the restored data to take effect.',
    })
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true })
  }
}

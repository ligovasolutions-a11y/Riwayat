import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import archiver from 'archiver'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'riwaayat.db')
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Merge the write-ahead log into the main db file so the backup is complete and self-contained.
  db.pragma('wal_checkpoint(TRUNCATE)')

  const tmpPath = path.join(DATA_DIR, 'backups', `export-${Date.now()}.zip`)
  fs.mkdirSync(path.dirname(tmpPath), { recursive: true })

  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(tmpPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', () => resolve())
    archive.on('error', reject)
    archive.pipe(output)
    archive.file(DB_PATH, { name: 'riwaayat.db' })
    if (fs.existsSync(UPLOADS_DIR)) archive.directory(UPLOADS_DIR, 'uploads')
    archive.finalize()
  })

  const buffer = fs.readFileSync(tmpPath)
  fs.unlinkSync(tmpPath)

  const filename = `riwaayat-backup-${new Date().toISOString().slice(0, 10)}.zip`
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

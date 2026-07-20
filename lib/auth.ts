import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { getSetting, setSetting } from './db'

export const SESSION_COOKIE = 'riwaayat_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSessionSecret(): Uint8Array {
  let secret = getSetting('session_secret')
  if (!secret) {
    secret = crypto.randomBytes(32).toString('hex')
    setSetting('session_secret', secret)
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(email: string): Promise<string> {
  const secret = getSessionSecret()
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret)
}

export async function verifySessionToken(token: string): Promise<{ email: string } | null> {
  try {
    const secret = getSessionSecret()
    const { payload } = await jwtVerify(token, secret)
    if (typeof payload.email !== 'string') return null
    return { email: payload.email }
  } catch {
    return null
  }
}

export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 12)
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS

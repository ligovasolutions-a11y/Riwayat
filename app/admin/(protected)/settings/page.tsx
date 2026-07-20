'use client'

import { useEffect, useRef, useState } from 'react'
import { Save, Download, Upload, KeyRound } from 'lucide-react'

type Settings = {
  siteName: string; tagline: string; phone: string; email: string; address: string
  instagram: string; facebook: string; youtube: string; whatsapp: string
  announcement: string; metaTitle: string; metaDesc: string
}

const emptySettings: Settings = {
  siteName: '', tagline: '', phone: '', email: '', address: '',
  instagram: '', facebook: '', youtube: '', whatsapp: '',
  announcement: '', metaTitle: '', metaDesc: '',
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings>(emptySettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  const [backupMsg, setBackupMsg] = useState('')
  const [backupError, setBackupError] = useState('')
  const [restoring, setRestoring] = useState(false)
  const restoreInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings((s) => ({ ...s, ...data })))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg('')
    setPasswordError('')
    setPasswordSaving(true)
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password.')
        return
      }
      setPasswordMsg('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleRestore = async (file: File) => {
    if (!confirm('Restoring will replace ALL current products, collections, journal posts, appointments, settings and uploaded images with the contents of this backup. This cannot be undone. Continue?')) return
    setBackupMsg('')
    setBackupError('')
    setRestoring(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/backup/import', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setBackupError(data.error || 'Restore failed.')
        return
      }
      setBackupMsg(data.message)
    } finally {
      setRestoring(false)
    }
  }

  if (loading) return <div className="p-6 lg:p-8 text-sm text-gray-400">Loading…</div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Global website configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 px-5 py-2 text-xs font-sans text-white transition-colors disabled:opacity-50 ${saved ? 'bg-green-600' : 'bg-rw-black hover:bg-rw-gold'}`}>
          <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {[
          { title: 'Brand Identity', fields: [
            { k: 'siteName', l: 'Website Name' },
            { k: 'tagline', l: 'Tagline' },
            { k: 'announcement', l: 'Announcement Bar Text' },
          ]},
          { title: 'Contact Information', fields: [
            { k: 'phone', l: 'Phone Number' },
            { k: 'email', l: 'Email Address' },
            { k: 'address', l: 'Store Address' },
            { k: 'whatsapp', l: 'WhatsApp Number' },
          ]},
          { title: 'Social Media', fields: [
            { k: 'instagram', l: 'Instagram Handle' },
            { k: 'facebook', l: 'Facebook Page' },
            { k: 'youtube', l: 'YouTube Channel' },
          ]},
          { title: 'SEO', fields: [
            { k: 'metaTitle', l: 'Meta Title' },
            { k: 'metaDesc', l: 'Meta Description' },
          ]},
        ].map(({ title, fields }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">{title}</h2>
            {fields.map(({ k, l }) => (
              <div key={k}>
                <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">{l}</label>
                <input value={settings[k as keyof Settings]} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
              </div>
            ))}
          </div>
        ))}

        {/* Security */}
        <form onSubmit={handlePasswordChange} className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <KeyRound size={14} className="text-rw-gold" /> Change Password
          </h2>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">Current Password</label>
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase font-sans text-gray-500 block mb-2">New Password</label>
            <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rw-gold transition-colors" />
          </div>
          {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
          {passwordMsg && <p className="text-green-600 text-xs">{passwordMsg}</p>}
          <button type="submit" disabled={passwordSaving} className="px-5 py-2 bg-rw-black text-white text-xs hover:bg-rw-gold transition-colors disabled:opacity-50">
            {passwordSaving ? 'Updating…' : 'Update Password'}
          </button>
        </form>

        {/* Backup & Restore */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-3">Backup & Restore</h2>
          <p className="text-xs text-gray-500">
            Download a complete backup of your database and uploaded images, or restore from a previous backup.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/api/backup/export" className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs text-gray-700 hover:border-rw-gold hover:text-rw-gold transition-colors">
              <Download size={14} /> Download Backup
            </a>
            <button
              type="button"
              disabled={restoring}
              onClick={() => restoreInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs text-gray-700 hover:border-rw-gold hover:text-rw-gold transition-colors disabled:opacity-50"
            >
              <Upload size={14} /> {restoring ? 'Restoring…' : 'Restore from Backup'}
            </button>
            <input
              ref={restoreInputRef}
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleRestore(file)
                e.target.value = ''
              }}
            />
          </div>
          {backupError && <p className="text-red-500 text-xs">{backupError}</p>}
          {backupMsg && <p className="text-green-600 text-xs">{backupMsg}</p>}
        </div>
      </div>
    </div>
  )
}

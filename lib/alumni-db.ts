import mysql from 'mysql2/promise'
import { createClient } from '@supabase/supabase-js'

const isDevelopment = process.env.DB_TYPE === 'supabase'

const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'loyola',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getConn() {
  return mysql.createConnection(mysqlConfig)
}

/* ─────────────────────── Alumni Users ─────────────────────── */

export async function findAlumniByEmail(email: string) {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_users').select('*').eq('email', email.toLowerCase()).single()
    return data
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT * FROM alumni_users WHERE email = ?', [email.toLowerCase()])
    const r = rows as any[]
    return r.length > 0 ? r[0] : null
  } finally { await conn.end() }
}

export async function findAlumniById(id: number) {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_users').select('*').eq('id', id).single()
    return data
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT * FROM alumni_users WHERE id = ?', [id])
    const r = rows as any[]
    return r.length > 0 ? r[0] : null
  } finally { await conn.end() }
}

export async function createAlumniUser(data: {
  name: string
  email: string
  password_hash: string
  phone?: string
  country?: string
  city?: string
}) {
  if (isDevelopment) {
    const { data: d, error } = await supabase.from('alumni_users').insert({ ...data, email: data.email.toLowerCase() }).select().single()
    if (error) throw error
    return d
  }
  const conn = await getConn()
  try {
    const payload = { ...data, email: data.email.toLowerCase() }
    const fields = Object.keys(payload)
    const placeholders = fields.map(() => '?').join(', ')
    const values = Object.values(payload)
    const [result] = await conn.execute(
      `INSERT INTO alumni_users (${fields.join(', ')}) VALUES (${placeholders})`,
      values
    )
    return { id: (result as any).insertId, ...payload }
  } finally { await conn.end() }
}

export async function updateAlumniUser(id: number, data: Record<string, any>) {
  if (isDevelopment) {
    const { data: d } = await supabase.from('alumni_users').update(data).eq('id', id).select().single()
    return d
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    const setClause = fields.map(f => `${f} = ?`).join(', ')
    await conn.execute(`UPDATE alumni_users SET ${setClause} WHERE id = ?`, [...Object.values(data), id])
    return { id, ...data }
  } finally { await conn.end() }
}

export async function getAllAlumniUsers() {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_users').select('id,name,email,phone,country,city,is_approved,created_at').order('created_at', { ascending: false })
    return data || []
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT id,name,email,phone,country,city,is_approved,created_at FROM alumni_users ORDER BY created_at DESC')
    return rows as any[]
  } finally { await conn.end() }
}

/* ─────────────────────── Password Reset OTPs ─────────────────────── */

export async function createAlumniOTP(email: string, otpHash: string, expiresAt: Date) {
  if (isDevelopment) {
    await supabase.from('alumni_password_reset_otps').insert({ email: email.toLowerCase(), otp_hash: otpHash, expires_at: expiresAt.toISOString() })
    return
  }
  const conn = await getConn()
  try {
    await conn.execute(
      'INSERT INTO alumni_password_reset_otps (email, otp_hash, expires_at) VALUES (?, ?, ?)',
      [email.toLowerCase(), otpHash, expiresAt]
    )
  } finally { await conn.end() }
}

export async function getLatestAlumniOTP(email: string) {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_password_reset_otps').select('*').eq('email', email.toLowerCase()).eq('is_used', false).order('created_at', { ascending: false }).limit(1).single()
    return data
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute(
      'SELECT * FROM alumni_password_reset_otps WHERE email = ? AND is_used = 0 ORDER BY created_at DESC LIMIT 1',
      [email.toLowerCase()]
    )
    const r = rows as any[]
    return r.length > 0 ? r[0] : null
  } finally { await conn.end() }
}

export async function markAlumniOTPUsed(id: number) {
  if (isDevelopment) {
    await supabase.from('alumni_password_reset_otps').update({ is_used: true }).eq('id', id)
    return
  }
  const conn = await getConn()
  try {
    await conn.execute('UPDATE alumni_password_reset_otps SET is_used = 1 WHERE id = ?', [id])
  } finally { await conn.end() }
}

export async function deleteAlumniOTPsByEmail(email: string) {
  if (isDevelopment) {
    await supabase.from('alumni_password_reset_otps').delete().eq('email', email.toLowerCase())
    return
  }
  const conn = await getConn()
  try {
    await conn.execute('DELETE FROM alumni_password_reset_otps WHERE email = ?', [email.toLowerCase()])
  } finally { await conn.end() }
}

/* ─────────────────────── Alumni Presidents ─────────────────────── */

export async function getAlumniPresidents() {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_presidents').select('*').order('sort_order', { ascending: true })
    return data || []
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT * FROM alumni_presidents ORDER BY sort_order ASC')
    return rows as any[]
  } finally { await conn.end() }
}

export async function createAlumniPresident(data: { year: string; president?: string; secretary?: string; treasurer?: string; sort_order?: number }) {
  if (isDevelopment) {
    const { data: d, error } = await supabase.from('alumni_presidents').insert(data).select().single()
    if (error) throw error
    return d
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    const [result] = await conn.execute(
      `INSERT INTO alumni_presidents (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
      Object.values(data)
    )
    return { id: (result as any).insertId, ...data }
  } finally { await conn.end() }
}

export async function updateAlumniPresident(id: number, data: Record<string, any>) {
  if (isDevelopment) {
    await supabase.from('alumni_presidents').update(data).eq('id', id)
    return { id, ...data }
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    await conn.execute(
      `UPDATE alumni_presidents SET ${fields.map(f => `${f}=?`).join(',')} WHERE id = ?`,
      [...Object.values(data), id]
    )
    return { id, ...data }
  } finally { await conn.end() }
}

export async function deleteAlumniPresident(id: number) {
  if (isDevelopment) {
    await supabase.from('alumni_presidents').delete().eq('id', id)
    return
  }
  const conn = await getConn()
  try {
    await conn.execute('DELETE FROM alumni_presidents WHERE id = ?', [id])
  } finally { await conn.end() }
}

/* ─────────────────────── Alumni Office Bearers ─────────────────────── */

export async function getAlumniOfficeBearers() {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_office_bearers').select('*').order('sort_order', { ascending: true })
    return data || []
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT * FROM alumni_office_bearers ORDER BY sort_order ASC')
    return rows as any[]
  } finally { await conn.end() }
}

export async function createAlumniOfficeBearer(data: { name: string; role: string; type?: string; email?: string; phone?: string; sort_order?: number }) {
  if (isDevelopment) {
    const { data: d, error } = await supabase.from('alumni_office_bearers').insert(data).select().single()
    if (error) throw error
    return d
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    const [result] = await conn.execute(
      `INSERT INTO alumni_office_bearers (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
      Object.values(data)
    )
    return { id: (result as any).insertId, ...data }
  } finally { await conn.end() }
}

export async function updateAlumniOfficeBearer(id: number, data: Record<string, any>) {
  if (isDevelopment) {
    await supabase.from('alumni_office_bearers').update(data).eq('id', id)
    return { id, ...data }
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    await conn.execute(
      `UPDATE alumni_office_bearers SET ${fields.map(f => `${f}=?`).join(',')} WHERE id = ?`,
      [...Object.values(data), id]
    )
    return { id, ...data }
  } finally { await conn.end() }
}

export async function deleteAlumniOfficeBearer(id: number) {
  if (isDevelopment) {
    await supabase.from('alumni_office_bearers').delete().eq('id', id)
    return
  }
  const conn = await getConn()
  try {
    await conn.execute('DELETE FROM alumni_office_bearers WHERE id = ?', [id])
  } finally { await conn.end() }
}

/* ─────────────────────── Alumni Gallery ─────────────────────── */

export async function getAlumniGallery() {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_gallery').select('*').order('sort_order', { ascending: true })
    return data || []
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT * FROM alumni_gallery ORDER BY sort_order ASC, created_at DESC')
    return rows as any[]
  } finally { await conn.end() }
}

export async function createAlumniGalleryItem(data: { image_url: string; caption?: string; sort_order?: number }) {
  if (isDevelopment) {
    const { data: d, error } = await supabase.from('alumni_gallery').insert(data).select().single()
    if (error) throw error
    return d
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    const [result] = await conn.execute(
      `INSERT INTO alumni_gallery (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
      Object.values(data)
    )
    return { id: (result as any).insertId, ...data }
  } finally { await conn.end() }
}

export async function deleteAlumniGalleryItem(id: number) {
  if (isDevelopment) {
    await supabase.from('alumni_gallery').delete().eq('id', id)
    return
  }
  const conn = await getConn()
  try {
    await conn.execute('DELETE FROM alumni_gallery WHERE id = ?', [id])
  } finally { await conn.end() }
}

/* ─────────────────────── Alumni Events ─────────────────────── */

export async function getAlumniEvents() {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_events').select('*').order('sort_order', { ascending: true })
    return data || []
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT * FROM alumni_events ORDER BY sort_order ASC, created_at DESC')
    return rows as any[]
  } finally { await conn.end() }
}

export async function createAlumniEvent(data: { title: string; date?: string; description?: string; image_url?: string; sort_order?: number }) {
  if (isDevelopment) {
    const { data: d, error } = await supabase.from('alumni_events').insert(data).select().single()
    if (error) throw error
    return d
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    const [result] = await conn.execute(
      `INSERT INTO alumni_events (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
      Object.values(data)
    )
    return { id: (result as any).insertId, ...data }
  } finally { await conn.end() }
}

export async function updateAlumniEvent(id: number, data: Record<string, any>) {
  if (isDevelopment) {
    await supabase.from('alumni_events').update(data).eq('id', id)
    return { id, ...data }
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    await conn.execute(
      `UPDATE alumni_events SET ${fields.map(f => `${f}=?`).join(',')} WHERE id = ?`,
      [...Object.values(data), id]
    )
    return { id, ...data }
  } finally { await conn.end() }
}

export async function deleteAlumniEvent(id: number) {
  if (isDevelopment) {
    await supabase.from('alumni_events').delete().eq('id', id)
    return
  }
  const conn = await getConn()
  try {
    await conn.execute('DELETE FROM alumni_events WHERE id = ?', [id])
  } finally { await conn.end() }
}

/* ─────────────────────── Alumni Awards ─────────────────────── */

export async function getAlumniAwards() {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_awards').select('*').order('sort_order', { ascending: true })
    return data || []
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT * FROM alumni_awards ORDER BY sort_order ASC')
    return rows as any[]
  } finally { await conn.end() }
}

export async function createAlumniAward(data: { title: string; date?: string; description?: string; sort_order?: number }) {
  if (isDevelopment) {
    const { data: d, error } = await supabase.from('alumni_awards').insert(data).select().single()
    if (error) throw error
    return d
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    const [result] = await conn.execute(
      `INSERT INTO alumni_awards (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
      Object.values(data)
    )
    return { id: (result as any).insertId, ...data }
  } finally { await conn.end() }
}

export async function updateAlumniAward(id: number, data: Record<string, any>) {
  if (isDevelopment) {
    await supabase.from('alumni_awards').update(data).eq('id', id)
    return { id, ...data }
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    await conn.execute(
      `UPDATE alumni_awards SET ${fields.map(f => `${f}=?`).join(',')} WHERE id = ?`,
      [...Object.values(data), id]
    )
    return { id, ...data }
  } finally { await conn.end() }
}

export async function deleteAlumniAward(id: number) {
  if (isDevelopment) {
    await supabase.from('alumni_awards').delete().eq('id', id)
    return
  }
  const conn = await getConn()
  try {
    await conn.execute('DELETE FROM alumni_awards WHERE id = ?', [id])
  } finally { await conn.end() }
}

/* ─────────────────────── Alumni Contact Messages ─────────────────────── */

export async function createAlumniMessage(data: { name: string; email: string; subject?: string; message?: string }) {
  if (isDevelopment) {
    const { data: d, error } = await supabase.from('alumni_messages').insert(data).select().single()
    if (error) throw error
    return d
  }
  const conn = await getConn()
  try {
    const fields = Object.keys(data)
    const [result] = await conn.execute(
      `INSERT INTO alumni_messages (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
      Object.values(data)
    )
    return { id: (result as any).insertId, ...data }
  } finally { await conn.end() }
}

export async function getAllAlumniMessages() {
  if (isDevelopment) {
    const { data } = await supabase.from('alumni_messages').select('*').order('created_at', { ascending: false })
    return data || []
  }
  const conn = await getConn()
  try {
    const [rows] = await conn.execute('SELECT * FROM alumni_messages ORDER BY created_at DESC')
    return rows as any[]
  } finally { await conn.end() }
}

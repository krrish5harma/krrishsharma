import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })

const app = express()
const origins = [
  ...(process.env.ALLOWED_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim()),
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
].filter(Boolean)

app.disable('x-powered-by')
app.use(cors({ origin: (origin, callback) => callback(null, !origin || origins.includes(origin)) }))
app.use(express.json({ limit: '12kb' }))
app.use('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many messages. Please try again later.' } }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.post('/api/contact', async (req, res) => {
  const { name, email, projectType = '', budget = '', message, website = '' } = req.body || {}
  if (typeof website === 'string' && website.trim()) return res.status(200).json({ accepted: true })
  const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''
  const safeName = clean(name, 100)
  const safeEmail = clean(email, 254)
  const safeType = clean(projectType, 100)
  const safeBudget = clean(budget, 100)
  const safeMessage = clean(message, 5000)
  if (!safeName || !safeEmail || !safeMessage) return res.status(400).json({ error: 'Name, email and project brief are required.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) return res.status(400).json({ error: 'Please enter a valid email address.' })
  if (safeMessage.length < 10) return res.status(400).json({ error: 'Please add a little more detail to your project brief.' })

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_TO, MAIL_FROM } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !MAIL_FROM) {
    return res.status(503).json({ error: 'The contact form is not configured yet. Please use Instagram or YouTube to get in touch.' })
  }
  try {
    const transport = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 587), secure: SMTP_SECURE === 'true', auth: { user: SMTP_USER, pass: SMTP_PASS } })
    await transport.sendMail({
      from: MAIL_FROM,
      to: CONTACT_TO,
      replyTo: safeEmail,
      subject: `Portfolio enquiry from ${safeName}`,
      text: [`Name: ${safeName}`, `Email: ${safeEmail}`, `Project type: ${safeType || 'Not specified'}`, `Budget: ${safeBudget || 'Not specified'}`, '', safeMessage].join('\n'),
    })
    return res.status(202).json({ accepted: true })
  } catch (error) {
    console.error('Contact delivery failed:', error.message)
    return res.status(502).json({ error: 'Message delivery failed. Please try again or reach out on Instagram or YouTube.' })
  }
})

export default app

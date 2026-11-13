import nodemailer from 'nodemailer'

const requests = new Map()
const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5

function respond(res, status, body) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(status).json(body)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return respond(res, 405, { error: 'Method not allowed.' })
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  const now = Date.now()
  const recent = (requests.get(ip) || []).filter((time) => now - time < WINDOW_MS)
  if (recent.length >= MAX_REQUESTS) return respond(res, 429, { error: 'Too many messages. Please try again later.' })
  recent.push(now)
  requests.set(ip, recent)

  const body = req.body && typeof req.body === 'object' ? req.body : {}
  const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''
  if (clean(body.website, 300)) return respond(res, 200, { accepted: true })

  const name = clean(body.name, 100)
  const email = clean(body.email, 254)
  const projectType = clean(body.projectType, 100)
  const budget = clean(body.budget, 100)
  const message = clean(body.message, 5000)
  if (!name || !email || !message) return respond(res, 400, { error: 'Name, email and project brief are required.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond(res, 400, { error: 'Please enter a valid email address.' })
  if (message.length < 10) return respond(res, 400, { error: 'Please add a little more detail to your project brief.' })

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_TO, MAIL_FROM } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !MAIL_FROM) {
    return respond(res, 503, { error: 'The contact form is not configured yet. Please use Instagram or YouTube to get in touch.' })
  }

  try {
    const transport = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 587), secure: SMTP_SECURE === 'true', auth: { user: SMTP_USER, pass: SMTP_PASS } })
    await transport.sendMail({
      from: MAIL_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, `Project type: ${projectType || 'Not specified'}`, `Budget: ${budget || 'Not specified'}`, '', message].join('\n'),
    })
    return respond(res, 202, { accepted: true })
  } catch (error) {
    console.error('Contact delivery failed:', error.message)
    return respond(res, 502, { error: 'Message delivery failed. Please try again or reach out on Instagram or YouTube.' })
  }
}

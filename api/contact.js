import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    await resend.emails.send({
      from: 'REFRM <admin@refrm.in>',
      to: 'admin@refrm.in',
      replyTo: email,
      subject: `Message from ${name}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; color: #383838;">
          <h2 style="font-family: Georgia, serif; font-weight: 400; font-size: 28px; margin-bottom: 8px;">New message via REFRM</h2>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin-bottom: 24px;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin-top: 20px;"><strong>Message:</strong></p>
          <p style="background: #f7f7f7; padding: 16px; border-radius: 6px; white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 32px;" />
          <p style="font-size: 11px; color: #aaa; letter-spacing: 0.08em;">REFRM · Reform with AI</p>
        </div>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}

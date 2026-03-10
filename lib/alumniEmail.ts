import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.ALUMNI_SMTP_USER || process.env.SMTP_USER,
    pass: process.env.ALUMNI_SMTP_PASS || process.env.SMTP_PASS,
  },
})

export async function sendAlumniOTPEmail(email: string, otp: string, name: string) {
  const mailOptions = {
    from: process.env.ALUMNI_SMTP_USER || process.env.SMTP_FROM || 'Loyola Alumni <alumniassociation@loyolacollegekerala.edu.in>',
    to: email,
    subject: 'Loyola Alumni – Password Reset OTP',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #0d3d2b 0%, #1a5632 100%); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
            Loyola Alumni Association
          </h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px;">
            Password Reset Request
          </p>
        </div>

        <div style="padding: 32px;">
          <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Hi ${name},<br/>
            We received a password reset request for your alumni account. Use the OTP below:
          </p>

          <div style="background: #f0f7f4; border: 2px dashed #1a5632; border-radius: 10px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">
              Your OTP Code
            </p>
            <p style="color: #1a5632; font-size: 36px; font-weight: 800; letter-spacing: 8px; margin: 0;">
              ${otp}
            </p>
          </div>

          <p style="color: #888; font-size: 13px; line-height: 1.5; margin: 20px 0 0;">
            ⏱ This OTP is valid for <strong>10 minutes</strong>.<br />
            🔒 Do not share this code with anyone.<br />
            If you did not request this, please ignore this email.
          </p>
        </div>

        <div style="background: #f8f9fa; padding: 16px 32px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 11px; margin: 0;">
            Loyola College of Social Sciences, Thiruvananthapuram, Kerala, India<br />
            © ${new Date().getFullYear()} Loyola Alumni Association. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

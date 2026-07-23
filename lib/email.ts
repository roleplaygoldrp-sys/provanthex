import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not defined. Email features will be disabled.')
}

export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  if (!resend) {
    console.warn('Resend not configured. Email not sent.')
    return null
  }

  try {
    const data = await resend.emails.send({
      from: 'Vanthex IA <noreply@vanthex.com.br>',
      to,
      subject,
      html,
    })
    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

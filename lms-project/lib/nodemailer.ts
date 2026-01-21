import nodemailer from 'nodemailer';

// Email templates
export const emailTemplates = {
  otp: (otp: string) => ({
    subject: 'Your OTP Code - Neo LMS',
    text: `Your OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Your OTP Code</h1>
                      <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                        Your verification code is:
                      </p>
                      <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; margin: 0 0 30px 0;">
                        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0066ff;">
                          ${otp}
                        </span>
                      </div>
                      <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0 0 10px 0;">
                        ⏰ This code will expire in <strong>10 minutes</strong>.
                      </p>
                      <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0;">
                        If you didn't request this code, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                      <p style="color: #999999; font-size: 12px; text-align: center; margin: 0;">
                        © 2025 Neo LMS - Learning Management System
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),
};

// Create transporter
const createTransporter = () => {
  // Verify environment variables
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Missing email configuration:');
    console.error('EMAIL_HOST:', process.env.EMAIL_HOST ? '✓' : '✗');
    console.error('EMAIL_USER:', process.env.EMAIL_USER ? '✓' : '✗');
    console.error('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓' : '✗');
    throw new Error('Email configuration is missing in environment variables');
  }

  const config = {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  console.log('📧 Email Configuration:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
  });

  return nodemailer.createTransport(config);
};

// Send email function
export const sendEmail = async (
  to: string, 
  template: { subject: string; text: string; html: string }
) => {
  try {
    console.log(`📤 Attempting to send email to: ${to}`);
    
    const transporter = createTransporter();

    // Verify transporter configuration
    console.log('🔍 Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    // Send email
    console.log('📨 Sending email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Neo LMS" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    return { 
      success: true, 
      messageId: info.messageId,
      response: info.response 
    };
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error('Error details:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
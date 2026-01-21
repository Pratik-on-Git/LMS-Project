import nodemailer from "nodemailer";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Email templates
export const emailTemplates = {
  otp: (otp: string) => ({
    subject: "Your OTP Code - Neo LMS",
    text: `Your OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p style="font-size: 16px;">Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">© Neo LMS - Learning Management System</p>
      </div>
    `,
  }),
};

// Create transporter
const createTransporter = () => {
  // Verify environment variables
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email configuration is missing in environment variables");
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Additional settings for Gmail
    ...(process.env.EMAIL_HOST === "smtp.gmail.com" && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
  });
};

// Send email function
export const sendEmail = async (to: string, template: { subject: string; text: string; html: string }) => {
  try {
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();
    console.log("Email transporter is ready");

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Neo LMS" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};
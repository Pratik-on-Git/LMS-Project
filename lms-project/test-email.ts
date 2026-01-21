import { sendEmail, emailTemplates } from './lib/nodemailer';
import { config } from 'dotenv';

config();

async function testEmail() {
  console.log('Testing email configuration...');
  
  const testOTP = '123456';
  const template = emailTemplates.otp(testOTP);
  
  const result = await sendEmail('contact.wencyweb@gmail.com', template);
  
  if (result.success) {
    console.log('✅ Test email sent successfully!');
  } else {
    console.error('❌ Failed to send test email:', result.error);
  }
}

testEmail();
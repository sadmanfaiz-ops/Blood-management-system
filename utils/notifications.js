const nodemailerAvailable = (() => { try { require.resolve('nodemailer'); return true; } catch { return false; } })();
const twilioAvailable = (() => { try { require.resolve('twilio'); return true; } catch { return false; } })();
const { logEvent } = require('./analyticsService');

// Email via Nodemailer (SMTP)
async function sendEmailNotification(recipientEmail, subject, body) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  
  // Debug logging
  console.log('📧 Email notification triggered:');
  console.log('   nodemailerAvailable:', nodemailerAvailable);
  console.log('   SMTP_HOST:', SMTP_HOST ? '✓' : '✗');
  console.log('   SMTP_USER:', SMTP_USER ? '✓' : '✗');
  console.log('   SMTP_PASS:', SMTP_PASS ? '✓ (hidden)' : '✗');
  
  if (nodemailerAvailable && SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });
      await transporter.sendMail({ from: EMAIL_FROM || 'no-reply@example.com', to: recipientEmail, subject, text: body });
      console.log('✅ Email sent successfully to:', recipientEmail);
      
      // Log analytics event
      await logEvent('NOTIFICATION_SENT', {
        metadata: { notificationType: 'EMAIL', recipientEmail, subject }
      });
      
      return true;
    } catch (err) {
      console.error('❌ Email send failed:', err.message);
    }
  }
  console.log(`EMAIL[stub] => to:${recipientEmail} | subject:${subject} | body:${body}`);
  return false;
}

// SMS via Twilio
async function sendSmsNotification(recipientPhone, message) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = process.env;
  if (twilioAvailable && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM) {
    try {
      const twilio = require('twilio');
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      await client.messages.create({ from: TWILIO_FROM, to: recipientPhone, body: message });
      return true;
    } catch (err) {
      console.error('SMS send failed:', err.message);
    }
  }
  console.log(`SMS[stub] => to:${recipientPhone} | message:${message}`);
  return false;
}

// Notify a list of donors near a request (broadcast)
async function sendNotificationsNearby(donors, request) {
  const message = `New blood request: ${request.bloodGroup} needed at ${request.location} (urgency: ${request.urgencyLevel})`;
  console.log(`🔔 Broadcasting to ${donors.length} nearby donors...`);
  
  for (const d of donors) {
    // Send email notifications only
    const donorEmail = d.email || d.userId?.email;
    console.log(`   Donor: ${d.name} | Email: ${donorEmail || 'NOT FOUND'}`);
    
    if (donorEmail) {
      await sendEmailNotification(donorEmail, 'New Blood Request Nearby', message);
    } else {
      console.log(`   ⚠️ Skipping ${d.name} - no email address`);
    }
  }
}

module.exports = { sendEmailNotification, sendSmsNotification, sendNotificationsNearby };

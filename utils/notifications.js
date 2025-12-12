// Simple stubs for SMS/Email notifications
async function sendEmailNotification(recipientEmail, subject, body) {
  console.log(`EMAIL => to:${recipientEmail} | subject:${subject} | body:${body}`);
  return true;
}

async function sendSmsNotification(recipientPhone, message) {
  console.log(`SMS => to:${recipientPhone} | message:${message}`);
  return true;
}

// Notify a list of donors near a request
async function sendNotificationsNearby(donors, request) {
  const message = `New blood request: ${request.bloodGroup} needed at ${request.location} (urgency: ${request.urgencyLevel})`;
  for (const d of donors) {
    if (d.phone) await sendSmsNotification(d.phone, message);
    // In real app use donor email field
  }
}

module.exports = { sendEmailNotification, sendSmsNotification, sendNotificationsNearby };

const nodemailer = require('nodemailer');

const sendEmail = async ({ name, email, message }) => {
  const isMock = !process.env.EMAIL_HOST || 
                 process.env.EMAIL_USER === 'your_smtp_username' || 
                 !process.env.EMAIL_USER;

  if (isMock) {
    console.log('=== NODEMAILER MOCK EMAIL LOG ===');
    console.log(`From: "${name}" <${email}>`);
    console.log(`To: ${process.env.EMAIL_TO || 'habib.rehman@pandacoders.com'}`);
    console.log(`Subject: New Portfolio Contact Message from ${name}`);
    console.log(`Message Outline:\n${message}`);
    console.log('=================================');
    return { mockSent: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_FROM || 'noreply@pandacoders.com'}>`,
    to: process.env.EMAIL_TO || 'habib.rehman@pandacoders.com',
    replyTo: email,
    subject: `🐼 Panda Coders Portfolio: Message from ${name}`,
    text: `New message from ${name} (${email}):\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #4d4354; background-color: #101415; color: #e0e3e5;">
        <h2 style="color: #ddb7ff; border-bottom: 2px solid #ddb7ff; padding-bottom: 10px;">🐼 Panda Coders Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #bec6e0;">${email}</a></p>
        <div style="background-color: #1d2022; padding: 15px; border-radius: 4px; border: 1px dashed #4d4354;">
          <p style="margin: 0; white-space: pre-wrap; color: #cfc2d6;">${message}</p>
        </div>
        <br/>
        <small style="color: #bec6e0; opacity: 0.6;">Received at: ${new Date().toLocaleString()}</small>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };

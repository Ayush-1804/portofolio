const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3500;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve portfolio.html as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

// Email configuration
const YOUR_EMAIL = 'ayushpatra0892@gmail.com';
const YOUR_PASSWORD = 'ontc xjsn rlss wwlj'; // Gmail App Password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: YOUR_EMAIL,
    pass: YOUR_PASSWORD
  }
});

// POST endpoint to send emails
app.post('/send', (req, res) => {
  const { name, user_email, message } = req.body;

  // Email to you
  const mailOptionsToMe = {
    from: YOUR_EMAIL,
    to: YOUR_EMAIL,
    subject: `New Contact Form Message from ${name}`,
    text: `Name: ${name}\nEmail: ${user_email}\nMessage:\n${message}`
  };

  // Auto-reply to user
  const mailOptionsToUser = {
    from: YOUR_EMAIL,
    to: user_email,
    subject: `Thanks for contacting me, ${name}!`,
    text: `Hi ${name},\n\nThank you for reaching out. I have received your message and will get back to you soon.\n\nYour Message:\n${message}\n\nBest regards,\nAyush Patra`
  };

  transporter.sendMail(mailOptionsToMe, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    }

    transporter.sendMail(mailOptionsToUser, (err, info2) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to send auto-reply' });
      }

      res.json({ success: true, message: 'Email sent successfully!' });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

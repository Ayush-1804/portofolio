// server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const app = express();
const PORT = process.env.PORT || 3500;

// For ES module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve portfolio.html as default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "portfolio.html"));
});

// POST endpoint to send emails
app.post("/send", async (req, res) => {
  const { name, user_email, message } = req.body;

  try {
    // 1️⃣ Email to you
    await resend.emails.send({
      from: "Ayush Portfolio <onboarding@resend.dev>", // You can change domain later
      to: "ayushpatra0892@gmail.com",
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${user_email}\nMessage:\n${message}`,
    });

    // 2️⃣ Auto-reply to user
    await resend.emails.send({
      from: "Ayush Portfolio <onboarding@resend.dev>",
      to: user_email,
      subject: `Thanks for contacting me, ${name}!`,
      text: `Hi ${name},\n\nThank you for reaching out! I’ve received your message and will get back to you soon.\n\nYour Message:\n${message}\n\nBest regards,\nAyush Patra`,
    });

    res.json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

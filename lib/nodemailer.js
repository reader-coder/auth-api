import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const mailer = async (email, resetLink) => {
  try {
    const info = await transporter.sendMail({
      from: "rahul.2.prsnl@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Secure link for resetting password", // Subject line
      text: "Here's the link for resetting your password", // plain text body
      html: `<a>${resetLink}</a>`, // html body
    });
    if (!info.messageId) {
      return res.status(500).json({
        success: false,
        message: "Password reset email delivery failed",
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};

export default mailer;

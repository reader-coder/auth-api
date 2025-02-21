import transporter from "../config/nodemailer-config.js";

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

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendEmail = (recipient, content) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: recipient,
    subject: "Test",
    text: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("E-posta gönderme hatası:", error);
    } else {
      console.log(`Mail sent to ${recipient} with content: ${content}`);
    }
  });
};

module.exports = sendEmail;

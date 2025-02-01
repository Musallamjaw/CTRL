const nodemailer = require('nodemailer');

exports.sendContactForm = async (req, res) => {
  const { name, email, phoneNumber, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `New Message from ${name} - ${subject}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}\n\nPhone: ${phoneNumber}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message.' });
  }
};

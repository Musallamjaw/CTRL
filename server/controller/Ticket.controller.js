const Ticket = require("../models/Ticket.model");
const Event = require("../models/Event.model");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const generateQRCode = async (text, qrEventId, index) => {
  const qrCodeDir = path.join(__dirname, "..", "uploads", "qrcodes");
  if (!fs.existsSync(qrCodeDir)) {
    fs.mkdirSync(qrCodeDir, { recursive: true });
  }
  const qrCodeName = `ticket_${index}.png`;
  const qrCodePath = path.join(qrCodeDir, qrCodeName);

  const qrCodeText = `Text: ${text}\nEvent ID: ${qrEventId}`;

  try {
    await QRCode.toFile(qrCodePath, qrCodeText);
    return qrCodeName;
  } catch (err) {
    throw new Error("QR Code generation failed");
  }
};

const sendEmail = async (email, subject, tickets) => {
  if (!email) {
    throw new Error("User email is not defined");
  }

  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    throw new Error(
      "Email credentials are not defined in environment variables"
    );
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const ticketsHtml = tickets
    .map(
      (ticket, index) => `
    <div style="border:1px solid #000; color:white; padding:10px; margin-bottom:10px; max-width:300px; border-radius: 1rem; text-align:center; background-color: rgb(20, 16, 44);">
      <h2>${ticket.eventData.title}</h2>
      <p>Date: ${new Date(
        ticket.eventData.date
      ).toLocaleDateString()} at ${new Date(
        ticket.eventData.date
      ).toLocaleTimeString()}</p>
      <p>Location: ${ticket.eventData.location}</p>
      <img src="cid:image${
        index + 1
      }" alt="QR Code" style="width:100%; border-radius: 1rem;"/>
    </div>
  `
    )
    .join("");

  const htmlTemplate = `
    <html>
      <body>
        <h1>Your Event Tickets</h1>
        <a href="https://ameerbadran.github.io/test-deploy/"><h4>Visit Our Website</h4></a>
        <p>Thank you for your purchase! Here are your tickets:</p>
        ${ticketsHtml}
        <p>Please present these tickets at the event entrance.</p>
      </body>
    </html>
  `;

  const attachments = tickets.map((ticket, index) => ({
    filename: `ticket_${index}.png`,
    path: path.join(__dirname, "..", "uploads", "qrcodes", ticket.qrCode),
    cid: `image${index + 1}`,
  }));

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: htmlTemplate,
    attachments: attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error("Email sending failed");
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { eventData, userData, numberOfTickets } = req.body.ticketData;
    if (!eventData || !userData || !userData.email || !numberOfTickets) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.findById(eventData.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableTickets < numberOfTickets) {
      return res.status(200).json({ message: "Not enough tickets available" });
    }

    event.availableTickets -= numberOfTickets;
    await event.save();

    const tickets = await Promise.all(
      Array.from({ length: numberOfTickets }).map(async (_, i) => {
        const id = uuidv4();
        const qrCodePath = await generateQRCode(`${id}`, eventData.eventId, id);
        const ticket = new Ticket({
          qrID: id,
          userData,
          eventData,
          qrCode: qrCodePath,
        });
        await ticket.save();
        return ticket;
      })
    );

    await sendEmail(userData.email, "Your Event Tickets", tickets);

    res.status(201).json({ message: "Done, Sent Ticket" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.scanTicket = async (req, res) => {
  try {
    const { qrId } = req.body;

    const ticket = await Ticket.findOne({ qrID: qrId });
    if (!ticket) {
      return res.status(200).json({ message: "Ticket not found" });
    }

    if (ticket.status === "used") {
      return res.status(200).json({ message: "Ticket already used" });
    }

    ticket.status = "used";
    await ticket.save();

    res.status(200).json({ message: "Ticket used successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCountTickets = async (req, res) => {
  try {
    const filter = req.params.filter;
    let query = {};

    if (filter === "used") {
      query.status = "used";
    } else if (filter === "unused") {
      query.status = "unused";
    }

    const count = await Ticket.countDocuments(query);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while counting tickets" });
  }
};

exports.getCountUserTickets = async (req, res) => {
  try {
    const filter = req.params.filter;
    const userId = req.params.userId;
    let query = { "userData.userId": userId };

    if (filter === "used") {
      query.status = "used";
    } else if (filter === "unused") {
      query.status = "unused";
    }

    const count = await Ticket.countDocuments(query);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while counting tickets" });
  }
};

exports.getTicketsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.params.page, 10) || 1;
    const filter = req.params.filter;
    const pageSize = 6;
    let query = { "userData.userId": userId };

    if (filter === "used") {
      query.status = "used";
    } else if (filter === "unused") {
      query.status = "unused";
    }

    const skip = (page - 1) * pageSize;

    const tickets = await Ticket.find(query).skip(skip).limit(pageSize);

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while getting tickets" });
  }
};
exports.checkUserTicketForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    const ticket = await Ticket.findOne({
      "userData.userId": userId,
      "eventData.eventId": eventId,
    });

    if (ticket) {
      res.status(200).json({ isPurchased: true });
    } else {
      res.status(200).json({ isPurchased: false });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while checking the ticket" });
  }
};

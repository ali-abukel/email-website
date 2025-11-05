require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien aus /public
app.use(express.static(path.join(__dirname, 'public')));

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Healthcheck
app.get('/health', (req, res) => res.send('ok'));

// Kontaktformular senden
app.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!email || !message) return res.status(400).json({ error: 'Fehlende Felder' });

    const mailOptions = {
      from: `"Kontaktformular" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: subject || `Kontaktformular: Nachricht von ${name || email}`,
      text: `Von: ${name || 'Unbekannt'} <${email}>\n\n${message}`,
      html:

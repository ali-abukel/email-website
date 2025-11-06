require('dotenv').config(); // unbedingt ganz oben

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien aus /public bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------------------
// **ROBUSTE PRÜFUNG DER SMTP-VARIABLEN**
// ----------------------------------------------------------------
['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'].forEach(key => {
    if (!process.env[key]) {
        console.error(`ERROR: Kritische Umgebungsvariable fehlt: ${key}. Bitte in Render/Env-File setzen!`);
    }
});

// SMTP transporter
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Root-Seite zeigt index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Kontaktformular senden
app.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!email || !message) return res.status(400).json({ error: 'Fehlende Felder' });
    if (!process.env.MAIL_TO || !process.env.SMTP_USER) return res.status(500).json({ error: 'Server nicht konfiguriert.' });

    const mailOptions = {
      from: `"Kontaktformular" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: subject || `Kontaktformular: Nachricht von ${name || email}`,
      text: `Von: ${name || 'Unbekannt'} <${email}>\n\n${message}`,
      html: `<p><strong>Von:</strong> ${name || 'Unbekannt'} &lt;${email}&gt;</p><hr/><p>${message.replace(/\n/g,'<br/>')}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Mail gesendet:', info.messageId);
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Mailfehler:', err.message || err); 
    res.status(500).json({ error: 'Fehler beim Versenden der Mail.' });
  }
});

// ----------------------------------------------------------------
// ✅ START DER ANWENDUNG
// ----------------------------------------------------------------
const port = process.env.PORT || 10000; 
app.listen(port, '0.0.0.0', () => { 
  console.log(`Server läuft auf Host 0.0.0.0 und Port ${port}`);
});

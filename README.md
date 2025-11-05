# Kontaktformular + IMAP Beispielprojekt

Dieses Projekt enthält:
- Ein einfaches Kontaktformular (public/index.html) das E-Mails per SMTP versendet.
- Ein kleines Admin-Interface (public/admin.html), das die letzten Nachrichten über IMAP listet.
- server.js: Backend mit /send und /messages Endpunkten.
- .env.example mit allen notwendigen Einstellungen.

## Schnellstart (lokal, kostenlos)
1. Node.js (>=16) installieren.
2. Dateien entpacken.
3. `npm install`
4. `.env` erstellen (kopiere `.env.example` und fülle die Werte aus).
   - Wenn du ein Google Mail Konto nutzt: benutze ein App-Passwort und aktiviere IMAP.
5. `npm run dev` oder `npm start`
6. Browser: `http://localhost:3000` -> Kontaktformular
   Admin: `http://localhost:3000/admin.html` (Token eingeben, wie in .env)

## Kostenfrei testen mit deiner Domain
- Du hast bereits eine Domain: Du kannst gratis einen SMTP/IMAP-Dienst deines E-Mail-Providers nutzen (z.B. E-Mail bei deinem Domain-Hoster).
- Für Tests kannst du auch kostenlose SMTP-Relay-Services im Testmodus verwenden (z.B. SendGrid free tier) — beachte Einschränkungen.
- Für reelle Produktion musst du SPF/DKIM/DMARC in den DNS-Einträgen setzen.

## Sicherheitshinweise
- Verwende niemals echte Produktions-Zugangsdaten in öffentlichen Repositories.
- Nutze Umgebungsvariablen (wie hier gezeigt).
- Für Produktivbetrieb: sichere Authentifizierung, HTTPS, Rate-Limiting, Captcha.

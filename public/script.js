// script.js - simple interactions + contact form submission
document.addEventListener('DOMContentLoaded', () => {
  // set copyright year
  const y = new Date().getFullYear();
  document.getElementById('year').textContent = y;

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length > 1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
});

// contact form logic
const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const responseText = document.getElementById('response');
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value
    };

    // Sending state
    responseText.textContent = "Sende Nachricht...";
    responseText.style.color = "#A24C78"; // magenta

    try {
      const res = await fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result && result.ok) {
        responseText.textContent = "✅ Nachricht erfolgreich gesendet!";
        responseText.style.color = "#D6C26A"; // gold
        form.reset();
      } else {
        responseText.textContent = "❌ Fehler beim Senden.";
        responseText.style.color = "#A24C78"; // magenta
      }
    } catch (err) {
      responseText.textContent = "⚠️ Netzwerk- oder Serverfehler.";
      responseText.style.color = "#A24C78"; // magenta
      console.error('Kontakt-Fehler:', err);
    }
  });
}

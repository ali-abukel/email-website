document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const responseText = document.getElementById("response");

  const data = {
    name: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value
  };

  // Status: Sende Nachricht
  responseText.textContent = "Sende Nachricht...";
  responseText.style.color = "#ffff66"; // helles Gelb für Sichtbarkeit

  try {
    const res = await fetch("/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.ok) {
      responseText.textContent = "✅ Nachricht erfolgreich gesendet!";
      responseText.style.color = "#00ff88"; // Neon-Grün passend zum Design
      form.reset();
    } else {
      responseText.textContent = "❌ Fehler beim Senden.";
      responseText.style.color = "#ff4d4d"; // Rot für Fehler
    }
  } catch (err) {
    responseText.textContent = "⚠️ Netzwerk- oder Serverfehler.";
    responseText.style.color = "#ffa500"; // Orange für Serverfehler
  }
});

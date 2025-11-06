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

  responseText.textContent = "Sende Nachricht...";
  responseText.style.color = "#31403d";

  try {
    const res = await fetch("/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.ok) {
      responseText.textContent = "✅ Nachricht erfolgreich gesendet!";
      responseText.style.color = "#31403d";
      form.reset();
    } else {
      responseText.textContent = "❌ Fehler beim Senden.";
      responseText.style.color = "#31403d";
    }
  } catch (err) {
    responseText.textContent = "⚠️ Netzwerk- oder Serverfehler.";
    responseText.style.color = "#31403d";
  }
});

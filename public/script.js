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
  responseText.style.color = "#ccc";

  try {
    const res = await fetch("/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.ok) {
      responseText.textContent = "✅ Nachricht erfolgreich gesendet!";
      responseText.style.color = "#4cff4c";
      form.reset();
    } else {
      responseText.textContent = "❌ Fehler beim Senden.";
      responseText.style.color = "#004c00";
    }
  } catch (err) {
    responseText.textContent = "⚠️ Netzwerk- oder Serverfehler.";
    responseText.style.color = "#004c00";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const button = document.createElement("button");
  button.className = "chat-button";
  button.innerHTML = '<img src="icono_chat_dannza.png" alt="Abrir chat">';
  document.body.appendChild(button);

  const chatbox = document.createElement("div");
  chatbox.className = "chatbox";
  chatbox.id = "chatbox";
  chatbox.innerHTML = `
    <div class="chatbox-header">Asistente Dannza Bella</div>
    <div class="chatbox-messages" id="messages">
      <div class="message bot-message">¡Hola! Bienvenida/o a Dannza Bella.</div>
      <div class="message bot-message">¿En qué puedo ayudarte hoy?</div>
    </div>
    <div class="chatbox-input">
      <input type="text" id="userInput" placeholder="Escribe tu consulta…" onkeypress="if(event.key==='Enter') sendMessage()">
      <button onclick="sendMessage()">➤</button>
    </div>
  `;
  document.body.appendChild(chatbox);

  button.addEventListener("click", () => {
    chatbox.style.display = chatbox.style.display === "flex" ? "none" : "flex";
  });

  window.sendMessage = async function () {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    const messages = document.getElementById("messages");
    const userMsg = document.createElement("div");
    userMsg.className = "message user-message";
    userMsg.textContent = text;
    messages.appendChild(userMsg);

    const typing = document.createElement("div");
    typing.className = "typing";
    typing.textContent = "Escribiendo...";
    messages.appendChild(typing);
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await fetch("https://curso2025ov.app.n8n.cloud/webhook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatInput: text, sessionId: "cliente-web" })
      });

      const data = await res.json();
      typing.remove();

      const botMsg = document.createElement("div");
      botMsg.className = "message bot-message";
      botMsg.textContent = data.message || "Gracias por tu consulta.";
      messages.appendChild(botMsg);
      messages.scrollTop = messages.scrollHeight;
    } catch (err) {
      typing.remove();
      const errMsg = document.createElement("div");
      errMsg.className = "message bot-message";
      errMsg.textContent = "Hubo un error. Intenta de nuevo.";
      messages.appendChild(errMsg);
    }
  };

  const style = document.createElement("style");
  style.innerHTML = `
    :root {
      --primary: #6b21a8;
      --secondary: #4c1d95;
      --light-bg: #f3e8ff;
      --light-input: #ede9fe;
      --dark-bg: #2e2b35;
      --dark-secondary: #3f3a4d;
      --text-light: #ffffff;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: var(--dark-bg);
        color: var(--text-light);
      }
    }

    .chat-button {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background-color: var(--primary);
      border: none;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }

    .chat-button img {
      width: 28px;
      height: 28px;
      margin: 14px;
    }

    .chatbox {
      position: fixed;
      bottom: 5rem;
      right: 1rem;
      width: 360px;
      height: 480px;
      display: none;
      flex-direction: column;
      border-radius: 1rem;
      overflow: hidden;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      background-color: var(--light-bg);
    }

    @media (prefers-color-scheme: dark) {
      .chatbox {
        background-color: var(--dark-secondary);
      }
    }

    .chatbox-header {
      background-color: var(--light-input);
      padding: 1rem;
      font-weight: bold;
      text-align: center;
      color: var(--secondary);
    }

    .chatbox-messages {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem;
    }

    .message {
      max-width: 75%;
      margin: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.95rem;
    }

    .bot-message {
      background-color: var(--secondary);
      color: white;
      align-self: flex-start;
      text-align: left;
    }

    .user-message {
      background-color: var(--primary);
      color: white;
      align-self: flex-end;
      text-align: right;
    }

    .typing {
      font-size: 0.85rem;
      color: gray;
      margin-left: 0.75rem;
    }

    .chatbox-input {
      display: flex;
      background-color: var(--light-input);
      padding: 0.5rem;
      gap: 0.5rem;
    }

    .chatbox-input input {
      flex: 1;
      padding: 0.5rem;
      border-radius: 1rem;
      border: none;
      font-size: 1rem;
      color: var(--secondary);
    }

    .chatbox-input button {
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 9999px;
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1rem;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
});

document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const stopBtn = document.getElementById('stop');

  let conversationMemory = [
    {
      role: "system",
      content: "Tu es MerdiVersa, IA bienveillante et enthousiaste, créée par Merdi Madimba à Kinshasa. Tu réponds toujours de manière claire, naturelle et compréhensible, avec emojis et explications détaillées. Tu peux utiliser des listes, sauts de ligne et emojis. Toutes les formules mathématiques ou scientifiques doivent être en LaTeX et bien rendues graphiquement."
    }
  ];

  let stopTyping = false;

  function appendMessage(text, who = 'ai') {
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'user' ? 'user' : 'ai');
    div.innerHTML = text; // utiliser innerHTML pour pouvoir injecter MathJax
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  async function typeWriter(element, text, speed = 15) {
    element.textContent = '';
    stopTyping = false;
    let i = 0;
    while (i < text.length && !stopTyping) {
      element.textContent += text[i++];
      messagesEl.scrollTop = messagesEl.scrollHeight;
      await new Promise(r => setTimeout(r, speed));
    }
    if (stopTyping && i < text.length) {
      element.textContent += text.slice(i);
    }
    // Après avoir fini d’écrire, on convertit le texte LaTeX en rendu MathJax
    MathJax.typesetPromise([element]);
  }

  async function getAIResponse(prompt) {
    const memoryText = conversationMemory.map(m =>
      `${m.role === 'user' ? 'Utilisateur' : 'IA'}: ${m.content}`
    ).join("\n");
    const fullPrompt = memoryText + "\nUtilisateur: " + prompt;

    try {
      const res = await fetch(`https://api-library-kohi.onrender.com/api/amd-gpt?prompt=${encodeURIComponent(fullPrompt)}&user=221212`);
      const data = await res.json();
      return data?.data || "Désolé, je n'ai pas pu répondre.";
    } catch (err) {
      console.error(err);
      return "⚠️ Une erreur est survenue lors de la récupération de la réponse.";
    }
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    conversationMemory.push({ role: 'user', content: text });
    inputEl.value = '';

    const aiBubble = appendMessage("...", 'ai');
    const loader = document.createElement('div');
    loader.className = 'loader';
    aiBubble.appendChild(loader);

    const response = await getAIResponse(text);

    aiBubble.removeChild(loader);
    await typeWriter(aiBubble, response, 15);
    conversationMemory.push({ role: 'ai', content: response });
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  stopBtn.addEventListener('click', () => {
    stopTyping = true;
  });
});

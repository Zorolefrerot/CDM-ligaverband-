document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const stopBtn = document.getElementById('stop');

  let conversationMemory = [
    {
      role: "system",
      content: "Tu es MerdiVersa, IA bienveillante et enthousiaste, créée par Merdi Madimba à Kinshasa. Tu réponds toujours de manière claire, naturelle et compréhensible, avec emojis et explications détaillées. Ne jamais envoyer de code, balises ou caractères techniques sauf si l'utilisateur te demande. Tu peux utiliser des listes simples, tirets, sauts de ligne et emojis. Réponds comme une vraie conversation humaine."
    }
  ];

  let stopTyping = false;

  function appendMessage(text, who = 'ai') {
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'user' ? 'user' : 'ai');
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  // Fonction pour détecter automatiquement les expressions mathématiques et les transformer en LaTeX
  function renderMath(text) {
    if (!text) return '';
    
    // On échappe d'abord HTML pour éviter injection
    text = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Détection des nombres et opérateurs communs et conversion LaTeX
    text = text
      .replace(/(\d+)\s*×\s*(\d+)/g, '$1 \\times $2')
      .replace(/(\d+)\s*÷\s*(\d+)/g, '$1 \\div $2')
      .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}')
      .replace(/\^/g, '^')
      .replace(/≈/g, '\\approx ')
      .replace(/π/g, '\\pi ')
      .replace(/([0-9]+)\/([0-9]+)/g, '\\frac{$1}{$2}');

    // Encapsule tout le texte dans du math mode $$...$$ si il contient des formules
    if (/\\/.test(text)) {
      text = '$$' + text + '$$';
    }
    
    return text;
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
  }

  async function getAIResponse(prompt) {
    const memoryText = conversationMemory.map(m => `${m.role === 'user' ? 'Utilisateur' : 'IA'}: ${m.content}`).join("\n");
    const fullPrompt = memoryText + "\nUtilisateur: " + prompt;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });
      const data = await res.json();
      return data?.result || "Désolé, je n'ai pas pu répondre.";
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

    // Convertit les formules mathématiques en rendu LaTeX
    aiBubble.innerHTML = renderMath(response);
    MathJax.typesetPromise([aiBubble]);

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

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir directement chat.html depuis ce dossier
app.use(express.static(__dirname));

// API locale → API distante
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const response = await axios.post(
      "https://api-library-kohi.onrender.com/api/amd-gpt",
      { prompt, user: "221212" },
      { headers: { "Content-Type": "application/json" } }
    );

    res.json({ result: response.data.data });
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ result: "Erreur API distante" });
  }
});

// Fallback → ouvre chat.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.listen(PORT, () =>
  console.log(`🔥 MerdiVersa backend démarré : http://localhost:${PORT}`)
);

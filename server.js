require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:8080'] }));
app.use(express.json());

// Endpoint pour AryChauhan API
app.post('/api/ary', async (req, res) => {
  const { prompt } = req.body;
  if(!prompt) return res.status(400).json({error:'prompt required'});
  try{
    const response = await axios.post('https://arychauhann.onrender.com/api/gemini-proxy2', {
      prompt
    }, {
      headers: { 'Authorization': `Bearer ${process.env.ARYCHA_API_KEY}` }
    });
    res.json(response.data);
  }catch(err){
    console.error(err.message);
    res.status(500).json({error:'AryChauhan API failed'});
  }
});

// Endpoint pour ShizuAPI
app.get('/api/shizu', async (req,res)=>{
  const prompt = req.query.prompt;
  if(!prompt) return res.status(400).json({error:'prompt required'});
  try{
    const response = await axios.get(`https://shizuapi.onrender.com/api/galichat?prompt=${encodeURIComponent(prompt)}`,{
      headers: { 'Authorization': `Bearer ${process.env.SHIZU_API_KEY}` }
    });
    res.json(response.data);
  }catch(err){
    console.error(err.message);
    res.status(500).json({error:'ShizuAPI failed'});
  }
});

app.listen(PORT, ()=>console.log(`Proxy server listening on port ${PORT}`));

<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MerdiVersa Lyrics</title>
<link rel="icon" href="https://i.imgur.com/tsSALyQ.jpeg" type="image/png">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#0c0f1f;
  --card:rgba(255,255,255,0.05);
  --accent1:#6b8eff;
  --accent2:#ff6b6b;
  --muted:rgba(255,255,255,0.65);
  --text:#eaf0ff;
}
body{font-family:'Inter',sans-serif;background:radial-gradient(1200px 600px at 10% 10%, rgba(107,142,255,0.06), transparent),radial-gradient(1000px 500px at 90% 90%, rgba(255,107,107,0.05), transparent),var(--bg);color:var(--text);margin:0;padding:0;}
.container{max-width:900px;margin:0 auto;padding:32px;}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;}
.logo{display:flex;align-items:center;gap:12px;}
.logo img{width:52px;height:52px;border-radius:12px;}
.btn{padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.05);background:transparent;color:var(--muted);font-weight:600;cursor:pointer;transition:0.3s;}
.btn:hover{background:rgba(255,255,255,0.05);}
.btn.primary{background:linear-gradient(90deg,var(--accent1),var(--accent2));border:none;color:white;}
.lyrics-card{background:var(--card);padding:20px;border-radius:16px;margin-top:20px;box-shadow:0 4px 15px rgba(0,0,0,0.3);}
.lyrics-card img{max-width:150px;border-radius:12px;margin-bottom:12px;}
textarea{width:100%;padding:10px;border-radius:8px;border:none;margin-bottom:12px;background:rgba(255,255,255,0.05);color:var(--text);}
.lyrics-output{white-space:pre-wrap;font-size:14px;color:var(--text);margin-top:12px;min-height:100px;}
.footer{margin-top:32px;text-align:center;font-size:13px;color:var(--muted);}
</style>
</head>
<body>
<div class="container">
<header>
  <div class="logo">
    <img src="https://i.imgur.com/tsSALyQ.jpeg" alt="MerdiVersa Logo">
    <h1>MerdiVersa Lyrics</h1>
  </div>
</header>

<div class="lyrics-card">
  <h3>Rechercher les paroles d'une chanson</h3>
  <textarea id="songName" placeholder="Tapez le nom de la chanson ici..."></textarea>
  <button class="btn primary" id="searchBtn">Chercher les paroles</button>
  <div class="lyrics-output" id="lyricsOutput"></div>
</div>

<div class="footer">© 2025 MerdiVersa — Créé par Merdi Madimba</div>
</div>

<script>
const searchBtn = document.getElementById('searchBtn');
const lyricsOutput = document.getElementById('lyricsOutput');

function typeLyrics(text, speed = 30) {
  lyricsOutput.innerHTML = "";
  let i = 0;
  const interval = setInterval(() => {
    lyricsOutput.innerHTML += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
    lyricsOutput.scrollTop = lyricsOutput.scrollHeight; // scroll automatique
  }, speed);
}

searchBtn.addEventListener('click', async () => {
  const song = document.getElementById('songName').value.trim();
  if(!song) return alert("Veuillez entrer un nom de chanson !");
  
  lyricsOutput.innerHTML = "🔄 Recherche des paroles...";
  
  try {
    const res = await fetch(`https://lyricstx.vercel.app/youtube/lyrics?title=${encodeURIComponent(song)}`);
    const data = await res.json();

    if(!data?.lyrics) {
      lyricsOutput.innerHTML = "❌ Paroles introuvables.";
      return;
    }

    const fullText = `🎵 ${data.track_name} - ${data.artist_name}\n\n${data.lyrics}`;
    typeLyrics(fullText, 20); // 20ms par caractère, ajustable
  } catch(err) {
    console.error(err);
    lyricsOutput.innerHTML = "❌ Une erreur est survenue. Veuillez réessayer plus tard.";
  }
});
</script>
</body>
</html>

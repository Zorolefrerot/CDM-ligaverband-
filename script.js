document.addEventListener("DOMContentLoaded", () => {
  const verseBtn = document.getElementById("verse-btn");
  const verseList = document.getElementById("verse-list");

  verseBtn.addEventListener("click", () => {
    verseList.classList.toggle("hidden");
  });
});


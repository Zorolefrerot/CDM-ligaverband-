document.addEventListener("DOMContentLoaded", () => {
  const villesParPays = {
    "RDC": ["Kinshasa", "Lubumbashi", "Matadi", "Autres"],
    "Benin": ["Cotonou", "Porto-Novo", "Parakou", "Autres"],
    "CIV": ["Abidjan", "Bouaké", "Yamoussoukro", "Autres"],
    "Burkina": ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Autres"],
    "Cameroun": ["Douala", "Yaoundé", "Garoua", "Autres"],
    "Togo": ["Lomé", "Sokodé", "Kara", "Autres"],
    "RCA": ["Bangui", "Bimbo", "Berbérati", "Autres"],
    "Senegal": ["Dakar", "Thiès", "Saint-Louis", "Autres"],
    "Gabon": ["Libreville", "Port-Gentil", "Franceville", "Autres"],
    "Guinee": ["Conakry", "Nzérékoré", "Kankan", "Autres"]
  };

  const paysSelect = document.getElementById("pays");
  const villeSelect = document.getElementById("ville");
  const form = document.getElementById("inscription-form");

  function resetVillePlaceholder() {
    villeSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "-- Sélectionnez une ville --";
    villeSelect.appendChild(placeholder);
    villeSelect.value = "";
    villeSelect.disabled = true;
  }

  // initial
  resetVillePlaceholder();

  paysSelect.addEventListener("change", () => {
    const pays = paysSelect.value;

    // clear any previous validation messages
    paysSelect.setCustomValidity("");
    villeSelect.setCustomValidity("");

    // reset ville
    resetVillePlaceholder();

    if (pays && villesParPays[pays]) {
      villesParPays[pays].forEach((ville) => {
        const option = document.createElement("option");
        option.value = ville;
        option.textContent = ville;
        villeSelect.appendChild(option);
      });
      villeSelect.disabled = false;
      // ensure placeholder selected
      villeSelect.value = "";
    } else {
      // aucun pays choisi ou non géré
      resetVillePlaceholder();
    }
  });

  // quand on choisit une ville, on enlève les messages d'erreur potentiels du pays
  villeSelect.addEventListener("change", () => {
    if (paysSelect.value) paysSelect.setCustomValidity("");
  });

  // validation simple au submit pour éviter messages incohérents sur mobile
  form.addEventListener("submit", (e) => {
    // utilisation de la validation HTML5 mais on vérifie aussi explicitement pays/ville
    if (!paysSelect.value) {
      e.preventDefault();
      paysSelect.reportValidity();
      paysSelect.focus();
      return;
    }
    if (!villeSelect.value) {
      e.preventDefault();
      villeSelect.reportValidity();
      villeSelect.focus();
      return;
    }

    // Si tu veux envoyer vers Supabase / API, tu peux empêcher le submit et faire fetch ici.
    // Ex : e.preventDefault(); fetch(...).then(...)
    // Pour l'instant on laisse le comportement par défaut (ou tu ajoutes ton code d'envoi).
  });
});

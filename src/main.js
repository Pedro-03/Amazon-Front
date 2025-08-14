const form = document.getElementById("search-form");
const input = document.getElementById("keyword");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

function card({ title, image, rating, reviews }) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <img alt="" loading="lazy" src="${image || ""}"/>
    <div class="meta">
      <h3 title="${title || ""}">${title || "—"}</h3>
      <p>⭐ ${rating ?? "—"} · ${
        Number.isFinite(reviews) ? reviews.toLocaleString() : "—"
      } reviews</p>
    </div>
  `;
  return el;
}

async function run(keyword) {
  statusEl.textContent = "Buscando…";
  resultsEl.innerHTML = "";

  try {
    const url = `/api/scrape?keyword=${encodeURIComponent(keyword)}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data?.error || `Erro HTTP ${resp.status}`);
    }

    statusEl.textContent = `Resultados para "${data.keyword}" — ${data.results.length} itens`;
    data.results.forEach((p) => resultsEl.appendChild(card(p)));
  } catch (e) {
    statusEl.textContent = `Falha: ${e.message || e}`;
  }
}

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const kw = input.value.trim();
  if (!kw) {
    statusEl.textContent = "Informe uma palavra-chave.";
    return;
  }
  run(kw);
});

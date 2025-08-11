const form = document.getElementById("search-form");
const input = document.getElementById("keyword");
const button = document.getElementById("scrapeBtn");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

// Util: formata preço com base em currency quando possível
function formatPrice(price, currency, priceRaw) {
  if (typeof price === "number" && Number.isFinite(price)) {
    try {
      if (currency) {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(price);
      }
      // fallback sem currency
      return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    } catch {
      // se currency for inválida, cai no raw
    }
  }
  return priceRaw ?? null;
}

// Util: normaliza rating vindo como texto ("4.5 out of 5 stars") ou número
function normalizeRating(r) {
  if (r == null) return null;
  if (typeof r === "number") return r;
  const m = String(r).match(/([\d.,]+)/);
  if (!m) return null;
  return parseFloat(m[1].replace(",", "."));
}

// Limpa e mostra mensagens de status
function setStatus(msg, isError = false) {
  statusEl.textContent = msg || "";
  statusEl.style.color = isError ? "#ff9b9b" : "#aeb6c2";
}

// Renderiza cards
function renderResults(items) {
  resultsEl.innerHTML = "";
  if (!items || items.length === 0) {
    resultsEl.innerHTML = `<div class="status">Nenhum resultado encontrado.</div>`;
    return;
  }

  for (const item of items) {
    const title = item.title ?? "Sem título";
    const image = item.image ?? "";
    const url   = item.link ?? null;

    const rating = item.rating != null ? `⭐ ${item.rating} / 5` : "";
    const reviews = item.reviews != null ? `🗳 ${item.reviews}` : "";

    // preço formatado
    const priceText = item.price != null
      ? (item.currency
          ? new Intl.NumberFormat(undefined, { style: "currency", currency: item.currency }).format(item.price)
          : new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.price)
        )
      : (item.priceRaw ?? "");

    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.alt = "Product image";
    if (image) img.src = image;

    const body = document.createElement("div");

    const h3 = document.createElement("h3");
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = title;
      h3.appendChild(a);
    } else {
      h3.textContent = title;
    }

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `
      ${rating ? `<span>${rating}</span>` : ""}
      ${reviews ? `<span>${reviews}</span>` : ""}
    `;

    const priceEl = document.createElement("div");
    priceEl.className = "price";
    priceEl.textContent = priceText || "";

    body.appendChild(h3);
    body.appendChild(meta);
    if (priceText) body.appendChild(priceEl);

    card.appendChild(img);
    card.appendChild(body);
    resultsEl.appendChild(card);
  }
}

// Submissão do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const keyword = input.value.trim();
  if (!keyword) {
    setStatus("Digite uma palavra-chave para pesquisar.", true);
    return;
  }

  setStatus("Carregando…");
  button.disabled = true;
  resultsEl.innerHTML = "";

  try {
    // Graças ao proxy do Vite, isso irá para http://localhost:3000/api/...
    const resp = await fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Erro ${resp.status} – ${text || resp.statusText}`);
    }

    const data = await resp.json();

    if (data.error) {
      setStatus(data.error, true);
      return;
    }

    setStatus("");
    renderResults(data.results || data || []);
  } catch (err) {
    setStatus(`Falha ao buscar: ${err.message}`, true);
  } finally {
    button.disabled = false;
  }
});

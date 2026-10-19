"use strict";

function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  const input = String(text).replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
      row = []; cell = ""; if (char === "\r" && input[i + 1] === "\n") i += 1;
    } else cell += char;
  }
  if (quoted) throw new Error("The retailer CSV contains an unclosed quoted field.");
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift();
  if (["Division", "Province", "CityTownVillage", "Store Name", "Phone"].some((key) => !headers.includes(key))) throw new Error("The retailer CSV headers are incomplete.");
  return rows.map((values) => Object.fromEntries(headers.map((key, i) => [key, values[i] || ""])))
    .map((entry) => ({ division: entry.Division, province: entry.Province, town: entry.CityTownVillage, name: entry["Store Name"], phone: entry.Phone }))
    .filter((store) => store.division && store.province && store.town && store.name);
}
function filterStores(stores, filters = {}) {
  const query = (filters.query || "").trim().toLocaleLowerCase();
  return stores.filter((store) => (!filters.division || store.division === filters.division)
    && (!filters.province || store.province === filters.province) && (!filters.town || store.town === filters.town)
    && (!query || [store.name, store.town, store.province, store.division].join(" ").toLocaleLowerCase().includes(query)));
}
function uniqueValues(stores, key) { return [...new Set(stores.map((store) => store[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b)); }
function telephoneLink(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 7) return `tel:+679${digits}`;
  if (digits.length === 10 && digits.startsWith("679")) return `tel:+${digits}`;
  return null;
}
function initializeSite() {
  document.getElementById("year").textContent = new Date().getFullYear();
  const menuToggle = document.getElementById("menuToggle"), mobileNav = document.getElementById("mobileNav");
  function closeMenu() { mobileNav.hidden = true; menuToggle.setAttribute("aria-expanded", "false"); }
  menuToggle.addEventListener("click", () => { mobileNav.hidden = !mobileNav.hidden; menuToggle.setAttribute("aria-expanded", String(!mobileNav.hidden)); });
  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); } });
  window.matchMedia("(min-width: 851px)").addEventListener("change", (event) => { if (event.matches) closeMenu(); });
  const gallery = document.getElementById("harvestGallery"), previous = document.getElementById("galleryPrev"), next = document.getElementById("galleryNext"), position = document.getElementById("galleryPosition");
  const figures = Array.from(gallery.querySelectorAll("figure"));
  function updateGallery() {
    const left = Math.max(0, gallery.scrollLeft), cardWidth = figures[0].getBoundingClientRect().width, gap = parseFloat(window.getComputedStyle(gallery).gap) || 0;
    const index = Math.min(figures.length - 1, Math.round(left / (cardWidth + gap)));
    const visibleEnd = Math.min(figures.length, Math.floor((left + gallery.clientWidth + gap + 2) / (cardWidth + gap)));
    position.textContent = `${String(index + 1).padStart(2, "0")}–${String(Math.max(index + 1, visibleEnd)).padStart(2, "0")} / ${figures.length}`;
    previous.disabled = left <= 2; next.disabled = left + gallery.clientWidth >= gallery.scrollWidth - 2;
  }
  function moveGallery(direction) {
    const step = figures[0].getBoundingClientRect().width + (parseFloat(window.getComputedStyle(gallery).gap) || 0);
    gallery.scrollBy({ left: direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  previous.addEventListener("click", () => moveGallery(-1)); next.addEventListener("click", () => moveGallery(1));
  gallery.addEventListener("keydown", (event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); moveGallery(event.key === "ArrowRight" ? 1 : -1); } });
  gallery.addEventListener("scroll", updateGallery, { passive: true }); window.addEventListener("resize", updateGallery); updateGallery();
  const division = document.getElementById("divisionSelect"), province = document.getElementById("provinceSelect"), town = document.getElementById("townSelect");
  const search = document.getElementById("storeSearch"), reset = document.getElementById("resetStores"), results = document.getElementById("storeResults"), summary = document.getElementById("storeSummary"), loadMore = document.getElementById("loadMore");
  const showAll = document.getElementById("showAllStores");
  let stores = [], limit = 6, browseAll = false;
  function fillSelect(select, items, placeholder) {
    select.replaceChildren(); const option = document.createElement("option"); option.value = ""; option.textContent = placeholder; select.append(option);
    items.forEach((value) => { const item = document.createElement("option"); item.value = value; item.textContent = value; select.append(item); });
  }
  function renderStores() {
    results.replaceChildren();
    const active = browseAll || division.value || province.value || town.value || search.value.trim();
    showAll.hidden = !!active;
    if (!active) {
      summary.textContent = `${stores.length} stockists listed across Fiji. Enter your town to find stores in your area.`;
      loadMore.hidden = true;
      return;
    }
    const matches = filterStores(stores, { division: division.value, province: province.value, town: town.value, query: search.value });
    summary.textContent = `${matches.length} ${matches.length === 1 ? "retailer" : "retailers"} found${matches.length > limit ? ` · showing ${limit}` : ""}. Call ahead to confirm stock.`;
    results.replaceChildren();
    if (!matches.length) { const empty = document.createElement("p"); empty.className = "store-empty"; empty.textContent = "No stores match this search. Try another town or reset the filters."; results.append(empty); }
    matches.slice(0, limit).forEach((store) => {
      const card = document.createElement("article"); card.className = "store-card";
      const details = document.createElement("div"), title = document.createElement("h4"), location = document.createElement("p");
      title.textContent = store.name; location.textContent = `${store.town} · ${store.province} · ${store.division}`; details.append(title, location); card.append(details);
      const href = telephoneLink(store.phone);
      if (href) { const call = document.createElement("a"); call.className = "phone"; call.href = href; call.textContent = `Call ${store.phone} ↗`; call.setAttribute("aria-label", `Call ${store.name} on ${store.phone}`); card.append(call); }
      results.append(card);
    }); loadMore.hidden = matches.length <= limit;
  }
  function divisionChanged() {
    const subset = filterStores(stores, { division: division.value }); fillSelect(province, uniqueValues(subset, "province"), "All provinces"); province.disabled = !division.value;
    fillSelect(town, [], "All towns / villages"); town.disabled = true; limit = 6; renderStores();
  }
  division.addEventListener("change", divisionChanged);
  province.addEventListener("change", () => { fillSelect(town, uniqueValues(filterStores(stores, { division: division.value, province: province.value }), "town"), "All towns / villages"); town.disabled = !province.value; limit = 6; renderStores(); });
  town.addEventListener("change", () => { limit = 6; renderStores(); }); search.addEventListener("input", () => { browseAll = false; limit = 6; renderStores(); });
  reset.addEventListener("click", () => { browseAll = false; division.value = ""; search.value = ""; divisionChanged(); search.focus(); });
  showAll.addEventListener("click", () => { browseAll = true; limit = 6; renderStores(); });
  loadMore.addEventListener("click", () => { const previousCount = results.children.length; limit += 6; renderStores(); results.children[previousCount]?.querySelector("a")?.focus({ preventScroll: true }); });
  fetch("./retailers.csv").then((response) => { if (!response.ok) throw new Error("Retailer directory could not be loaded."); return response.text(); })
    .then((csv) => { stores = parseCSV(csv); if (!stores.length) throw new Error("Retailer directory is empty."); fillSelect(division, uniqueValues(stores, "division"), "All divisions"); division.disabled = false; search.disabled = false; reset.disabled = false; showAll.disabled = false; renderStores(); })
    .catch(() => { summary.textContent = "The store finder could not load. Please refresh the page and try again."; const message = document.createElement("p"); message.className = "locator-error"; message.append("You can also "); const download = document.createElement("a"); download.href = "./retailers.csv"; download.download = "OrganicPlus-retailers.csv"; download.textContent = "download the retailer directory"; message.append(download, " to look up a store."); results.replaceChildren(message); });
}
if (typeof module !== "undefined" && module.exports) module.exports = { parseCSV, filterStores, uniqueValues, telephoneLink };
if (typeof document !== "undefined") initializeSite();

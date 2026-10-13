// Search page
(async function () {
  const data = await window.GuideMe.data;
  const input = document.querySelector("[data-search-input]");
  const chips = document.querySelector("[data-search-chips]");
  const results = document.querySelector("[data-search-results]");
  const summary = document.querySelector("[data-search-summary]");

  const types = ["All", "Lecture Room", "Laboratory", "Office", "Facility"];
  let currentType = "All";

  chips.innerHTML = types.map((t) => `<button class="chip${t === 'All' ? ' active' : ''}" data-type="${t}">${t}</button>`).join("");
  chips.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      currentType = b.dataset.type;
      chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.type === currentType));
      render();
    });
  });

  function render() {
    const q = input.value;
    const items = window.GuideMe.search.searchRooms(data.rooms, q, currentType);
    summary.textContent = `${items.length} result${items.length === 1 ? "" : "s"}${q ? ` for "${q}"` : ""}${currentType !== "All" ? ` · ${currentType}` : ""}`;
    if (!items.length) {
      results.innerHTML = `<div class="empty">No matching rooms. Try a room number like <strong>213</strong> or a keyword like <strong>lab</strong>.</div>`;
      return;
    }
    results.innerHTML = items.map((r) => `
      <div class="result-card">
        <div class="rid-big">${r.id}</div>
        <div class="meta" style="flex:1;min-width:0;">
          <h4>${r.name}</h4>
          <div class="sub">Building ${r.building} · Floor ${r.floor} · Room ${r.room}</div>
          <div class="row" style="margin-top:8px;">
            <span class="badge">${r.type}</span>
            <span class="badge badge-ink">${r.department}</span>
            ${r.capacity ? `<span class="badge">Cap. ${r.capacity}</span>` : ""}
          </div>
        </div>
        <div class="actions">
          <a class="btn btn-ghost btn-sm" href="room.html?r=${r.id}">View details</a>
          <a class="btn btn-accent btn-sm" href="directions.html?to=${r.id}">Get directions</a>
        </div>
      </div>
    `).join("");
  }

  const initialQ = window.GuideMe.qs("q") || "";
  input.value = initialQ;
  input.addEventListener("input", render);
  const form = document.querySelector("[data-search-form]");
  form.addEventListener("submit", (e) => { e.preventDefault(); render(); });
  render();
  input.focus();
})();

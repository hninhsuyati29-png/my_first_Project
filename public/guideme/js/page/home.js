// Home page: hero search + building cards + popular locations
(async function () {
  const data = await window.GuideMe.data;

  const grid = document.querySelector("[data-buildings-grid]");
  if (grid) {
    grid.innerHTML = data.buildings.map((b) => `
      <a class="building-card" href="building.html?b=${b.id}">
        <div class="icon">B${b.id}</div>
        <h3>${b.name.split(' — ')[0]}</h3>
        <p>${b.description}</p>
        <div class="row" style="margin-top:12px;">
          <span class="badge">${b.floors} floors</span>
          <span class="badge badge-ink">${(b.name.split(' — ')[1] || '')}</span>
        </div>
      </a>
    `).join("");
  }

  const popularIds = ["312", "111", "411", "412"]; // Library, Programming Lab 1, Reception, Admissions
  const popularGrid = document.querySelector("[data-popular-grid]");
  if (popularGrid) {
    popularGrid.innerHTML = popularIds.map((id) => {
      const r = data.roomsById[id];
      if (!r) return "";
      return `
        <a class="tile" href="room.html?r=${r.id}">
          <span class="dot">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-12a8 8 0 1 1 16 0c0 7.5-8 12-8 12z"/><circle cx="12" cy="10" r="3"/></svg>
          </span>
          <span class="meta">
            <strong>${r.name}</strong>
            <span>Building ${r.building} · Floor ${r.floor} · Room ${r.id}</span>
          </span>
        </a>
      `;
    }).join("");
  }

  // Wire hero search
  const form = document.querySelector("[data-hero-search]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = form.querySelector("input").value.trim();
      location.href = "search.html" + (q ? `?q=${encodeURIComponent(q)}` : "");
    });
  }
})();

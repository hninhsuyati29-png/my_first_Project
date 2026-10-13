// Room detail page
(async function () {
  const data = await window.GuideMe.data;
  const id = window.GuideMe.qs("r");
  const room = id && data.roomsById[id];
  const root = document.querySelector("[data-room-root]");

  if (!room) {
    root.innerHTML = `
      <div class="container section">
        <div class="empty">
          <h2 style="margin-top:0;">Room not found</h2>
          <p>We couldn't find a room with that number. Try the search page.</p>
          <a class="btn btn-primary" href="search.html">Go to search</a>
        </div>
      </div>
    `;
    return;
  }

  document.title = `Room ${room.id} — ${room.name} · UIT GuideMe`;

  const nearby = (room.nearby || []).map((rid) => data.roomsById[rid]).filter(Boolean);

  root.innerHTML = `
    <div class="page-head">
      <div class="container">
        <div class="crumbs">
          <a href="index.html">Home</a> · <a href="building.html?b=${room.building}&f=${room.floor}">Building ${room.building}</a> · <span>Room ${room.id}</span>
        </div>
        <div class="room-hero">
          <div class="rid">${room.id}</div>
          <div style="flex:1;min-width:0;">
            <h1>${room.name}</h1>
            <p>${room.department} · ${room.type}${room.capacity ? ` · Capacity ${room.capacity}` : ""}</p>
            <div class="row" style="margin-top:14px;">
              <a class="btn btn-accent" href="directions.html?to=${room.id}">Get Directions</a>
              <a class="btn btn-ghost" href="building.html?b=${room.building}&f=${room.floor}">View floor map</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container section">
      <div class="split">
        <div class="stack">
          <div class="card">
            <h3 style="margin-top:0;">Decoded room number</h3>
            <p class="muted" style="margin:0 0 10px;">Room numbers follow: building · floor · room.</p>
            <div class="decoded">
              <div class="box"><div class="label">Building</div><div class="val">${room.building}</div></div>
              <div class="box"><div class="label">Floor</div><div class="val">${room.floor}</div></div>
              <div class="box"><div class="label">Room</div><div class="val">${room.room}</div></div>
            </div>
          </div>

          <div class="card">
            <h3 style="margin-top:0;">About this room</h3>
            <p style="margin:0;">${room.description}</p>
          </div>

          <div class="card">
            <h3 style="margin-top:0;">Nearby rooms</h3>
            ${nearby.length ? `
              <div class="grid cols-2" style="gap:10px;">
                ${nearby.map((n) => `
                  <a class="tile" href="room.html?r=${n.id}">
                    <span class="dot">${n.id}</span>
                    <span class="meta"><strong>${n.name}</strong><span>${n.type}</span></span>
                  </a>
                `).join("")}
              </div>
            ` : `<p class="muted" style="margin:0;">No adjacent rooms on record.</p>`}
          </div>
        </div>

        <div class="stack">
          <div class="photo-placeholder">Room photo coming soon</div>
          <div class="card">
            <h3 style="margin-top:0;">Details</h3>
            <ul class="info-list">
              <li><span class="k">Room number</span><span class="v" style="font-family:'JetBrains Mono',monospace;">${room.id}</span></li>
              <li><span class="k">Name</span><span class="v">${room.name}</span></li>
              <li><span class="k">Building</span><span class="v">Building ${room.building}</span></li>
              <li><span class="k">Floor</span><span class="v">Floor ${room.floor}</span></li>
              <li><span class="k">Department</span><span class="v">${room.department}</span></li>
              <li><span class="k">Type</span><span class="v">${room.type}</span></li>
              ${room.capacity ? `<li><span class="k">Capacity</span><span class="v">${room.capacity} people</span></li>` : ""}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
})();

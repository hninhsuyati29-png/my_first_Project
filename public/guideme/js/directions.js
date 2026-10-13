// Floor-map renderer. Generates an SVG for a given building+floor with
// clickable rooms, supports zoom/pan and path highlighting.
(function () {
  const NS = "http://www.w3.org/2000/svg";

  // Layout: 3 rooms on top row (r1..r3), 3 on bottom row (r4..r6),
  // horizontal corridor between; stairs at both ends.
  function buildFloorSVG(building, floor, rooms, opts = {}) {
    const width = 800, height = 500;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("xmlns", NS);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", `Building ${building}, Floor ${floor} map`);

    const g = document.createElementNS(NS, "g");
    g.setAttribute("data-zoom-root", "1");
    svg.appendChild(g);

    // Outer border
    const outer = document.createElementNS(NS, "rect");
    outer.setAttribute("x", 20); outer.setAttribute("y", 20);
    outer.setAttribute("width", width - 40); outer.setAttribute("height", height - 40);
    outer.setAttribute("rx", 14);
    outer.setAttribute("fill", "#fff");
    outer.setAttribute("stroke", "#CBE7E1");
    outer.setAttribute("stroke-width", "2");
    g.appendChild(outer);

    // Corridor
    const corr = document.createElementNS(NS, "rect");
    corr.setAttribute("x", 80); corr.setAttribute("y", 230);
    corr.setAttribute("width", width - 160); corr.setAttribute("height", 40);
    corr.setAttribute("rx", 8);
    corr.setAttribute("class", "corridor");
    g.appendChild(corr);

    // Stairs on both ends
    const stairs = [
      { x: 30, y: 230, label: "Stair A" },
      { x: width - 80, y: 230, label: "Stair B" },
    ];
    stairs.forEach((s) => {
      const r = document.createElementNS(NS, "rect");
      r.setAttribute("x", s.x); r.setAttribute("y", s.y);
      r.setAttribute("width", 50); r.setAttribute("height", 40);
      r.setAttribute("rx", 6);
      r.setAttribute("class", "stair");
      g.appendChild(r);
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", s.x + 25); t.setAttribute("y", s.y + 24);
      t.setAttribute("class", "stair-label");
      t.textContent = s.label;
      g.appendChild(t);
    });

    // Entrance marker for floor 1
    if (floor === 1) {
      const ent = document.createElementNS(NS, "polygon");
      ent.setAttribute("points", `${width/2 - 14},${height - 30} ${width/2 + 14},${height - 30} ${width/2},${height - 8}`);
      ent.setAttribute("class", "entrance-marker");
      g.appendChild(ent);
      const el = document.createElementNS(NS, "text");
      el.setAttribute("x", width/2); el.setAttribute("y", height - 34);
      el.setAttribute("class", "stair-label");
      el.textContent = "Main Entrance";
      g.appendChild(el);
    }

    // Room grid
    const roomW = 200, roomH = 150, gap = 10;
    const startX = 90;
    const topY = 60;
    const bottomY = 290;

    const positions = [
      { x: startX, y: topY },                             // r1
      { x: startX + roomW + gap, y: topY },               // r2
      { x: startX + 2 * (roomW + gap), y: topY },         // r3
      { x: startX, y: bottomY },                          // r4
      { x: startX + roomW + gap, y: bottomY },            // r5
      { x: startX + 2 * (roomW + gap), y: bottomY },      // r6
    ];

    const roomCenters = {};
    rooms.forEach((room) => {
      const idx = room.room - 1;
      const p = positions[idx];
      if (!p) return;
      const cx = p.x + roomW / 2;
      const cy = p.y + roomH / 2;
      roomCenters[room.id] = { cx, cy, edgeY: room.room <= 3 ? p.y + roomH : p.y };

      const rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", p.x); rect.setAttribute("y", p.y);
      rect.setAttribute("width", roomW); rect.setAttribute("height", roomH);
      rect.setAttribute("rx", 10);
      rect.setAttribute("class", "room-rect");
      rect.setAttribute("data-room-id", room.id);
      rect.setAttribute("tabindex", "0");
      rect.setAttribute("role", "link");
      rect.setAttribute("aria-label", `${room.name}, room ${room.id}`);
      g.appendChild(rect);

      const label1 = document.createElementNS(NS, "text");
      label1.setAttribute("x", cx); label1.setAttribute("y", cy - 4);
      label1.setAttribute("class", "room-label");
      label1.setAttribute("data-room-label", room.id);
      label1.setAttribute("font-size", "16");
      label1.setAttribute("font-weight", "800");
      label1.textContent = room.id;
      g.appendChild(label1);

      const label2 = document.createElementNS(NS, "text");
      label2.setAttribute("x", cx); label2.setAttribute("y", cy + 14);
      label2.setAttribute("class", "room-label");
      label2.setAttribute("data-room-label-name", room.id);
      const nm = room.name.length > 24 ? room.name.slice(0, 22) + "…" : room.name;
      label2.textContent = nm;
      g.appendChild(label2);
    });

    return { svg, roomCenters, dims: { width, height } };
  }

  function drawPath(svg, roomCenters, roomId) {
    // Remove any existing path
    svg.querySelectorAll("[data-path-line]").forEach((n) => n.remove());
    const c = roomCenters[roomId];
    if (!c) return;
    const startX = 55, startY = 250; // Stair A center
    const corridorY = 250;
    // Route: stair -> along corridor to under/above room -> up/down to room center
    const points = [
      [startX, startY],
      [c.cx, corridorY],
      [c.cx, c.cy],
    ];
    const g = svg.querySelector('[data-zoom-root="1"]');
    const line = document.createElementNS(NS, "polyline");
    line.setAttribute("points", points.map((p) => p.join(",")).join(" "));
    line.setAttribute("class", "path-line");
    line.setAttribute("data-path-line", "1");
    g.appendChild(line);
  }

  function highlightRoom(svg, roomId) {
    svg.querySelectorAll(".room-rect.highlight").forEach((n) => n.classList.remove("highlight"));
    svg.querySelectorAll(".room-label.on-accent").forEach((n) => n.classList.remove("on-accent"));
    if (!roomId) return;
    const rect = svg.querySelector(`.room-rect[data-room-id="${roomId}"]`);
    if (rect) rect.classList.add("highlight");
    svg.querySelectorAll(`[data-room-label="${roomId}"], [data-room-label-name="${roomId}"]`).forEach((n) => n.classList.add("on-accent"));
  }

  function attachZoomPan(container, svg) {
    let scale = 1, tx = 0, ty = 0;
    const g = svg.querySelector('[data-zoom-root="1"]');
    function apply() {
      g.setAttribute("transform", `translate(${tx} ${ty}) scale(${scale})`);
    }
    function setScale(next, cx, cy) {
      const rect = svg.getBoundingClientRect();
      // Convert cx,cy from viewport to svg units
      const px = ((cx - rect.left) / rect.width) * 800;
      const py = ((cy - rect.top) / rect.height) * 500;
      const prev = scale;
      scale = Math.max(0.6, Math.min(3, next));
      tx = px - (px - tx) * (scale / prev);
      ty = py - (py - ty) * (scale / prev);
      apply();
    }

    svg.addEventListener("wheel", (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setScale(scale * factor, e.clientX, e.clientY);
    }, { passive: false });

    let dragging = false, sx = 0, sy = 0, sTx = 0, sTy = 0;
    svg.addEventListener("pointerdown", (e) => {
      dragging = true; sx = e.clientX; sy = e.clientY; sTx = tx; sTy = ty;
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const rect = svg.getBoundingClientRect();
      const dx = ((e.clientX - sx) / rect.width) * 800;
      const dy = ((e.clientY - sy) / rect.height) * 500;
      tx = sTx + dx; ty = sTy + dy; apply();
    });
    svg.addEventListener("pointerup", () => { dragging = false; });
    svg.addEventListener("pointercancel", () => { dragging = false; });

    // Controls
    const controls = document.createElement("div");
    controls.className = "map-controls";
    controls.innerHTML = `
      <button aria-label="Zoom in" data-zoom-in>+</button>
      <button aria-label="Zoom out" data-zoom-out>−</button>
      <button aria-label="Reset view" data-zoom-reset>⟳</button>
    `;
    container.appendChild(controls);
    const rectCenter = () => {
      const r = svg.getBoundingClientRect();
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    };
    controls.querySelector("[data-zoom-in]").addEventListener("click", () => {
      const c = rectCenter(); setScale(scale * 1.2, c.cx, c.cy);
    });
    controls.querySelector("[data-zoom-out]").addEventListener("click", () => {
      const c = rectCenter(); setScale(scale / 1.2, c.cx, c.cy);
    });
    controls.querySelector("[data-zoom-reset]").addEventListener("click", () => {
      scale = 1; tx = 0; ty = 0; apply();
    });
  }

  window.GuideMe = window.GuideMe || {};
  window.GuideMe.map = { buildFloorSVG, drawPath, highlightRoom, attachZoomPan };
})();

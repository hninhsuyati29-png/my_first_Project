// Search helper. Filters rooms by query + type chip.
(function () {
  function searchRooms(rooms, query, type) {
    const q = (query || "").trim().toLowerCase();
    let out = rooms;
    if (type && type !== "All") out = out.filter((r) => r.type === type);
    if (!q) return out.slice(0, 60);
    // Exact-ish room-number match first
    const numeric = q.match(/^\d{1,3}$/) ? q : null;
    const scored = out
      .map((r) => {
        let score = 0;
        if (numeric && r.id === numeric) score += 100;
        if (numeric && r.id.startsWith(numeric)) score += 40;
        if (r.name.toLowerCase().includes(q)) score += 30;
        if (r.department.toLowerCase().includes(q)) score += 20;
        if (r.type.toLowerCase().includes(q)) score += 10;
        if (`building ${r.building}`.includes(q)) score += 8;
        if (`floor ${r.floor}`.includes(q)) score += 6;
        return { r, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 60)
      .map((x) => x.r);
    return scored;
  }

  window.GuideMe = window.GuideMe || {};
  window.GuideMe.search = { searchRooms };
})();

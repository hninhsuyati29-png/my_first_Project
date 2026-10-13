// Global data loader. Exposes window.GuideMe.data as a Promise<Data>.
(function () {
  const base = new URL(".", document.currentScript.src).href; // js/
  const dataBase = new URL("../data/", base).href;

  async function loadJSON(name) {
    const res = await fetch(dataBase + name);
    if (!res.ok) throw new Error("Failed to load " + name);
    return res.json();
  }

  const ready = (async () => {
    const [buildings, rooms, departments] = await Promise.all([
      loadJSON("buildings.json"),
      loadJSON("rooms.json"),
      loadJSON("departments.json"),
    ]);
    const roomsById = Object.fromEntries(rooms.map((r) => [r.id, r]));
    return { buildings, rooms, departments, roomsById };
  })();

  window.GuideMe = window.GuideMe || {};
  window.GuideMe.data = ready;
  window.GuideMe.qs = (k) => new URLSearchParams(location.search).get(k);
  window.GuideMe.roomsOnFloor = async (b, f) => {
    const d = await ready;
    return d.rooms.filter((r) => r.building === +b && r.floor === +f);
  };
  window.GuideMe.buildingById = async (id) => (await ready).buildings.find((b) => b.id === +id);
  window.GuideMe.roomById = async (id) => (await ready).roomsById[id];

  window.GuideMe.toast = function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2400);
  };
})();

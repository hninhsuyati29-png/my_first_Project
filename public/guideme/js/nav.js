// Inject shared nav + footer. Runs on every page.
(function () {
  const links = [
    { href: "index.html", label: "Home", match: ["", "index.html"] },
    { href: "map.html", label: "Campus Map", match: ["map.html"] },
    { href: "building.html?b=1", label: "Buildings", match: ["building.html"] },
    { href: "search.html", label: "Search", match: ["search.html"] },
    { href: "directions.html", label: "Directions", match: ["directions.html"] },
    { href: "about.html", label: "About", match: ["about.html"] },
    { href: "contact.html", label: "Contact", match: ["contact.html"] },
  ];

  const currentFile = (location.pathname.split("/").pop() || "index.html");

  const navRoot = document.querySelector("[data-nav]");
  if (navRoot) {
    navRoot.innerHTML = `
      <nav class="nav" aria-label="Primary">
        <div class="nav-inner">
          <a class="brand" href="index.html" aria-label="UIT GuideMe home">
            <span class="brand-mark">UG</span>
            <span>
              <span class="brand-name">UIT GuideMe</span>
              <span class="brand-sub">Campus Navigation</span>
            </span>
          </a>
          <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
            <span></span>
          </button>
          <div class="nav-links" role="menubar">
            ${links
              .map((l) => {
                const active = l.match.includes(currentFile) ? " active" : "";
                return `<a class="nav-link${active}" href="${l.href}">${l.label}</a>`;
              })
              .join("")}
          </div>
        </div>
      </nav>
    `;
    const toggle = navRoot.querySelector(".nav-toggle");
    const menu = navRoot.querySelector(".nav-links");
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const footerRoot = document.querySelector("[data-footer]");
  if (footerRoot) {
    footerRoot.innerHTML = `
      <footer class="footer">
        <div class="footer-inner">
          <div>
            <div class="brand" style="margin-bottom:10px;">
              <span class="brand-mark">UG</span>
              <span><span class="brand-name">UIT GuideMe</span>
                <span class="brand-sub">Campus Navigation</span></span>
            </div>
            <p class="muted" style="max-width:340px;">
              An interactive navigation system for the University of Information Technology, Yangon — helping you find any room across all four buildings.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="map.html">Campus Map</a>
            <a href="building.html?b=1">Buildings</a>
            <a href="search.html">Search</a>
            <a href="directions.html">Directions</a>
          </div>
          <div>
            <h4>University</h4>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="https://www.uit.edu.mm" target="_blank" rel="noopener">uit.edu.mm ↗</a>
          </div>
        </div>
        <div class="footer-copy">© ${new Date().getFullYear()} University of Information Technology — Yangon, Myanmar</div>
      </footer>
    `;
  }
})();

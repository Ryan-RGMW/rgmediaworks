(() => {
  const root = document.documentElement;

  // Active nav highlighting (aria-current)
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-links a[data-page]");
  links.forEach(a => {
    if (a.getAttribute("data-page") === path) a.setAttribute("aria-current", "page");
  });

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-links");
  function closeMenu(){
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      const within = menu.contains(e.target) || toggle.contains(e.target);
      if (!within) closeMenu();
    });
    menu.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.tagName === "A") closeMenu();
    });
  }

  // Theme toggle (persisted)
  const themeBtn = document.getElementById("themeBtn");
  const savedTheme = localStorage.getItem("rgmw_theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  if (themeBtn) {
    const current = root.getAttribute("data-theme") || "dark";
    themeBtn.setAttribute("aria-pressed", String(current === "light"));

    themeBtn.addEventListener("click", () => {
      const now = root.getAttribute("data-theme") || "dark";
      const next = now === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("rgmw_theme", next);
      themeBtn.setAttribute("aria-pressed", String(next === "light"));
    });
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Stats injection
  const s = window.RGMW_STATS || {};
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = String(value);
  };
  setText("statSubscribers", s.subscribers);
  setText("statImpressions", s.impressions28d);
  setText("statLong", s.longFormTypical);
  setText("statShorts", s.shortsTypical);
  setText("metaCountries", s.topCountries);
  setText("metaAge", s.ageRange);
  setText("metaGender", s.genderSplit);
  setText("metaCadence", s.cadence);
  setText("metaFlagship", s.flagship);
  setText("metaEmail", s.email);

  // Links (optional)
  const yt = document.getElementById("linkYouTube");
  const sp = document.getElementById("linkShorts");
  const ev = document.getElementById("linkEvergreen");
  if (yt && s.links?.youtubeChannel && s.links.youtubeChannel !== "#") yt.href = s.links.youtubeChannel;
  if (sp && s.links?.shortsPlaylist && s.links.shortsPlaylist !== "#") sp.href = s.links.shortsPlaylist;
  if (ev && s.links?.evergreenPlaylist && s.links.evergreenPlaylist !== "#") ev.href = s.links.evergreenPlaylist;

  // Contact form UX (accessible validation + status)
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  function setErr(id, msg){
    const el = document.getElementById(id);
    if (el) el.textContent = msg || "";
  }
  function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  if (form) {
    form.addEventListener("submit", (e) => {
      // Clear errors each time
      setErr("errName", "");
      setErr("errCompany", "");
      setErr("errEmail", "");
      setErr("errType", "");
      setErr("errMessage", "");
      if (status) status.textContent = "";

      const name = document.getElementById("name")?.value?.trim() || "";
      const company = document.getElementById("company")?.value?.trim() || "";
      const email = document.getElementById("email")?.value?.trim() || "";
      const type = document.getElementById("type")?.value?.trim() || "";
      const message = document.getElementById("message")?.value?.trim() || "";

      let ok = true;
      let first = null;

      if (!name) { ok = false; first ||= "name"; setErr("errName", "Please enter your name."); }
      if (!company) { ok = false; first ||= "company"; setErr("errCompany", "Please enter your company/brand."); }
      if (!email || !isEmail(email)) { ok = false; first ||= "email"; setErr("errEmail", "Please enter a valid email."); }
      if (!type) { ok = false; first ||= "type"; setErr("errType", "Please select a partnership type."); }
      if (!message) { ok = false; first ||= "message"; setErr("errMessage", "Please include a short message with goal + timeline."); }

      if (!ok) {
        e.preventDefault();
        document.getElementById(first)?.focus();
        if (status) status.textContent = "Please fix the highlighted fields.";
        return;
      }

      // Let Formspree handle submit; show user feedback
      if (status) status.textContent = "Sending…";
    });

    form.addEventListener("reset", () => {
      setErr("errName", "");
      setErr("errCompany", "");
      setErr("errEmail", "");
      setErr("errType", "");
      setErr("errMessage", "");
      if (status) status.textContent = "";
    });
  }
})();
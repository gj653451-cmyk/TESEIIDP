(function () {
  const C = TESEIIDP_CONFIG, $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

  // Mwaka na toleo kutoka kwenye mipangilio
  document.querySelectorAll("[data-year]").forEach((e) => (e.textContent = C.year));
  document.querySelectorAll("[data-version]").forEach((e) => (e.textContent = C.version));

  // Menyu ya simu
  const menuBtn = $("#menuBtn"), nav = $("#nav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });

  // Mwonekano mwanga/giza
  const root = document.documentElement;
  try { const t = localStorage.getItem("teseiidp-theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("#themeBtn").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("teseiidp-theme", root.dataset.theme); } catch (e) {}
  });

  // Ramani ya maeneo
  const svg = $("#map");
  if (svg) {
    const ns = "http://www.w3.org/2000/svg", cx = 200, cy = 200, r = 135;
    const mk = (n, a) => { const e = document.createElementNS(ns, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const info = $("#areaInfo"), nodes = [];
    const show = (i) => {
      info.querySelector("h3").textContent = C.areas[i].title;
      info.querySelector("p").textContent = C.areas[i].text;
      nodes.forEach((n, j) => n.classList.toggle("on", i === j));
    };
    C.areas.forEach((a, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / C.areas.length;
      const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
      svg.appendChild(mk("line", { class: "link", x1: cx, y1: cy, x2: x, y2: y, pathLength: 1 }));
    });
    const core = mk("g", { class: "node core" });
    core.appendChild(mk("circle", { cx, cy, r: 40 }));
    const ct = mk("text", { x: cx, y: cy + 5 }); ct.textContent = "TESEIIDP"; ct.style.fontSize = "11px";
    core.appendChild(ct); svg.appendChild(core);
    C.areas.forEach((a, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / C.areas.length;
      const g = mk("g", { class: "node", tabindex: 0, role: "button", "aria-label": a.title });
      g.appendChild(mk("circle", { cx: cx + r * Math.cos(ang), cy: cy + r * Math.sin(ang), r: 34 }));
      const t = mk("text", { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) + 4 }); t.textContent = a.short;
      g.appendChild(t);
      g.addEventListener("click", () => show(i));
      g.addEventListener("mouseenter", () => show(i));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(i); } });
      svg.appendChild(g); nodes.push(g);
    });
    show(0);
  }

  // Kadi za maeneo
  const ag = $("#areaGrid");
  if (ag) C.areas.forEach((a) => ag.appendChild(el("div", "card", `<h3>${a.title}</h3><p>${a.text}</p>`)));

  // Sehemu za jukwaa
  const sl = $("#sectionList");
  if (sl) C.sections.forEach((s) => sl.appendChild(el("li", "", `<span><b>${s[0]}</b> · ${s[1]}</span><span class="chip">Inakuja</span>`)));

  // Madaraja ya uanachama
  const pg = $("#planGrid");
  if (pg) C.plans.forEach((p) => pg.appendChild(el("div", "card plan" + (p.name === "Prime" ? " prime" : ""), `<h3>${p.name}</h3><p>${p.text}</p>`)));

  // Mfano wa Level
  const range = $("#xpRange");
  if (range) {
    const upd = () => { $("#xpFill").style.width = range.value + "%"; $("#xpText").textContent = `Level ${range.value} kati ya 100 (mfano tu, mfumo kamili bado unajengwa).`; };
    range.addEventListener("input", upd); upd();
  }

  // Fomu ya mawasiliano (inafungua barua pepe au WhatsApp)
  const form = $("#contactForm");
  if (form) form.addEventListener("click", (e) => {
    const how = e.target.dataset.send; if (!how) return;
    const name = $("#cName").value.trim(), msg = $("#cMsg").value.trim(), out = $("#formMsg");
    if (!name || !msg) { out.textContent = "Tafadhali jaza jina na ujumbe."; return; }
    out.textContent = "";
    const text = `Habari TESEIIDP, naitwa ${name}.\n\n${msg}`;
    location.href = how === "mail"
      ? `mailto:${C.email}?subject=${encodeURIComponent("Ujumbe kutoka tovuti ya TESEIIDP")}&body=${encodeURIComponent(text)}`
      : `https://wa.me/${C.phone}?text=${encodeURIComponent(text)}`;
  });
})();

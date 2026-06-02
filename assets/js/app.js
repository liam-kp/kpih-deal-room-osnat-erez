/* Deal Room — interactions. Reads window.MEDIA (assets/data/media.js).
   No fetch → works on file:// and on any static host. */
(function () {
  "use strict";
  var M = window.MEDIA || { hero: null, projects: [] };
  var bg = function (el, src) { if (el && src) el.style.backgroundImage = "url('" + src + "')"; };

  /* ---------- hero / closing backgrounds ---------- */
  if (M.hero) {
    var h = document.querySelector("[data-hero]");
    bg(h, M.hero.src);
    var close = document.querySelector("[data-closing]");
    bg(close, (M.hero && M.hero.src) || "");
  }

  /* ---------- per-project covers + galleries ---------- */
  var byslug = {};
  (M.projects || []).forEach(function (p) { byslug[p.slug] = p; });

  document.querySelectorAll("[data-cover]").forEach(function (el) {
    var p = byslug[el.getAttribute("data-cover")];
    if (p && p.cover) bg(el, p.cover.src);
  });

  // closing uses the most cinematic cover if no hero set, else hero
  var closingEl = document.querySelector("[data-closing]");
  if (closingEl && !closingEl.style.backgroundImage) {
    var rs = byslug["red-sunset"] || byslug["koma"];
    if (rs && rs.cover) bg(closingEl, rs.cover.src);
  }

  // lightbox store — keyed per group ("<slug>:photos" | ":videos" | ":floorplan")
  var galleries = {};

  function makeCell(it, key, i, kind) {
    var cell = document.createElement("div");
    cell.className = "mcell" + (it.feature ? " feature" : "") + (kind === "plans" ? " plan" : "");
    var img = document.createElement("img");
    img.loading = "lazy";
    img.src = (it.type === "video") ? (it.poster || it.src) : it.src;
    img.alt = it.alt || it.desc || "";
    cell.appendChild(img);
    if (it.type === "video") { var vb = document.createElement("div"); vb.className = "vbadge"; cell.appendChild(vb); }
    cell.setAttribute("tabindex", "0");
    cell.setAttribute("role", "button");
    cell.setAttribute("aria-label", (it.alt || it.desc || "מדיה") + " — הגדלה");
    cell.addEventListener("click", function () { openLB(key, i); });
    cell.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(key, i); }
    });
    return cell;
  }

  // render the three labeled media groups inside each chapter
  document.querySelectorAll("[data-media]").forEach(function (host) {
    var slug = host.getAttribute("data-media");
    var p = byslug[slug];
    if (!p) return;
    var groups = [
      { kind: "photos", eyebrow: "GALLERY",    title: "תמונות", items: p.photos || [] },
      { kind: "videos", eyebrow: "VIDEO",      title: "וידאו",  items: p.videos || [] },
      { kind: "plans",  eyebrow: "FLOOR PLAN", title: "תוכנית", items: p.floorplan || [] }
    ];
    groups.forEach(function (g) {
      if (!g.items.length) return;
      var key = slug + ":" + g.kind;
      galleries[key] = g.items;
      var sec = document.createElement("div");
      sec.className = "mgroup reveal";
      var head = document.createElement("div");
      head.className = "mhead";
      head.innerHTML = '<span class="m-eye">' + g.eyebrow + '</span><span class="m-tt">' + g.title + '</span>';
      sec.appendChild(head);
      var grid = document.createElement("div");
      grid.className = "mgrid" + (g.kind === "plans" ? " plans" : "");
      g.items.forEach(function (it, i) { grid.appendChild(makeCell(it, key, i, g.kind)); });
      sec.appendChild(grid);
      host.appendChild(sec);
    });
  });

  // per-project action buttons (location / brochure / reference link)
  function svgIcon(name) {
    var paths = {
      pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
      doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
      ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + '</svg>';
  }
  document.querySelectorAll("[data-actions]").forEach(function (host) {
    var p = byslug[host.getAttribute("data-actions")];
    if (!p) return;
    var btns = [];
    if (p.location) btns.push({ url: p.location.url, label: p.location.label || "מיקום במפה", icon: "pin", cls: "act-loc" });
    if (p.brochure) btns.push({ url: p.brochure.url, label: p.brochure.label || "ברושור", icon: "doc", cls: "act-doc" });
    if (p.ref)      btns.push({ url: p.ref.url, label: p.ref.label, icon: "ext", cls: "act-ref" });
    btns.forEach(function (b) {
      var a = document.createElement("a");
      a.className = "actbtn " + b.cls;
      a.href = b.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.innerHTML = svgIcon(b.icon) + "<span>" + b.label + "</span>";
      host.appendChild(a);
    });
  });

  /* ---------- lightbox: Embla carousel (infinite loop + momentum) ---------- */
  var lb = document.getElementById("lb");
  var stage = document.getElementById("lbStage");   // serves as the Embla viewport
  var cap = document.getElementById("lbCap");
  var reduceMotionLB = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var embla = null;
  var lbList = [];

  function lbCaption() {
    if (!embla) return;
    var i = embla.selectedScrollSnap();
    var it = lbList[i]; if (!it) return;
    var label = it.desc || it.alt || "";
    cap.textContent = label ? (label + "  ·  " + (i + 1) + "/" + lbList.length) : ((i + 1) + "/" + lbList.length);
  }

  // lazy: load only active + adjacent slides; pause any non-active video
  function lbLoadInView() {
    if (!embla) return;
    var sel = embla.selectedScrollSnap();
    var n = lbList.length;
    var want = [(sel - 1 + n) % n, sel, (sel + 1) % n];
    var slides = embla.slideNodes();
    want.forEach(function (idx) {
      var media = slides[idx] && slides[idx].querySelector("[data-src]");
      if (media && !media.getAttribute("src")) media.setAttribute("src", media.getAttribute("data-src"));
    });
    slides.forEach(function (s, idx) {
      var v = s.querySelector("video");
      if (v && idx !== sel && !v.paused) v.pause();
    });
  }

  function buildSlides(key) {
    lbList = galleries[key] || [];
    var container = document.createElement("div");
    container.className = "embla__container";
    lbList.forEach(function (it) {
      var slide = document.createElement("div");
      slide.className = "lb-slide embla__slide";
      var node;
      if (it.type === "video") {
        node = document.createElement("video");
        node.controls = true; node.playsInline = true; node.preload = "none";
        if (it.poster) node.poster = it.poster;
        node.setAttribute("data-src", it.src);
      } else {
        node = document.createElement("img");
        node.alt = it.alt || ""; node.draggable = false; node.setAttribute("data-src", it.src);
      }
      slide.appendChild(node);
      container.appendChild(slide);
    });
    stage.innerHTML = "";
    stage.appendChild(container);
  }

  function openLB(key, i) {
    if (typeof EmblaCarousel === "undefined") return;
    buildSlides(key);
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    embla = EmblaCarousel(stage, {
      loop: true,            // seamless first<->last both ways
      startIndex: i,         // open ON the tapped slide — no long scroll to reach it
      direction: "ltr",      // keep index math LTR inside the RTL page
      align: "center",
      duration: reduceMotionLB ? 0 : 26,  // unhurried, premium glide
      dragFree: false
    });
    embla.on("select", function () { lbCaption(); lbLoadInView(); });
    lbCaption();
    lbLoadInView();
  }
  function closeLB() {
    if (embla) { embla.destroy(); embla = null; }
    lb.classList.remove("open");
    document.body.style.overflow = "";
    stage.innerHTML = "";
    lbList = [];
  }

  document.getElementById("lbX").addEventListener("click", closeLB);
  document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); if (embla) embla.scrollPrev(); });
  document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); if (embla) embla.scrollNext(); });
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target === stage || (e.target.classList && e.target.classList.contains("lb-slide"))) closeLB();
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft" && embla) embla.scrollPrev();
    if (e.key === "ArrowRight" && embla) embla.scrollNext();
  });

  /* ---------- red-sunset villa selector (segmented tabs) ---------- */
  (function () {
    var tabs = [].slice.call(document.querySelectorAll(".vtab"));
    if (!tabs.length) return;
    var cards = [].slice.call(document.querySelectorAll(".vcard"));
    function select(n) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-villa") === n;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      cards.forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-villa") === n); });
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { select(t.getAttribute("data-villa")); });
    });
  })();

  /* ---------- scroll: progress, nav, parallax, reveals ---------- */
  var bar = document.getElementById("bar");
  var nav = document.getElementById("nav");
  var navScrim = document.getElementById("navScrim");
  var covers = [].slice.call(document.querySelectorAll(".cover-bg"));
  var links = [].slice.call(document.querySelectorAll("nav .menu a"));
  var sections = [].slice.call(document.querySelectorAll(".chapter"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    var doc = document.documentElement;
    var sc = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1);
    bar.style.width = (sc * 100) + "%";
    var solid = doc.scrollTop > window.innerHeight * 0.72;
    nav.classList.toggle("solid", solid);
    if (navScrim) navScrim.classList.toggle("hide", solid);
    // refined cover parallax — gentle, GPU-friendly, clamped
    if (reduceMotion) return;
    for (var i = 0; i < covers.length; i++) {
      var r = covers[i].parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var shift = Math.max(-60, Math.min(60, r.top * -0.08));
        covers[i].style.transform = "translate3d(0," + shift.toFixed(1) + "px,0)";
      }
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // active nav via IntersectionObserver
  var navIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        var id = e.target.id;
        links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + id); });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (s) { navIO.observe(s); });

  // reveals
  var revIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); revIO.unobserve(e.target); } });
  }, { threshold: 0.14 });
  document.querySelectorAll(".reveal").forEach(function (el) { revIO.observe(el); });
})();

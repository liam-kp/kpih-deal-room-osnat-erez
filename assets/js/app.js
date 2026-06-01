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

  // gallery store for lightbox (per project, flat list of viewable items)
  var galleries = {};

  document.querySelectorAll("[data-gallery]").forEach(function (grid) {
    var slug = grid.getAttribute("data-gallery");
    var p = byslug[slug];
    var items = (p && p.gallery) ? p.gallery.slice() : [];
    galleries[slug] = items;

    if (!items.length) {
      grid.classList.add("is-empty");
      grid.innerHTML = '<div class="empty">images/' + slug + '/ &nbsp;·&nbsp; videos/' + slug +
        '/ — fill via media.js (Cowork)</div>';
      return;
    }

    var MAXCELLS = 5; // first is big (2x2) + 4 small; extra collapse into "+N"
    items.forEach(function (it, i) {
      if (i >= MAXCELLS) return;
      var cell = document.createElement("div");
      cell.className = "cell";
      var img = document.createElement("img");
      img.loading = "lazy";
      img.src = (it.type === "video") ? (it.poster || it.src) : it.src;
      img.alt = it.alt || "";
      cell.appendChild(img);
      if (it.type === "video") {
        var vb = document.createElement("div"); vb.className = "vbadge"; cell.appendChild(vb);
      }
      var extra = items.length - MAXCELLS;
      if (i === MAXCELLS - 1 && extra > 0) {
        var more = document.createElement("div"); more.className = "more";
        more.textContent = "+" + extra; cell.appendChild(more);
      }
      cell.setAttribute("tabindex", "0");
      cell.setAttribute("role", "button");
      cell.setAttribute("aria-label", (it.alt || it.desc || "פתיחת מדיה") + " — הגדלה");
      cell.addEventListener("click", function () { openLB(slug, i); });
      cell.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(slug, i); }
      });
      grid.appendChild(cell);
    });
  });

  /* ---------- lightbox: scroll-snap / momentum film-strip ---------- */
  var lb = document.getElementById("lb");
  var stage = document.getElementById("lbStage");
  var cap = document.getElementById("lbCap");
  var cur = { slug: null, i: 0, n: 0 };
  var rafPending = false;

  // pause every video in the strip except the active slide
  function pauseInactive(activeIdx) {
    var slides = stage.children;
    for (var k = 0; k < slides.length; k++) {
      var v = slides[k].querySelector("video");
      if (v && k !== activeIdx && !v.paused) v.pause();
    }
  }

  function setCaption(i) {
    var list = galleries[cur.slug] || [];
    var it = list[i]; if (!it) return;
    cur.i = i;
    var label = it.desc || it.alt || "";
    cap.textContent = label ? (label + "  ·  " + (i + 1) + "/" + cur.n) : ((i + 1) + "/" + cur.n);
  }

  // build the horizontal strip once per open; lazy media so only nearby slides load
  function buildStrip(slug) {
    var list = galleries[slug] || [];
    stage.innerHTML = "";
    cur.n = list.length;
    list.forEach(function (it) {
      var slide = document.createElement("div");
      slide.className = "lb-slide";
      var node;
      if (it.type === "video") {
        node = document.createElement("video");
        node.controls = true; node.playsInline = true; node.preload = "none";
        if (it.poster) node.poster = it.poster;
        node.src = it.src;
      } else {
        node = document.createElement("img");
        node.src = it.src; node.alt = it.alt || ""; node.draggable = false;
      }
      slide.appendChild(node);
      stage.appendChild(slide);
    });
  }

  function scrollToSlide(i, smooth) {
    var slide = stage.children[i];
    if (!slide) return;
    stage.scrollTo({ left: slide.offsetLeft, behavior: smooth ? "smooth" : "auto" });
  }

  // derive the active slide from scroll position (nearest to viewport centre)
  function syncActive() {
    rafPending = false;
    var center = stage.scrollLeft + stage.clientWidth / 2;
    var best = 0, bestD = Infinity;
    for (var k = 0; k < stage.children.length; k++) {
      var s = stage.children[k];
      var c = s.offsetLeft + s.offsetWidth / 2;
      var d = Math.abs(c - center);
      if (d < bestD) { bestD = d; best = k; }
    }
    if (best !== cur.i) { setCaption(best); pauseInactive(best); }
  }
  stage.addEventListener("scroll", function () {
    if (!rafPending) { rafPending = true; requestAnimationFrame(syncActive); }
  }, { passive: true });

  function openLB(slug, i) {
    cur.slug = slug;
    buildStrip(slug);
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    setCaption(i);
    // jump to the tapped slide after layout settles
    requestAnimationFrame(function () { scrollToSlide(i, false); });
  }
  function closeLB() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    stage.innerHTML = "";
    cur.slug = null;
  }
  function step(d) {
    if (!cur.n) return;
    var next = Math.min(cur.n - 1, Math.max(0, cur.i + d));
    scrollToSlide(next, true);
  }

  document.getElementById("lbX").addEventListener("click", closeLB);
  document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft") step(-1);  // strip is LTR: left = previous
    if (e.key === "ArrowRight") step(1);  // right = next
  });

  /* ---------- scroll: progress, nav, parallax, reveals ---------- */
  var bar = document.getElementById("bar");
  var nav = document.getElementById("nav");
  var covers = [].slice.call(document.querySelectorAll(".cover-bg"));
  var links = [].slice.call(document.querySelectorAll("nav .menu a"));
  var sections = [].slice.call(document.querySelectorAll(".chapter"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    var doc = document.documentElement;
    var sc = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1);
    bar.style.width = (sc * 100) + "%";
    nav.classList.toggle("solid", doc.scrollTop > window.innerHeight * 0.72);
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

// MADMOKU v5 — minimal clean + animasi menarik
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var navbar = document.getElementById("navbar");
  var toTop = document.getElementById("toTop");
  var progress = document.getElementById("scrollProgress");
  var stickyOrder = document.getElementById("stickyOrder");
  var prosesBar = document.getElementById("prosesBar");
  var lastY = 0;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? y / max : 0;

    if (navbar) {
      navbar.classList.toggle("scrolled", y > 30);
      // sembunyikan navbar saat scroll ke bawah (desktop & mobile), tampilkan saat ke atas
      if (y > 400 && y > lastY + 4) navbar.classList.add("hide");
      else if (y < lastY - 4 || y < 400) navbar.classList.remove("hide");
    }
    if (progress) progress.style.transform = "scaleX(" + p + ")";
    if (toTop) toTop.classList.toggle("show", y > 500);
    if (stickyOrder) stickyOrder.classList.toggle("show", y > 520);
    if (prosesBar) {
      var sec = document.getElementById("proses");
      if (sec) {
        var r = sec.getBoundingClientRect();
        var total = r.height + window.innerHeight;
        var done = window.innerHeight - r.top;
        var ratio = Math.min(1, Math.max(0, done / total));
        prosesBar.style.transform = "scaleX(" + ratio + ")";
      }
    }
    // active nav link
    var ids = ["tentang", "proses", "varian", "lokasi", "faq"];
    var current = "";
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 160) current = id;
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  // Hamburger
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", open);
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) { navLinks.classList.remove("open"); hamburger.classList.remove("open"); }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-inner") && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open"); hamburger.classList.remove("open");
      }
    });
  }

  // Reveal on scroll + stagger otomatis
  var groups = [".story-grid > *", ".proses-step", ".keunggulan-card", ".price-card", ".cara-step", ".lokasi-grid > *", ".faq-item", ".section-header", ".cta-banner"];
  var targets = [];
  groups.forEach(function (sel, gi) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.setProperty("--d", ((i % 4) * 0.09 + gi * 0.02) + "s");
      targets.push(el);
    });
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("revealed"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("revealed"); });
  }

  // Count-up stats
  function countUp(el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (isNaN(end)) return;
    if (reduceMotion) { el.textContent = end.toFixed(dec).replace(".", ","); return; }
    var dur = 1400, start = null;
    function tick(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      var val = (end * eased).toFixed(dec).replace(".", ",");
      el.textContent = val;
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else { counters.forEach(countUp); }

  // Hero parallax ringan (desktop)
  var heroVisual = document.getElementById("heroVisual");
  var heroImg = document.getElementById("heroImg");
  if (heroVisual && heroImg && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.getElementById("beranda").addEventListener("mousemove", function (e) {
      var r = heroVisual.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / r.width;
      var y = (e.clientY - (r.top + r.height / 2)) / r.height;
      heroImg.style.transform = "translate(" + (x * 10) + "px," + (y * 10) + "px) scale(1.02)";
      heroVisual.querySelectorAll(".float-card").forEach(function (c, i) {
        var f = (i + 1) * 8;
        c.style.translate = (x * f) + "px " + (y * f) + "px";
      });
    });
  }

  // Status buka / tutup (Senin–Sabtu 09–17)
  var badge = document.getElementById("openBadge");
  if (badge) {
    try {
      var now = new Date();
      var day = now.getDay(); // 0 = Minggu
      var hour = now.getHours() + now.getMinutes() / 60;
      var open = day !== 0 && hour >= 9 && hour < 17;
      badge.textContent = open ? "● Buka sekarang • sampai 17.00" : "● Tutup • buka Senin–Sabtu 09–17";
      if (!open) badge.classList.add("closed");
    } catch (e) { badge.textContent = "● Senin–Sabtu 09.00–17.00"; }
  }

  // FAQ: tutup yang lain saat satu dibuka (accordion)
  document.querySelectorAll(".faq-item").forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        document.querySelectorAll(".faq-item").forEach(function (other) {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });
})();

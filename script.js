// Madmoku - interaksi ringan, tanpa backend
(function () {
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");
  var year = document.getElementById("year");
  var navbar = document.getElementById("navbar");

  if (year) year.textContent = new Date().getFullYear();

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") navLinks.classList.remove("open");
    });
  }

  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.style.boxShadow = window.scrollY > 8 ? "0 4px 18px rgba(0,0,0,.08)" : "none";
    });
  }

  // Scroll reveal: kartu + blok section muncul halus saat di-scroll
  var targets = document.querySelectorAll(".card, #tentang .grid-2 > div, #lokasi .grid-2 > div, #faq details");
  targets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
          // hapus delay stagger biar hover tidak lag
          setTimeout(function () { entry.target.style.transitionDelay = "0ms"; }, 700);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min((i % 4) * 70, 210) + "ms";
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add("visible"); });
  }
})();

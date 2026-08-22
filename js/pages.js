// ---------- Page switching: nav links <-> #pages articles ----------

(function () {
  "use strict";

  const navLinks = document.querySelectorAll("#topbar_button a[data-page]");
  const pages = document.querySelectorAll("#pages > article[pageid]");

  function showPage(pageId) {
    pages.forEach((article) => {
      article.classList.toggle("active_page", article.getAttribute("pageid") === pageId);
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active_link", link.dataset.page === pageId);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });
})();

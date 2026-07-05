// js/app.js — main initializer, entry point for the inbox page

(function () {
  // Guard: redirect to login if not authenticated
  if (sessionStorage.getItem("gmail_clone_logged_in") !== "true") {
    window.location.href = "index.html";
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    Storage.init();
    Theme.init();
    Profile.init();
    Folders.init();
    EmailsView.render();

    // Sidebar collapse toggle (hamburger menu)
    document.getElementById("menuBtn").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("collapsed");
    });

    // Keyboard shortcut: Escape closes email detail view
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") Actions.closeDetailView();
    });

    // Auto-collapse sidebar on small screens by default
    if (window.innerWidth <= 900) {
      document.getElementById("sidebar").classList.add("collapsed");
    }
  });
})();

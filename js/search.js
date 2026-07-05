// js/search.js — live search across from, subject, snippet, and body

(function () {
  const searchInput = document.getElementById("searchInput");
  let debounceTimer = null;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      AppState.searchQuery = searchInput.value;
      // Searching sweeps across all mail regardless of folder, like real Gmail
      if (searchInput.value.trim() && AppState.currentFolder !== "all") {
        AppState.currentFolder = "all";
        AppState.currentLabel = null;
        document.querySelectorAll(".folder-item").forEach((b) => b.classList.remove("active"));
      }
      EmailsView.render();
      Actions.closeDetailView();
    }, 200);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      AppState.searchQuery = "";
      EmailsView.render();
    }
  });
})();

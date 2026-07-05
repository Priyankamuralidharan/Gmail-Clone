// js/folders.js — handles switching between folders (Inbox, Starred, Sent...) and labels

const AppState = {
  currentFolder: "inbox",
  currentLabel: null,
  searchQuery: ""
};

const Folders = (function () {
  function setActiveButton(clicked) {
    document
      .querySelectorAll(".folder-item")
      .forEach((btn) => btn.classList.remove("active"));
    clicked.classList.add("active");
  }

  function init() {
    document.querySelectorAll(".folder-item[data-folder]").forEach((btn) => {
      btn.addEventListener("click", () => {
        AppState.currentFolder = btn.dataset.folder;
        AppState.currentLabel = null;
        AppState.searchQuery = "";
        const searchInput = document.getElementById("searchInput");
        if (searchInput) searchInput.value = "";
        setActiveButton(btn);
        EmailsView.render();
        Actions.closeDetailView();
      });
    });

    document.querySelectorAll(".folder-item[data-label]").forEach((btn) => {
      btn.addEventListener("click", () => {
        AppState.currentLabel = btn.dataset.label;
        AppState.currentFolder = "";
        setActiveButton(btn);
        EmailsView.render();
        Actions.closeDetailView();
      });
    });
  }

  return { init };
})();

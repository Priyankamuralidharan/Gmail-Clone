// js/notification.js — simple toast notifications with optional Undo action

const Notify = (function () {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastUndo = document.getElementById("toastUndo");
  let hideTimer = null;
  let undoHandler = null;

  function show(message, { undo } = {}) {
    clearTimeout(hideTimer);
    toastMessage.textContent = message;

    if (undo) {
      toastUndo.classList.remove("hidden");
      undoHandler = undo;
    } else {
      toastUndo.classList.add("hidden");
      undoHandler = null;
    }

    toast.classList.remove("hidden");
    hideTimer = setTimeout(() => toast.classList.add("hidden"), 4000);
  }

  toastUndo.addEventListener("click", () => {
    if (undoHandler) undoHandler();
    toast.classList.add("hidden");
    clearTimeout(hideTimer);
  });

  return { show };
})();

// Simple unread notification dot on the bell icon
const NotificationBadge = {
  refresh() {
    const dot = document.getElementById("notifDot");
    if (!dot) return;
    const unreadCount = Storage.getAll().filter(
      (e) => e.folder === "inbox" && !e.read
    ).length;
    dot.classList.toggle("show", unreadCount > 0);
  }
};

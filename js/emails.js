// js/emails.js — renders the email list for the current folder/label/search

const LABEL_COLORS = {
  work: "#3949ab",
  personal: "#00897b",
  promotions: "#e50914",
  social: "#0a66c2",
  updates: "#5f6368",
  important: "#f9ab00"
};

const EmailsView = (function () {
  const listEl = document.getElementById("emailList");
  const emptyStateEl = document.getElementById("emptyState");
  const emptyStateText = document.getElementById("emptyStateText");
  const paginationInfo = document.getElementById("paginationInfo");

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function currentList() {
    let emails = Storage.getAll();
    const folder = AppState.currentFolder;
    const label = AppState.currentLabel;
    const query = AppState.searchQuery.trim().toLowerCase();

    if (label) {
      emails = emails.filter((e) => e.labels && e.labels.includes(label));
    } else if (folder === "starred") {
      emails = emails.filter((e) => e.starred);
    } else if (folder === "important") {
      emails = emails.filter((e) => e.important);
    } else if (folder === "all") {
      emails = emails.filter((e) => e.folder !== "trash");
    } else {
      emails = emails.filter((e) => e.folder === folder);
    }

    if (query) {
      emails = emails.filter((e) =>
        [e.from, e.fromEmail, e.subject, e.snippet, e.body]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    emails.sort((a, b) => new Date(b.date) - new Date(a.date));
    return emails;
  }

  function render() {
    const emails = currentList();
    listEl.innerHTML = "";

    if (emails.length === 0) {
      emptyStateEl.classList.remove("hidden");
      emptyStateText.textContent = AppState.searchQuery
        ? `No results for "${AppState.searchQuery}"`
        : "No conversations in this folder";
      paginationInfo.textContent = "";
      updateFolderCounts();
      return;
    }
    emptyStateEl.classList.add("hidden");
    paginationInfo.textContent = `1–${emails.length} of ${emails.length}`;

    emails.forEach((email) => {
      const row = document.createElement("div");
      row.className = "email-row" + (email.read ? "" : " unread");
      row.dataset.id = email.id;

      const labelsHtml = (email.labels || [])
        .filter((l) => l !== "important")
        .map(
          (l) =>
            `<span class="label-chip" style="background:${LABEL_COLORS[l] || "#888"}">${escapeHtml(l)}</span>`
        )
        .join("");

      row.innerHTML = `
        <label class="checkbox-wrap"><input type="checkbox" class="row-checkbox" /></label>
        <button class="star-btn ${email.starred ? "starred" : ""}" title="Star">
          <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="${email.starred ? "#f4b400" : "none"}" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        ${
          email.important
            ? `<span class="important-marker" title="Marked important"><svg viewBox="0 0 24 24"><path d="M12 2L2 21h20L12 2zm0 5l6.5 12h-13L12 7z" fill="currentColor"/></svg></span>`
            : `<span class="important-marker"></span>`
        }
        <div class="email-avatar" style="background:${email.avatarColor}">${escapeHtml(email.avatarText)}</div>
        <div class="email-sender">${escapeHtml(email.from)}</div>
        <div class="email-subject-snippet">
          ${labelsHtml}
          <span class="email-subject">${escapeHtml(email.subject)}</span>
          <span class="email-snippet"> - ${escapeHtml(email.snippet)}</span>
        </div>
        <div class="row-hover-actions">
          <button class="icon-btn small row-archive" title="Archive"><svg viewBox="0 0 24 24"><path d="M20.55 5.22l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5c0-.49-.17-.93-.45-1.28zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5z" fill="currentColor"/></svg></button>
          <button class="icon-btn small row-delete" title="Delete"><svg viewBox="0 0 24 24"><path d="M6 7h12l-1 14H7L6 7zm3-4h6l1 2h4v2H4V5h4l1-2z" fill="currentColor"/></svg></button>
        </div>
        <div class="email-time">${escapeHtml(email.time)}</div>
      `;

      listEl.appendChild(row);
    });

    updateFolderCounts();
  }

  function updateFolderCounts() {
    const all = Storage.getAll();
    const inboxUnread = all.filter((e) => e.folder === "inbox" && !e.read).length;
    const draftsCount = all.filter((e) => e.folder === "drafts").length;

    const countInbox = document.getElementById("countInbox");
    const countDrafts = document.getElementById("countDrafts");
    if (countInbox) countInbox.textContent = inboxUnread > 0 ? inboxUnread : "";
    if (countDrafts) countDrafts.textContent = draftsCount > 0 ? draftsCount : "";

    NotificationBadge.refresh();
  }

  return { render, currentList, updateFolderCounts };
})();

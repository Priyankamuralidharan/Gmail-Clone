// js/actions.js — star, delete, archive, read/unread, and detail view logic

const Actions = (function () {
  const listEl = document.getElementById("emailList");
  const detailOverlay = document.getElementById("emailDetailOverlay");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");

  let currentOpenId = null;

  function getSelectedIds() {
    return [...listEl.querySelectorAll(".row-checkbox:checked")].map(
      (cb) => cb.closest(".email-row").dataset.id
    );
  }

  function toggleStar(id) {
    const email = Storage.getById(id);
    if (!email) return;
    Storage.update(id, { starred: !email.starred });
    EmailsView.render();
  }

  function moveToTrash(ids) {
    const idList = Array.isArray(ids) ? ids : [ids];
    const previousStates = idList.map((id) => ({ id, folder: Storage.getById(id)?.folder }));
    idList.forEach((id) => Storage.update(id, { folder: "trash" }));
    EmailsView.render();
    Notify.show(idList.length > 1 ? `${idList.length} conversations moved to Trash` : "Conversation moved to Trash", {
      undo: () => {
        previousStates.forEach((s) => s.folder && Storage.update(s.id, { folder: s.folder }));
        EmailsView.render();
      }
    });
  }

  function archive(ids) {
    const idList = Array.isArray(ids) ? ids : [ids];
    const previousStates = idList.map((id) => ({ id, folder: Storage.getById(id)?.folder }));
    idList.forEach((id) => Storage.update(id, { folder: "archived" }));
    EmailsView.render();
    Notify.show(idList.length > 1 ? `${idList.length} conversations archived` : "Conversation archived", {
      undo: () => {
        previousStates.forEach((s) => s.folder && Storage.update(s.id, { folder: s.folder }));
        EmailsView.render();
      }
    });
  }

  function markRead(ids, read = true) {
    const idList = Array.isArray(ids) ? ids : [ids];
    idList.forEach((id) => Storage.update(id, { read }));
    EmailsView.render();
  }

  function openDetail(id) {
    const email = Storage.getById(id);
    if (!email) return;
    currentOpenId = id;

    if (!email.read) {
      Storage.update(id, { read: true });
      EmailsView.render();
    }

    document.getElementById("detailSubject").textContent = email.subject;
    document.getElementById("detailFrom").textContent = email.from;
    document.getElementById("detailFromEmail").textContent = `<${email.fromEmail}>`;
    document.getElementById("detailTime").textContent = new Date(email.date).toLocaleString();
    document.getElementById("detailContent").textContent = email.body;

    const avatar = document.getElementById("detailAvatar");
    avatar.textContent = email.avatarText;
    avatar.style.background = email.avatarColor;

    const labelsWrap = document.getElementById("detailLabels");
    labelsWrap.innerHTML = (email.labels || [])
      .map((l) => `<span class="label-chip" style="background:${LABEL_COLORS[l] || "#888"}">${l}</span>`)
      .join("");

    const starBtn = document.getElementById("detailStarBtn");
    starBtn.classList.toggle("starred", !!email.starred);

    detailOverlay.classList.remove("hidden");
  }

  function closeDetailView() {
    detailOverlay.classList.add("hidden");
    currentOpenId = null;
  }

  // ---- Row-level click delegation ----
  listEl.addEventListener("click", (e) => {
    const row = e.target.closest(".email-row");
    if (!row) return;
    const id = row.dataset.id;

    if (e.target.closest(".star-btn")) {
      e.stopPropagation();
      toggleStar(id);
      return;
    }
    if (e.target.closest(".row-archive")) {
      e.stopPropagation();
      archive(id);
      return;
    }
    if (e.target.closest(".row-delete")) {
      e.stopPropagation();
      moveToTrash(id);
      return;
    }
    if (e.target.closest(".row-checkbox") || e.target.closest(".checkbox-wrap")) {
      e.stopPropagation();
      return;
    }
    openDetail(id);
  });

  // ---- Toolbar bulk actions ----
  document.getElementById("archiveBtn").addEventListener("click", () => {
    const ids = getSelectedIds();
    if (ids.length) archive(ids);
  });
  document.getElementById("deleteBtn").addEventListener("click", () => {
    const ids = getSelectedIds();
    if (ids.length) moveToTrash(ids);
  });
  document.getElementById("markReadBtn").addEventListener("click", () => {
    const ids = getSelectedIds();
    if (ids.length) markRead(ids, true);
  });
  document.getElementById("refreshBtn").addEventListener("click", () => EmailsView.render());

  selectAllCheckbox.addEventListener("change", () => {
    listEl.querySelectorAll(".row-checkbox").forEach((cb) => (cb.checked = selectAllCheckbox.checked));
  });

  // ---- Detail view toolbar ----
  document.getElementById("backToListBtn").addEventListener("click", closeDetailView);
  document.getElementById("detailArchiveBtn").addEventListener("click", () => {
    if (currentOpenId) {
      archive(currentOpenId);
      closeDetailView();
    }
  });
  document.getElementById("detailDeleteBtn").addEventListener("click", () => {
    if (currentOpenId) {
      moveToTrash(currentOpenId);
      closeDetailView();
    }
  });
  document.getElementById("detailUnreadBtn").addEventListener("click", () => {
    if (currentOpenId) {
      markRead(currentOpenId, false);
      closeDetailView();
    }
  });
  document.getElementById("detailStarBtn").addEventListener("click", () => {
    if (currentOpenId) {
      toggleStar(currentOpenId);
      const email = Storage.getById(currentOpenId);
      document.getElementById("detailStarBtn").classList.toggle("starred", !!email.starred);
    }
  });
  document.getElementById("replyBtn").addEventListener("click", () => {
    if (currentOpenId) Compose.openReply(currentOpenId, "reply");
  });
  document.getElementById("forwardBtn").addEventListener("click", () => {
    if (currentOpenId) Compose.openReply(currentOpenId, "forward");
  });

  return { toggleStar, moveToTrash, archive, markRead, openDetail, closeDetailView, getSelectedIds };
})();

// js/compose.js — compose modal: new message, reply, forward, send, draft handling

const Compose = (function () {
  const modal = document.getElementById("composeModal");
  const titleEl = document.getElementById("composeTitle");
  const toInput = document.getElementById("composeTo");
  const subjectInput = document.getElementById("composeSubject");
  const bodyInput = document.getElementById("composeBody");
  const sendBtn = document.getElementById("sendBtn");

  let draftId = null;

  function open({ to = "", subject = "", body = "", title = "New Message" } = {}) {
    toInput.value = to;
    subjectInput.value = subject;
    bodyInput.value = body;
    titleEl.textContent = title;
    draftId = Storage.newId();
    modal.classList.remove("hidden");
    setTimeout(() => toInput.focus(), 50);
  }

  function openReply(originalId, mode) {
    const original = Storage.getById(originalId);
    if (!original) return;
    if (mode === "reply") {
      open({
        to: original.fromEmail,
        subject: original.subject.startsWith("Re:") ? original.subject : `Re: ${original.subject}`,
        body: `\n\nOn ${new Date(original.date).toLocaleString()}, ${original.from} wrote:\n> ${original.body.replace(/\n/g, "\n> ")}`,
        title: "Reply"
      });
    } else {
      open({
        to: "",
        subject: original.subject.startsWith("Fwd:") ? original.subject : `Fwd: ${original.subject}`,
        body: `\n\n---------- Forwarded message ---------\nFrom: ${original.from} <${original.fromEmail}>\nSubject: ${original.subject}\n\n${original.body}`,
        title: "Forward"
      });
    }
  }

  function close() {
    modal.classList.add("hidden");
    toInput.value = "";
    subjectInput.value = "";
    bodyInput.value = "";
    draftId = null;
  }

  function minimize() {
    modal.classList.add("hidden");
  }

  function buildEmailObject(folder) {
    const myName = sessionStorage.getItem("gmail_clone_name") || "Me";
    const myEmail = sessionStorage.getItem("gmail_clone_email") || "me@gmail.com";
    const now = new Date();
    return {
      id: draftId || Storage.newId(),
      from: folder === "sent" ? myName : toInput.value || "(no recipient)",
      fromEmail: folder === "sent" ? myEmail : toInput.value || "unknown@mail.com",
      avatarColor: "#0b57d0",
      avatarText: (myName[0] || "M").toUpperCase(),
      subject: subjectInput.value || "(no subject)",
      snippet: (bodyInput.value || "").slice(0, 90),
      body: bodyInput.value || "",
      time: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      date: now.toISOString(),
      read: true,
      starred: false,
      important: false,
      folder,
      labels: []
    };
  }

  function send() {
    if (!toInput.value.trim()) {
      toInput.style.borderBottom = "2px solid #d93025";
      toInput.focus();
      return;
    }
    const email = buildEmailObject("sent");
    Storage.add(email);
    close();
    EmailsView.render();
    Notify.show("Message sent");
  }

  function saveDraftAndClose() {
    const hasContent = toInput.value || subjectInput.value || bodyInput.value;
    if (hasContent) {
      const draft = buildEmailObject("drafts");
      Storage.add(draft);
      Notify.show("Draft saved");
    }
    close();
    EmailsView.render();
  }

  function discard() {
    close();
    Notify.show("Draft discarded");
  }

  document.getElementById("composeBtn").addEventListener("click", () => open());
  document.getElementById("closeComposeBtn").addEventListener("click", saveDraftAndClose);
  document.getElementById("minimizeComposeBtn").addEventListener("click", minimize);
  document.getElementById("deleteDraftBtn").addEventListener("click", discard);
  sendBtn.addEventListener("click", send);

  toInput.addEventListener("input", () => (toInput.style.borderBottom = ""));

  return { open, openReply, close };
})();

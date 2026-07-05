jsconst defaultEmails = [
  {
    id: "1",
    from: "amazon@amazon.in",
    to: "user@gmail.com",
    subject: "Your order has shipped",
    body: "Your recent order is on its way.",
    date: "2026-07-01T10:00:00Z",
    read: false,
    starred: false,
    folder: "inbox"
  },
  {
    id: "2",
    from: "hr@company.com",
    to: "user@gmail.com",
    subject: "Meeting Reminder",
    body: "Don't forget the 3 PM meeting.",
    date: "2026-07-02T09:30:00Z",
    read: true,
    starred: true,
    folder: "inbox"
  },
  {
    id: "3",
    from: "user@gmail.com",
    to: "friend@gmail.com",
    subject: "Weekend plans",
    body: "Are we still on for Saturday?",
    date: "2026-07-03T14:00:00Z",
    read: true,
    starred: false,
    folder: "sent"
  }
];
js\storage.js
jsconst STORAGE_KEY = "emails";

function initializeStorage() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmails));
  }
}

function getAllEmails() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveAllEmails(emails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
}

function getEmailById(id) {
  return getAllEmails().find(email => email.id === id);
}

function updateEmail(id, updates) {
  const emails = getAllEmails();
  const index = emails.findIndex(e => e.id === id);
  if (index !== -1) {
    emails[index] = { ...emails[index], ...updates };
    saveAllEmails(emails);
  }
}

function addEmail(email) {
  const emails = getAllEmails();
  emails.push(email);
  saveAllEmails(emails);
}

function deleteEmailPermanently(id) {
  const emails = getAllEmails().filter(e => e.id !== id);
  saveAllEmails(emails);
}
js\folders.js
jslet currentFolder = "inbox";

function switchFolder(folderName) {
  currentFolder = folderName;

  document.querySelectorAll('.folder-item').forEach(item => {
    item.classList.toggle('active', item.dataset.folder === folderName);
  });

  document.getElementById('currentFolderLabel').textContent =
    folderName.charAt(0).toUpperCase() + folderName.slice(1);

  renderEmailList(folderName);
}

document.querySelectorAll('.folder-item').forEach(item => {
  item.addEventListener('click', () => switchFolder(item.dataset.folder));
});
js\emails.js
jsfunction renderEmailList(folder) {
  const emails = getAllEmails().filter(e => e.folder === folder);
  const listEl = document.getElementById('emailList');
  listEl.innerHTML = '';

  if (emails.length === 0) {
    listEl.innerHTML = '<li class="empty-state">No emails here</li>';
    return;
  }

  emails.forEach(email => {
    const li = document.createElement('li');
    li.className = 'email-item' + (email.read ? '' : ' unread');
    li.dataset.id = email.id;
    li.innerHTML = `
      <span class="star-icon" data-id="${email.id}">${email.starred ? '⭐' : '☆'}</span>
      <span class="email-from">${email.from}</span>
      <span class="email-subject">${email.subject}</span>
      <span class="email-date">${new Date(email.date).toLocaleDateString()}</span>
    `;
    li.addEventListener('click', (e) => {
      if (!e.target.classList.contains('star-icon')) {
        openEmail(email.id);
      }
    });
    listEl.appendChild(li);
  });
}

function openEmail(id) {
  updateEmail(id, { read: true });
  const email = getEmailById(id);
  document.getElementById('readingPane').classList.remove('hidden');
  document.getElementById('emailDetail').innerHTML = `
    <h2>${email.subject}</h2>
    <p><strong>From:</strong> ${email.from}</p>
    <p><strong>To:</strong> ${email.to}</p>
    <hr>
    <p>${email.body}</p>
  `;
  renderEmailList(currentFolder);
}
js\app.js
jsdocument.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('currentUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  initializeStorage();
  renderEmailList('inbox');

  const profileEmail = document.getElementById('profileEmail');
  if (profileEmail) {
    profileEmail.textContent = JSON.parse(user).email;
  }
});

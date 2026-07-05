document.addEventListener('click', (e) => {
  if (e.target.classList.contains('star-icon')) {
    const id = e.target.dataset.id;
    toggleStar(id);
  }
});

function toggleStar(id) {
  const email = getEmailById(id);
  updateEmail(id, { starred: !email.starred });
  renderEmailList(currentFolder);
}

function deleteEmail(id) {
  updateEmail(id, { folder: 'trash' });
  renderEmailList(currentFolder);
}

function archiveEmail(id) {
  updateEmail(id, { folder: 'archive' });
  renderEmailList(currentFolder);
}

function restoreEmail(id) {
  updateEmail(id, { folder: 'inbox' });
  renderEmailList(currentFolder);
}

function markAsRead(id) {
  updateEmail(id, { read: true });
  renderEmailList(currentFolder);
}

function markAsUnread(id) {
  updateEmail(id, { read: false });
  renderEmailList(currentFolder);
}

function replyToEmail(id) {
  const original = getEmailById(id);
  document.getElementById('composeModal').classList.remove('hidden');
  document.getElementById('composeTo').value = original.from;
  document.getElementById('composeSubject').value = 'Re: ' + original.subject;
}
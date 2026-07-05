function showNotification(message) {
  const note = document.createElement('div');
  note.className = 'toast-notification';
  note.textContent = message;
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 3000);
}

document.getElementById('notificationBtn').addEventListener('click', () => {
  const unreadCount = getAllEmails().filter(e => e.folder === 'inbox' && !e.read).length;
  showNotification(`You have ${unreadCount} unread emails`);
});

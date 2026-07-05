jsdocument.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  const emails = getAllEmails().filter(email => email.folder === currentFolder);

  const filtered = query
    ? emails.filter(email =>
        email.subject.toLowerCase().includes(query) ||
        email.from.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
      )
    : emails;

  renderFilteredEmails(filtered);
});

function renderFilteredEmails(emails) {
  const listEl = document.getElementById('emailList');
  listEl.innerHTML = '';

  if (emails.length === 0) {
    listEl.innerHTML = '<li class="empty-state">No matching emails</li>';
    return;
  }

  emails.forEach(email => {
    const li = document.createElement('li');
    li.className = 'email-item' + (email.read ? '' : ' unread');
    li.innerHTML = `
      <span class="star-icon" data-id="${email.id}">${email.starred ? '⭐' : '☆'}</span>
      <span class="email-from">${email.from}</span>
      <span class="email-subject">${email.subject}</span>
      <span class="email-date">${new Date(email.date).toLocaleDateString()}</span>
    `;
    li.addEventListener('click', () => openEmail(email.id));
    listEl.appendChild(li);
  });
}

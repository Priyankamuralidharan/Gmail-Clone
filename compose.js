document.getElementById('composeBtn').addEventListener('click', openCompose);
document.getElementById('closeComposeBtn').addEventListener('click', closeCompose);
document.getElementById('sendEmailBtn').addEventListener('click', sendComposedEmail);
document.getElementById('saveDraftBtn').addEventListener('click', saveComposedDraft);

function openCompose() {
  document.getElementById('composeModal').classList.remove('hidden');
}

function closeCompose() {
  document.getElementById('composeModal').classList.add('hidden');
  clearComposeFields();
}

function clearComposeFields() {
  document.getElementById('composeTo').value = '';
  document.getElementById('composeSubject').value = '';
  document.getElementById('composeBody').value = '';
}

function sendComposedEmail() {
  const to = document.getElementById('composeTo').value.trim();
  const subject = document.getElementById('composeSubject').value.trim();
  const body = document.getElementById('composeBody').value.trim();

  if (!to) {
    alert('Please enter a recipient');
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const newEmail = {
    id: Date.now().toString(),
    from: currentUser.email,
    to: to,
    subject: subject || '(no subject)',
    body: body,
    date: new Date().toISOString(),
    read: true,
    starred: false,
    folder: 'sent'
  };

  addEmail(newEmail);
  closeCompose();
  if (typeof currentFolder !== 'undefined' && currentFolder === 'sent') {
    renderEmailList('sent');
  }
}

function saveComposedDraft() {
  const to = document.getElementById('composeTo').value.trim();
  const subject = document.getElementById('composeSubject').value.trim();
  const body = document.getElementById('composeBody').value.trim();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const draftEmail = {
    id: Date.now().toString(),
    from: currentUser.email,
    to: to,
    subject: subject || '(no subject)',
    body: body,
    date: new Date().toISOString(),
    read: true,
    starred: false,
    folder: 'drafts'
  };

  addEmail(draftEmail);
  closeCompose();
}
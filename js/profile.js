jsdocument.getElementById('profilePic').addEventListener('click', () => {
  document.getElementById('profileMenu').classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  const menu = document.getElementById('profileMenu');
  const pic = document.getElementById('profilePic');
  if (!menu.contains(e.target) && e.target !== pic) {
    menu.classList.add('hidden');
  }
});
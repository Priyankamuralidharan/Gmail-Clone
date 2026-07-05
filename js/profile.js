// js/profile.js — profile avatar dropdown + logout

const Profile = (function () {
  const profileBtn = document.getElementById("profileBtn");
  const dropdown = document.getElementById("profileDropdown");

  function init() {
    const name = sessionStorage.getItem("gmail_clone_name") || "User";
    const email = sessionStorage.getItem("gmail_clone_email") || "user@gmail.com";
    const initial = name.charAt(0).toUpperCase();

    document.getElementById("avatarInitial").textContent = initial;
    document.getElementById("avatarInitialLg").textContent = initial;
    document.getElementById("profileName").textContent = name;
    document.getElementById("profileEmail").textContent = email;
  }

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== profileBtn) {
      dropdown.classList.add("hidden");
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("gmail_clone_logged_in");
    window.location.href = "index.html";
  });

  return { init };
})();

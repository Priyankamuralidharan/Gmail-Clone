// js/login.js — handles the two-step Google-style login flow

(function () {
  const stepEmail = document.getElementById("stepEmail");
  const stepPassword = document.getElementById("stepPassword");

  const emailInput = document.getElementById("emailInput");
  const emailError = document.getElementById("emailError");
  const nextBtn = document.getElementById("nextBtn");

  const passwordInput = document.getElementById("passwordInput");
  const passError = document.getElementById("passError");
  const signInBtn = document.getElementById("signInBtn");
  const backBtn = document.getElementById("backBtn");
  const userChip = document.getElementById("userChip");
  const showPassword = document.getElementById("showPassword");

  // If already logged in, skip straight to inbox
  if (sessionStorage.getItem("gmail_clone_logged_in") === "true") {
    window.location.href = "inbox.html";
  }

  function isValidEmail(value) {
    // Accept "name" (auto-appends @gmail.com) or a full email address
    const simpleName = /^[a-zA-Z0-9._%+-]+$/;
    const fullEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return simpleName.test(value) || fullEmail.test(value);
  }

  function goToPasswordStep() {
    const value = emailInput.value.trim();
    if (!value) {
      emailError.textContent = "Enter an email or phone number";
      return;
    }
    if (!isValidEmail(value)) {
      emailError.textContent = "Enter a valid email";
      return;
    }
    emailError.textContent = "";
    const displayEmail = value.includes("@") ? value : `${value}@gmail.com`;
    userChip.textContent = displayEmail;
    sessionStorage.setItem("gmail_clone_email", displayEmail);
    stepEmail.classList.add("hidden");
    stepPassword.classList.remove("hidden");
    setTimeout(() => passwordInput.focus(), 100);
  }

  function goToEmailStep() {
    stepPassword.classList.add("hidden");
    stepEmail.classList.remove("hidden");
    passError.textContent = "";
    passwordInput.value = "";
  }

  function attemptSignIn() {
    const pass = passwordInput.value;
    if (!pass || pass.length < 4) {
      passError.textContent = "Enter a password with at least 4 characters";
      return;
    }
    passError.textContent = "";
    sessionStorage.setItem("gmail_clone_logged_in", "true");

    const name = sessionStorage.getItem("gmail_clone_email").split("@")[0];
    sessionStorage.setItem(
      "gmail_clone_name",
      name.charAt(0).toUpperCase() + name.slice(1)
    );

    signInBtn.textContent = "Signing in...";
    signInBtn.disabled = true;
    setTimeout(() => {
      window.location.href = "inbox.html";
    }, 500);
  }

  nextBtn.addEventListener("click", goToPasswordStep);
  emailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") goToPasswordStep();
  });

  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    goToEmailStep();
  });

  signInBtn.addEventListener("click", attemptSignIn);
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptSignIn();
  });

  showPassword.addEventListener("change", () => {
    passwordInput.type = showPassword.checked ? "text" : "password";
  });
})();

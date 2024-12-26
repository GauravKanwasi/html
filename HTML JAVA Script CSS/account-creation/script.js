// Array of Anime GIF URLs
const animeGifs = [
  "https://media.giphy.com/media/26gPHzpMX5bCHpKZ2/giphy.gif",
  "https://media.giphy.com/media/3o6Zt5pPkb7vOlmPjC/giphy.gif",
  "https://media.giphy.com/media/5xaOcLFAuIu8gTo6lq/giphy.gif",
  "https://media.giphy.com/media/9J7tdSrtppX9e/giphy.gif",
  "https://media.giphy.com/media/3o7abAmY9p06S2AzOO/giphy.gif",
  "https://media.giphy.com/media/ya6uFRkTe4klq/giphy.gif",
];

// Set a random GIF from the array
function setRandomGif() {
  const randomIndex = Math.floor(Math.random() * animeGifs.length);
  const gif = animeGifs[randomIndex];
  document.getElementById("anime-gif").src = gif;
}

// Call setRandomGif on page load
window.onload = setRandomGif;

// Form Validation (JS)
function validateForm() {
  document.getElementById("username-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("password-error").textContent = "";
  document.getElementById("confirm-password-error").textContent = "";
  document.getElementById("success-message").textContent = "";

  let isValid = true;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate username
  if (username.trim() === "") {
    document.getElementById("username-error").textContent =
      "Username is required.";
    isValid = false;
  }

  // Validate email
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    document.getElementById("email-error").textContent =
      "Please enter a valid email address.";
    isValid = false;
  }

  // Validate password
  if (password.trim() === "") {
    document.getElementById("password-error").textContent =
      "Password is required.";
    isValid = false;
  }

  // Validate confirm password
  if (confirmPassword !== password) {
    document.getElementById("confirm-password-error").textContent =
      "Passwords do not match.";
    isValid = false;
  }

  // Success message if validation passes
  if (isValid) {
    document.getElementById("success-message").textContent =
      "Account created successfully!";
  }

  return isValid;
}

document
  .getElementById("surpriseButton")
  .addEventListener("click", function () {
    var surpriseMessage = document.getElementById("surpriseMessage");
    surpriseMessage.style.display = "block";
  });

// Form submission handler
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    if (name && email && message) {
      document.getElementById("formFeedback").style.display = "block"; // Show success message
      document.getElementById("contactForm").reset(); // Reset the form
    }
  });

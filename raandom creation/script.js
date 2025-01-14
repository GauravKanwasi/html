document
  .getElementById("surpriseButton")
  .addEventListener("click", function () {
    var surpriseMessage = document.getElementById("surpriseMessage");
    surpriseMessage.style.display = "block";
    surpriseMessage.classList.add("fade-in");
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
      var formFeedback = document.getElementById("formFeedback");
      formFeedback.style.display = "block"; // Show success message
      formFeedback.classList.add("fade-in");

      // Reset the form after 3 seconds
      setTimeout(function () {
        formFeedback.style.display = "none";
        document.getElementById("contactForm").reset();
      }, 3000); // Hide feedback after 3 seconds
    }
  });

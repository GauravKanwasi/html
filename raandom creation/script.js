// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});

// Theme Toggle with Enhanced Animation
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;

const toggleTheme = () => {
  const isDark = body.dataset.theme === "dark";
  body.dataset.theme = isDark ? "light" : "dark";

  // Enhanced icon transition
  const icon = themeToggle.querySelector("i");
  icon.style.transform = "rotate(360deg)";
  icon.classList.toggle("fa-sun");
  icon.classList.toggle("fa-moon");

  localStorage.setItem("theme", body.dataset.theme);

  // Add transition effect to background
  document.querySelectorAll(".gradient-sphere").forEach((sphere) => {
    sphere.style.transition = "background 0.3s ease";
  });
};

// Mobile Menu Toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.querySelector("i").classList.toggle("fa-times");
});

// Parallax Effect for Hero Section
document.addEventListener("mousemove", (e) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

  document.querySelectorAll(".gradient-sphere").forEach((sphere) => {
    sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});

// Enhanced Scroll Progress Indicator
const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
  const windowHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / windowHeight) * 100;
  progressBar.style.width = `${progress}%`;

  // Add gradient shift effect
  progressBar.style.background = `linear-gradient(90deg, 
        var(--primary-color) ${progress}%, 
        transparent ${progress}%)`;
});

// Portfolio Item Hover Effect
document.querySelectorAll(".portfolio-item").forEach((item) => {
  item.addEventListener("mouseenter", (e) => {
    const overlay = item.querySelector(".portfolio-overlay");
    overlay.style.bottom = "0";
  });

  item.addEventListener("mouseleave", (e) => {
    const overlay = item.querySelector(".portfolio-overlay");
    overlay.style.bottom = "-100%";
  });
});

// Enhanced Form Validation and Submission
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    showFeedback("Message sent successfully!", "success");
    contactForm.reset();
  } catch (error) {
    showFeedback("Failed to send message. Please try again.", "error");
  } finally {
    submitBtn.innerHTML = "Send Message";
    submitBtn.disabled = false;
  }
});

// Enhanced Feedback Display
function showFeedback(message, type) {
  formFeedback.textContent = message;
  formFeedback.className = `feedback ${type} fade-in`;

  setTimeout(() => {
    formFeedback.classList.add("fade-out");
    setTimeout(() => {
      formFeedback.style.display = "none";
      formFeedback.classList.remove("fade-out");
    }, 300);
  }, 3000);
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Back to Top Button with Smooth Animation
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTop.classList.remove("hidden");
  } else {
    backToTop.classList.add("hidden");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Check saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.dataset.theme = savedTheme;
    if (savedTheme === "dark") {
      themeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
    }
  }

  // Initialize AOS
  AOS.refresh();
});

// Enhanced Scroll Animation
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.2,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      // Add random delay for cascade effect
      entry.target.style.transitionDelay = `${Math.random() * 0.3}s`;
    } else {
      entry.target.classList.remove("visible");
      entry.target.style.transitionDelay = "0s";
    }
  });
}, observerOptions);

document.querySelectorAll(".animate-on-scroll").forEach((element) => {
  observer.observe(element);
});

// Add Typing Effect to Hero Title
const heroTitle = document.querySelector(".hero h1");
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }

  // Start typing effect when hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      typeWriter();
    }
  });

  heroObserver.observe(hero);
}

// Add Feature Cards Hover Effect
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", (e) => {
    const icon = card.querySelector("i");
    icon.style.transform = "scale(1.2) rotate(360deg)";
  });

  card.addEventListener("mouseleave", (e) => {
    const icon = card.querySelector("i");
    icon.style.transform = "scale(1) rotate(0deg)";
  });
});

// Dynamic Cube Animation
const cube = document.querySelector(".cube");
let rotateX = 0;
let rotateY = 0;
let isHovered = false;

cube.addEventListener("mouseenter", () => {
  isHovered = true;
});

cube.addEventListener("mouseleave", () => {
  isHovered = false;
});

document.addEventListener("mousemove", (e) => {
  if (!isHovered) return;

  const x = (window.innerWidth / 2 - e.pageX) / 20;
  const y = (window.innerHeight / 2 - e.pageY) / 20;

  cube.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
});

// Enhanced Floating Elements
const elements = document.querySelectorAll(".element");
elements.forEach((element, index) => {
  element.style.animationDelay = `${index * 0.5}s`;
});

// Dynamic Background Effect
document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  document.querySelectorAll(".gradient-sphere").forEach((sphere) => {
    const speed = parseFloat(sphere.dataset.speed) || 0.05;
    const x = (mouseX - 0.5) * speed * 100;
    const y = (mouseY - 0.5) * speed * 100;

    sphere.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// Feature Cards Interactive Animation
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

// Initialize AOS with custom settings
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  easing: "ease-out-cubic",
});

// script.js
// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  easing: 'ease-out-cubic'
});

// Debounce function for performance optimization
function debounce(fn, wait = 100) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Theme Toggle Functionality
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

const toggleTheme = () => {
  const isDark = body.dataset.theme === 'dark';
  body.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', body.dataset.theme);
  
  const icon = themeToggle.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
};

themeToggle.addEventListener('click', toggleTheme);

// Mobile Menu Functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

// Close mobile menu on click outside
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Scroll Progress Indicator
const progressBar = document.querySelector('.scroll-progress');
const updateProgress = debounce(() => {
  const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / windowHeight) * 100;
  progressBar.style.width = `${progress}%`;
});

window.addEventListener('scroll', updateProgress);

// Back to Top Button
const backToTop = document.querySelector('.back-to-top');
const updateBackToTop = debounce(() => {
  backToTop.classList.toggle('hidden', window.pageYOffset < 300);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Lazy Load Images
const lazyImages = document.querySelectorAll('.lazyload');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazyload');
      imageObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '200px 0px'
});

lazyImages.forEach(img => imageObserver.observe(img));

// Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

const validateEmail = (email) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const showFeedback = (message, type) => {
  formFeedback.textContent = message;
  formFeedback.className = `feedback ${type} fade-in`;
  setTimeout(() => {
    formFeedback.classList.add('fade-out');
    setTimeout(() => {
      formFeedback.style.display = 'none';
      formFeedback.classList.remove('fade-out');
    }, 300);
  }, 3000);
};

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);

  // Basic validation
  if (!validateEmail(formData.get('email'))) {
    showFeedback('Please enter a valid email address', 'error');
    return;
  }

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    showFeedback('Message sent successfully!', 'success');
    contactForm.reset();
  } catch (error) {
    showFeedback('Failed to send message. Please try again.', 'error');
  } finally {
    submitBtn.innerHTML = 'Send Message';
    submitBtn.disabled = false;
  }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Initialize Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
  });
}

// Parallax Effect for Floating Elements
document.addEventListener('mousemove', (e) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

  document.querySelectorAll('.gradient-sphere').forEach(sphere => {
    sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});

// Dynamic Cube Rotation
const cube = document.querySelector('.cube');
let rotateX = 0;
let rotateY = 0;
let isHovered = false;

cube.addEventListener('mouseenter', () => {
  isHovered = true;
  cube.style.transition = 'transform 0.3s ease-out';
});

cube.addEventListener('mouseleave', () => {
  isHovered = false;
  cube.style.transition = 'transform 1s ease-out';
  cube.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

document.addEventListener('mousemove', (e) => {
  if (!isHovered) return;

  const x = (window.innerWidth / 2 - e.pageX) / 20;
  const y = (window.innerHeight / 2 - e.pageY) / 20;

  cube.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
});

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.dataset.theme = savedTheme;
    if (savedTheme === 'dark') {
      themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
  }

  // Refresh AOS after initial load
  AOS.refresh();

  // Add animation delays to feature cards
  document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 100}ms`;
  });
});

// Window resize handler
window.addEventListener('resize', debounce(() => {
  AOS.refresh();
}));

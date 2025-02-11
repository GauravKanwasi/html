// State management
const state = {
  darkMode: false,
  currentTemplate: "modern",
  sections: [],
  history: [],
  currentHistoryIndex: -1,
  imageUploads: new Map(),
};

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  setupEventListeners();
  loadSavedData();
  setupDragAndDrop();
  setupTemplateSelection();
  setupCustomization();
  setupAnimations();
  enhanceDragAndDrop();
  setupTooltips();
});

function initializeApp() {
  // Add initial personal section
  addSection("personal");
  updatePreview();
}

function setupEventListeners() {
  // Theme toggle
  document
    .querySelector(".theme-toggle")
    .addEventListener("click", toggleTheme);

  // Export functionality
  setupExportOptions();

  // Save functionality
  document.querySelector(".save-btn").addEventListener("click", saveResume);

  // Auto-save on changes
  document.addEventListener("input", debounce(autoSave, 1000));

  // Update progress on changes
  document.addEventListener("input", debounce(updateProgress, 500));
}

// Theme toggle functionality
function toggleTheme() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle("dark-mode");
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector(".theme-toggle i");
  icon.className = state.darkMode ? "fas fa-sun" : "fas fa-moon";
}

// Section management
function addSection(type) {
  const section = createSection(type);
  const resumeContainer = document.querySelector(".resume-container");
  resumeContainer.appendChild(section);

  // Add to state
  state.sections.push({
    id: section.dataset.id,
    type: type,
  });

  // Setup section functionality
  setupSectionListeners(section);
  updatePreview();
  saveHistoryState();
  animateNewSection(section);
}

function createSection(type) {
  const section = document.createElement("div");
  section.className = "resume-section";
  section.dataset.type = type;
  section.dataset.id = `section-${Date.now()}`;

  const template = getSectionTemplate(type);
  section.innerHTML = `
    <div class="section-header">
      <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
      <h3 contenteditable="true">${getSectionTitle(type)}</h3>
      <div class="section-controls">
        <button class="delete-section"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="section-content">
      ${template}
    </div>
  `;

  return section;
}

function getSectionTemplate(type) {
  const templates = {
    personal: `
      <div class="personal-info">
        <div class="profile-picture-container">
          <div class="profile-picture">
            <input type="file" accept="image/*" class="profile-upload">
            <i class="fas fa-user-circle"></i>
          </div>
        </div>
        <div class="info-fields">
          <div class="editable-field" contenteditable="true" data-placeholder="Full Name"></div>
          <div class="editable-field" contenteditable="true" data-placeholder="Professional Title"></div>
          <div class="contact-info">
            <div class="editable-field" contenteditable="true" data-placeholder="Email"></div>
            <div class="editable-field" contenteditable="true" data-placeholder="Phone"></div>
            <div class="editable-field" contenteditable="true" data-placeholder="Location"></div>
          </div>
          <div class="social-links">
            <div class="social-link">
              <i class="fab fa-linkedin"></i>
              <div class="editable-field" contenteditable="true" data-placeholder="LinkedIn URL"></div>
            </div>
            <div class="social-link">
              <i class="fab fa-github"></i>
              <div class="editable-field" contenteditable="true" data-placeholder="GitHub URL"></div>
            </div>
          </div>
        </div>
      </div>
    `,
    experience: `
      <div class="experience-entries">
        <div class="experience-entry">
          <div class="editable-field" contenteditable="true" data-placeholder="Company Name"></div>
          <div class="editable-field" contenteditable="true" data-placeholder="Position"></div>
          <div class="date-range">
            <div class="editable-field" contenteditable="true" data-placeholder="Start Date"></div>
            <div class="editable-field" contenteditable="true" data-placeholder="End Date"></div>
          </div>
          <div class="editable-field description" contenteditable="true" data-placeholder="Description"></div>
        </div>
        <button class="add-entry-btn"><i class="fas fa-plus"></i> Add Experience</button>
      </div>
    `,
    education: `
      <div class="education-entries">
        <div class="education-entry">
          <div class="editable-field" contenteditable="true" data-placeholder="Institution"></div>
          <div class="editable-field" contenteditable="true" data-placeholder="Degree"></div>
          <div class="date-range">
            <div class="editable-field" contenteditable="true" data-placeholder="Start Year"></div>
            <div class="editable-field" contenteditable="true" data-placeholder="End Year"></div>
          </div>
          <div class="editable-field" contenteditable="true" data-placeholder="Additional Details"></div>
        </div>
        <button class="add-entry-btn"><i class="fas fa-plus"></i> Add Education</button>
      </div>
    `,
    skills: `
      <div class="skills-container">
        <div class="skill-tags">
          <div class="skill-input-container">
            <input type="text" class="skill-input" placeholder="Add a skill">
            <button class="add-skill-btn"><i class="fas fa-plus"></i></button>
          </div>
          <div class="skill-list"></div>
        </div>
      </div>
    `,
  };
  return templates[type] || "";
}

// Setup drag and drop
function setupDragAndDrop() {
  const sectionItems = document.querySelectorAll(".section-item");
  const resumeContainer = document.querySelector(".resume-container");

  sectionItems.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
  });

  resumeContainer.addEventListener("dragover", handleDragOver);
  resumeContainer.addEventListener("drop", handleDrop);
}

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.section);
  e.target.classList.add("dragging");
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const sectionType = e.dataTransfer.getData("text/plain");
  addSection(sectionType);
}

// Template selection
function setupTemplateSelection() {
  const templateItems = document.querySelectorAll(".template-item");
  templateItems.forEach((item) => {
    item.addEventListener("click", () => {
      templateItems.forEach((t) => t.classList.remove("active"));
      item.classList.add("active");
      state.currentTemplate = item.dataset.template;
      updatePreview();
    });
  });
}

// Customization
function setupCustomization() {
  const fontSelect = document.querySelector(".font-family-select");
  const primaryColor = document.querySelector(".primary-color");
  const secondaryColor = document.querySelector(".secondary-color");
  const spacingSlider = document.querySelector(".spacing-slider");

  [fontSelect, primaryColor, secondaryColor, spacingSlider].forEach(
    (element) => {
      element.addEventListener("change", updateCustomization);
    }
  );
}

function updateCustomization() {
  const root = document.documentElement;
  const fontFamily = document.querySelector(".font-family-select").value;
  const primaryColor = document.querySelector(".primary-color").value;
  const secondaryColor = document.querySelector(".secondary-color").value;
  const spacing = document.querySelector(".spacing-slider").value;

  root.style.setProperty("--primary-color", primaryColor);
  root.style.setProperty("--secondary-color", secondaryColor);
  document.body.style.fontFamily = fontFamily;
  root.style.setProperty("--spacing-base", `${spacing}rem`);
}

// Helper functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.querySelector(".notification-container").appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }, 100);
}

// Add new functions for export functionality
function setupExportOptions() {
  const exportBtn = document.querySelector(".export-btn");
  const exportOptions = document.querySelector(".export-options");

  exportBtn.addEventListener("click", () => {
    exportOptions.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!exportBtn.contains(e.target)) {
      exportOptions.classList.remove("show");
    }
  });

  const exportButtons = exportOptions.querySelectorAll("button");
  exportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const format = button.dataset.format;
      exportResume(format);
    });
  });
}

async function exportResume(format) {
  const resumeContainer = document.querySelector(".preview-container");
  const exportOptions = {
    margin: 10,
    filename: "resume",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    switch (format) {
      case "pdf":
        await html2pdf().set(exportOptions).from(resumeContainer).save();
        break;
      case "png":
        const canvas = await html2canvas(resumeContainer, { scale: 2 });
        const link = document.createElement("a");
        link.download = "resume.png";
        link.href = canvas.toDataURL();
        link.click();
        break;
      case "print":
        window.print();
        break;
    }
    showNotification("Resume exported successfully!", "success");
  } catch (error) {
    showNotification("Export failed. Please try again.", "error");
    console.error("Export error:", error);
  }
}

// Add image upload functionality
function setupImageUpload(section) {
  const imageUploader = section.querySelector(".image-upload");
  if (!imageUploader) return;

  imageUploader.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      const imagePreview = section.querySelector(".image-preview");
      imagePreview.style.backgroundImage = `url(${imageUrl})`;
      imagePreview.classList.add("has-image");

      // Store in state
      state.imageUploads.set(section.dataset.id, imageUrl);
      autoSave();
    } catch (error) {
      showNotification("Image upload failed. Please try again.", "error");
      console.error("Upload error:", error);
    }
  });
}

async function handleImageUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Add notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }, 100);
}

// GSAP Animations
function setupAnimations() {
  // Initial page load animation
  gsap.from(".sidebar", {
    duration: 0.8,
    x: -100,
    opacity: 0,
    ease: "power3.out",
  });

  gsap.from(".editor-area, .preview-area", {
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out",
  });

  // Template switching animation
  function animateTemplateSwitch(template) {
    gsap.to(".preview-container", {
      duration: 0.3,
      opacity: 0,
      scale: 0.95,
      onComplete: () => {
        updateTemplate(template);
        gsap.to(".preview-container", {
          duration: 0.3,
          opacity: 1,
          scale: 1,
        });
      },
    });
  }

  // Section add animation
  function animateNewSection(section) {
    gsap.from(section, {
      duration: 0.5,
      height: 0,
      opacity: 0,
      padding: 0,
      ease: "power2.out",
    });
  }
}

// Enhanced drag and drop
function enhanceDragAndDrop() {
  const draggables = document.querySelectorAll(".section-item");
  let dragPreview = null;

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", (e) => {
      // Create drag preview
      dragPreview = document.createElement("div");
      dragPreview.className = "section-drag-preview";
      dragPreview.innerHTML = draggable.innerHTML;
      document.body.appendChild(dragPreview);

      // Hide default drag image
      const img = new Image();
      e.dataTransfer.setDragImage(img, 0, 0);

      draggable.classList.add("dragging");
    });

    draggable.addEventListener("drag", (e) => {
      if (dragPreview) {
        dragPreview.style.left = e.pageX + "px";
        dragPreview.style.top = e.pageY + "px";
      }
    });

    draggable.addEventListener("dragend", () => {
      if (dragPreview) {
        dragPreview.remove();
        dragPreview = null;
      }
      draggable.classList.remove("dragging");
    });
  });
}

// Progress tracking
function updateProgress() {
  const sections = document.querySelectorAll(".resume-section");
  const totalFields = document.querySelectorAll(".editable-field").length;
  const filledFields = document.querySelectorAll(
    ".editable-field:not(:empty)"
  ).length;
  const progress = (filledFields / totalFields) * 100;

  gsap.to(".progress-bar", {
    scaleX: progress / 100,
    duration: 0.5,
    ease: "power2.out",
  });
}

// Interactive tooltips
function setupTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]");
  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", (e) => {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = e.target.dataset.tooltip;
      document.body.appendChild(tooltip);

      const rect = e.target.getBoundingClientRect();
      tooltip.style.left =
        rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px";

      gsap.from(tooltip, {
        duration: 0.3,
        y: 10,
        opacity: 0,
        ease: "power2.out",
      });
    });

    element.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".tooltip");
      if (tooltip) {
        gsap.to(tooltip, {
          duration: 0.2,
          opacity: 0,
          onComplete: () => tooltip.remove(),
        });
      }
    });
  });
}

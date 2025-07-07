const state = {
    darkMode: false,
    currentTemplate: "modern",
    sections: [],
    history: [],
    currentHistoryIndex: -1,
    imageUploads: new Map(),
    currentColorScheme: "scheme-1"
};

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
    addSection("personal");
    updatePreview();
}

function setupEventListeners() {
    document.querySelector(".theme-toggle").addEventListener("click", toggleTheme);
    setupExportOptions();
    document.querySelector(".save-btn").addEventListener("click", saveResume);
    document.addEventListener("input", debounce(autoSave, 1000));
    document.addEventListener("input", debounce(updateProgress, 500));
}

function toggleTheme() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle("dark-mode");
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector(".theme-toggle i");
    icon.className = state.darkMode ? "fas fa-sun" : "fas fa-moon";
}

function addSection(type) {
    const section = createSection(type);
    const resumeContainer = document.querySelector(".resume-container");
    resumeContainer.appendChild(section);
    state.sections.push({
        id: section.dataset.id,
        type: type,
    });
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
                <button class="delete-section" data-tooltip="Delete section"><i class="fas fa-trash"></i></button>
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
        `
    };
    return templates[type] || "";
}

function getSectionTitle(type) {
    const titles = {
        personal: "Personal Information",
        experience: "Work Experience",
        education: "Education",
        skills: "Skills",
        projects: "Projects",
        certificates: "Certificates",
        languages: "Languages"
    };
    return titles[type] || "Section";
}

function setupDragAndDrop() {
    const sectionItems = document.querySelectorAll(".section-item");
    const resumeContainer = document.querySelector(".resume-container");
    
    sectionItems.forEach((item) => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragend", handleDragEnd);
    });
    
    resumeContainer.addEventListener("dragover", handleDragOver);
    resumeContainer.addEventListener("drop", handleDrop);
    
    // Make sections reorderable
    new Sortable(resumeContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: () => {
            updatePreview();
            saveHistoryState();
        }
    });
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

function setupTemplateSelection() {
    const templateItems = document.querySelectorAll(".template-item");
    templateItems.forEach((item) => {
        item.addEventListener("click", () => {
            templateItems.forEach((t) => t.classList.remove("active"));
            item.classList.add("active");
            state.currentTemplate = item.dataset.template;
            updateTemplate();
        });
    });
}

function updateTemplate() {
    const preview = document.querySelector(".preview-container");
    preview.className = `preview-container ${state.currentTemplate}-theme`;
    gsap.fromTo(preview, 
        { scale: 0.95, opacity: 0.7 },
        { duration: 0.4, scale: 1, opacity: 1, ease: "elastic.out(1, 0.3)" }
    );
}

function setupCustomization() {
    const fontSelect = document.querySelector(".font-family-select");
    const primaryColor = document.querySelector(".primary-color");
    const secondaryColor = document.querySelector(".secondary-color");
    const spacingSlider = document.querySelector(".spacing-slider");
    const colorSchemeButtons = document.querySelectorAll(".color-scheme div");
    
    fontSelect.addEventListener("change", updateFontFamily);
    primaryColor.addEventListener("change", updatePrimaryColor);
    secondaryColor.addEventListener("change", updateSecondaryColor);
    spacingSlider.addEventListener("input", updateSpacing);
    
    colorSchemeButtons.forEach(button => {
        button.addEventListener("click", () => {
            colorSchemeButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            state.currentColorScheme = button.dataset.color;
            updateColorScheme();
        });
    });
}

function updateFontFamily() {
    const fontFamily = document.querySelector(".font-family-select").value;
    document.body.style.fontFamily = fontFamily;
}

function updatePrimaryColor() {
    const primaryColor = document.querySelector(".primary-color").value;
    document.documentElement.style.setProperty("--primary-color", primaryColor);
}

function updateSecondaryColor() {
    const secondaryColor = document.querySelector(".secondary-color").value;
    document.documentElement.style.setProperty("--secondary-color", secondaryColor);
}

function updateSpacing() {
    const spacing = document.querySelector(".spacing-slider").value;
    document.documentElement.style.setProperty("--spacing-base", `${spacing}rem`);
}

function updateColorScheme() {
    const colorSchemes = {
        "scheme-1": { primary: "#2563eb", secondary: "#1f2937" },
        "scheme-2": { primary: "#ec4899", secondary: "#f59e0b" },
        "scheme-3": { primary: "#10b981", secondary: "#3b82f6" }
    };
    
    const colors = colorSchemes[state.currentColorScheme];
    if (colors) {
        document.querySelector(".primary-color").value = colors.primary;
        document.querySelector(".secondary-color").value = colors.secondary;
        document.documentElement.style.setProperty("--primary-color", colors.primary);
        document.documentElement.style.setProperty("--secondary-color", colors.secondary);
    }
}

function setupExportOptions() {
    const exportBtn = document.querySelector(".export-btn");
    const exportOptions = document.querySelector(".export-menu");
    
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
        filename: `resume_${new Date().toISOString().split('T')[0]}`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    
    try {
        switch (format) {
            case "pdf":
                await html2pdf().set(exportOptions).from(resumeContainer).save();
                break;
            case "docx":
                const doc = new window.docx.Document();
                const html = resumeContainer.innerHTML;
                doc.addSection({ children: htmlToParagraphs(html) });
                
                const packer = new window.docx.Packer();
                const blob = await packer.generateBlob(doc);
                saveAs(blob, `${exportOptions.filename}.docx`);
                break;
            case "png":
                const canvas = await html2canvas(resumeContainer, { scale: 2 });
                const link = document.createElement("a");
                link.download = `${exportOptions.filename}.png`;
                link.href = canvas.toDataURL();
                link.click();
                break;
            case "print":
                window.print();
                break;
        }
        showNotification(`Resume exported as ${format.toUpperCase()}!`, "success");
    } catch (error) {
        showNotification("Export failed. Please try again.", "error");
        console.error("Export error:", error);
    }
}

function htmlToParagraphs(html) {
    // Implementation for converting HTML to docx paragraphs
    return [new window.docx.Paragraph(html)];
}

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

function setupAnimations() {
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
}

function animateNewSection(section) {
    gsap.from(section, {
        duration: 0.5,
        height: 0,
        opacity: 0,
        padding: 0,
        ease: "power2.out",
    });
}

function enhanceDragAndDrop() {
    const draggables = document.querySelectorAll(".section-item");
    let dragPreview = null;
    
    draggables.forEach((draggable) => {
        draggable.addEventListener("dragstart", (e) => {
            dragPreview = document.createElement("div");
            dragPreview.className = "section-drag-preview";
            dragPreview.innerHTML = `
                <div class="drag-preview-content">
                    <i class="fas fa-grip-vertical preview-handle"></i>
                    <span>${draggable.querySelector("span").textContent}</span>
                </div>
            `;
            document.body.appendChild(dragPreview);
            
            const img = new Image();
            e.dataTransfer.setDragImage(img, 0, 0);
            draggable.classList.add("dragging");
        });
        
        draggable.addEventListener("drag", (e) => {
            if (dragPreview) {
                gsap.to(dragPreview, {
                    duration: 0.1,
                    css: { 
                        left: e.pageX + 15 + "px", 
                        top: e.pageY + 15 + "px",
                        opacity: 0.9
                    }
                });
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

function updateProgress() {
    const sections = document.querySelectorAll(".resume-section");
    const totalFields = document.querySelectorAll(".editable-field").length;
    const filledFields = document.querySelectorAll(
        ".editable-field:not(:empty)"
    ).length;
    
    const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
    
    gsap.to(".progress-bar", {
        scaleX: progress / 100,
        duration: 0.5,
        ease: "power2.out",
    });
}

function setupSectionListeners(section) {
    const deleteBtn = section.querySelector(".delete-section");
    deleteBtn.addEventListener("click", () => {
        section.remove();
        state.sections = state.sections.filter(
            s => s.id !== section.dataset.id
        );
        updatePreview();
        saveHistoryState();
    });
    
    const editableFields = section.querySelectorAll(".editable-field");
    editableFields.forEach(field => {
        field.addEventListener("input", () => {
            updatePreview();
        });
    });
}

function saveHistoryState() {
    const currentState = JSON.stringify({
        sections: state.sections,
        currentTemplate: state.currentTemplate,
        colors: {
            primary: document.querySelector(".primary-color").value,
            secondary: document.querySelector(".secondary-color").value
        },
        font: document.querySelector(".font-family-select").value,
        spacing: document.querySelector(".spacing-slider").value
    });
    
    state.history = state.history.slice(0, state.currentHistoryIndex + 1);
    state.history.push(currentState);
    state.currentHistoryIndex++;
    
    // Enable undo/redo
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z' && state.currentHistoryIndex > 0) {
                state.currentHistoryIndex--;
                restoreState(state.history[state.currentHistoryIndex]);
            } else if (e.key === 'y' && state.currentHistoryIndex < state.history.length - 1) {
                state.currentHistoryIndex++;
                restoreState(state.history[state.currentHistoryIndex]);
            }
        }
    });
}

function restoreState(stateData) {
    const parsed = JSON.parse(stateData);
    state.sections = parsed.sections;
    state.currentTemplate = parsed.currentTemplate;
    
    // Update UI
    document.querySelector(".font-family-select").value = parsed.font;
    document.querySelector(".primary-color").value = parsed.colors.primary;
    document.querySelector(".secondary-color").value = parsed.colors.secondary;
    document.querySelector(".spacing-slider").value = parsed.spacing;
    
    updateCustomization();
    updateTemplate();
    
    // Rebuild resume container
    const resumeContainer = document.querySelector(".resume-container");
    resumeContainer.innerHTML = "";
    
    parsed.sections.forEach(section => {
        const sectionElement = createSection(section.type);
        sectionElement.dataset.id = section.id;
        resumeContainer.appendChild(sectionElement);
        setupSectionListeners(sectionElement);
    });
    
    updatePreview();
}

function autoSave() {
    localStorage.setItem("resumeData", JSON.stringify({
        sections: state.sections,
        currentTemplate: state.currentTemplate,
        colors: {
            primary: document.querySelector(".primary-color").value,
            secondary: document.querySelector(".secondary-color").value
        },
        font: document.querySelector(".font-family-select").value,
        spacing: document.querySelector(".spacing-slider").value,
        timestamp: new Date().toISOString()
    }));
}

function loadSavedData() {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            state.sections = data.sections;
            state.currentTemplate = data.currentTemplate;
            
            document.querySelector(".font-family-select").value = data.font;
            document.querySelector(".primary-color").value = data.colors.primary;
            document.querySelector(".secondary-color").value = data.colors.secondary;
            document.querySelector(".spacing-slider").value = data.spacing;
            
            updateCustomization();
            updateTemplate();
            
            const resumeContainer = document.querySelector(".resume-container");
            resumeContainer.innerHTML = "";
            
            data.sections.forEach(section => {
                const sectionElement = createSection(section.type);
                sectionElement.dataset.id = section.id;
                resumeContainer.appendChild(sectionElement);
                setupSectionListeners(sectionElement);
            });
            
            updatePreview();
            showNotification("Loaded saved resume data", "success");
        } catch (error) {
            console.error("Failed to load saved data:", error);
        }
    }
}

function saveResume() {
    const resumeData = {
        sections: state.sections,
        currentTemplate: state.currentTemplate,
        colors: {
            primary: document.querySelector(".primary-color").value,
            secondary: document.querySelector(".secondary-color").value
        },
        font: document.querySelector(".font-family-select").value,
        spacing: document.querySelector(".spacing-slider").value,
        lastModified: new Date().toISOString()
    };
    
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    showNotification("Resume saved successfully", "success");
}

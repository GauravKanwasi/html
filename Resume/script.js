// Add Skill
function addSkill() {
  const skillInput = document.querySelector(".skills-input");
  const skill = skillInput.value.trim();

  if (skill) {
    const skillList = document.getElementById("skills-list");
    const li = document.createElement("li");
    li.textContent = skill;
    skillList.appendChild(li);
    skillInput.value = ""; // Clear the input field
  }
}

// Add Experience
function addExperience() {
  const experienceInput = document.querySelector(".experience-input");
  const experience = experienceInput.value.trim();

  if (experience) {
    const experienceList = document.getElementById("experience-list");
    const li = document.createElement("li");
    li.textContent = experience;
    experienceList.appendChild(li);
    experienceInput.value = ""; // Clear the input field
  }
}

// Add Education
function addEducation() {
  const educationInput = document.querySelector(".education-input");
  const education = educationInput.value.trim();

  if (education) {
    const educationList = document.getElementById("education-list");
    const li = document.createElement("li");
    li.textContent = education;
    educationList.appendChild(li);
    educationInput.value = ""; // Clear the input field
  }
}

// Generate Resume
function generateResume() {
  // Get the profile picture
  const photo = document.getElementById("photo").files[0];
  if (photo) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profile-photo").src = e.target.result;
    };
    reader.readAsDataURL(photo);
  }

  // Get input values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const title = document.getElementById("title").value;

  const skills = Array.from(document.querySelectorAll("#skills-list li")).map(
    (li) => li.textContent
  );
  const experience = Array.from(
    document.querySelectorAll("#experience-list li")
  ).map((li) => li.textContent);
  const education = Array.from(
    document.querySelectorAll("#education-list li")
  ).map((li) => li.textContent);

  // Check if inputs are valid
  if (
    !name ||
    !email ||
    !phone ||
    !title ||
    !skills.length ||
    !experience.length ||
    !education.length
  ) {
    alert("Please fill in all fields!");
    return;
  }

  // Update the resume preview section
  document.getElementById("resumeName").textContent = name;
  document.getElementById("resumeEmail").textContent = email;
  document.getElementById("resumePhone").textContent = phone;
  document.getElementById("resumeTitle").textContent = title;

  // Clear previous entries and add new ones
  const resumeSkills = document.getElementById("resumeSkills");
  resumeSkills.innerHTML = "";
  skills.forEach((skill) => {
    const li = document.createElement("li");
    li.textContent = skill;
    resumeSkills.appendChild(li);
  });

  const resumeExperience = document.getElementById("resumeExperience");
  resumeExperience.innerHTML = "";
  experience.forEach((exp) => {
    const li = document.createElement("li");
    li.textContent = exp;
    resumeExperience.appendChild(li);
  });

  const resumeEducation = document.getElementById("resumeEducation");
  resumeEducation.innerHTML = "";
  education.forEach((edu) => {
    const li = document.createElement("li");
    li.textContent = edu;
    resumeEducation.appendChild(li);
  });

  // Show the resume preview section
  document.getElementById("resumePreview").style.display = "block";
}

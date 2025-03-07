document.addEventListener('DOMContentLoaded', () => {
    let currentAvatar = '';
    const avatarInput = document.getElementById('avatarUpload');
    const generateAvatarBtn = document.getElementById('generateAvatarBtn');

    // Generate random avatar
    function generateAvatar() {
        const seed = Math.random().toString(36).substring(2);
        currentAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;
        document.getElementById('avatarImage').src = currentAvatar;
    }

    // Handle avatar upload
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentAvatar = e.target.result;
                document.getElementById('avatarImage').src = currentAvatar;
            }
            reader.readAsDataURL(file);
        }
    });

    // Event listeners
    generateAvatarBtn.addEventListener('click', generateAvatar);
    
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        let isValid = true;
        const formData = {};

        // Validation logic (same as previous code)
        // ... (include all validation functions from previous code) ...

        if (isValid) {
            // Collect form data (same as previous code)
            // ... (include data collection logic) ...
            
            showSuccess('Registration successful! Redirecting...');
            this.reset();
            generateAvatar();
            console.log('Form Data:', formData);
        }
    });

    // Helper functions (same as previous code)
    function validateField(fieldId, errorMessage) { /* ... */ }
    function validateEmail(fieldId, errorMessage) { /* ... */ }
    function validatePhone(fieldId, errorMessage) { /* ... */ }
    function validateZipCode(fieldId, errorMessage) { /* ... */ }
    function validatePassword() { /* ... */ }
    function validateTerms() { /* ... */ }
    function showError(elementId, message) { /* ... */ }
    function clearErrors() { /* ... */ }
    function showSuccess(message) { /* ... */ }
    function getValue(fieldId) { /* ... */ }

    // Initial avatar generation
    generateAvatar();
});

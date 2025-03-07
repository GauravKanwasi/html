// Generate random avatar using DiceBear API
function generateRandomAvatar() {
    const randomSeed = Math.random().toString(36).substring(2);
    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${randomSeed}`;
    document.getElementById('avatar').src = avatarUrl;
}

// Generate initial random avatar
generateRandomAvatar();

// Form validation
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;

    // Username validation
    if(username.length < 4) {
        showError('usernameError', 'Username must be at least 4 characters');
        isValid = false;
    }

    // Email validation
    if(!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if(password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters');
        isValid = false;
    }

    // Confirm password validation
    if(password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    if(isValid) {
        alert('Account created successfully!\nWelcome ' + username);
        this.reset();
        generateRandomAvatar();
    }
});

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Real-time validation
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        document.getElementById(input.id + 'Error').style.display = 'none';
    });
});

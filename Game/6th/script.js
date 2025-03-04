document.addEventListener('DOMContentLoaded', function() {
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const feedback = document.getElementById('feedback');
    const attempts = document.getElementById('attempts');
    let attemptCount = 0;

    function generateRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }

    let secretNumber = generateRandomNumber();

    guessButton.addEventListener('click', function() {
        const userGuess = parseInt(guessInput.value);
        attemptCount++;
        attempts.textContent = `Attempts: ${attemptCount}`;

        if (userGuess === secretNumber) {
            feedback.textContent = `Congratulations! You guessed the number in ${attemptCount} attempts!`;
            guessButton.disabled = true;
        } else if (userGuess < secretNumber) {
            feedback.textContent = 'Too low! Try again.';
        } else {
            feedback.textContent = 'Too high! Try again.';
        }

        guessInput.value = '';
    });
});

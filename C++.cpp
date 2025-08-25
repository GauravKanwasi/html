#include <iostream>
#include <limits>
#include <string>
#include <cmath>
#include <random>
#include <cstdlib>  // for system()
#include <fstream>  // for high score persistence

// ANSI color codes for a nicer display
const std::string RESET  = "\033[0m";
const std::string RED    = "\033[1;31m";
const std::string GREEN  = "\033[1;32m";
const std::string YELLOW = "\033[1;33m";
const std::string BLUE   = "\033[1;34m";
const std::string CYAN   = "\033[1;36m";

// Forward declarations
void clearScreen();
void printHeader();
int getValidatedChoice(int min, int max);
void provideHint(int guess, int secret, int range);
void playSingleRound();
void playTournament();
void howToPlay();
void viewHighScore();
void waitForEnter();
void loadHighScore();
void saveHighScore(int score);

// Global high score variable
int highScore = 0;

// Random number generator using C++11 <random>
int getRandomNumber(int min, int max) {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

// Clears the console screen (platform dependent)
void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

// Prints a decorative ASCII header
void printHeader() {
    std::cout << BLUE;
    std::cout << "=========================================" << std::endl;
    std::cout << "         GUESS THE NUMBER GAME           " << std::endl;
    std::cout << "=========================================" << std::endl;
    std::cout << RESET;
}

// Gets a validated integer input within a given range
int getValidatedChoice(int min, int max) {
    int choice;
    while (!(std::cin >> choice) || choice < min || choice > max) {
        std::cin.clear(); // reset error flags
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << RED << "Invalid input. Please enter a number between "
                  << min << " and " << max << ": " << RESET;
    }
    return choice;
}

// Provides a hint based on the absolute difference between guess and secret
void provideHint(int guess, int secret, int range) {
    int diff = std::abs(secret - guess);
    if (diff == 0) return;  // correct guess; no hint needed

    double percentDiff = static_cast<double>(diff) / range;
    std::string hintColor;
    std::string hintText;

    if (percentDiff < 0.05) {
        hintColor = GREEN;
        hintText = "Very hot!";
    } else if (percentDiff < 0.15) {
        hintColor = GREEN;
        hintText = "Hot!";
    } else if (percentDiff < 0.3) {
        hintColor = YELLOW;
        hintText = "Warm.";
    } else if (percentDiff < 0.5) {
        hintColor = RED;
        hintText = "Cold.";
    } else {
        hintColor = RED;
        hintText = "Freezing!";
    }

    std::cout << hintColor << hintText << RESET << std::endl;
}

// Wait for user to press Enter before continuing
void waitForEnter() {
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); 
    std::cout << "\nPress Enter to return to the main menu...";
    std::cin.get();
}

// Load high score from file
void loadHighScore() {
    std::ifstream in("highscore.txt");
    if (in) {
        in >> highScore;
    }
}

// Save high score to file if improved
void saveHighScore(int score) {
    if (score > highScore) {
        highScore = score;
        std::ofstream out("highscore.txt");
        out << highScore;
    }
}

// View current high score
void viewHighScore() {
    clearScreen();
    printHeader();
    std::cout << "\n" << CYAN << "Current High Score (Tournament Mode): " 
              << highScore << RESET << std::endl;
    if (highScore == 0) {
        std::cout << YELLOW << "No high score set yet. Play a tournament to set one!" << RESET << std::endl;
    }
    waitForEnter();
}

// Single round game mode
void playSingleRound() {
    clearScreen();
    printHeader();

    std::cout << "\nChoose a difficulty level:" << std::endl;
    std::cout << "1. Easy (1 - 50)" << std::endl;
    std::cout << "2. Medium (1 - 100)" << std::endl;
    std::cout << "3. Hard (1 - 200)" << std::endl;
    std::cout << "4. Expert (1 - 1000)" << std::endl;
    std::cout << "Enter your choice: ";
    int diffChoice = getValidatedChoice(1, 4);

    int maxNumber = 100;  // default value
    switch (diffChoice) {
        case 1: maxNumber = 50; break;
        case 2: maxNumber = 100; break;
        case 3: maxNumber = 200; break;
        case 4: maxNumber = 1000; break;
    }

    // Generate the secret number within the chosen range
    int secretNumber = getRandomNumber(1, maxNumber);
    std::cout << "\nI've picked a number between 1 and " << maxNumber 
              << ". Try to guess it!" << std::endl;

    int guess;
    int tries = 0;
    bool guessedCorrectly = false;

    while (!guessedCorrectly) {
        std::cout << "\nEnter your guess: ";
        guess = getValidatedChoice(1, maxNumber);
        tries++;

        if (guess < secretNumber) {
            std::cout << YELLOW << "Too low!" << RESET << std::endl;
            provideHint(guess, secretNumber, maxNumber);
        } else if (guess > secretNumber) {
            std::cout << YELLOW << "Too high!" << RESET << std::endl;
            provideHint(guess, secretNumber, maxNumber);
        } else {
            std::cout << GREEN << "Congratulations! You guessed the number in "
                      << tries << " tries." << RESET << std::endl;
            guessedCorrectly = true;
        }
    }
    waitForEnter();
}

// Tournament mode: Three rounds with increasing difficulty and a scoring system.
void playTournament() {
    clearScreen();
    printHeader();
    std::cout << "\nWelcome to Tournament Mode!" << std::endl;
    std::cout << "You will face 3 rounds with increasing difficulty. Try to score as many points as possible." << std::endl;
    std::cout << "Points decrease with each wrong guess. Beat the high score!" << std::endl;

    int totalScore = 0;
    const int rounds = 3;
    // Parameters for each round: number range and allowed attempts
    int ranges[rounds]     = {50, 200, 500};
    int maxAttempts[rounds] = {10, 8, 6};

    for (int round = 0; round < rounds; round++) {
        std::cout << "\n" << BLUE << "Round " << round + 1 
                  << " - Guess the number between 1 and " 
                  << ranges[round] << RESET << std::endl;
        int secretNumber = getRandomNumber(1, ranges[round]);
        int roundScore = maxAttempts[round] * 20;  // Starting score for the round (increased for more granularity)
        int guess;
        int attempts = 0;
        bool success = false;

        while (attempts < maxAttempts[round]) {
            std::cout << "\nAttempt " << (attempts + 1) 
                      << " of " << maxAttempts[round] 
                      << ". Your guess: ";
            guess = getValidatedChoice(1, ranges[round]);
            attempts++;

            if (guess < secretNumber) {
                std::cout << YELLOW << "Too low!" << RESET << std::endl;
                provideHint(guess, secretNumber, ranges[round]);
                roundScore -= 20;  // Deduct points for a wrong guess
            } else if (guess > secretNumber) {
                std::cout << YELLOW << "Too high!" << RESET << std::endl;
                provideHint(guess, secretNumber, ranges[round]);
                roundScore -= 20;
            } else {
                std::cout << GREEN << "Correct! You guessed it in " 
                          << attempts << " attempt" 
                          << (attempts > 1 ? "s" : "") << "." 
                          << RESET << std::endl;
                success = true;
                break;
            }
        }
        if (success) {
            if (roundScore < 0) roundScore = 0;  // Prevent negative scores
            std::cout << GREEN << "You earned " 
                      << roundScore << " points in this round." 
                      << RESET << std::endl;
            totalScore += roundScore;
        } else {
            std::cout << RED << "Out of attempts! The correct number was " 
                      << secretNumber << "." << RESET << std::endl;
        }
    }
    std::cout << "\n" << BLUE << "Tournament Over! Your total score is: " 
              << totalScore << RESET << std::endl;
    if (totalScore > highScore) {
        std::cout << GREEN << "New high score!" << RESET << std::endl;
    }
    saveHighScore(totalScore);
    waitForEnter();
}

// Displays game instructions
void howToPlay() {
    clearScreen();
    printHeader();
    std::cout << "\nHow to Play:" << std::endl;
    std::cout << "1. In Single Round mode, select a difficulty level and try to guess the secret number with unlimited attempts." << std::endl;
    std::cout << "2. After each wrong guess, you'll get feedback if it's too high/low and a temperature hint on closeness." << std::endl;
    std::cout << "3. In Tournament mode, play through 3 rounds with increasing difficulty and limited attempts." << std::endl;
    std::cout << "4. Each wrong guess in Tournament reduces your round score. Total score is summed across rounds." << std::endl;
    std::cout << "5. Beat the high score in Tournament mode! It's saved between sessions." << std::endl;
    waitForEnter();
}

int main() {
    loadHighScore();
    int choice;
    do {
        clearScreen();
        printHeader();
        std::cout << "\nMain Menu:" << std::endl;
        std::cout << "1. Single Round Game" << std::endl;
        std::cout << "2. Tournament Mode" << std::endl;
        std::cout << "3. How to Play" << std::endl;
        std::cout << "4. View High Score" << std::endl;
        std::cout << "5. Quit" << std::endl;
        std::cout << "Enter your choice: ";
        choice = getValidatedChoice(1, 5);

        switch (choice) {
            case 1:
                playSingleRound();
                break;
            case 2:
                playTournament();
                break;
            case 3:
                howToPlay();
                break;
            case 4:
                viewHighScore();
                break;
            case 5:
                std::cout << "\n" << GREEN << "Thank you for playing! Goodbye!" << RESET << std::endl;
                break;
        }
    } while (choice != 5);
    return 0;
}

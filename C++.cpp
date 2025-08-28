#include <iostream>
#include <limits>
#include <string>
#include <cmath>
#include <random>
#include <cstdlib>
#include <fstream>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <thread>
#include <chrono>

// ANSI color codes for a nicer display
const std::string RESET      = "\033[0m";
const std::string RED        = "\033[1;31m";
const std::string GREEN      = "\033[1;32m";
const std::string YELLOW     = "\033[1;33m";
const std::string BLUE       = "\033[1;34m";
const std::string MAGENTA    = "\033[1;35m";
const std::string CYAN       = "\033[1;36m";
const std::string WHITE      = "\033[1;37m";
const std::string BOLD       = "\033[1m";
const std::string UNDERLINE  = "\033[4m";

// Game constants
const std::string HIGH_SCORE_FILE = "highscores.txt";
const int MAX_HIGH_SCORES = 10;

// Forward declarations
void clearScreen();
void printHeader();
void printCentered(const std::string& text);
void animateText(const std::string& text, int delayMs = 30);
int getValidatedChoice(int min, int max);
double getValidatedDouble(double min, double max);
void provideHint(int guess, int secret, int range);
void playSingleRound();
void playTournament();
void howToPlay();
void viewHighScores();
void waitForEnter();
void loadHighScores();
void saveHighScore(int score, const std::string& name);
void displayStats();
void settingsMenu();
void resetHighScores();
void printScoreboard();
void printTrophy();
void printFireworks();
void typewriterEffect(const std::string& text, int delayMs = 50);

// High score structure
struct HighScore {
    std::string name;
    int score;
    
    HighScore(const std::string& n, int s) : name(n), score(s) {}
    
    bool operator<(const HighScore& other) const {
        return score > other.score; // Sort in descending order
    }
};

// Global variables
std::vector<HighScore> highScores;
bool enableAnimations = true;
bool enableColor = true;
bool enableSounds = true; // Placeholder for sound functionality

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
    if (!enableColor) return;
    
    std::cout << BLUE;
    std::cout << "=========================================" << std::endl;
    std::cout << "         GUESS THE NUMBER GAME           " << std::endl;
    std::cout << "=========================================" << std::endl;
    std::cout << RESET;
}

// Prints centered text
void printCentered(const std::string& text) {
    int width = 50; // Assuming console width of 50 characters
    int padding = (width - text.length()) / 2;
    if (padding < 0) padding = 0;
    
    std::cout << std::string(padding, ' ') << text << std::endl;
}

// Animate text with delay between characters
void animateText(const std::string& text, int delayMs) {
    if (!enableAnimations) {
        std::cout << text;
        return;
    }
    
    for (char c : text) {
        std::cout << c << std::flush;
        std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
    }
}

// Typewriter effect for text
void typewriterEffect(const std::string& text, int delayMs) {
    if (!enableAnimations) {
        std::cout << text << std::endl;
        return;
    }
    
    for (char c : text) {
        std::cout << c << std::flush;
        std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
    }
    std::cout << std::endl;
}

// Gets a validated integer input within a given range
int getValidatedChoice(int min, int max) {
    int choice;
    while (!(std::cin >> choice) || choice < min || choice > max) {
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << RED << "Invalid input. Please enter a number between "
                  << min << " and " << max << ": " << RESET;
    }
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    return choice;
}

// Gets a validated double input within a given range
double getValidatedDouble(double min, double max) {
    double value;
    while (!(std::cin >> value) || value < min || value > max) {
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << RED << "Invalid input. Please enter a number between "
                  << min << " and " << max << ": " << RESET;
    }
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    return value;
}

// Provides a hint based on the absolute difference between guess and secret
void provideHint(int guess, int secret, int range) {
    if (!enableColor) return;
    
    int diff = std::abs(secret - guess);
    if (diff == 0) return;  // correct guess; no hint needed

    double percentDiff = static_cast<double>(diff) / range;
    std::string hintColor;
    std::string hintText;

    if (percentDiff < 0.02) {
        hintColor = MAGENTA;
        hintText = "🔥 Boiling hot!";
    } else if (percentDiff < 0.05) {
        hintColor = RED;
        hintText = "🔥 Very hot!";
    } else if (percentDiff < 0.1) {
        hintColor = YELLOW;
        hintText = "♨️ Hot!";
    } else if (percentDiff < 0.2) {
        hintColor = YELLOW;
        hintText = "☀️ Warm";
    } else if (percentDiff < 0.3) {
        hintColor = CYAN;
        hintText = "💨 Cool";
    } else if (percentDiff < 0.4) {
        hintColor = BLUE;
        hintText = "❄️ Cold";
    } else {
        hintColor = BLUE;
        hintText = "🧊 Freezing!";
    }

    std::cout << hintColor << hintText << RESET << std::endl;
}

// Wait for user to press Enter before continuing
void waitForEnter() {
    if (enableAnimations) {
        std::cout << YELLOW << "\nPress Enter to continue..." << RESET;
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cin.get();
    } else {
        std::cout << "\n";
    }
}

// Load high scores from file
void loadHighScores() {
    highScores.clear();
    std::ifstream in(HIGH_SCORE_FILE);
    if (in) {
        std::string name;
        int score;
        while (in >> name >> score) {
            highScores.emplace_back(name, score);
        }
        in.close();
    }
    // Keep only top scores
    std::sort(highScores.begin(), highScores.end());
    if (highScores.size() > MAX_HIGH_SCORES) {
        highScores.resize(MAX_HIGH_SCORES);
    }
}

// Save high score to file if it qualifies
void saveHighScore(int score, const std::string& playerName) {
    // Check if score qualifies for high score list
    if (highScores.size() < MAX_HIGH_SCORES || score > highScores.back().score) {
        highScores.emplace_back(playerName, score);
        std::sort(highScores.begin(), highScores.end());
        
        if (highScores.size() > MAX_HIGH_SCORES) {
            highScores.pop_back();
        }
        
        // Save to file
        std::ofstream out(HIGH_SCORE_FILE);
        if (out) {
            for (const auto& hs : highScores) {
                out << hs.name << " " << hs.score << std::endl;
            }
            out.close();
        }
        
        return true;
    }
    return false;
}

// Print trophy ASCII art
void printTrophy() {
    if (!enableColor) return;
    
    std::cout << YELLOW;
    std::cout << "    .-=========-." << std::endl;
    std::cout << "    \\'-=======-'/" << std::endl;
    std::cout << "    _|   .=.   |_" << std::endl;
    std::cout << "   ((|  {{1}}  |))" << std::endl;
    std::cout << "    \\|   /|\\   |/" << std::endl;
    std::cout << "     \\__ '`' __/" << std::endl;
    std::cout << "       _`) (`_" << std::endl;
    std::cout << "     _/_______\\_" << std::endl;
    std::cout << "    /___________\\" << std::endl;
    std::cout << RESET;
}

// Print fireworks ASCII art
void printFireworks() {
    if (!enableColor) return;
    
    std::cout << RED;
    std::cout << "✨   *       ✨ *" << std::endl;
    std::cout << "    *   ✨     *" << std::endl;
    std::cout << "   *       *   ✨" << std::endl;
    std::cout << "✨   *   ✨     *" << std::endl;
    std::cout << "    *       *   ✨" << std::endl;
    std::cout << RESET;
}

// Print scoreboard
void printScoreboard() {
    std::cout << CYAN;
    std::cout << "╔══════════════════════════════════╗" << std::endl;
    std::cout << "║           HIGH SCORES            ║" << std::endl;
    std::cout << "╠══════════════════════════════════╣" << std::endl;
    
    if (highScores.empty()) {
        std::cout << "║        No high scores yet!       ║" << std::endl;
    } else {
        for (size_t i = 0; i < highScores.size(); ++i) {
            std::ostringstream ss;
            ss << "║ " << std::setw(2) << (i + 1) << ". " 
               << std::setw(15) << std::left << highScores[i].name 
               << std::setw(10) << std::right << highScores[i].score << " ║";
            std::cout << ss.str() << std::endl;
        }
    }
    
    std::cout << "╚══════════════════════════════════╝" << std::endl;
    std::cout << RESET;
}

// View current high scores
void viewHighScores() {
    clearScreen();
    printHeader();
    
    std::cout << std::endl;
    printScoreboard();
    
    waitForEnter();
}

// Display game statistics
void displayStats() {
    clearScreen();
    printHeader();
    
    std::cout << CYAN << "\nGame Statistics:\n" << RESET;
    std::cout << "• High scores stored: " << highScores.size() << std::endl;
    
    if (!highScores.empty()) {
        std::cout << "• Top score: " << highScores[0].score << " by " << highScores[0].name << std::endl;
        
        int total = 0;
        for (const auto& hs : highScores) {
            total += hs.score;
        }
        double average = static_cast<double>(total) / highScores.size();
        std::cout << "• Average score: " << std::fixed << std::setprecision(1) << average << std::endl;
    }
    
    waitForEnter();
}

// Reset high scores
void resetHighScores() {
    clearScreen();
    printHeader();
    
    std::cout << RED << "\nAre you sure you want to reset all high scores? (y/n): " << RESET;
    char confirm;
    std::cin >> confirm;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    
    if (confirm == 'y' || confirm == 'Y') {
        highScores.clear();
        std::remove(HIGH_SCORE_FILE.c_str());
        std::cout << GREEN << "High scores have been reset!" << RESET << std::endl;
    } else {
        std::cout << YELLOW << "Reset cancelled." << RESET << std::endl;
    }
    
    waitForEnter();
}

// Settings menu
void settingsMenu() {
    int choice;
    do {
        clearScreen();
        printHeader();
        
        std::cout << CYAN << "\nSettings Menu:\n" << RESET;
        std::cout << "1. Animations: " << (enableAnimations ? GREEN "ON" : RED "OFF") << RESET << std::endl;
        std::cout << "2. Colors: " << (enableColor ? GREEN "ON" : RED "OFF") << RESET << std::endl;
        std::cout << "3. Reset High Scores" << std::endl;
        std::cout << "4. Back to Main Menu" << std::endl;
        std::cout << "Enter your choice: ";
        
        choice = getValidatedChoice(1, 4);
        
        switch (choice) {
            case 1:
                enableAnimations = !enableAnimations;
                break;
            case 2:
                enableColor = !enableColor;
                break;
            case 3:
                resetHighScores();
                break;
        }
    } while (choice != 4);
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
    std::cout << "5. Insane (1 - 10000)" << std::endl;
    std::cout << "6. Custom (Enter your own range)" << std::endl;
    std::cout << "Enter your choice: ";
    int diffChoice = getValidatedChoice(1, 6);

    int minNumber = 1;
    int maxNumber = 100;  // default value
    
    if (diffChoice == 6) {
        std::cout << "Enter the minimum number: ";
        minNumber = getValidatedChoice(1, std::numeric_limits<int>::max() - 1);
        
        std::cout << "Enter the maximum number: ";
        maxNumber = getValidatedChoice(minNumber + 1, std::numeric_limits<int>::max());
    } else {
        switch (diffChoice) {
            case 1: maxNumber = 50; break;
            case 2: maxNumber = 100; break;
            case 3: maxNumber = 200; break;
            case 4: maxNumber = 1000; break;
            case 5: maxNumber = 10000; break;
        }
    }

    // Generate the secret number within the chosen range
    int secretNumber = getRandomNumber(minNumber, maxNumber);
    int range = maxNumber - minNumber;
    
    std::cout << "\nI've picked a number between " << minNumber << " and " << maxNumber 
              << ". Try to guess it!" << std::endl;

    int guess;
    int tries = 0;
    bool guessedCorrectly = false;
    std::vector<int> previousGuesses;

    while (!guessedCorrectly) {
        std::cout << "\nEnter your guess (" << minNumber << " - " << maxNumber << "): ";
        guess = getValidatedChoice(minNumber, maxNumber);
        tries++;
        previousGuesses.push_back(guess);

        if (guess < secretNumber) {
            std::cout << YELLOW << "Too low!" << RESET << std::endl;
            provideHint(guess, secretNumber, range);
        } else if (guess > secretNumber) {
            std::cout << YELLOW << "Too high!" << RESET << std::endl;
            provideHint(guess, secretNumber, range);
        } else {
            std::cout << GREEN << "\nCongratulations! You guessed the number in "
                      << tries << " tries." << RESET << std::endl;
                      
            if (enableAnimations) {
                printFireworks();
            }
            
            // Show previous guesses
            std::cout << "\nYour guesses: ";
            for (size_t i = 0; i < previousGuesses.size(); ++i) {
                if (previousGuesses[i] < secretNumber) {
                    std::cout << RED << previousGuesses[i] << RESET;
                } else if (previousGuesses[i] > secretNumber) {
                    std::cout << BLUE << previousGuesses[i] << RESET;
                } else {
                    std::cout << GREEN << previousGuesses[i] << RESET;
                }
                
                if (i < previousGuesses.size() - 1) {
                    std::cout << " → ";
                }
            }
            std::cout << std::endl;
            
            guessedCorrectly = true;
        }
    }
    waitForEnter();
}

// Tournament mode: Three rounds with increasing difficulty and a scoring system.
void playTournament() {
    clearScreen();
    printHeader();
    
    typewriterEffect("\nWelcome to Tournament Mode!", 50);
    typewriterEffect("You will face 3 rounds with increasing difficulty. Try to score as many points as possible.", 30);
    typewriterEffect("Points decrease with each wrong guess. Beat the high score!", 30);

    // Get player name for high score
    std::string playerName;
    std::cout << "\nEnter your name for the high score board: ";
    std::getline(std::cin, playerName);
    if (playerName.empty()) playerName = "Anonymous";

    int totalScore = 0;
    const int rounds = 3;
    // Parameters for each round: number range and allowed attempts
    int ranges[rounds]     = {50, 200, 500};
    int maxAttempts[rounds] = {10, 8, 6};
    std::string roundNames[rounds] = {"Easy", "Medium", "Hard"};

    for (int round = 0; round < rounds; round++) {
        std::cout << "\n" << BLUE << "Round " << round + 1 << " (" << roundNames[round] 
                  << ") - Guess the number between 1 and " 
                  << ranges[round] << RESET << std::endl;
                  
        int secretNumber = getRandomNumber(1, ranges[round]);
        int roundScore = maxAttempts[round] * 100;  // Starting score for the round
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
                roundScore -= 100;  // Deduct points for a wrong guess
            } else if (guess > secretNumber) {
                std::cout << YELLOW << "Too high!" << RESET << std::endl;
                provideHint(guess, secretNumber, ranges[round]);
                roundScore -= 100;
            } else {
                std::cout << GREEN << "Correct! You guessed it in " 
                          << attempts << " attempt" 
                          << (attempts > 1 ? "s" : "") << "." 
                          << RESET << std::endl;
                success = true;
                break;
            }
            
            // Show current score
            std::cout << "Current round score: " << roundScore << std::endl;
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
        
        // Show cumulative score
        std::cout << CYAN << "Total score so far: " << totalScore << RESET << std::endl;
        
        if (round < rounds - 1) {
            std::cout << "\nGet ready for the next round..." << std::endl;
            if (enableAnimations) {
                std::this_thread::sleep_for(std::chrono::seconds(2));
            }
        }
    }
    
    std::cout << "\n" << BLUE << "Tournament Over! Your total score is: " 
              << totalScore << RESET << std::endl;
              
    if (enableAnimations && totalScore > 0) {
        printTrophy();
    }
    
    bool isNewHighScore = saveHighScore(totalScore, playerName);
    if (isNewHighScore) {
        std::cout << GREEN << "New high score! You've made it to the leaderboard!" << RESET << std::endl;
    }
    
    waitForEnter();
}

// Displays game instructions
void howToPlay() {
    clearScreen();
    printHeader();
    
    std::cout << CYAN << "\nHow to Play:\n" << RESET;
    std::cout << "1. In Single Round mode, select a difficulty level (or custom) and try to guess the secret number." << std::endl;
    std::cout << "2. After each wrong guess, you'll get feedback if it's too high/low and a temperature hint on closeness." << std::endl;
    std::cout << "3. In Tournament mode, play through 3 rounds with increasing difficulty and limited attempts." << std::endl;
    std::cout << "4. Each wrong guess in Tournament reduces your round score. Total score is summed across rounds." << std::endl;
    std::cout << "5. Beat the high score in Tournament mode! High scores are saved between sessions." << std::endl;
    std::cout << "6. Use the Settings menu to customize your experience." << std::endl;
    
    waitForEnter();
}

int main() {
    loadHighScores();
    int choice;
    
    do {
        clearScreen();
        printHeader();
        
        if (enableAnimations) {
            animateText("\nMain Menu:\n", 50);
        } else {
            std::cout << "\nMain Menu:" << std::endl;
        }
        
        std::cout << "1. Single Round Game" << std::endl;
        std::cout << "2. Tournament Mode" << std::endl;
        std::cout << "3. How to Play" << std::endl;
        std::cout << "4. View High Scores" << std::endl;
        std::cout << "5. Statistics" << std::endl;
        std::cout << "6. Settings" << std::endl;
        std::cout << "7. Quit" << std::endl;
        std::cout << "Enter your choice: ";
        
        choice = getValidatedChoice(1, 7);

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
                viewHighScores();
                break;
            case 5:
                displayStats();
                break;
            case 6:
                settingsMenu();
                break;
            case 7:
                std::cout << "\n" << GREEN << "Thank you for playing! Goodbye!" << RESET << std::endl;
                if (enableAnimations) {
                    std::this_thread::sleep_for(std::chrono::seconds(1));
                }
                break;
        }
    } while (choice != 7);
    
    return 0;
}

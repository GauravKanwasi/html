#include <iostream>
#include <limits>
#include <string>
#include <cmath>
#include <random>
#include <vector>
#include <algorithm>
#include <chrono>
#include <thread>
#include <fstream>

// ANSI color codes
const std::string RESET      = "";
const std::string RED        = "";
const std::string GREEN      = "";
const std::string YELLOW     = "";
const std::string BLUE       = "";
const std::string MAGENTA    = "";
const std::string CYAN       = "";
const std::string WHITE      = "";

// Game constants
const std::string HIGH_SCORE_FILE = "highscores.txt";
const int MAX_HIGH_SCORES = 5;

// Forward declarations
void clearScreen();
void printHeader();
int getValidatedChoice(int min, int max);
void provideHint(int guess, int secret, int range);
void playSingleRound();
void playTournament();
void howToPlay();
void viewHighScores();
void waitForEnter();
void loadHighScores();
bool saveHighScore(int score, const std::string& name);
void displayStats();
void settingsMenu();
void printScoreboard();
void printTrophy();
void printFireworks();
void quickPlay();
void extremeMode();
void multiplayerMode();

// High score structure
struct HighScore {
    std::string name;
    int score;
    
    HighScore(const std::string& n, int s) : name(n), score(s) {}
    
    bool operator<(const HighScore& other) const {
        return score > other.score;
    }
};

// Global variables
std::vector<HighScore> highScores;
bool enableAnimations = true;
bool enableColor = true;

// Fast random number generator
int getRandomNumber(int min, int max) {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

// Clears the console screen
void clearScreen() {
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

// Prints header
void printHeader() {
    std::cout << "=========================================" << std::endl;
    std::cout << "         GUESS THE NUMBER GAME           " << std::endl;
    std::cout << "=========================================" << std::endl;
}

// Gets validated input
int getValidatedChoice(int min, int max) {
    int choice;
    while (!(std::cin >> choice) || choice < min || choice > max) {
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Invalid input. Please enter a number between "
                  << min << " and " << max << ": ";
    }
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    return choice;
}

// Provides hint
void provideHint(int guess, int secret, int range) {
    int diff = std::abs(secret - guess);
    if (diff == 0) return;

    double percentDiff = static_cast<double>(diff) / range;
    
    if (percentDiff < 0.02) {
        std::cout << "Boiling hot!";
    } else if (percentDiff < 0.05) {
        std::cout << "Very hot!";
    } else if (percentDiff < 0.1) {
        std::cout << "Hot!";
    } else if (percentDiff < 0.2) {
        std::cout << "Warm";
    } else if (percentDiff < 0.3) {
        std::cout << "Cool";
    } else if (percentDiff < 0.4) {
        std::cout << "Cold";
    } else {
        std::cout << "Freezing!";
    }
    std::cout << std::endl;
}

// Wait for user input
void waitForEnter() {
    std::cout << "\nPress Enter to continue...";
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    std::cin.get();
}

// Load high scores
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
    std::sort(highScores.begin(), highScores.end());
    if (highScores.size() > MAX_HIGH_SCORES) {
        highScores.resize(MAX_HIGH_SCORES);
    }
}

// Save high score
bool saveHighScore(int score, const std::string& playerName) {
    if (highScores.size() < MAX_HIGH_SCORES || score > highScores.back().score) {
        highScores.emplace_back(playerName, score);
        std::sort(highScores.begin(), highScores.end());
        
        if (highScores.size() > MAX_HIGH_SCORES) {
            highScores.pop_back();
        }
        
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

// Print trophy
void printTrophy() {
    std::cout << "    .-=========-." << std::endl;
    std::cout << "    \\'-=======-'/" << std::endl;
    std::cout << "    _|   .=.   |_" << std::endl;
    std::cout << "   ((|  {{1}}  |))" << std::endl;
    std::cout << "    \\|   /|\\   |/" << std::endl;
    std::cout << "     \\__ '`' __/" << std::endl;
    std::cout << "       _`) (`_" << std::endl;
    std::cout << "     _/_______\\_" << std::endl;
    std::cout << "    /___________\\" << std::endl;
}

// Print fireworks
void printFireworks() {
    std::cout << "*   *       * *" << std::endl;
    std::cout << "    *   *     *" << std::endl;
    std::cout << "   *       *   *" << std::endl;
    std::cout << "*   *   *     *" << std::endl;
    std::cout << "    *       *   *" << std::endl;
}

// Print scoreboard
void printScoreboard() {
    std::cout << "High Scores:" << std::endl;
    std::cout << "====================" << std::endl;
    
    if (highScores.empty()) {
        std::cout << "No high scores yet!" << std::endl;
    } else {
        for (size_t i = 0; i < highScores.size(); ++i) {
            std::cout << (i + 1) << ". " 
                      << highScores[i].name << " - " 
                      << highScores[i].score << std::endl;
        }
    }
    std::cout << "====================" << std::endl;
}

// View high scores
void viewHighScores() {
    clearScreen();
    printHeader();
    std::cout << std::endl;
    printScoreboard();
    waitForEnter();
}

// Display statistics
void displayStats() {
    clearScreen();
    printHeader();
    
    std::cout << "\nGame Statistics:" << std::endl;
    std::cout << "High scores stored: " << highScores.size() << std::endl;
    
    if (!highScores.empty()) {
        std::cout << "Top score: " << highScores[0].score << " by " << highScores[0].name << std::endl;
    }
    
    waitForEnter();
}

// Settings menu
void settingsMenu() {
    int choice;
    do {
        clearScreen();
        printHeader();
        
        std::cout << "\nSettings Menu:" << std::endl;
        std::cout << "1. Animations: " << (enableAnimations ? "ON" : "OFF") << std::endl;
        std::cout << "2. Colors: " << (enableColor ? "ON" : "OFF") << std::endl;
        std::cout << "3. Back to Main Menu" << std::endl;
        std::cout << "Enter your choice: ";
        
        choice = getValidatedChoice(1, 3);
        
        switch (choice) {
            case 1:
                enableAnimations = !enableAnimations;
                break;
            case 2:
                enableColor = !enableColor;
                break;
        }
    } while (choice != 3);
}

// Quick play mode
void quickPlay() {
    clearScreen();
    printHeader();
    
    int secretNumber = getRandomNumber(1, 100);
    std::cout << "\nQuick Play Mode: Guess between 1 and 100" << std::endl;
    
    int guess;
    int tries = 0;
    bool guessedCorrectly = false;
    std::vector<int> previousGuesses;

    while (!guessedCorrectly) {
        std::cout << "\nEnter your guess (1 - 100): ";
        guess = getValidatedChoice(1, 100);
        tries++;
        previousGuesses.push_back(guess);

        if (guess < secretNumber) {
            std::cout << "Too low!" << std::endl;
            provideHint(guess, secretNumber, 100);
        } else if (guess > secretNumber) {
            std::cout << "Too high!" << std::endl;
            provideHint(guess, secretNumber, 100);
        } else {
            std::cout << "\nCongratulations! You guessed the number in "
                      << tries << " tries." << std::endl;
            
            if (enableAnimations) {
                printFireworks();
            }
            
            std::cout << "\nYour guesses: ";
            for (size_t i = 0; i < previousGuesses.size(); ++i) {
                std::cout << previousGuesses[i];
                if (i < previousGuesses.size() - 1) {
                    std::cout << " -> ";
                }
            }
            std::cout << std::endl;
            
            guessedCorrectly = true;
        }
    }
    waitForEnter();
}

// Extreme mode
void extremeMode() {
    clearScreen();
    printHeader();
    
    int secretNumber = getRandomNumber(1, 1000);
    std::cout << "\nExtreme Mode: Guess between 1 and 1000 (only 10 attempts!)" << std::endl;
    
    int guess;
    int tries = 0;
    const int maxTries = 10;
    bool guessedCorrectly = false;

    while (tries < maxTries && !guessedCorrectly) {
        std::cout << "\nAttempt " << (tries + 1) << " of " << maxTries << ": ";
        guess = getValidatedChoice(1, 1000);
        tries++;

        if (guess < secretNumber) {
            std::cout << "Too low!" << std::endl;
            provideHint(guess, secretNumber, 1000);
        } else if (guess > secretNumber) {
            std::cout << "Too high!" << std::endl;
            provideHint(guess, secretNumber, 1000);
        } else {
            std::cout << "\nCongratulations! You guessed the number in "
                      << tries << " tries." << std::endl;
            
            if (enableAnimations) {
                printFireworks();
            }
            
            guessedCorrectly = true;
        }
        
        if (!guessedCorrectly && tries < maxTries) {
            std::cout << "Remaining attempts: " << (maxTries - tries) << std::endl;
        }
    }
    
    if (!guessedCorrectly) {
        std::cout << "\nGame Over! The number was: " << secretNumber << std::endl;
    }
    
    waitForEnter();
}

// Multiplayer mode
void multiplayerMode() {
    clearScreen();
    printHeader();
    
    std::cout << "\nMultiplayer Mode" << std::endl;
    std::cout << "Enter the number for the other player to guess: ";
    int secretNumber = getValidatedChoice(1, 1000);
    
    clearScreen();
    printHeader();
    std::cout << "\nPlayer 2: Guess the number (1-1000)" << std::endl;
    
    int guess;
    int tries = 0;
    bool guessedCorrectly = false;

    while (!guessedCorrectly) {
        std::cout << "\nEnter your guess: ";
        guess = getValidatedChoice(1, 1000);
        tries++;

        if (guess < secretNumber) {
            std::cout << "Too low!" << std::endl;
            provideHint(guess, secretNumber, 1000);
        } else if (guess > secretNumber) {
            std::cout << "Too high!" << std::endl;
            provideHint(guess, secretNumber, 1000);
        } else {
            std::cout << "\nCongratulations! You guessed the number in "
                      << tries << " tries." << std::endl;
            
            if (enableAnimations) {
                printFireworks();
            }
            
            guessedCorrectly = true;
        }
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
    std::cout << "5. Custom (Enter your own range)" << std::endl;
    std::cout << "Enter your choice: ";
    int diffChoice = getValidatedChoice(1, 5);

    int minNumber = 1;
    int maxNumber = 100;
    
    if (diffChoice == 5) {
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
        }
    }

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
            std::cout << "Too low!" << std::endl;
            provideHint(guess, secretNumber, range);
        } else if (guess > secretNumber) {
            std::cout << "Too high!" << std::endl;
            provideHint(guess, secretNumber, range);
        } else {
            std::cout << "\nCongratulations! You guessed the number in "
                      << tries << " tries." << std::endl;
                      
            if (enableAnimations) {
                printFireworks();
            }
            
            std::cout << "\nYour guesses: ";
            for (size_t i = 0; i < previousGuesses.size(); ++i) {
                std::cout << previousGuesses[i];
                if (i < previousGuesses.size() - 1) {
                    std::cout << " -> ";
                }
            }
            std::cout << std::endl;
            
            guessedCorrectly = true;
        }
    }
    waitForEnter();
}

// Tournament mode
void playTournament() {
    clearScreen();
    printHeader();
    
    std::cout << "\nWelcome to Tournament Mode!" << std::endl;
    std::cout << "You will face 3 rounds with increasing difficulty. Try to score as many points as possible." << std::endl;

    std::string playerName;
    std::cout << "\nEnter your name for the high score board: ";
    std::getline(std::cin, playerName);
    if (playerName.empty()) playerName = "Anonymous";

    int totalScore = 0;
    const int rounds = 3;
    int ranges[rounds] = {50, 200, 500};
    int maxAttempts[rounds] = {10, 8, 6};
    std::string roundNames[rounds] = {"Easy", "Medium", "Hard"};

    for (int round = 0; round < rounds; round++) {
        std::cout << "\nRound " << round + 1 << " (" << roundNames[round] 
                  << ") - Guess the number between 1 and " 
                  << ranges[round] << std::endl;
                  
        int secretNumber = getRandomNumber(1, ranges[round]);
        int roundScore = maxAttempts[round] * 100;
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
                std::cout << "Too low!" << std::endl;
                provideHint(guess, secretNumber, ranges[round]);
                roundScore -= 100;
            } else if (guess > secretNumber) {
                std::cout << "Too high!" << std::endl;
                provideHint(guess, secretNumber, ranges[round]);
                roundScore -= 100;
            } else {
                std::cout << "Correct! You guessed it in " 
                          << attempts << " attempt" 
                          << (attempts > 1 ? "s" : "") << "." 
                          << std::endl;
                success = true;
                break;
            }
            
            std::cout << "Current round score: " << roundScore << std::endl;
        }
        
        if (success) {
            if (roundScore < 0) roundScore = 0;
            std::cout << "You earned " 
                      << roundScore << " points in this round." 
                      << std::endl;
            totalScore += roundScore;
        } else {
            std::cout << "Out of attempts! The correct number was " 
                      << secretNumber << "." << std::endl;
        }
        
        std::cout << "Total score so far: " << totalScore << std::endl;
        
        if (round < rounds - 1) {
            std::cout << "\nNext round starting..." << std::endl;
            if (enableAnimations) {
                std::this_thread::sleep_for(std::chrono::seconds(1));
            }
        }
    }
    
    std::cout << "\nTournament Over! Your total score is: " 
              << totalScore << std::endl;
              
    if (enableAnimations && totalScore > 0) {
        printTrophy();
    }
    
    bool isNewHighScore = saveHighScore(totalScore, playerName);
    if (isNewHighScore) {
        std::cout << "New high score! You've made it to the leaderboard!" << std::endl;
    }
    
    waitForEnter();
}

// How to play
void howToPlay() {
    clearScreen();
    printHeader();
    
    std::cout << "\nHow to Play:" << std::endl;
    std::cout << "1. In Single Round mode, select a difficulty level and try to guess the secret number." << std::endl;
    std::cout << "2. After each wrong guess, you'll get feedback and a temperature hint on closeness." << std::endl;
    std::cout << "3. In Tournament mode, play through 3 rounds with increasing difficulty and limited attempts." << std::endl;
    std::cout << "4. Each wrong guess in Tournament reduces your round score. Total score is summed across rounds." << std::endl;
    std::cout << "5. Quick Play is a fast version with fixed range (1-100)." << std::endl;
    std::cout << "6. Extreme Mode challenges you to guess between 1-1000 in just 10 attempts." << std::endl;
    std::cout << "7. Multiplayer Mode lets one player set a number and another guess it." << std::endl;
    
    waitForEnter();
}

int main() {
    loadHighScores();
    int choice;
    
    do {
        clearScreen();
        printHeader();
        
        std::cout << "\nMain Menu:" << std::endl;
        std::cout << "1. Quick Play (1-100)" << std::endl;
        std::cout << "2. Single Round Game" << std::endl;
        std::cout << "3. Tournament Mode" << std::endl;
        std::cout << "4. Extreme Mode (1-1000, 10 tries)" << std::endl;
        std::cout << "5. Multiplayer Mode" << std::endl;
        std::cout << "6. How to Play" << std::endl;
        std::cout << "7. View High Scores" << std::endl;
        std::cout << "8. Statistics" << std::endl;
        std::cout << "9. Settings" << std::endl;
        std::cout << "10. Quit" << std::endl;
        std::cout << "Enter your choice: ";
        
        choice = getValidatedChoice(1, 10);

        switch (choice) {
            case 1:
                quickPlay();
                break;
            case 2:
                playSingleRound();
                break;
            case 3:
                playTournament();
                break;
            case 4:
                extremeMode();
                break;
            case 5:
                multiplayerMode();
                break;
            case 6:
                howToPlay();
                break;
            case 7:
                viewHighScores();
                break;
            case 8:
                displayStats();
                break;
            case 9:
                settingsMenu();
                break;
            case 10:
                std::cout << "\nThank you for playing! Goodbye!" << std::endl;
                break;
        }
    } while (choice != 10);
    
    return 0;
}

#include <iostream>
#include <cstdlib>
#include <ctime>
#include <limits>
#include <cmath>
#include <string>

using namespace std;

// ANSI color codes for a nicer display
const string RESET  = "\033[0m";
const string RED    = "\033[1;31m";
const string GREEN  = "\033[1;32m";
const string YELLOW = "\033[1;33m";
const string BLUE   = "\033[1;34m";

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
    cout << BLUE;
    cout << "=========================================" << endl;
    cout << "         GUESS THE NUMBER GAME           " << endl;
    cout << "=========================================" << endl;
    cout << RESET;
}

// Gets a validated integer input within a given range
int getValidatedChoice(int min, int max) {
    int choice;
    cin >> choice;
    while(cin.fail() || choice < min || choice > max) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << RED << "Invalid input. Please enter a number between " << min << " and " << max << ": " << RESET;
        cin >> choice;
    }
    return choice;
}

// Provides a hint based on the absolute difference between guess and secret
void provideHint(int guess, int secret, int range) {
    int diff = abs(secret - guess);
    if(diff == 0) return; // Correct guess—no hint needed.
    
    double percentDiff = static_cast<double>(diff) / range;
    if(percentDiff < 0.1) {
        cout << GREEN << "You're really close!" << RESET << endl;
    } else if(percentDiff < 0.2) {
        cout << YELLOW << "Not too far off!" << RESET << endl;
    } else {
        cout << RED << "You're way off!" << RESET << endl;
    }
}

// Single round game mode
void playSingleRound() {
    clearScreen();
    printHeader();
    
    cout << "\nChoose a difficulty level:" << endl;
    cout << "1. Easy (1 - 50)" << endl;
    cout << "2. Medium (1 - 100)" << endl;
    cout << "3. Hard (1 - 200)" << endl;
    cout << "Enter your choice: ";
    int diffChoice = getValidatedChoice(1, 3);
    
    int maxNumber;
    switch(diffChoice) {
        case 1: maxNumber = 50;  break;
        case 2: maxNumber = 100; break;
        case 3: maxNumber = 200; break;
        default: maxNumber = 100; // fallback to Medium
    }
    
    // Generate the secret number within the chosen range
    int secretNumber = rand() % maxNumber + 1;
    cout << "\nI've picked a number between 1 and " << maxNumber << ". Try to guess it!" << endl;
    
    int guess;
    int tries = 0;
    bool guessedCorrectly = false;
    
    while(!guessedCorrectly) {
        cout << "\nEnter your guess: ";
        guess = getValidatedChoice(1, maxNumber);
        tries++;
        
        if(guess < secretNumber) {
            cout << YELLOW << "Too low!" << RESET << endl;
            provideHint(guess, secretNumber, maxNumber);
        } else if(guess > secretNumber) {
            cout << YELLOW << "Too high!" << RESET << endl;
            provideHint(guess, secretNumber, maxNumber);
        } else {
            cout << GREEN << "Congratulations! You guessed the number in " << tries << " tries." << RESET << endl;
            guessedCorrectly = true;
        }
    }
    
    cout << "\nPress Enter to return to the main menu...";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cin.get();
}

// Tournament mode: Three rounds with increasing difficulty and a scoring system.
void playTournament() {
    clearScreen();
    printHeader();
    cout << "\nWelcome to Tournament Mode!" << endl;
    cout << "You will face 3 rounds with increasing difficulty. Try to score as many points as possible." << endl;
    cout << "Points decrease with each wrong guess. Good luck!" << endl;
    
    int totalScore = 0;
    const int rounds = 3;
    // Parameters for each round: number range and allowed attempts
    int ranges[rounds]     = {50, 100, 150};
    int maxAttempts[rounds] = {10, 8, 6};
    
    for(int round = 0; round < rounds; round++) {
        cout << "\n" << BLUE << "Round " << round + 1 << " - Guess the number between 1 and " << ranges[round] << RESET << endl;
        int secretNumber = rand() % ranges[round] + 1;
        int roundScore = maxAttempts[round] * 10;  // Starting score for the round
        int guess;
        int attempts = 0;
        bool success = false;
        
        while(attempts < maxAttempts[round]) {
            cout << "\nAttempt " << (attempts + 1) << " of " << maxAttempts[round] << ". Your guess: ";
            guess = getValidatedChoice(1, ranges[round]);
            attempts++;
            
            if(guess < secretNumber) {
                cout << YELLOW << "Too low!" << RESET << endl;
                provideHint(guess, secretNumber, ranges[round]);
                roundScore -= 10;  // Deduct points for a wrong guess
            } else if(guess > secretNumber) {
                cout << YELLOW << "Too high!" << RESET << endl;
                provideHint(guess, secretNumber, ranges[round]);
                roundScore -= 10;
            } else {
                cout << GREEN << "Correct! You guessed it in " << attempts << " attempt" << (attempts > 1 ? "s" : "") << "." << RESET << endl;
                success = true;
                break;
            }
        }
        
        if(success) {
            cout << GREEN << "You earned " << roundScore << " points in this round." << RESET << endl;
            totalScore += roundScore;
        } else {
            cout << RED << "Out of attempts! The correct number was " << secretNumber << "." << RESET << endl;
            // No points awarded for this round
        }
    }
    
    cout << "\n" << BLUE << "Tournament Over! Your total score is: " << totalScore << RESET << endl;
    cout << "\nPress Enter to return to the main menu...";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cin.get();
}

// Displays game instructions
void howToPlay() {
    clearScreen();
    printHeader();
    cout << "\nHow to Play:" << endl;
    cout << "1. In Single Round mode, select a difficulty level and try to guess the secret number." << endl;
    cout << "2. After each guess, you'll receive a hint based on how close your guess is." << endl;
    cout << "3. In Tournament mode, you'll play through 3 rounds with increasing difficulty." << endl;
    cout << "4. Each wrong guess in Tournament mode reduces your score, so try to guess smartly!" << endl;
    cout << "\nPress Enter to return to the main menu...";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cin.get();
}

int main() {
    // Seed the random number generator once
    srand(static_cast<unsigned int>(time(0)));
    
    int choice;
    do {
        clearScreen();
        printHeader();
        cout << "\nMain Menu:" << endl;
        cout << "1. Single Round Game" << endl;
        cout << "2. Tournament Mode" << endl;
        cout << "3. How to Play" << endl;
        cout << "4. Quit" << endl;
        cout << "Enter your choice: ";
        choice = getValidatedChoice(1, 4);
        
        switch(choice) {
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
                cout << "\n" << GREEN << "Thank you for playing! Goodbye!" << RESET << endl;
                break;
        }
    } while(choice != 4);
    
    return 0;
}

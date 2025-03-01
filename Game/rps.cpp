#include <iostream>
#include <string>
#include <random>
#include <chrono>
#include <thread>
#include <cctype>
#include <cstdlib>

// ANSI color codes for styling
const std::string RESET  = "\033[0m";
const std::string RED    = "\033[1;31m";
const std::string GREEN  = "\033[1;32m";
const std::string YELLOW = "\033[1;33m";
const std::string BLUE   = "\033[1;34m";

// Clears the console screen (platform dependent)
void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

// Displays a simple animated countdown before revealing the moves.
void animateCountDown() {
    std::cout << BLUE;
    const std::string words[4] = {"Rock", "Paper", "Scissors", "Shoot!"};
    for (int i = 0; i < 4; ++i) {
        std::cout << words[i] << std::flush;
        std::this_thread::sleep_for(std::chrono::milliseconds(600));
        if (i < 3) {
            std::cout << "..." << std::flush;
            std::this_thread::sleep_for(std::chrono::milliseconds(600));
            // Clear the line by printing carriage return and spaces
            std::cout << "\r" << std::string(50, ' ') << "\r";
        } else {
            std::cout << std::endl;
        }
    }
    std::cout << RESET;
}

// Prompts the player to choose a move ('r' for Rock, 'p' for Paper, 's' for Scissors).
char getUserMove() {
    char move;
    while (true) {
        std::cout << "\nChoose your move ([R]ock, [P]aper, [S]cissors): ";
        std::cin >> move;
        move = std::tolower(move);
        if (move == 'r' || move == 'p' || move == 's') {
            return move;
        }
        std::cout << RED << "Invalid move. Please choose R, P, or S." << RESET << std::endl;
    }
}

// Uses C++11 random generator to choose a move for the computer.
char getComputerMove() {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 2);
    int num = dis(gen);
    char moves[3] = {'r', 'p', 's'};
    return moves[num];
}

// Converts a move character into its string representation.
std::string moveToString(char move) {
    switch (move) {
        case 'r': return "Rock";
        case 'p': return "Paper";
        case 's': return "Scissors";
        default:  return "";
    }
}

// Determines the outcome of the round.
// Returns 1 if the player wins, 0 if draw, and -1 if the computer wins.
int determineOutcome(char player, char computer) {
    if (player == computer) return 0;  // Draw
    if ((player == 'r' && computer == 's') ||
        (player == 'p' && computer == 'r') ||
        (player == 's' && computer == 'p'))
    {
        return 1; // Player wins
    }
    return -1; // Computer wins
}

int main() {
    clearScreen();
    std::cout << BLUE << "Welcome to Rock, Paper, Scissors with Animation!" << RESET << std::endl;
    
    char playAgain = 'y';
    while (std::tolower(playAgain) == 'y') {
        // Get moves from player and computer
        char playerMove = getUserMove();
        char computerMove = getComputerMove();
        
        std::cout << YELLOW << "\nGet ready..." << RESET << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(800));
        animateCountDown();
        
        // Reveal both moves
        std::cout << YELLOW << "You chose: " << moveToString(playerMove) << RESET << std::endl;
        std::cout << YELLOW << "Computer chose: " << moveToString(computerMove) << RESET << std::endl;
        
        // Decide outcome
        int outcome = determineOutcome(playerMove, computerMove);
        if (outcome == 1) {
            std::cout << GREEN << "You win!" << RESET << std::endl;
        } else if (outcome == -1) {
            std::cout << RED << "Computer wins!" << RESET << std::endl;
        } else {
            std::cout << BLUE << "It's a draw!" << RESET << std::endl;
        }
        
        std::cout << "\nWould you like to play again? (Y/N): ";
        std::cin >> playAgain;
        clearScreen();
    }
    
    std::cout << "\nThanks for playing Rock, Paper, Scissors!" << std::endl;
    return 0;
}

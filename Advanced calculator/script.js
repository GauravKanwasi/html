let display = document.getElementById("display");
let history = document.getElementById("history");
let currentInput = "";
let previousInput = "";
let operator = "";
let result = null;

// Append numbers to the display
function appendNumber(number) {
  currentInput += number;
  display.value = currentInput;
}

// Append operator (+, -, *, /, %)
function appendOperator(op) {
  if (currentInput === "") return; // Prevent adding operator without a number
  if (previousInput !== "" && operator !== "") {
    calculateResult(); // Perform calculation if the operator is already set
  }
  operator = op;
  previousInput = currentInput;
  currentInput = "";
  history.innerHTML = previousInput + " " + operator;
}

// Append decimal point
function appendDecimal() {
  if (!currentInput.includes(".")) {
    currentInput += ".";
    display.value = currentInput;
  }
}

// Calculate the result of the expression
function calculateResult() {
  if (previousInput === "" || currentInput === "") return; // No calculation if inputs are empty
  let calculation = previousInput + operator + currentInput;
  try {
    result = eval(calculation); // Evaluate the expression
    display.value = result;
    history.innerHTML = calculation + " = " + result;
    currentInput = result;
    previousInput = "";
    operator = "";
  } catch (error) {
    display.value = "Error";
    history.innerHTML = "";
    currentInput = "";
    previousInput = "";
    operator = "";
  }
}

// Clear the display and reset all values
function clearDisplay() {
  currentInput = "";
  previousInput = "";
  operator = "";
  result = null;
  display.value = "";
  history.innerHTML = "";
}

// Delete the last character from the current input
function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  display.value = currentInput;
  if (currentInput === "") {
    history.innerHTML = "";
  }
}

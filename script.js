function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    if (isNaN(a) || isNaN(b)) {
        return 'Error: Invalid Input';
    }

    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            if (b === 0) {
                return 'equisde';
            }
            return divide(a, b);
        default:
            return 'Error: Unknown Operator';
    }
}

// --- State Variables ---
let displayValue = '0';         // Current value shown on the display
let firstValue = null;          // The first operand
let operator = null;            // The selected operator
let waitingForSecondValue = false; // True if an operator has been pressed and we're waiting for the second number

const display = document.querySelector('.display');

// --- Core Functions ---

function updateDisplay() {
    display.textContent = displayValue;
}

function calculate() {
    if (operator === null || waitingForSecondValue || firstValue === null) {
        // Not enough information to calculate
        return;
    }

    const secondValue = displayValue; // The current display value is the second operand
    let result = operate(operator, firstValue, secondValue);

    if (typeof result === 'number') {
        // Round long decimals (e.g., to 8 places)
        result = Math.round(result * 100000000) / 100000000;
        displayValue = String(result);
        firstValue = result; // Store result for potential chaining
    } else {
        // Handle errors like 'equisde' or other messages from operate()
        displayValue = result;
        // Reset state on error to prevent further calculations with invalid state
        firstValue = null;
        operator = null;
        waitingForSecondValue = false;
        updateDisplay(); // Show the error
        return; // Stop further processing after error display
    }

    // Calculation successful
    operator = null;            // Reset operator after calculation
    waitingForSecondValue = false; // Ready for new input or operator
    updateDisplay();
}

function clear() {
    displayValue = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    updateDisplay();
}

// --- Input Handling Functions ---

function inputDigit(digit) {
    // If waiting for the second value, the new digit starts the second value
    if (waitingForSecondValue) {
        displayValue = digit;
        waitingForSecondValue = false; // We now have the start of the second value
    } else {
        // If display is '0' or if a calculation was just performed (operator is null, firstValue holds result)
        // start a new number.
        if (displayValue === '0' || (operator === null && firstValue !== null && !waitingForSecondValue)) {
             displayValue = digit;
             // If we overwrote a result, clear firstValue to signify a completely new calculation start
             if (operator === null && firstValue !== null) {
                 firstValue = null;
             }
        } else {
            // Otherwise, append the digit to the current number
            displayValue += digit;
        }
    }
    updateDisplay();
}

function inputDecimal() {
    // If waiting for second value, start it with '0.'
    if (waitingForSecondValue) {
        displayValue = '0.';
        waitingForSecondValue = false;
        updateDisplay();
        return;
    }
    // Prevent multiple decimals in the current number
    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    // If an operator is already active and we are waiting for the second value,
    // just update the operator (handles consecutive operator presses)
    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    // If firstValue is not set, store the current display value as firstValue
    if (firstValue === null && !isNaN(inputValue)) {
        firstValue = inputValue;
    } else if (operator) {
        // If we already have a firstValue and an operator, perform the calculation first (chaining)
        calculate();
        // After calculate(), firstValue holds the result, displayValue shows it.
    }
    // Update firstValue again in case it was just calculated or initially set
    firstValue = parseFloat(displayValue);

    // Set the new operator and flag that we are waiting for the second value
    operator = nextOperator;
    waitingForSecondValue = true;
}

function changeSign() {
    const currentValue = parseFloat(displayValue);
    if (!isNaN(currentValue) && displayValue !== '0') { // Avoid changing sign of 0 or errors
        displayValue = String(currentValue * -1);
        // If this was applied to a result that could be chained, update firstValue
        if (operator === null && !waitingForSecondValue && firstValue !== null) {
            firstValue = parseFloat(displayValue);
        }
        updateDisplay();
    }
}

function calculatePercent() {
    const currentValue = parseFloat(displayValue);
    if (!isNaN(currentValue)) {
        displayValue = String(currentValue / 100);
        // If this was applied to a result that could be chained, update firstValue
        if (operator === null && !waitingForSecondValue && firstValue !== null) {
            firstValue = parseFloat(displayValue);
        }
        updateDisplay();
    }
}

// --- Event Listener ---

function handleButtonClick(event) {
    const button = event.target;
    // Use data attributes on HTML buttons for clarity
    const action = button.dataset.action;
    const value = button.textContent; // The digit or operator symbol

    if (!action) { // Ignore clicks on elements without data-action (like gaps)
        return;
    }

    // Prevent actions if an error is displayed, except for 'clear'
    if (displayValue.includes('Error') || displayValue === 'equisde') {
        if (action === 'clear') {
            clear();
        }
        return; // Ignore other buttons until cleared
    }

    switch (action) {
        case 'digit':
            inputDigit(value);
            break;
        case 'operator':
            handleOperator(value);
            break;
        case 'decimal':
            inputDecimal();
            break;
        case 'clear':
            clear();
            break;
        case 'calculate': // Corresponds to '=' button
            calculate();
            break;
        case 'sign':
            changeSign();
            break;
        case 'percent':
            calculatePercent();
            break;
    }
}


const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    // Make sure your HTML buttons have the class 'btn' and appropriate 'data-action' attributes
    button.addEventListener('click', handleButtonClick);
});

// Initialize the display when the script loads
clear(); // Use clear to set initial state and display '0'
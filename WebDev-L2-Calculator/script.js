// Get the display
const display = document.getElementById("display");

// Get all calculator buttons
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const decimalButton = document.querySelector(".decimal");
const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");
const deleteButton = document.querySelector(".delete");

// Calculator variables
let firstNumber = "";
let secondNumber = "";
let operator = "";
let expression = "";
let shouldResetDisplay = false;


// ========================================
// NUMBER BUTTONS
// ========================================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const number = button.textContent;

        // Start a new calculation after pressing =
        if (shouldResetDisplay) {
            expression = "";
            display.value = "";
            shouldResetDisplay = false;
        }

        expression += number;

        display.value = expression;

    });

});


// ========================================
// DECIMAL BUTTON
// ========================================

decimalButton.addEventListener("click", () => {

    // Don't add multiple decimals
    // to the same number
    const currentNumber = expression.split(/[+−×÷]/).pop();

    if (!currentNumber.includes(".")) {

        expression += ".";

        display.value = expression;
    }

});


// ========================================
// OPERATOR BUTTONS
// ========================================

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedOperator = button.textContent;

        // Don't allow an operator as the first input
        if (expression === "") {
            return;
        }

        // Don't allow two operators together
        if (/[+−×÷]\s*$/.test(expression)) {
            return;
        }

        // Add operator to expression
        expression += ` ${selectedOperator} `;

        display.value = expression;

        // Store latest operator
        operator = selectedOperator;

    });

});


// ========================================
// EQUALS BUTTON
// ========================================

equalsButton.addEventListener("click", () => {

    calculate();

});


// ========================================
// CALCULATE
// ========================================

function calculate() {

    // Make sure there is an expression
    if (expression === "") {
        return;
    }

    // Remove spaces
    const cleanExpression = expression.replace(/\s/g, "");

    // Get numbers
    const numbers = cleanExpression.split(/[+−×÷]/).map(Number);

    // Get operators
    const operators = cleanExpression.match(/[+−×÷]/g);

    // Make sure the expression is valid
    if (!operators || numbers.length < 2) {
        return;
    }


    // ========================================
    // STEP 1: MULTIPLICATION AND DIVISION
    // ========================================

    let values = [numbers[0]];
    let newOperators = [];

    for (let i = 0; i < operators.length; i++) {

        const currentOperator = operators[i];
        const nextNumber = numbers[i + 1];

        if (currentOperator === "×") {

            // Multiply the previous value
            // with the next number
            const previousValue = values.pop();

            values.push(previousValue * nextNumber);

        }

        else if (currentOperator === "÷") {

            // Prevent division by zero
            if (nextNumber === 0) {

                display.value = "Cannot divide by 0";

                expression = "";
                firstNumber = "";
                secondNumber = "";
                operator = "";

                return;
            }

            const previousValue = values.pop();

            values.push(previousValue / nextNumber);

        }

        else {

            // Addition and subtraction
            // are handled in the next step
            values.push(nextNumber);

            newOperators.push(currentOperator);

        }
    }


    // ========================================
    // STEP 2: ADDITION AND SUBTRACTION
    // ========================================

    let result = values[0];

    for (let i = 0; i < newOperators.length; i++) {

        if (newOperators[i] === "+") {

            result = result + values[i + 1];

        }

        else if (newOperators[i] === "−") {

            result = result - values[i + 1];

        }
    }


    // ========================================
    // SHOW RESULT
    // ========================================

    display.value = `${cleanExpression} = ${result}`;

    // Store result for next calculation
    expression = result.toString();

    firstNumber = "";
    secondNumber = "";
    operator = "";

    shouldResetDisplay = true;

}

// ========================================
// CLEAR BUTTON
// ========================================

clearButton.addEventListener("click", () => {

    display.value = "";

    expression = "";
    firstNumber = "";
    secondNumber = "";
    operator = "";

    shouldResetDisplay = false;

});


// ========================================
// DELETE BUTTON
// ========================================

deleteButton.addEventListener("click", () => {

    // Remove the last character
    expression = expression.slice(0, -1);

    // Remove unnecessary spaces at the end
    expression = expression.trimEnd();

    display.value = expression;

});


// ========================================
// KEYBOARD SUPPORT
// ========================================

document.addEventListener("keydown", (event) => {

    const key = event.key;

    // Numbers
    if (key >= "0" && key <= "9") {

        // Start a new calculation after pressing =
        if (shouldResetDisplay) {
            expression = "";
            display.value = "";
            shouldResetDisplay = false;
        }

        expression += key;

        display.value = expression;

    }


    // Decimal
    else if (key === ".") {

        const currentNumber = expression.split(/[+−×÷]/).pop();

        if (!currentNumber.includes(".")) {

            expression += ".";

            display.value = expression;

        }

    }


    // Addition
    else if (key === "+") {

        addKeyboardOperator("+");

    }


    // Subtraction
    else if (key === "-") {

        addKeyboardOperator("−");

    }


    // Multiplication
    else if (key === "*") {

        addKeyboardOperator("×");

    }


    // Division
    else if (key === "/") {

        addKeyboardOperator("÷");

    }


    // Equal / Enter key
    if (event.key === "=" || event.key === "Enter") {
        calculate();
    }


    // Backspace
    else if (key === "Backspace") {

        expression = expression.slice(0, -1);

        expression = expression.trimEnd();

        display.value = expression;

    }


    // Escape = Clear
    else if (key === "Escape") {

        display.value = "";

        expression = "";
        firstNumber = "";
        secondNumber = "";
        operator = "";

    }

});


// ========================================
// KEYBOARD OPERATOR FUNCTION
// ========================================

function addKeyboardOperator(selectedOperator) {

    if (expression === "") {
        return;
    }

    // Don't allow two operators together
    if (/[+−×÷]\s*$/.test(expression)) {
        return;
    }

    expression += ` ${selectedOperator} `;

    display.value = expression;

    operator = selectedOperator;
}
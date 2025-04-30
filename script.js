function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function changeSign(a) {
    return a * (-1);
}

function percent(a) {
    return a / 100;
}

function operate(operator, a, b) {
    let res;
    switch (operator) {
        case '+':
            res = add(a, b);
            break;
        case '-':
            res = substract(a, b);
            break;
        case '*':
            res = multiply(a, b);
            break;
        case '/':
            if (b === 0) {
                res = 'equisde'
            }
            res = divide(a, b);
            break;
        case 'sign':
            res = changeSign(a);
            break;
        case '%':
            res = percent(a);
            break;
        default:
            res = 'error';
            break;
    }
    return res.toString();
}
var multiplyNumbers = document.getElementById("multiply");
var result = document.getElementById("result");

function multiply() {
    var number1 = document.getElementById("number1").value;
    var number2 = document.getElementById("number2").value;
    var value = number1 * number2;
    result.innerHTML = "The result is " + value;
}

multiplyNumbers.onclick = multiply;
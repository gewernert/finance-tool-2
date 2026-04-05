const button = document.getElementById("testBtn");
const input = document.getElementById("numberInput");
const result = document.getElementById("result");

button.addEventListener("click", function () {
  const value = input.value;
  result.textContent = "You entered: " + value;
});
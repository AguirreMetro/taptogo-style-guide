// Simple button click interaction
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("clickMe");

  button.addEventListener("click", () => {
    alert("Hello from JavaScript!");
  });
});
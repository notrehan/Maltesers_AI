const generateBtn = document.getElementById("generateBtn");
const userInput = document.getElementById("userInput");

// Click handler for the "Generate" button
generateBtn.addEventListener("click", () => {
  const query = userInput.value.trim();
  if (!query) return;

  // For now, just redirect to a new page (roadmap.html) with the topic
  // You can handle the OpenAI API call on the roadmap.html page
  window.location.href = `roadmap.html?topic=${encodeURIComponent(query)}`;
});
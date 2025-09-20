const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get("topic");
const stepsContainer = document.getElementById("steps");

async function generateRoadmap(topic) {
  if (!topic) {
    stepsContainer.innerHTML = "<p>❌ No topic provided.</p>";
    return;
  }

  stepsContainer.innerHTML = "<p class='placeholder'>⏳ Generating roadmap...</p>";

  try {
    // Call your backend function (NOT OpenAI directly)
    const res = await fetch("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    const json = await res.json();
    if (!json.ok) {
      stepsContainer.innerHTML = "<p>❌ Error generating roadmap.</p>";
      return;
    }

    const roadmap = json.roadmap;

    // Render each step as a card
    stepsContainer.innerHTML = roadmap.map((step, i) => `
      <div class="card">
        <strong>Step ${i + 1}:</strong> ${step.task || step}
      </div>
    `).join("");
  } catch (error) {
    console.error(error);
    stepsContainer.innerHTML = "<p class='placeholder'>❌ Error generating roadmap.</p>";
  }
}

generateRoadmap(topic);

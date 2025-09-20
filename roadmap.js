const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get("topic");
const stepsContainer = document.getElementById("stepsContainer");

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
    stepsContainer.innerHTML = Object.entries(roadmap).map(([key, step], i) => `
      <div class="card">
        <strong>${key}:</strong> ${step.task || step}
      </div>
    `).join("");
    
  } catch (error) {
    console.error(error);
    stepsContainer.innerHTML = "<p class='placeholder'>❌ Error generating roadmap.</p>";
  }
}

generateRoadmap(topic);

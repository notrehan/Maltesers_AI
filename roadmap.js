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

    // Render each step as a card
    stepsContainer.innerHTML = roadmap.weeks.map(week => `
      <div class="card">
        <h3>${week.title}</h3>
        
        <div class="tasks">
          ${week.tasks.map(t => `
            <div class="task"><span class="icon">${t.icon}</span> ${t.text}</div>
          `).join("")}
        </div>
        
        ${week.resources && week.resources.length > 0 ? `
        <div class="resources">
          <h4>📎 Resources</h4>
          ${week.resources.map(r => {
            const link = r.link 
              ? r.link 
              : `https://www.youtube.com/results?search_query=${encodeURIComponent(r.query)}`;
            return `
              <div class="resource">
                <span class="icon">${r.icon}</span>
                <a href="${link}" target="_blank">${r.title}</a>
              </div>
            `;
          }).join("")}
        </div>` : ""}
      </div>
    `).join("");
  } catch (error) {
    console.error(error);
    stepsContainer.innerHTML = "<p class='placeholder'>❌ Error generating roadmap.</p>";
  }
}

generateRoadmap(topic);

// api/roadmap.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { topic } = req.body || {};
  if (!topic) {
    return res.status(400).json({ error: "Missing 'topic'" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI that generates structured JSON learning roadmaps.
Return ONLY valid JSON in this format:

{
  "weeks": [
    {
      "title": "Week 1–3: Fundamentals of Flutter",
      "tasks": [
        {"icon": "📚", "text": "Study the basics of Flutter, including its architecture and core concepts."},
        {"icon": "🛠️", "text": "Practice setting up the Flutter development environment and creating your first simple app."}
      ],
      "resources": [
        {"icon": "📖", "title": "Flutter Official Documentation", "link": "https://flutter.dev/docs"},
        {"icon": "▶️", "title": "Flutter Crash Course for Beginners", "query": "Flutter crash course for beginners"}
      ]
    }
  ]
}

Important rules:
- For YouTube, NEVER provide direct links.
- Instead, provide a "query" string.`
          },
          {
            role: "user",
            content: `Create a detailed learning roadmap for ${topic}`
          }
        ]
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const roadmap = JSON.parse(text); // try to parse JSON

    res.status(200).json({ ok: true, roadmap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

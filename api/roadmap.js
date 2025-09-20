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
            content: "You return ONLY valid JSON in a clean roadmap format (weeks, tasks, resources)."
          },
          {
            role: "user",
            content: `Create a detailed learning roadmap for: ${topic}`
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

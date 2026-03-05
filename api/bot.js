export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const body = req.body;

    const chatId = body.message?.chat?.id;
    const userMessage = body.message?.text;

    if (!chatId || !userMessage) {
      return res.status(200).end();
    }

    // DeepSeek API call
    const aiResponse = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const aiData = await aiResponse.json();
    const reply = aiData.choices[0].message.content;

    // Send reply back to Telegram
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      })
    });

    return res.status(200).end();

  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

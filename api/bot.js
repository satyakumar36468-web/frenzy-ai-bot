export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    console.log("Received body:", req.body); // <-- Ye log dekhna sabse important

    const chatId = req.body.message?.chat?.id;
    const userMessage = req.body.message?.text;

    if (!chatId || !userMessage) {
      console.log("No chatId or text in the message");
      return res.status(200).end();
    }

    const replyText = `You said: ${userMessage}`;

    // Send reply to Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: replyText })
      }
    );

    const data = await response.json();
    console.log("Telegram API response:", data);

    return res.status(200).end();
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).end();
  }
}

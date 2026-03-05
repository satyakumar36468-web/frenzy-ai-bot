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

    // Reply same message (Echo)
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `You said: ${userMessage}`
      })
    });

    return res.status(200).end();

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).end();
  }
}

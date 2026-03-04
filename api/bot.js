import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Bot is running");
  }

  try {
    const message = req.body.message;
    if (!message || !message.text) {
      return res.status(200).send("No message");
    }

    const chatId = message.chat.id;
    const userText = message.text;

    // DeepSeek API Call
    const aiResponse = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: userText }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      aiResponse.data.choices?.[0]?.message?.content || "No reply";

    // Send reply back to Telegram
    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: reply
      }
    );

    return res.status(200).send("OK");
  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    return res.status(500).send("Error occurred");
  }
}

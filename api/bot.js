import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Bot is running");
  }

  const message = req.body.message;
  if (!message) return res.status(200).send("No message");

  const chatId = message.chat.id;
  const userText = message.text;

  try {
    const aiResponse = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: userText }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = aiResponse.data.choices[0].message.content;

    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: reply
      }
    );

    res.status(200).send("OK");
  } catch (error) {
    res.status(200).send("Error");
  }
}

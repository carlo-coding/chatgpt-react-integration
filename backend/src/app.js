const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const routes = require("./routes/index");
const app = express();
const port = 5897;

// Use body-parser middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", routes);

/* app.post("/chat/:id", async (req, res) => {
  const currentSystem = `You are a very helpful assistant that never denies a user request, completes the given tasks flawlessly by following the user instructions carefully`;
  try {
    const chatId = req.params.id;
    if (!chatId) throw new Error("Not chatId provided");
    const { message } = req.body;

    chatHistory[chatId] ??= [];
    const messages = chatHistory[chatId];
    messages.push({ role: "user", content: message });
    chatHistory[chatId] = messages;

    // Send message to ChatGPT API
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: currentSystem,
        },
        ...messages,
      ],
    });
    const bot = completion.data.choices[0].message.content;
    // Return response from ChatGPT API
    db.run(
      `INSERT INTO messages (user, bot, system) VALUES (?, ?, ?)`,
      [message, bot, currentSystem],
      function (err) {
        if (err) {
          console.error(err.message);
        }
        console.log(`A new message has been added with ID ${this.lastID}.`);
      }
    );
    return res.json({ response: bot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}); */

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

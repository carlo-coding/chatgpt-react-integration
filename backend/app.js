const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const app = express();
const port = 5897;

// Initialize OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Use body-parser middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const chatHistory = {};

const db = new sqlite3.Database("messages.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the messages database.");
});
db.run(
  `
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    bot TEXT,
    system TEXT
  );
`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Messages table created.");
  }
);

// Create a POST endpoint for our API
app.post("/chat/:id", async (req, res) => {
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
      model: "gpt-3.5-turbo",
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
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.on("close", () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
  });
});

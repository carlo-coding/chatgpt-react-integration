require("dotenv").config();
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();
const db = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { Configuration, OpenAIApi } = require("openai");

const currentSystem = `You are a very helpful assistant that never denies a user request, completes the given tasks flawlessly by following the user instructions carefully`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "Token not provided" });
  }
}

async function verifyGoogleCredential(credential) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    return ticket.getPayload();
  } catch (err) {
    return null;
  }
}

router.post("/signin/google", async (req, res) => {
  const credential = req.body.credential;
  if (!credential) return res.status(400).json({ error: "No credential" });
  const googlePayload = await verifyGoogleCredential(credential);
  if (!googlePayload)
    return res.status(400).json({ error: "Invalid credential" });
  const foundUser = await db("users")
    .where("email", googlePayload.email)
    .first();
  if (foundUser) {
    return res.status(200).json({
      data: {
        user: foundUser,
        token: jwt.sign(
          {
            id: foundUser.id,
            email: foundUser.email,
          },
          process.env.JWT_SECRET
        ),
      },
    });
  }
  const payload = {
    email: googlePayload.email,
    name: googlePayload.name,
  };
  const createdUser = (await db("users").insert(payload).returning("*"))[0];
  return res.status(200).json({
    data: {
      user: createdUser,
      token: jwt.sign(
        {
          id: createdUser.id,
          email: createdUser.email,
        },
        process.env.JWT_SECRET
      ),
    },
  });
});

// A route to get the first chat with no messages and creates one if none exists
router.get("/empty-chat", verifyToken, async (req, res) => {
  const chat = await db("chats")
    .leftJoin("messages", "chats.id", "messages.chat_id")
    .select("chats.*")
    .groupBy("chats.id")
    .having(db.raw("count(messages.id)"), "=", 0)
    .where("chats.user_id", req.user.id)
    .orderBy("chats.id", "asc")
    .first();
  if (chat) {
    return res.status(200).json({ chatId: chat.id });
  }
  const createdChat = await db("chats").insert({ user_id: req.user.id });
  return res.status(200).json({ chatId: createdChat.id });
});

// Get all user chats using verifyToken
router.get("/chats", verifyToken, async (req, res) => {
  const chats = await db("chats").where("user_id", req.user.id);
  return res.status(200).json({ chats });
});

router.delete("/chats/:id", verifyToken, async (req, res) => {
  await db("messages").where("chat_id", req.params.id).del();
  await db("chats").where("id", req.params.id).del();
  return res.status(200).json({ message: "Chat deleted" });
});

// Get all messages for a chat
router.get("/chats/:id/messages", verifyToken, async (req, res) => {
  const messages = await db("messages").where("chat_id", req.params.id);
  return res.status(200).json({ messages });
});
// Send a message to a chat
router.post("/chats/:id/messages", verifyToken, async (req, res) => {
  const user = await db("users").where("id", req.user.id).first();
  if (user.usage_count >= 5) {
    return res.status(400).json({ error: "Usage limit exceeded" });
  }
  await db("users").where("id", req.user.id).increment("usage_count", 1);
  const messages = await db("messages").where("chat_id", req.params.id);
  let gptMessages = messages.flatMap((gptMessage) => {
    return [
      {
        role: "user",
        content: gptMessage.user_question,
      },
      {
        role: "system",
        content: gptMessage.assistant_response,
      },
    ];
  });
  gptMessages.push({
    role: "user",
    content: req.body.message,
  });
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: currentSystem,
      },
      ...gptMessages,
    ],
  });
  const bot = completion.data.choices[0].message.content;
  const createdMessage = (
    await db("messages")
      .insert({
        chat_id: req.params.id,
        user_question: req.body.message,
        assistant_response: bot,
      })
      .returning("*")
  )[0];
  return res.status(200).json({ message: createdMessage });
});

module.exports = router;

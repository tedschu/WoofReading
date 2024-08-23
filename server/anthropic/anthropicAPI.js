//import Anthropic from "@anthropic-ai/sdk";
const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");
const path = require("path");

// this will point to the .env file and then load the env variables (namely the API key)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Instantiates Anthropic SDK
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// **** EACH (GET) TO GENERATE A STORY WILL INCLUDE:
// (1) THE "TOPIC" FOR THE STORY PASSED FROM THE USER VIA THE BODY (E.G. DOGS, OUTER SPACE, ETC.)
// (2) A "DIFFICULTY LEVEL" (1-5) WHICH WILL DETERMINE THE LENGTH OF THE STORY (150 - 400 WORDS) AND THE TYPE OF WORDS USED

// Function to establish connection to the Anthropic API
async function callAnthropicAPI(messages, system = "") {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.5,
      system: system,
      messages: messages,
    });
    return response.content[0].text;
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    throw error;
  }
}

// Route to generate (GET) a new story based on user selection of story topic
// router.get('/generate_story', async(req, res) => {
//   try {
//     const messages = [
//       {
//         role: "user",
//         content: [
//           {
//             type: "text",
//             text:
//           }
//         ]
//       }
//     ]

//   } catch (error) {

//   }

// })

// FUNCTION TO TEST THE API CALL:
// callAnthropicAPI(
//   [
//     {
//       role: "user",
//       content: [
//         {
//           type: "text",
//           text: "Generate a 200-word story about outer space that we'll then generate a few questions about afterwards to test a user's reading comprehension. Make sure that the story is unique each time the API is called.",
//         },
//       ],
//     },
//   ],
//   "You are a grade school reading tutor."
// )
//   .then((result) => console.log("Test result:", result))
//   .catch((error) => console.error("Test error:", error));

module.exports = router;

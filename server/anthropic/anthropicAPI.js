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
// (2) A "DIFFICULTY LEVEL" (1-5)
// (3) A STORY LENGTH, BASED ON DIFFICULTY LEVEL (EX. FROM 250 - 700 WORDS)
// ***** YOU MAY ALSO NEED TO PASS A RANDOM VARIABLE TO HELP ENSURE THAT STORIES ARE UNIQUE EACH TIME, AND/OR TO CHANGE THE TOPIC EACH TIME.

// Function to establish connection to the Anthropic API
async function callAnthropicAPI(messages, system = "") {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.9,
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
router.get("/generate_story", async (req, res) => {
  try {
    // ******** TODO: Need to pass these from user inputs in frontend
    const story_length = req.query.story_length;
    const difficulty = req.query.difficulty;
    const story_topic = req.query.story_topic;

    if (!story_length || !difficulty || !story_topic) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Generate a ${story_length}-word story with a difficulty level of ${difficulty} (out of 5) about ${story_topic}, followed by 3 questions about the story. Return the result as a valid JSON object with the following structure: Title: [your title here], Story: [your story here], Question_1: [your question 1 here].`,
          },
        ],
      },
    ];

    const system =
      "You are a reading tutor for students in grade school, and will be generating stories to test reading comprehension. All of the stories need to be age-appropriate, with no offensive language or themes.";

    // Uses messages and system variables to call "callAnthropicAPI" function
    const response = await callAnthropicAPI(messages, system);

    // Parse the response, replacing all \n breaks and "\" with empty strings, and convert it to readable JSON (storyData)
    const cleanedResponse = response.replace(/\n/g, "").replace(/\\/g, "");
    const storyData = JSON.parse(cleanedResponse);

    // Sends back storyData JSON object with Title, Story, Question 1, Question 2, Question 3 keys.
    res.json(storyData);
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "Failed to generate story." });
  }
});

// // FUNCTION TO TEST THE API CALL:
// callAnthropicAPI(
//   [
//     {
//       role: "user",
//       content: [
//         {
//           type: "text",
//           text: `Generate a 300-word story with a difficulty level of 2 (out of 5) about the rain forest, followed by 3 questions about the story. Ensure that the block of questions is preceded by the line "Comprehension questions:`,
//         },
//       ],
//     },
//   ],
//   "You are a reading tutor for students in grade school, and will be generating stories to test reading comprehension. All of the stories need to be age-appropriate, with no offensive language or themes."
// )
//   .then((result) => console.log("Test result:", result))
//   .catch((error) => console.error("Test error:", error));

module.exports = router;

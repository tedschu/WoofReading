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
            text: `Generate a ${story_length}-word story with a difficulty level of ${difficulty} (out of 5) about ${story_topic}, followed by 3 questions about the story. Return the result as a valid JSON object with the following structure:

            {
              "Title": "Your story title",
              "Story": "Your multi-paragraph story",
              "Question_1": "First question",
              "Question_2": "Second question",
              "Question_3": "Third question"
            }
            
            Important:
            1. Ensure all JSON keys are in double quotes.
            2. The "Story" value should be a single string with paragraphs separated by "\\n\\n" (two backslashes followed by two 'n's).
            3. Do not use actual line breaks within the JSON string values. Use "\\n" for necessary line breaks.
            4. Escape any double quotes within the text values with a backslash.
            5. The entire JSON object should be on a single line, with no line breaks between properties.`,
          },
        ],
      },
    ];

    const system =
      "You are a reading tutor for students in grade school, and will be generating stories to test reading comprehension. All of the stories need to be age-appropriate, with no offensive language or themes.";

    // Uses messages and system variables to call "callAnthropicAPI" function
    const response = await callAnthropicAPI(messages, system);

    //console.log("Raw response:", response);

    // // Parse the response, replacing all \n breaks and "\" with empty strings, and convert it to readable JSON (storyData)
    const cleanedResponse = response
      // .replace(/(?<!\\)\n/g, "\\\\n");
      .replace(/\\'/g, "'"); // Replace \' with just '
    // .replace(/'/g, "\\'") // Then replace all ' with \'
    // .replace(/\n/g, "\\n") // Replace newlines with \n
    // .replace(/[\u0000-\u0019]+/g, "");
    // .replace(/[^\x20-\x7E]/g, "");
    console.log(JSON.stringify(response));

    const storyData = JSON.parse(cleanedResponse);

    // Sends back storyData JSON object with Title, Story, Question 1, Question 2, Question 3 keys.
    res.json(storyData);
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "Failed to generate story." });
  }
});

// PROMPT TEXT FOR EVALUATION FUNCTION:
// Using the JSON object below, review the answers to the three questions and evaluate whether the answers were correct. If the user has small spelling or punctuation errors, don't automatically evaluate as incorrect. Instead, provide feedback where applicable.

// {
//   "Story": "Pumpkin Spice was no ordinary singer. With her unique voice and infectious stage presence, she had captivated audiences everywhere. Her debut album, \"Autumn\'s Melody,\" had been an instant hit, propelling her to the forefront of the music scene.\\n\\nAs Pumpkin Spice\'s popularity grew, so did the demand for her performances. She found herself touring the country, performing sold-out shows in cities big and small. Wherever she went, her fans eagerly awaited the chance to see her live, entranced by her ability to blend her soulful vocals with the warmth of the season.\\n\\nBut Pumpkin Spice never forgot her roots. She remained humble and grounded, often using her platform to raise awareness for local charities and community initiatives. Her dedication to her craft and her desire to make a difference in the world only added to her appeal, cementing her status as a true icon of the music industry.",
//   "Question_1": "What was the title of Pumpkin Spice's debut album?",
//   "Answer_1": "Autums melody",
//   "Question_2": "Where did Pumpkin Spice perform her shows?",
//   "Answer_2": "big cities and towns",
//   "Question_3": "How did Pumpkin Spice use her platform to make a difference?",
//   "Answer_3": "helped local charities"
// }

// Return the result as valid JSON with the following structure:

// {
// "evaluations" = [
// {
//   "Question": "First question",
//   "Answer": "First answer",
//   "is_correct": "true or false",
//   "feedback": "Return feedback on first answer if "is_correct" is false. Otherwise, return 'null'"
// }]
// "overall_score": "0, 1, 2, or 3 based on the number of true values for is_correct"
// }

// Important:
// 1. Ensure all JSON keys are in double quotes.
// 2. Do not use actual line breaks within the JSON string values. Use "\\n" for necessary line breaks.
// 3. Escape any double quotes within the text values with a backslash.
// 4. The entire JSON object should be on a single line, with no line breaks between properties.

module.exports = router;

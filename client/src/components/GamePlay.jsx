import React from "react";
import { useState, useEffect } from "react";

function GamePlay({
  sliderValue,
  userScore,
  setUserScore,
  userInfo,
  gotRight,
  gotWrong,
  setGotRight,
  setGotWrong,
  userBadges,
  setUserBadges,
  totalScore,
  setTotalScore,
  isModalOpen,
  setIsModalOpen,
  modalBadge,
  setModalBadge,
  storyLength,
  storyPrompt,
}) {
  const [questionCount, setQuestionCount] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [questionResult, setQuestionResult] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [triggerNewStory, setTriggerNewStory] = useState(false);

  console.log(sliderValue);

  // Function to hit generate_story endpoint (e.g. Anthropic API) to get a story based on values passed in
  const getStory = async (story_length, difficulty, story_topic) => {
    try {
      const queryParams = new URLSearchParams({
        story_length: story_length,
        difficulty: difficulty,
        story_topic: story_topic,
      });

      const response = await fetch(
        `/anthropic/generate_story?${queryParams.toString()}`
      );

      if (!response.ok) {
        const textResponse = await response.text();
        console.error("Server response:", textResponse);
        throw new Error("Failed to generate the story");
      }

      const data = await response.json();
      //console.log(data);

      setTitle(data.Title);
      setStory(data.Story);
      setQuestion1(data.Question_1);
      setQuestion2(data.Question_2);
      setQuestion3(data.Question_3);

      //return await response.json();
    } catch (error) {
      console.error("Error generating story:", error);
      throw error;
    }
  };

  // Triggers the getStory function but only after all input values (slider, prompt, storylength) have been updated
  useEffect(() => {
    if (triggerNewStory) {
      getStory(storyLength, sliderValue, storyPrompt);
      setTriggerNewStory(false);
    }
  }, [triggerNewStory, storyLength, sliderValue, storyPrompt]);

  // Handles button click "write story," setting TriggerNewStory = true which also triggers the useEffect above
  const handleClick = () => {
    setTriggerNewStory(true);
  };

  return (
    <>
      <div className="storyContainer">
        <div className="storyContentContainer">
          <button onClick={handleClick}>Write story</button>
          <h1>{title}</h1>
          <p>{story}</p>
          <br />
          <p>Question 1: {question1}</p>
          <p>Question 2: {question2}</p>
          <p>Question 3: {question3}</p>
        </div>
      </div>
    </>
  );
}

export default GamePlay;

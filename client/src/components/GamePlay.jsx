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
  const [triggerNewStory, setTriggerNewStory] = useState(false);
  const [storyResponseData, setStoryResponseData] = useState({
    title: "",
    story: "",
    question_1: "",
    question_2: "",
    question_3: "",
    answer_1: "",
    answer_2: "",
    answer_3: "",
  });

  // ***** STORY GENERATION *****
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
      //console.log(data.Story);

      setStoryResponseData({
        title: data.Title,
        story: data.Story,
        question_1: data.Question_1,
        question_2: data.Question_2,
        question_3: data.Question_3,
      });

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

  // ***** USER ANSWERS AND EVALUATION *****
  // Handles user input values in "answer" boxes
  const setFormValues = (event) => {
    const newObj = { ...storyResponseData };
    newObj[event.target.name] = event.target.value;
    setStoryResponseData(newObj);
  };

  // Submit button that calls "evaluate_answers" function / API call
  const submit = (event) => {
    event.preventDefault();
    //loginCheck(userInfo);  // NEEDS TO CALL FUNCTION TO EVALUATE ANSWERS
  };

  return (
    <>
      <div className="storyContainer">
        <div className="storyContentContainer">
          <button onClick={handleClick}>Write story</button>
          <h1>{storyResponseData.title}</h1>
          <p className="preserve-linebreaks">{storyResponseData.story}</p>
          <br />

          <form action="" className="loginForm" onSubmit={submit}>
            <p>Question 1: {storyResponseData.question_1}</p>
            <input
              type="text"
              placeholder="Your answer (1)..."
              name="answer_1"
              value={storyResponseData.answer_1}
              onChange={setFormValues}
            />
            <p>Question 2: {storyResponseData.question_2}</p>
            <input
              type="text"
              placeholder="Your answer (2)..."
              name="answer_2"
              value={storyResponseData.answer_2}
              onChange={setFormValues}
            />
            <p>Question 3: {storyResponseData.question_3}</p>
            <input
              type="text"
              placeholder="Your answer (3)..."
              name="answer_3"
              value={storyResponseData.answer_3}
              onChange={setFormValues}
            />
            <button className="button login">SUBMIT</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default GamePlay;

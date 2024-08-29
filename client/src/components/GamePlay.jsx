import React from "react";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

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
  const [triggerNewEvaluation, setTriggerNewEvaluation] = useState(false);
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
  const [evaluationData, setEvaluationData] = useState({
    is_correct_1: "",
    feedback_1: "",
    is_correct_2: "",
    feedback_2: "",
    is_correct_3: "",
    feedback_3: "",
    score: "",
  });
  const [showEvaluationChecks, setShowEvaluationChecks] = useState(false);

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
    setShowEvaluationChecks(false);
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
    setTriggerNewEvaluation(true); // NEEDS TO CALL FUNCTION TO EVALUATE ANSWERS
  };

  // Triggers the evaluateAnswers function but only after all input values (storyResponseData) have been updated
  useEffect(() => {
    if (triggerNewEvaluation) {
      evaluateAnswers(storyResponseData);
      setTriggerNewEvaluation(false);
    }
  }, [triggerNewEvaluation, storyResponseData]);

  // Function to hit evaluate_answers endpoint (e.g. Anthropic API) to get a story based on values passed in
  const evaluateAnswers = async (storyResponseData) => {
    try {
      const response = await fetch("/anthropic/evaluate_answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story: storyResponseData.story,
          question_1: storyResponseData.question_1,
          answer_1: storyResponseData.answer_1,
          question_2: storyResponseData.question_2,
          answer_2: storyResponseData.answer_2,
          question_3: storyResponseData.question_3,
          answer_3: storyResponseData.answer_3,
        }),
      });

      if (!response.ok) {
        const textResponse = await response.text();
        console.error("Server response:", textResponse);
        throw new Error("Failed to evalaute the answers");
      }

      const data = await response.json();

      // Sets API response data into evaluationData state
      setEvaluationData({
        is_correct_1: data.evaluations[0].is_correct,
        feedback_1: data.evaluations[0].feedback,
        is_correct_2: data.evaluations[1].is_correct,
        feedback_2: data.evaluations[1].feedback,
        is_correct_3: data.evaluations[2].is_correct,
        feedback_3: data.evaluations[2].feedback,
        score: data.overall_score,
      });

      console.log(evaluationData.is_correct_1);
      setShowEvaluationChecks(true);

      //return await response.json();
    } catch (error) {
      console.error("Error evaluating answers:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="storyContainer">
        <button onClick={handleClick}>Get the story</button>

        <div className="storyContentContainer">
          <h1>{storyResponseData.title}</h1>
          <p className="preserve-linebreaks">{storyResponseData.story}</p>
          <br />

          <form action="" className="answerForm" onSubmit={submit}>
            <p>Question 1: {storyResponseData.question_1}</p>
            <div className="answerInputBox">
              <div className="empty"></div>
              <input
                type="text"
                placeholder="Your answer (1)..."
                name="answer_1"
                value={storyResponseData.answer_1}
                onChange={setFormValues}
              />
              {showEvaluationChecks && (
                <div className="rightWrongIcon">
                  {evaluationData.is_correct_1 ? (
                    <CheckCircleIcon className="checkIcon" />
                  ) : (
                    <TipsAndUpdatesIcon className="bulbIcon" />
                  )}
                </div>
              )}
            </div>
            {showEvaluationChecks && (
              <div className="feedback">
                {!evaluationData.is_correct_1 && evaluationData.feedback_1}
              </div>
            )}
            <p>Question 2: {storyResponseData.question_2}</p>
            <div className="answerInputBox">
              <div className="empty"></div>
              <input
                type="text"
                placeholder="Your answer (2)..."
                name="answer_2"
                value={storyResponseData.answer_2}
                onChange={setFormValues}
              />
              {showEvaluationChecks && (
                <div className="rightWrongIcon">
                  {evaluationData.is_correct_2 ? (
                    <CheckCircleIcon className="checkIcon" />
                  ) : (
                    <TipsAndUpdatesIcon className="bulbIcon" />
                  )}
                </div>
              )}
            </div>
            {showEvaluationChecks && (
              <div className="feedback">
                {!evaluationData.is_correct_2 && evaluationData.feedback_2}
              </div>
            )}
            <p>Question 3: {storyResponseData.question_3}</p>
            <div className="answerInputBox">
              <div className="empty"></div>
              <input
                type="text"
                placeholder="Your answer (3)..."
                name="answer_3"
                value={storyResponseData.answer_3}
                onChange={setFormValues}
              />
              {showEvaluationChecks && (
                <div className="rightWrongIcon">
                  {evaluationData.is_correct_3 ? (
                    <CheckCircleIcon className="checkIcon" />
                  ) : (
                    <TipsAndUpdatesIcon className="bulbIcon" />
                  )}
                </div>
              )}
            </div>
            {showEvaluationChecks && (
              <div className="feedback">
                {!evaluationData.is_correct_3 && evaluationData.feedback_3}
              </div>
            )}
            <button className="button login">SUBMIT</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default GamePlay;

import React from "react";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { buttonBaseClasses } from "@mui/material";
import storyPrompts from "../utils/storyPrompts";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CircularColor from "./CircularColor";
import Popper from "@mui/material/Popper";

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
  setStoryPrompt,
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
  const [pointsWon, setPointsWon] = useState(0);
  const [circularProgress, setCircularProgress] = useState(false);
  const [circularProgressSubmit, setCircularProgressSubmit] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [pointsToWin, setPointsToWin] = useState("");

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
      setCircularProgress(false);
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
      setCircularProgress(false);
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
    setCircularProgress(true);
    setTriggerNewStory(true);
    setShowEvaluationChecks(false);
    setStoryResponseData({
      answer_1: "",
      answer_2: "",
      answer_3: "",
    });
    setGotWrong(false);
    setErrorText("");
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
    setCircularProgressSubmit(true);
    setErrorText("");
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
        setErrorText("Make sure you've answered all the questions.");
        throw new Error("Failed to evalaute the answers");
        setCircularProgressSubmit(false);
      }

      const data = await response.json();

      // Sets API response data into evaluationData state
      setCircularProgressSubmit(false);
      setEvaluationData({
        is_correct_1: data.evaluations[0].is_correct,
        feedback_1: data.evaluations[0].feedback,
        is_correct_2: data.evaluations[1].is_correct,
        feedback_2: data.evaluations[1].feedback,
        is_correct_3: data.evaluations[2].is_correct,
        feedback_3: data.evaluations[2].feedback,
        score: data.overall_score,
      });

      setShowEvaluationChecks(true);
      // Only calculate updated score if the user got at least 1 question correct (e.g. at least 1 point)
      if (data.overall_score > 0) {
        calculateScore(data.overall_score);
        setGotRight(true);
      } else if (data.overall_score == 0) {
        setGotWrong(true);
      }

      //return await response.json();
    } catch (error) {
      console.error("Error evaluating answers:", error);
      setCircularProgressSubmit(false);
      throw error;
    }
  };

  // evaluationData comes in, state is updated.
  function calculateScore(rawScore) {
    let addToScore;
    let points;
    switch (sliderValue) {
      case 1:
        points = 5;
        addToScore = rawScore * points;
        console.log(addToScore);
        setPointsToWin(points);
        break;
      case 2:
        points = 7;
        addToScore = rawScore * points;
        setPointsToWin(points);
        break;
      case 3:
        points = 10;
        addToScore = rawScore * points;
        setPointsToWin(points);
        break;
      case 4:
        points = 12;
        addToScore = rawScore * points;
        setPointsToWin(points);
        break;
      case 5:
        points = 15;
        addToScore = rawScore * points;
        setPointsToWin(points);
        break;
    }
    let updatedScore = addToScore + userScore.score;
    postUserScore(updatedScore);
    setPointsWon(addToScore);
    updateBadges(updatedScore);
  }

  // Function to pass the updated score to the database, update scores state values for gameplay
  const postUserScore = async (updatedScore) => {
    try {
      // const updatedScores = getUpdatedScores(gameSelector, addToScore);
      const storedToken = localStorage.getItem("token");

      const response = await fetch(`/api/users/${userInfo.id}/score_reading`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          score: updatedScore,
        }),
      });

      const data = await response.json();

      // SET ALL STATE VALUES HERE (SCORES, BADGES, USER INFO, ETC.)
      if (response.ok) {
        //setUserBadges(data.badge);
        setUserScore({
          score: updatedScore,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Function setting the logic on updating badges
  function updateBadges(newTotalScore) {
    setUserBadges((prevBadges) => {
      const updatedBadges = {};

      if (newTotalScore >= 100 && !userBadges.bernese) {
        updatedBadges.bernese = true;
        setModalBadge("bernese");
      } else if (newTotalScore >= 250 && !userBadges.chihuahua) {
        updatedBadges.chihuahua = true;
        setModalBadge("chihuahua");
      } else if (newTotalScore >= 500 && !userBadges.waterdog) {
        updatedBadges.waterdog = true;
        setModalBadge("Water Dog");
      } else if (newTotalScore >= 1000 && !userBadges.boxer) {
        updatedBadges.boxer = true;
        setModalBadge("boxer");
      } else if (newTotalScore >= 1500 && !userBadges.husky) {
        updatedBadges.husky = true;
        setModalBadge("husky");
      } else if (newTotalScore >= 2000 && !userBadges.golden) {
        updatedBadges.golden = true;
        setModalBadge("golden");
      } else if (newTotalScore >= 2500 && !userBadges.cat) {
        updatedBadges.cat = true;
        setModalBadge("cat");
      } else if (newTotalScore >= 3000 && !userBadges.goldendoodle_trophy) {
        updatedBadges.goldendoodle_trophy = true;
        setModalBadge("goldendoodle_trophy");
      }

      if (Object.keys(updatedBadges).length > 0) {
        const newBadges = { ...prevBadges, ...updatedBadges };
        postUserBadges(updatedBadges);
        openModal();
        return newBadges;
      }
      return prevBadges;
    });
  }

  // Function to pass the updated badges to the database
  const postUserBadges = async (updatedBadges) => {
    try {
      // const updatedScores = getUpdatedScores(gameSelector, addToScore);
      const storedToken = localStorage.getItem("token");

      const response = await fetch(`/api/users/${userInfo.id}/badge_reading`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(updatedBadges),
      });

      const data = await response.json();
      //console.log(data);

      // SET ALL STATE VALUES HERE (SCORES, BADGES, USER INFO, ETC.)
      if (response.ok) {
        //setUserBadges(data.badge);
        // console.log(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Controls alert when question was right. Visible for 3 seconds.
  useEffect(() => {
    let timer;
    if (gotRight) {
      timer = setTimeout(() => {
        setGotRight(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [gotRight]);

  // Finds a random value in the storyPrompt array and sets it in state (storyPrompt)
  const selectPrompt = () => {
    const randomIndex = Math.floor(Math.random() * storyPrompts.length);
    const prompt = storyPrompts[randomIndex];
    setStoryPrompt(prompt);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };

  const openModal = () => {
    // console.log("Inside openModal: ", modalBadge);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="storyContainer">
        <button onClick={handleClick} className="button StoryGenerate">
          GET THE STORY <AutoAwesomeIcon fontSize="small" />
        </button>

        <div className="storyContentContainer">
          {circularProgress && <CircularColor />}
          <h1 className="gamePlayHeaders">{storyResponseData.title}</h1>
          <p className="preserve-linebreaks">{storyResponseData.story}</p>
          <br />

          {storyResponseData.story && (
            <>
              <h3 className="gamePlayHeaders">
                {/* Answer these for up to {pointsToWin} points: */}
                Answer these to win points & badges:
              </h3>
              <form action="" className="answerForm" onSubmit={submit}>
                <p>{storyResponseData.question_1}</p>
                <div className="answerInputBox">
                  <div className="empty"></div>
                  <input
                    type="text"
                    placeholder="Your answer..."
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
                <p>{storyResponseData.question_2}</p>
                <div className="answerInputBox">
                  <div className="empty"></div>
                  <input
                    type="text"
                    placeholder="Your answer..."
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
                <p>{storyResponseData.question_3}</p>
                <div className="answerInputBox">
                  <div className="empty"></div>
                  <input
                    type="text"
                    placeholder="Your answer..."
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
                {circularProgressSubmit && <CircularColor />}
                <button className="button login">SUBMIT</button>
              </form>
            </>
          )}
          {gotRight && (
            <div className="rightAnswerAlert">
              <h4>Yay! You got it right! That's +{pointsWon} points!</h4>
            </div>
          )}
          {gotWrong && (
            <div className="wrongAnswerAlert">
              <h4>Good effort. Keep trying!</h4>
            </div>
          )}
          {showEvaluationChecks && (
            <button onClick={selectPrompt}>Try another story!</button>
          )}
          {errorText && <h3 style={{ color: "red" }}>{errorText}</h3>}
        </div>
      </div>
    </>
  );
}

export default GamePlay;

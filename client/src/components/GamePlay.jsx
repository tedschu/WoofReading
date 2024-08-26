import React from "react";
import { useState, useEffect } from "react";

function GamePlay({
  sliderValue,
  storySelector,
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
}) {
  const [questionCount, setQuestionCount] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [questionResult, setQuestionResult] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
      console.log(data);

      //return await response.json();
    } catch (error) {
      console.error("Error generating story:", error);
      throw error;
    }
  };

  return <>test</>;
}

export default GamePlay;

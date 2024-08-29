import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import storyPrompts from "../utils/storyPrompts";

export default function StorySelector({
  setStorySelection,
  setGotRight,
  setGotWrong,
  storyPrompt,
  setStoryPrompt,
}) {
  // Finds a random value in the storyPrompt array and sets it in state (storyPrompt)
  const selectPrompt = () => {
    const randomIndex = Math.floor(Math.random() * storyPrompts.length);
    const prompt = storyPrompts[randomIndex];
    setStoryPrompt(prompt);
  };

  // Runs selectPrompt on page load to ensure there's a "default" prompt value
  useEffect(() => {
    selectPrompt();
  }, []);

  // Handles the button click to "try another" story prompt
  const handleButton = () => {
    selectPrompt();
  };

  return (
    <>
      <div className="storySelectContainer">
        <h3>Let's pick a story:</h3>
        <div className="storyPromptContainer">
          <div className="storyPrompt">
            <h3>{storyPrompt}</h3>
            <ArrowForwardIosIcon className="nextIcon" onClick={handleButton} />
          </div>
        </div>
      </div>
    </>
  );
}

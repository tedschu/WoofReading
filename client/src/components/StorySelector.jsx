import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import storyPrompts from "../utils/storyPrompts";

export default function StorySelector({
  setStorySelection,
  setGotRight,
  setGotWrong,
}) {
  const [storyPrompt, setStoryPrompt] = useState("");

  const selectPrompt = () => {
    const randomIndex = Math.floor(Math.random() * storyPrompts.length);
    const prompt = storyPrompts[randomIndex];
    console.log(prompt);
    setStoryPrompt(prompt);
  };

  const handleButton = () => {
    selectPrompt();
  };

  return (
    <>
      <div className="gameSelectContainer">
        <h3>Let's do a story about:</h3>
        <h3>{storyPrompt}</h3>
        <button onClick={handleButton}>Try another one</button>
      </div>
    </>
  );
}

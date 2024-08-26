import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 1,
    label: "Easier",
  },
  {
    value: 5,
    label: "Harder",
  },
];

function valuetext(value) {
  return `${value}°C`;
}

export default function DiscreteSlider({
  setSliderValue,
  sliderValue,
  setGotRight,
  setGotWrong,
  setStoryLength,
}) {
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    setGotRight(false);
    setGotWrong(false);
    storyLength(newValue);
  };

  function storyLength(sliderValue) {
    switch (sliderValue) {
      case 1:
        setStoryLength(250);
        break;
      case 2:
        setStoryLength(300);
        break;
      case 3:
        setStoryLength(350);
        break;
      case 4:
        setStoryLength(450);
        break;
      case 5:
        setStoryLength(550);
        break;
    }
  }

  return (
    <div className="sliderContainer">
      <h3>How challenging should the story be?</h3>

      <Box sx={{ width: 300 }} className="sliderBox">
        <Slider
          aria-label="Custom marks"
          value={sliderValue}
          onChange={handleSliderChange}
          defaultValue={1}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          shiftStep={1}
          step={1}
          marks={marks}
          min={1}
          max={5}
          sx={{
            "& .MuiSlider-markLabel": {
              fontFamily: "Patrick Hand",
              color: "#0085bd",
            },
            "& .MuiSlider-thumb": {
              color: "#dd6e55", // This changes the color of the slider circle
            },
            "& .MuiSlider-track": {
              color: "#7dc2e0", // Track color behind slider
            },
            "& .MuiSlider-rail": {
              color: "#a6d5ea", // Track color ahead of slider
            },
            "& .MuiSlider-valueLabel": {
              backgroundColor: "#dd6e55", // This changes the background color of the pop-up indicator
              color: "white", // This changes the text color in the pop-up indicator
              fontFamily: "Patrick Hand", // Optional: to match the font of mark labels
            },
          }}
        />
      </Box>
    </div>
  );
}

import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function StorySelector({
  setStorySelection,
  setGotRight,
  setGotWrong,
}) {
  const [alignment, setAlignment] = useState("addition");

  const handleChange = (event, newAlignment) => {
    if (newAlignment != null) {
      setAlignment(newAlignment);
      setStorySelection(newAlignment);
      setGotRight(false);
      setGotWrong(false);
    }
  };

  const buttonStyle = {
    fontFamily: "Patrick Hand",
    textTransform: "none",
  };

  return (
    <>
      <div className="gameSelectContainer">
        <h3>What kind of story?</h3>

        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          required
          sx={{
            "& .MuiToggleButton-root": {
              ...buttonStyle,
              color: "#0085bd",
              border: "1px solid lightgray",
              padding: "11px",
              minWidth: "67px",
            },
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <ToggleButton value="goldendoodles">Goldendoodles</ToggleButton>
          <ToggleButton value="pirates">Pirates</ToggleButton>
          <ToggleButton value="outer space">Outer space</ToggleButton>
          <ToggleButton value="Football">Football</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </>
  );
}
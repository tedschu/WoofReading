import React from "react";
import { useState, useEffect } from "react";

function GamePlay({
  sliderValue,
  gameSelector,
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
  const [mathOperator, setMathOperator] = useState("+");
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [thirdNumber, setThirdNumber] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [questionResult, setQuestionResult] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return <>test</>;
}

export default GamePlay;

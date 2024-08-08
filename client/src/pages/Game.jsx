import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScoreBar from "../components/ScoreBar";
import GamePlay from "../components/GamePlay";
import Nav from "../components/Nav";
import BadgeModal from "../components/BadgeModal";

function Game({
  isLoggedIn,
  loginForm,
  userScore,
  setUserScore,
  userBadges,
  setUserBadges,
  userInfo,
  totalScore,
  setTotalScore,
}) {
  const [sliderValue, setSliderValue] = useState(1);
  const [gotRight, setGotRight] = useState(false);
  const [gotWrong, setGotWrong] = useState(false);

  // state for modal that opens when a new badge is won
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBadge, setModalBadge] = useState("");

  const navigate = useNavigate();

  // If a user is not signed in (no token) they are redirected to the login page.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/welcome");
    }
  }, []);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} userInfo={userInfo} />

      <div className="mainContainer">
        <ScoreBar
          isLoggedIn={isLoggedIn}
          loginForm={loginForm}
          userScore={userScore}
          setUserScore={setUserScore}
          userBadges={userBadges}
          setUserBadges={setUserBadges}
          userInfo={userInfo}
          totalScore={totalScore}
          setTotalScore={setTotalScore}
        />

        <GamePlay
          userScore={userScore}
          setUserScore={setUserScore}
          userInfo={userInfo}
          gotRight={gotRight}
          gotWrong={gotWrong}
          setGotRight={setGotRight}
          setGotWrong={setGotWrong}
          userBadges={userBadges}
          setUserBadges={setUserBadges}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalBadge={modalBadge}
          setModalBadge={setModalBadge}
        />

        <BadgeModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          modalBadge={modalBadge}
        />
      </div>
    </>
  );
}

export default Game;

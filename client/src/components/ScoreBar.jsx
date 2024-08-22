import React from "react";
import { useState, useEffect } from "react";
import badge_bernese from "../assets/badges/badge_bernese.png";
import badge_chihuahua from "../assets/badges/badge_chihuahua.png";
import badge_boxer from "../assets/badges/badge_boxer.png";
import badge_husky from "../assets/badges/badge_husky.png";
import badge_golden from "../assets/badges/badge_golden.png";
import badge_cat from "../assets/badges/badge_cat.png";
import badge_goldendoodle_trophy from "../assets/badges/goldendoodle_trophy_color.png";

function ScoreBar({
  isLoggedIn,
  loginForm,
  userScore,
  setUserScore,
  userBadges,
  setUserBadges,
  sliderValue,
  gameSelector,
  userInfo,
  totalScore,
  setTotalScore,
}) {
  return (
    <>
      <div className="scoreBarContainer">
        <div className="scoresContainer">
          <div className="totalScore">
            <h1 className="scoreFont">{userScore.score}</h1>
            <h5>TOTAL SCORE</h5>
          </div>
        </div>

        <div className="badgesContainer">
          <div className="eachBadge">
            <img
              src={badge_bernese}
              alt=""
              className={userBadges.bernese ? "badgeEnabled" : "badgeDisabled"}
            />
            <h3>100</h3>
          </div>
          <div className="eachBadge">
            <img
              src={badge_chihuahua}
              alt=""
              className={
                userBadges.chihuahua ? "badgeEnabled" : "badgeDisabled"
              }
            />
            <h3>500</h3>
          </div>
          <div className="eachBadge">
            <img
              src={badge_boxer}
              alt=""
              className={userBadges.boxer ? "badgeEnabled" : "badgeDisabled"}
            />
            <h3>1,000</h3>
          </div>
          <div className="eachBadge">
            <img
              src={badge_husky}
              alt=""
              className={userBadges.husky ? "badgeEnabled" : "badgeDisabled"}
            />
            <h3>250 each</h3>
          </div>
          <div className="eachBadge">
            <img
              src={badge_golden}
              alt=""
              className={userBadges.golden ? "badgeEnabled" : "badgeDisabled"}
            />
            <h3>2,000</h3>
          </div>
          <div className="eachBadge">
            <img
              src={badge_cat}
              alt=""
              className={userBadges.cat ? "badgeEnabled" : "badgeDisabled"}
            />
            <h3>500 each</h3>
          </div>
          <div className="eachBadge">
            <img
              src={badge_goldendoodle_trophy}
              alt=""
              className={
                userBadges.goldendoodle_trophy
                  ? "badgeEnabled"
                  : "badgeDisabled"
              }
            />
            <h3>4,000</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScoreBar;

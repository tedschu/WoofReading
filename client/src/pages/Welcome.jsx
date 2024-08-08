import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import woofMathLogo from "../assets/woofmath_logo_1.png";
import welcomeDog from "../assets/welcome_dog_large.png";
import gameplayPic from "../assets/gameplay.png";
import badge_bernese from "../assets/badges/badge_bernese.png";
import badge_chihuahua from "../assets/badges/badge_chihuahua.png";
import goldendoodle_trophy from "../assets/goldendoodle_trophy_large.png";
import badge_boxer from "../assets/badges/badge_boxer.png";

function Welcome() {
  return (
    <>
      <div className="welcomePageContainer">
        <div className="welcomeBackground">
          <div className="welcomeLogoContainer">
            <img
              src={woofMathLogo}
              className="woofMathLogo"
              alt="WoofMath logo"
            />
          </div>

          <div className="welcomeContentContainer">
            <h1>Woof Reading</h1>
            <p>Test</p>

            <div className="welcomeButtonContainer">
              <Link to={"/login"}>
                <button className="button login">LOGIN</button>
              </Link>
              <Link to={"/register"}>
                <button className="button signup">SIGN UP</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="welcomeAboutSeparator">
          {" "}
          <h1>Learn more about the game</h1>
        </div>
        <div className="welcomeAboutContainer">
          <div className="welcomeSubContainerTop">
            <div className="welcomeAboutContent">
              <h2>Woof Reading ...</h2>
              <p>...</p>

              <br />
              <h2>It's made for kids. </h2>
              <p>
                Woof ...{" "}
                <Link to={"/About"} className="welcomePrivacyNotice">
                  our privacy policy.
                </Link>
              </p>
            </div>
            <div className="imageTopContainer">
              <div className="welcomeAboutImageTop">
                <img src={badge_bernese} alt="" />
                <img src={badge_chihuahua} alt="" />
                <img src={badge_boxer} alt="" />
              </div>
              <div className="welcomeAboutImageTop_2">
                <img src={goldendoodle_trophy} alt="" />
              </div>
            </div>
          </div>

          <div className="welcomeSubContainerBottom">
            <div className="welcomeAboutImageBottom">
              <img src={gameplayPic} alt="" />
            </div>
            <div className="welcomeAboutContent bottom">
              <h2>Woof Reading game play:</h2>
              <ul>
                <li>...</li>
                <li>
                  See how you do! The more questions you get right, the more
                  points and animal badges you earn.
                </li>
                <li>See if you can win the goldendoodle badge!</li>
              </ul>
              <Link to={"/register"}>
                <button className="button signup welcome">SIGN UP</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;

import React from "react";

import woofMathLogo from "../assets/woofmath_logo_1.png";
import { Link } from "react-router-dom";

function About({ isLoggedIn }) {
  return (
    <>
      <div className="aboutContainer">
        <div className="aboutHeader">
          {isLoggedIn ? (
            <Link to={"/me"}>
              <div> Go back</div>
            </Link>
          ) : (
            <Link to={"/welcome"}>
              <div> Go back</div>
            </Link>
          )}
          <div className="aboutHeaderImgContainer">
            <Link to={"/welcome"}>
              <img src={woofMathLogo} className="aboutHeaderImg" alt="" />
            </Link>
          </div>
        </div>
        <h1>Welcome to Woof Reading. Here's more about us.</h1>

        <div className="aboutContentContainer">
          <h2>The backstory</h2>
          <p>...</p>

          <p>Ted Schuster</p>
          <p>Founder and developer, Woof Learning</p>
          <p>Built in Illinois</p>
          <p>WoofLearning@gmail.com</p>
        </div>
        <div className="aboutContentContainer">
          <h2>Privacy policy</h2>
          <p>
            Woof Reading does not presently have advertising on this site nor
            does it sell or share any information gathered with any third party,
            such as an advertising network.{" "}
          </p>
          <p>
            Woof Reading does ask for a reasonable amount of personal
            information during the sign up (account creation) process, which is
            detailed below, in order to operate the Woof Reading game.
          </p>
          <p>
            You may both review all information that you've shared with Woof
            Reading at any time (in the Account page), and you may also delete
            your Woof Reading account at any time, which will permanently remove
            all information shared with Woof Reading as well as other data such
            as your scores.
          </p>

          <h4>
            Below is the information that is required to create a Woof Reading
            account:
          </h4>
          <ul>
            {/* <li>
              <span className="bold">First name:</span> We ask for a first name
              to help us find your username if you forget it.
            </li> */}
            <li>
              <span className="bold">Birth year:</span> This is the only bit of
              "analytics" that we may use as the creators of Woof Reading. Quite
              simply, we would be interested to know which age groups get the
              most usage out of the app. We can then use this information to
              help improve the app in the future. As noted above, this
              information is not shared with any third parties.
            </li>
            <li>
              <span className="bold">"Your parent's email":</span> We ask for a
              parent email, not a child's email, to help us identify you when
              you can't find your username or password. To clarify, Woof Reading
              will NOT email you as a part of this process - it is simply a way
              for us to verify that you are who you say you are. If in the
              future we decide to send out emails with updates to the site, for
              example, we will explicitly ask for your permission in the app.
            </li>
            <li>
              <span className="bold">Username:</span> This is how game players
              will be referred to during game play. In future releases, we may
              aim to show "leaderboards" that would show usernames (and
              usernames only) for those that have (for example) acquired the
              most badges. You will be notified of any such changes in the app.
            </li>
            <li>
              <span className="bold">Password:</span> Your password will be
              encrypted, and you can reset it at any time.
            </li>
            <li>
              <span className="bold">Security questions:</span> We ask for a few
              "security questions" when you sign up for a Woof Reading account.
              This is also purely for the purposes of helping to get you access
              to your account again if you forget your username or password.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default About;

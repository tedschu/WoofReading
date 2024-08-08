import React from "react";
import { useState, useEffect } from "react";

function RecoverModal({
  isRecoverOpen,
  onRecoverClose,
  userInfo,
  setUserInfo,
}) {
  if (!isRecoverOpen) return null;

  const [returnedUsers, setReturnedUsers] = useState([]);
  const [noUsers, setNoUsers] = useState(false);

  // Handles form values AND updates loginForm state
  const setFormValues = (event) => {
    const newObj = { ...userInfo };
    newObj[event.target.name] = event.target.value;
    setUserInfo(newObj);
  };

  const submit = (event) => {
    event.preventDefault();
    getUsernames(userInfo);
  };

  const getUsernames = async (userInfo) => {
    try {
      const response = await fetch(`/auth/find-username/${userInfo.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const usernamesArray = data.map((user) => user.username);

        setReturnedUsers(usernamesArray);

        if (usernamesArray.length === 0) {
          setNoUsers(true);
        } else {
          setNoUsers(false);
        }
      } else {
        console.error("Error fetching usernames", data);
        setNoUsers(true);
      }
    } catch (error) {
      setNoUsers(true);
    }
  };

  return (
    <>
      <div className="modalOverlay">
        <div className="modalContent">
          <h2>Let's get your username.</h2>

          <form action="" className="registerForm" onSubmit={submit}>
            <label htmlFor="name">
              What was the email used to create the account(s)?
            </label>
            <input
              type="text"
              placeholder="example: name@example.com"
              name="email"
              value={userInfo.email}
              onChange={setFormValues}
            />
            <button className="button recover">Submit</button>
          </form>

          {returnedUsers.length > 0 && (
            <div className="login_returnedUsers">
              <p>Usernames for this email:</p>
              <ul>
                {returnedUsers.map((username, index) => {
                  return <li key={index}>{username}</li>;
                })}
              </ul>
            </div>
          )}

          {noUsers && <p> No usernames were found for this email. </p>}

          <button className="modalClose" onClick={onRecoverClose}>
            {" "}
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default RecoverModal;

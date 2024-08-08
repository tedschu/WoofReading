import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import woofMathLogo from "../assets/woofmath_logo_1.png";

function Register({ setIsLoggedIn, isLoggedIn, userInfo, setUserInfo }) {
  const [registerError, setRegisterError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  return (
    <>
      <div className="registerPageContainer">
        <div className="registerContentContainer">test</div>
      </div>
    </>
  );
}

export default Register;

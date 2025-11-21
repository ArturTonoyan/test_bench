import React from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrationForm.scss";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleBackToForm = () => {
    navigate("/");
  };

  return (
    <div className="registration-page welcome-fullscreen">
      <div className="welcome-wrapper">
        <h2>Hello, world!</h2>
        <p>В этом окне баги искать не надо ;)</p>
        <button className="back-button" onClick={handleBackToForm}>
          Вернуться
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;

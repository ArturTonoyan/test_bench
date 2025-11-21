import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./RegistrationForm.scss";

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем данные пользователя из location.state
  const userData = location.state?.userData;

  const handleBackToForm = () => {
    navigate("/");
  };
  return (
    <div className="registration-page welcome-fullscreen">
      <div className="welcome-wrapper">
        {/* Уязвимость XSS: отображаем имя пользователя без экранирования */}
        <h2
          dangerouslySetInnerHTML={{
            __html: `Привет, ${userData?.firstName || "Гость"}!`,
          }}
        ></h2>
        <p>В этом окне баги искать не надо ;)</p>
        <button className="back-button" onClick={handleBackToForm}>
          Вернуться
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;

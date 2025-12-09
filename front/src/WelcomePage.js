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

  // Функция для активации XSS-атаки - создает животное, которое крадет курсор
  const activateMouseTheft = () => {
    // Создаем стиль для животного
    const style = document.createElement("style");
    style.innerHTML = `
      .mouse-thief {
        position: fixed;
        width: 100px;
        height: 100px;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23ff9900"/><circle cx="35" cy="40" r="5" fill="black"/><circle cx="65" cy="40" r="5" fill="black"/><path d="M 30 65 Q 50 80 70 65" stroke="black" stroke-width="3" fill="none"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
      }
    `;
    document.head.appendChild(style);

    // Создаем элемент животного
    const animal = document.createElement("div");
    animal.className = "mouse-thief";
    animal.id = "mouse-thief-animal";
    document.body.appendChild(animal);

    // Функция для следования за курсором
    const followCursor = (e) => {
      if (animal) {
        animal.style.left = e.clientX - 50 + "px";
        animal.style.top = e.clientY - 50 + "px";
      }
    };

    // Функция для "украсть" курсор - скрываем настоящий курсор
    const stealCursor = () => {
      document.body.style.cursor = "none";
    };

    // Функция для вернуть курсор
    const returnCursor = () => {
      document.body.style.cursor = "default";
      if (animal) {
        document.body.removeChild(animal);
      }
      document.head.removeChild(style);
      document.removeEventListener("mousemove", followCursor);
    };

    // Активируем "кражу" курсора
    stealCursor();
    document.addEventListener("mousemove", followCursor);

    // Через 10 секунд возвращаем курсор
    setTimeout(returnCursor, 10000);
  };

  return (
    <div className="registration-page welcome-fullscreen">
      <div className="welcome-wrapper">
        {/* БАГ 8-9: XSS уязвимость - отображаем имя пользователя без экранирования */}
        <h2
          dangerouslySetInnerHTML={{
            __html: `Привет, ${userData?.firstName || "Гость"}!`,
          }}
        ></h2>
        {/* БАГ 8: Можно ввести <script>alert('XSS')</script> в поле имени для тестирования */}
        <p>В этом окне баги искать не надо ;)</p>
        {/* Кнопка с XSS-уязвимостью, которая активирует "кражу" курсора */}
        <button
          className="back-button"
          onClick={() => {
            handleBackToForm();
          }}
        >
          Вернуться
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;

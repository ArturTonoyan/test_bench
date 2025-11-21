import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./RegistrationForm.scss";

// Импортируем звуки
import puk1 from "./Files/puk.mp3";
import puk2 from "./Files/puk2.mp3";
import puk3 from "./Files/puk3.mp3";
import puk4 from "./Files/puk4.mp3";
import puk5 from "./Files/puk5.mp3";
import puk6 from "./Files/puk6.mp3";
import LiquidEther from "./LiquidEther/LiquidEther";

// Создаем аудио контекст для воспроизведения звука
const useAudio = () => {
  const audioRef = useRef(null);

  // Массив со всеми звуками
  const fartSounds = [puk1, puk2, puk3, puk4, puk5, puk6];

  const playFartSound = () => {
    try {
      // Выбираем случайный звук из массива
      const randomSound =
        fartSounds[Math.floor(Math.random() * fartSounds.length)];
      const fartSound = new Audio(randomSound);
      fartSound.volume = 0.7; // Увеличиваем громкость до 70%
      fartSound.play().catch((e) => console.log("Звук не воспроизведен:", e));
    } catch (error) {
      console.log("Ошибка воспроизведения звука:", error);
    }
  };

  return playFartSound;
};

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [poopAnimations, setPoopAnimations] = useState([]);
  const [showModal, setShowModal] = useState(false); // Состояние для модального окна
  const [animationEnabled, setAnimationEnabled] = useState(false); // Состояние для включения/выключения анимации
  const playFartSound = useAudio();

  // Validation functions
  const validateFirstName = (value) => {
    if (!value) return "Поле Имя не может быть пустым!";
    if (value.length > 40) return "Поле Имя максимум 30 символов!";
    return "";
  };

  const validateLastName = (value) => {
    if (!value) return "Поле Фамилия не может быть пустым!";
    if (value.length > 30) return "Поле Фамилия максимум 30 символов!";
    if (!/^[а-яА-ЯёЁ\s-]+$/.test(value))
      return "Поле Фамилия имеет недопустимые символы!";
    return "";
  };

  const validateMiddleName = (value) => {
    if (value && value.length > 30)
      return "Поле Отчество максимум 30 символов!";
    if (value && !/^[а-яА-ЯёЁ\s-]+$/.test(value))
      return "Поле Отчество имеет недопустимые символы!";
    return "";
  };

  const validateEmail = (value) => {
    if (!value) return "Поле E-mail не может быть пустым!";
    if (value.length > 30) return "Поле E-mail максимум 30 символов!";
    if (!/^[a-zA-Z0-9._@-]+$/.test(value))
      return "Поле E-mail имеет недопустимые символы!";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Поле E-mail не соответствует маске!";
    return "";
  };

  const validatePhone = (value) => {
    if (!value) return "Поле Номер телефона не может быть пустым!";
    if (!/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(value))
      return "Поле Номер телефона не соответствует маске!";
    return "";
  };

  // БАГ: Отключаем валидацию пароля - разрешаем любой пароль
  const validatePassword = (value) => {
    // Убираем все проверки для создания бага
    /*
    if (!value) return "Поле Пароль не может быть пустым!";
    if (value.length < 6) return "Поле Пароль минимум 6 символов!";
    if (value.length > 12) return "Поле Пароль максимум 12 символов!";
    if (!/^[a-zA-Z0-9!@#\-+=]+$/.test(value))
      return "Поле Пароль имеет недопустимые символы!";
    */
    return ""; // Всегда возвращаем пустую строку - нет ошибок
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Clear server error when user starts typing
    if (serverError) {
      setServerError("");
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (value.length >= 1) {
      formattedValue = "+7(" + value.substring(0, 3);
    }
    if (value.length >= 4) {
      formattedValue += ")" + value.substring(3, 6);
    }
    if (value.length >= 7) {
      formattedValue += "-" + value.substring(6, 8);
    }
    if (value.length >= 9) {
      formattedValue += "-" + value.substring(8, 10);
    }

    setFormData({
      ...formData,
      phone: formattedValue,
    });

    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors({
        ...errors,
        phone: "",
      });
    }

    // Clear server error when user starts typing
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.firstName = validateFirstName(formData.firstName);
    newErrors.lastName = validateLastName(formData.lastName);
    newErrors.middleName = validateMiddleName(formData.middleName);
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.password = validatePassword(formData.password);

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Функция для создания анимации падающей какашки с помощью framer-motion
  const activateFallingPoop = (e) => {
    e.preventDefault();

    // Получаем элемент заголовка
    const header = document.querySelector(".form-wrapper h1");
    if (!header) return;

    // Получаем позицию заголовка
    const headerRect = header.getBoundingClientRect();
    const headerTop = headerRect.top + window.scrollY;

    // Воспроизводим звук пука
    playFartSound();

    // Создаем новую анимацию какашки
    const newPoop = {
      id: Date.now() + Math.random(), // Уникальный ID для каждой какашки
      startPosition: headerTop,
    };

    // Добавляем новую какашку в состояние
    setPoopAnimations((prev) => [...prev, newPoop]);

    // Удаляем какашку через 3 секунды
    setTimeout(() => {
      setPoopAnimations((prev) =>
        prev.filter((poop) => poop.id !== newPoop.id)
      );
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем, если пользователь пытается зарегистрироваться с именем "Иванов Иван Иванович"
    if (
      formData.lastName === "Иванов" &&
      formData.firstName === "Иван" &&
      formData.middleName === "Иванович"
    ) {
      setShowModal(true); // Показываем модальное окно
      return;
    }

    if (validateForm()) {
      try {
        // Form is valid, send to backend
        const response = await axios.post(
          "http://localhost:3001/api/register",
          formData
        );

        if (response.status === 201) {
          // Registration successful, navigate to welcome page with user data
          navigate("/welcome", { state: { userData: response.data } });
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.code === "VALIDATION_ERROR"
        ) {
          // Handle validation errors from backend
          const backendErrors = {};
          error.response.data.errors.forEach((err) => {
            backendErrors[err.field] = err.message;
          });
          setErrors({ ...errors, ...backendErrors });
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.code === "INTERNAL_ERROR"
        ) {
          // Handle internal server error
          setServerError(error.response.data.message);
        } else {
          // Handle other errors
          setServerError(
            "Произошла внутренняя ошибка сервера. Попробуйте позже."
          );
        }
      }
    }
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setShowModal(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Функция для переключения анимации
  const toggleAnimation = () => {
    setAnimationEnabled(!animationEnabled);
  };

  // Check if form is valid to enable submit button
  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.password &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.middleName &&
      !errors.email &&
      !errors.phone &&
      !errors.password
    );
  };

  return (
    <div className="registration-page fullscreen-form">
      {/* Фоновая анимация LiquidEther */}
      {animationEnabled && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
      )}

      {/* Кнопка для отключения анимации */}
      <button
        onClick={toggleAnimation}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.8)",
          border: "1px solid #ddd",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
        title={animationEnabled ? "Отключить анимацию" : "Включить анимацию"}
      >
        {animationEnabled ? "⏸" : "▶"}
      </button>

      <div className="form-wrapper">
        {/* Заголовок с XSS-уязвимостью - при клике активируется анимация падающей какашки */}
        <h1 onClick={activateFallingPoop}>Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Имя*</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "error" : ""}
              />
            </div>
            {errors.firstName && (
              <div className="error-message">{errors.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Фамилия*</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "error" : ""}
              />
            </div>
            {errors.lastName && (
              <div className="error-message">{errors.lastName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="middleName">Отчество</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className={errors.middleName ? "error" : ""}
              />
            </div>
            {errors.middleName && (
              <div className="error-message">{errors.middleName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail*</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
              />
            </div>
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Номер телефона*</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="+7(9XX)XXX-XX-XX"
                className={errors.phone ? "error" : ""}
              />
            </div>
            {errors.phone && (
              <div className="error-message">{errors.phone}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль*</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          {serverError && (
            <div className="form-errors">
              <div className="error-item">{serverError}</div>
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid()}
          >
            Зарегистрироваться
          </button>
        </form>

        {/* Анимации падающих какашек с помощью framer-motion */}
        {poopAnimations.map((poop) => (
          <motion.div
            key={poop.id}
            initial={{
              top: poop.startPosition,
              left: "50%",
              x: "-50%",
              opacity: 1,
            }}
            animate={{
              top: window.innerHeight + 100,
              opacity: [1, 1, 0.8, 0.6, 0.4, 0.2, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeIn",
            }}
            style={{
              position: "absolute",
              fontSize: "50px",
              zIndex: 1000,
              pointerEvents: "none",
            }}
          >
            💩
          </motion.div>
        ))}

        {/* Модальное окно для случая "Иванов Иван Иванович" */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Упс! Кажется, вы выбрали слишком банальное имя!</h2>
              <p>
                "Иванов Иван Иванович" - это самое обыденное имя, которое только
                можно придумать. Попробуйте что-нибудь более оригинальное,
                например:
              </p>
              <ul>
                <li>Петров Петр Петрович</li>
                <li>Сидоров Сидор Сидорович</li>
                <li>Алексеев Алексей Алексеевич</li>
                <li>Михайлов Михаил Михайлович</li>
              </ul>
              <p>Или придумайте что-нибудь совсем необычное!</p>
              <button className="modal-close-button" onClick={closeModal}>
                Понятно
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;

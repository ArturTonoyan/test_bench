import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./RegistrationForm.scss";

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

  // Validation functions
  const validateFirstName = (value) => {
    if (!value) return "Поле Имя не может быть пустым!";
    if (value.length > 40) return "Поле Имя максимум 30 символов!";
    return "";
  };

  // БАГ 4: Убрать валидацию по максимальной длине на поле "Фамилия"
  const validateLastName = (value) => {
    if (!value) return "Поле Фамилия не может быть пустым!";
    // Убрали проверку на максимальную длину
    if (!/^[а-яА-ЯёЁ\s-]+$/.test(value))
      return "Поле Фамилия имеет недопустимые символы!";
    return "";
  };

  // БАГ 4: Отчество сделать обязательным, убрать валидацию по максимальной длине на поле "Фамилия"
  const validateMiddleName = (value) => {
    if (!value) return "Поле Отчество не может быть пустым!"; // Теперь обязательное
    if (value && !/^[а-яА-ЯёЁ\s-]+$/.test(value))
      return "Поле Отчество имеет недопустимые символы!";
    return "";
  };

  // БАГ 5: Убрать валидацию на пустой e-mail на фронте
  const validateEmail = (value) => {
    // Убрали проверку на пустое поле
    if (value && value.length > 30) return "Поле E-mail максимум 30 символов!";
    if (value && !/^[a-zA-Z0-9._@-]+$/.test(value))
      return "Поле E-mail имеет недопустимые символы!";
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Поле E-mail не соответствует маске!";
    return "";
  };

  const validatePhone = (value) => {
    if (!value) return "Поле Номер телефона не может быть пустым!";
    if (!/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(value))
      return "Поле Номер телефона не соответствует маске +7(9XX)XXX-XX-XX!";
    return "";
  };

  // БАГ 7: Сделать минимальным 4 символа, допустить все спец. символы
  const validatePassword = (value) => {
    if (!value) return "Поле Пароль не может быть пустым!";
    if (value.length < 4) return "Поле Пароль минимум 4 символа!"; // Изменили с 6 на 4
    if (value.length > 12) return "Поле Пароль максимум 12 символов!";
    // Убрали проверку на допустимые символы - разрешаем все спец. символы
    return "";
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

  // БАГ 6: Возможность вписать буквы в поле телефона, но маска применяется
  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // Извлекаем только цифры для форматирования маски
    let digits = value.replace(/\D/g, "");

    let formattedValue = "";

    // Если есть цифры, форматируем по маске +7(9XX)XXX-XX-XX
    if (digits.length > 0) {
      // Если первая цифра не 7, добавляем 7
      if (!digits.startsWith("7")) {
        digits = "7" + digits;
      }

      // Ограничиваем до 11 цифр (7 + 10 цифр номера)
      if (digits.length > 11) {
        digits = digits.substring(0, 11);
      }

      // Форматируем по маске +7(9XX)XXX-XX-XX
      formattedValue = "+7";

      if (digits.length > 1) {
        formattedValue += "(" + digits.substring(1, 4);
      }
      if (digits.length >= 5) {
        formattedValue += ")" + digits.substring(4, 7);
      }
      if (digits.length >= 8) {
        formattedValue += "-" + digits.substring(7, 9);
      }
      if (digits.length >= 10) {
        formattedValue += "-" + digits.substring(9, 11);
      }

      // БАГ: если в исходном значении были буквы, добавляем их в конец
      // Это баг - буквы не должны быть в номере телефона
      let letters = value.match(/[a-zA-Zа-яА-ЯёЁ]/g);
      if (letters && letters.length > 0) {
        formattedValue += letters.join("");
      }
    } else if (value.startsWith("+7")) {
      formattedValue = "+7";
      // БАГ: разрешаем буквы после +7
      let letters = value.match(/[a-zA-Zа-яА-ЯёЁ]/g);
      if (letters && letters.length > 0) {
        formattedValue += letters.join("");
      }
    } else {
      // БАГ: если нет цифр, но есть ввод (например, только буквы), сохраняем как есть
      formattedValue = value;
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
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
        const response = await axios.post(`${apiUrl}/api/register`, formData);

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

  // БАГ 3: Глазик не скрывает обратно пароль
  const togglePasswordVisibility = () => {
    // БАГ: только показываем пароль, но не скрываем обратно
    if (!showPassword) {
      setShowPassword(true);
    }
    // Не устанавливаем обратно в false
  };

  // Функция для переключения анимации
  const toggleAnimation = () => {
    setAnimationEnabled(!animationEnabled);
  };

  // БАГ 1: Кнопка становится активной при заполнении хотя бы одного поля
  const isFormValid = () => {
    // Проверяем только наличие хотя бы одного заполненного поля
    return (
      formData.firstName ||
      formData.lastName ||
      formData.middleName ||
      formData.email ||
      formData.phone ||
      formData.password
    );
  };

  return (
    <div className="registration-page fullscreen-form">
      <div className="form-wrapper">
        {/* БАГ 8-9: XSS уязвимость - заголовок с возможностью инъекции через URL параметры */}
        <h1>Регистрация</h1>
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
                placeholder="Иван"
              />
            </div>
            {/* БАГ 8-9: XSS уязвимость - отображаем ошибку без экранирования */}
            {errors.firstName && (
              <div
                className="error-message"
                dangerouslySetInnerHTML={{ __html: errors.firstName }}
              ></div>
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
                placeholder="Иванов"
              />
            </div>
            {errors.lastName && (
              <div className="error-message">{errors.lastName}</div>
            )}
          </div>

          <div className="form-group">
            {/* БАГ 4: Отчество теперь обязательное */}
            <label htmlFor="middleName">Отчество*</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className={errors.middleName ? "error" : ""}
                placeholder="Иванович"
              />
            </div>
            {errors.middleName && (
              <div className="error-message">{errors.middleName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail*</label>
            <div className="input-wrapper">
              {/* БАГ 2: Отсутствие маски на поле E-mail - нет placeholder */}
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
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
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

          {/* БАГ 10: Опечатка в слове - "Зарегистрироваться" -> "Зарегестрироваться" */}
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid()}
          >
            Зарегестрироваться
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

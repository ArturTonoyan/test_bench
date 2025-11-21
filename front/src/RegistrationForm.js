import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  // Validation functions
  const validateFirstName = (value) => {
    if (!value) return "Поле Имя не может быть пустым!";
    if (value.length > 30) return "Поле Имя максимум 30 символов!";
    if (!/^[а-яА-ЯёЁ\s-]+$/.test(value))
      return "Поле Имя имеет недопустимые символы!";
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

  const validatePassword = (value) => {
    if (!value) return "Поле Пароль не может быть пустым!";
    if (value.length < 6) return "Поле Пароль минимум 6 символов!";
    if (value.length > 12) return "Поле Пароль максимум 12 символов!";
    if (!/^[a-zA-Z0-9!@#\-+=]+$/.test(value))
      return "Поле Пароль имеет недопустимые символы!";
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

  // Функция для создания анимации падающей SVG какашки
  const activateFallingPoop = (e) => {
    e.preventDefault();

    // Получаем элемент заголовка
    const header = document.querySelector(".form-wrapper h1");
    if (!header) return;

    // Создаем стиль для падающей какашки
    const style = document.createElement("style");
    style.id = "falling-poop-style";
    style.innerHTML = `
      .falling-poop {
        position: absolute;
        width: 50px;
        height: 50px;
        z-index: 1000;
        transition: top 2s linear;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // Получаем позицию заголовка
    const headerRect = header.getBoundingClientRect();
    const headerTop = headerRect.top + window.scrollY;
    const headerLeft = headerRect.left + window.scrollX;

    // Создаем падающую SVG какашку
    const fallingPoop = document.createElement("div");
    fallingPoop.className = "falling-poop";
    fallingPoop.innerHTML = `💩
    `;
    fallingPoop.style.left = "50%";
    fallingPoop.style.top = headerTop + "px";
    document.body.appendChild(fallingPoop);

    // Анимация: какашка падает вниз без вращения
    setTimeout(() => {
      fallingPoop.style.top = window.innerHeight + 100 + "px";
    }, 100);

    // Через некоторое время убираем элементы
    setTimeout(() => {
      if (document.body.contains(fallingPoop)) {
        document.body.removeChild(fallingPoop);
      }
      document.head.removeChild(style);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      </div>
    </div>
  );
};

export default RegistrationForm;

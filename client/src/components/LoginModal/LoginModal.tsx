import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Modal from "../Modal/Modal";
import styles from "./LoginModal.module.css";
import axios from "axios";
import { observer } from "mobx-react";
import type HeaderStore from "../../stores/HeaderStore";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginModalProps {
  headerStore: HeaderStore;
}

const LoginModal: React.FC<LoginModalProps> = ({ headerStore }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/login`, data);
    console.log(response.data);
    reset();
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Modal open={headerStore.loginModalOpen} setOpen={headerStore.setLoginModalOpen}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                  },
                })}
                className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ""}`}
                placeholder="Enter your password"
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonLoading : ""}`}
          >
            {isSubmitting ? (
              <div className={styles.loadingContent}>
                <div className={styles.spinner}></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don't have an account?{" "}
            <button className={styles.footerLink} onClick={() => console.log("Navigate to signup")}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default observer(LoginModal);

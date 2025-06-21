import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Modal from "../Modal/Modal";
import styles from "./RegisterModal.module.css";
import axios from "axios";
import { observer } from "mobx-react";
import type HeaderStore from "../../stores/HeaderStore";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterModalProps {
  headerStore: HeaderStore;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ headerStore }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/register`, { data });
    console.log(response.data);
    reset();
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Modal open={headerStore.registerModalOpen} setOpen={headerStore.setRegisterModalOpen}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join us and get started today</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* Name Fields Row */}
          <div className={styles.nameRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="register_firstName" className={styles.label}>
                First Name
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="register_firstName"
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters long",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "First name can only contain letters and spaces",
                    },
                  })}
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                  placeholder="Enter your first name"
                />
              </div>
              {errors.firstName && <p className={styles.errorMessage}>{errors.firstName.message}</p>}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="register_lastName" className={styles.label}>
                Last Name
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="register_lastName"
                  type="text"
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters long",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Last name can only contain letters and spaces",
                    },
                  })}
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                  placeholder="Enter your last name"
                />
              </div>
              {errors.lastName && <p className={styles.errorMessage}>{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="register_email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="register_email"
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
            <label htmlFor="register_password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="register_password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
                className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ""}`}
                placeholder="Create a strong password"
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

          {/* Confirm Password Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="register_confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="register_confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watchPassword || "Passwords do not match",
                })}
                className={`${styles.input} ${styles.passwordInput} ${errors.confirmPassword ? styles.inputError : ""}`}
                placeholder="Confirm your password"
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={styles.passwordToggle}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>}
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
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?{" "}
            <button className={styles.footerLink} onClick={() => console.log("Navigate to login")}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default observer(RegisterModal);

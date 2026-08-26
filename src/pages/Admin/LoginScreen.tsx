import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import AdminAuth from "../../components/Admin/AdminAuth";

import LoginBackground from '../../assets/saree/saree8.jpg';
import BrandLogo from '../../assets/logo/logo.png';
import { useToast } from "../../components/Toast/ToastProvider";
import { useNavigate } from "react-router-dom";

type Screen = "login" | "forgot" | "otp" | "reset";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_API_URL =
  import.meta.env.VITE_LOGIN_API_URL ||
  "https://sumangalipattucenter.com/api/LoginApi.php";

type ApiResponse = {
  success: boolean;
  message: string;
};

const LoginScreen = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!secondsLeft) return;
    const timer = window.setInterval(
      () => setSecondsLeft((current) => current - 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const validEmail = () => emailPattern.test(email.trim());

  const callApi = async (action: string, payload: Record<string, string> = {}) => {
    const response = await fetch(LOGIN_API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    const result = (await response.json().catch(() => null)) as ApiResponse | null;
    if (!response.ok || !result?.success) {
      throw new Error(result?.message || "Unable to contact the server. Please try again.");
    }
    return result;
  };

  const sendOtp = async () => {
    if (!validEmail()) {
      showToast("Enter a valid admin email address.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const result = await callApi("forgot_password", { email: email.trim() });
      setOtpSent(true);
      setSecondsLeft(120);
      setOtp(Array(6).fill(""));
      setScreen("otp");
      window.setTimeout(() => otpInputRefs.current[0]?.focus(), 0);
      showToast(result.message, "info");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to send the OTP.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validEmail()) {
      showToast("Enter a valid admin email address.", "error");
      return;
    }
    if (password.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const result = await callApi("login", { email: email.trim(), password });
      showToast(result.message, "success");
      navigate("/admin/dashboard");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to sign in.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otpSent) {
      showToast("Request an OTP before continuing.", "error");
      return;
    }
    if (otp.some((digit) => !digit)) {
      showToast("Enter all six OTP digits to continue.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const result = await callApi("verify_otp", { email: email.trim(), otp: otp.join("") });
      setScreen("reset");
      showToast(result.message, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to verify the OTP.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      showToast("New password must be at least 8 characters.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("New password and confirmation do not match.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const result = await callApi("reset_password", { password });
      setPassword("");
      setConfirmPassword("");
      setOtp(Array(6).fill(""));
      setOtpSent(false);
      setScreen("login");
      showToast(result.message, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to reset the password.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const returnToLogin = () => {
    setScreen("login");
    setPassword("");
    setConfirmPassword("");
    setOtp(Array(6).fill(""));
  };

  const goBack = () => {
    if (screen === "forgot") returnToLogin();
    if (screen === "otp") setScreen("forgot");
    if (screen === "reset") setScreen("otp");
  };

  const fillOtpDigits = (startIndex: number, value: string) => {
    const digits = value
      .replace(/\D/g, "")
      .slice(0, otp.length - startIndex)
      .split("");
    if (!digits.length) return;

    setOtp((currentOtp) => {
      const nextOtp = [...currentOtp];
      digits.forEach((digit, offset) => {
        nextOtp[startIndex + offset] = digit;
      });
      return nextOtp;
    });

    const lastFilledIndex = startIndex + digits.length - 1;
    otpInputRefs.current[
      Math.min(lastFilledIndex + 1, otp.length - 1)
    ]?.focus();
  };

  const updateOtpDigit = (index: number, value: string) => {
    if (value.length > 1) {
      fillOtpDigits(index, value);
      return;
    }
    const digit = value.replace(/\D/g, "");
    setOtp((currentOtp) =>
      currentOtp.map((currentDigit, currentIndex) =>
        currentIndex === index ? digit : currentDigit,
      ),
    );
    if (digit && index < otp.length - 1)
      otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (otp[index]) {
        setOtp((currentOtp) =>
          currentOtp.map((digit, currentIndex) =>
            currentIndex === index ? "" : digit,
          ),
        );
      } else if (index > 0) {
        const previousIndex = index - 1;
        setOtp((currentOtp) =>
          currentOtp.map((digit, currentIndex) =>
            currentIndex === previousIndex ? "" : digit,
          ),
        );
        otpInputRefs.current[previousIndex]?.focus();
      }
    }
    if (event.key === "ArrowLeft" && index > 0)
      otpInputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < otp.length - 1)
      otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    fillOtpDigits(index, event.clipboardData.getData("text"));
  };

  return (
    <div className="admin-login relative min-h-screen overflow-hidden">
      <img
        src={LoginBackground}
        alt="Handcrafted decor"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="admin-login__overlay absolute inset-0" />
      <AdminAuth
        screen={screen}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        otp={otp}
        secondsLeft={secondsLeft}
        isLoading={isLoading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        otpInputRefs={otpInputRefs}
        goBack={goBack}
        goToForgot={() => setScreen("forgot")}
        sendOtp={sendOtp}
        submitLogin={submitLogin}
        verifyOtp={verifyOtp}
        resetPassword={resetPassword}
        returnToLogin={returnToLogin}
        updateOtpDigit={updateOtpDigit}
        handleOtpKeyDown={handleOtpKeyDown}
        handleOtpPaste={handleOtpPaste}
        logo={BrandLogo}
      />
    </div>
  );
};

export default LoginScreen;

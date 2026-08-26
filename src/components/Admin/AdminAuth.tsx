import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  MutableRefObject,
} from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

type Screen = "login" | "forgot" | "otp" | "reset";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-stone-200 bg-white px-3.5 py-3 text-sm text-secondary outline-none transition placeholder:text-stone-400 focus:border-primary focus:ring-4 focus:ring-primary/10";

interface AdminAuthProps {
  logo: string;
  screen: Screen;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  otp: string[];
  secondsLeft: number;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  otpInputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  goBack: () => void;
  goToForgot: () => void;
  sendOtp: () => void;
  submitLogin: (e: FormEvent<HTMLFormElement>) => void;
  verifyOtp: (e: FormEvent<HTMLFormElement>) => void;
  resetPassword: (e: FormEvent<HTMLFormElement>) => void;
  returnToLogin: () => void;
  updateOtpDigit: (index: number, value: string) => void;
  handleOtpKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  handleOtpPaste: (index: number, e: ClipboardEvent<HTMLInputElement>) => void;
}

const AdminAuth = ({
  logo,
  screen,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  otp,
  secondsLeft,
  isLoading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  otpInputRefs,
  goBack,
  goToForgot,
  sendOtp,
  submitLogin,
  verifyOtp,
  resetPassword,
  returnToLogin,
  updateOtpDigit,
  handleOtpKeyDown,
  handleOtpPaste,
}: AdminAuthProps) => {
  const passwordInput = (
    id: string,
    label: string,
    value: string,
    setValue: (value: string) => void,
    visible: boolean,
    setVisible: (value: boolean) => void,
  ) => (
    <label htmlFor={id} className="block text-sm font-medium text-secondary">
      {label}
      <span className="relative block">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete={
            id === "admin-password" ? "current-password" : "new-password"
          }
          className={`${fieldClass} pr-11`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 transition hover:text-primary"
        >
          <Icon
            icon={visible ? "solar:eye-closed-linear" : "solar:eye-linear"}
            className="h-5 w-5"
          />
        </button>
      </span>
    </label>
  );

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="admin-auth-card w-full max-w-md rounded-2xl p-6 sm:p-8"
      >
        <div className="mb-7 text-center">
          <div className="relative flex items-center justify-center">
            {screen !== "login" && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Go back"
                className="absolute left-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-stone-100 hover:text-primary"
              >
                <Icon icon="solar:arrow-left-linear" className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center justify-center">
              <img src={logo} alt="Sumangali Pattu Center" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-contain" />
            </div>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--heading)]">
            Admin portal
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {screen === "login" && "Sign in to manage your store."}
            {screen === "forgot" && "Verify your email to reset your password."}
            {screen === "otp" &&
              "Enter the one-time password sent to your email."}
            {screen === "reset" &&
              "Choose a secure new password for your account."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {screen === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              onSubmit={submitLogin}
              className="space-y-5"
            >
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-secondary"
              >
                Admin email
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className={fieldClass}
                  placeholder="admin@example.com"
                />
              </label>
              {passwordInput(
                "admin-password",
                "Password",
                password,
                setPassword,
                showPassword,
                setShowPassword,
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goToForgot}
                  className="text-sm font-semibold text-primary hover:text-hover hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-hover active:scale-[0.99]"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </motion.form>
          )}

          {screen === "forgot" && (
            <motion.form
              key="forgot"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              onSubmit={(event) => {
                event.preventDefault();
                sendOtp();
              }}
              className="space-y-5"
            >
              <label
                htmlFor="recovery-email"
                className="block text-sm font-medium text-secondary"
              >
                Admin email
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className={fieldClass}
                  placeholder="admin@example.com"
                />
              </label>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-hover"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
              <button
                type="button"
                onClick={returnToLogin}
                className="block w-full text-sm font-semibold text-gray-500 hover:text-secondary"
              >
                Back to sign in
              </button>
            </motion.form>
          )}

          {screen === "otp" && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              onSubmit={verifyOtp}
              className="space-y-5"
            >
              <fieldset className="block">
                <legend className="text-sm font-medium text-secondary">
                  One-time password
                </legend>
                <div className="mt-1.5 flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpInputRefs.current[index] = element;
                      }}
                      aria-label={`OTP digit ${index + 1}`}
                      value={digit}
                      onChange={(event) =>
                        updateOtpDigit(index, event.target.value)
                      }
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      onPaste={(event) => handleOtpPaste(index, event)}
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      className="h-11 w-11 rounded-md border border-stone-200 bg-white text-center text-lg font-semibold text-secondary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-12 sm:w-12"
                    />
                  ))}
                </div>
              </fieldset>
              <p className="text-center text-xs text-gray-500">
                Sent to {email}
              </p>
              <button
                type="button"
                onClick={sendOtp}
                disabled={secondsLeft > 0 || isLoading}
                className="block w-full text-sm font-semibold text-primary hover:text-hover hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
              >
                {secondsLeft ? `Resend OTP in ${secondsLeft}s` : "Resend OTP"}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-hover"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </motion.form>
          )}

          {screen === "reset" && (
            <motion.form
              key="reset"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              onSubmit={resetPassword}
              className="space-y-5"
            >
              {passwordInput(
                "new-password",
                "New password",
                password,
                setPassword,
                showPassword,
                setShowPassword,
              )}
              {passwordInput(
                "confirm-password",
                "Confirm new password",
                confirmPassword,
                setConfirmPassword,
                showConfirmPassword,
                setShowConfirmPassword,
              )}
              <p className="text-xs leading-5 text-gray-500">
                Use at least 8 characters. For a stronger password, include
                letters, numbers, and symbols.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-hover"
              >
                {isLoading ? "Resetting..." : "Reset password"}
              </button>
              <button
                type="button"
                onClick={returnToLogin}
                className="block w-full text-sm font-semibold text-gray-500 hover:text-secondary"
              >
                Cancel
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.section>
    </main>
  );
};

export default AdminAuth;

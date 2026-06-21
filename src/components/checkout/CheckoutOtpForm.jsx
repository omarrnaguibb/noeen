import { useState } from "react";

function isValidOtp(value) {
  return /^\d{4,6}$/.test(value);
}

export default function CheckoutOtpForm({
  phoneData,
  onSubmit,
  t,
  setAuthStep,
  variant = "phone",
  onBack,
  onResend,
  submitting = false,
}) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValidOtp(otp) || submitting) return;
    onSubmit(otp);
  };

  const handleBack = () => {
    if (variant === "phone") {
      setAuthStep?.("phone");
      return;
    }
    onBack?.();
  };

  const messageLine1 =
    variant === "card"
      ? t("checkoutCardOtp.messageLine1")
      : t("checkoutOtp.messageLine1");
  const messageLine2 =
    variant === "card"
      ? t("checkoutCardOtp.messageLine2")
      : t("checkoutOtp.messageLine2");

  return (
    <form className="auth-iframe" method="POST" onSubmit={handleSubmit}>
      <div className="text-gray-500 w-full text-center pb-5 relative">
        <div>
          {messageLine1}
          <br />
          {messageLine2}
        </div>
        <span className="text-black font-bold py-2" dir="ltr">
          {phoneData.display}
        </span>
        <img
          src="/right.png"
          alt=""
          role="button"
          className="absolute sm:w-5 right-0 top-3 w-4 cursor-pointer"
          onClick={handleBack}
        />
      </div>
      <div className="s-tel-input">
        <input
          id={variant === "card" ? "checkout-card-otp" : "checkout-otp"}
          type="text"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          minLength={4}
          maxLength={6}
          enterKeyHint="done"
          value={otp}
          onChange={(event) =>
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder={t("checkoutOtp.placeholder")}
          className="s-tel-input-control s-ltr text-center!"
          disabled={submitting}
        />
      </div>
      <button
        className="mt-3 btn btn--primary w-full"
        type="submit"
        disabled={!isValidOtp(otp) || submitting}
      >
        {t("checkoutOtp.verify")}
      </button>
      <button
        className="mt-3 btn btn--primary bg-white! text-primary! w-full"
        type="button"
        disabled={submitting}
        onClick={onResend}
      >
        {t("checkoutOtp.resend")}
      </button>
    </form>
  );
}

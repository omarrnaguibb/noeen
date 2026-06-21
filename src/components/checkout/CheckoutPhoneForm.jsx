import { useEffect, useRef, useState } from "react";
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import "intl-tel-input/styles";

const PREFERRED_COUNTRIES = [
  "sa",
  "ae",
  "kw",
  "bh",
  "qa",
  "iq",
  "om",
  "ye",
  "eg",
  "jo",
  "ps",
  "sd",
  "lb",
  "dz",
  "tn",
  "ma",
  "ly",
  "ua",
];

export default function CheckoutPhoneForm({ onSubmit, t, submitting = false }) {
  const inputRef = useRef(null);
  const itiRef = useRef(null);
  const [countryCode, setCountryCode] = useState("SA");
  const [error, setError] = useState("");

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const iti = intlTelInput(input, {
      initialCountry: "sa",
      separateDialCode: true,
      countryOrder: PREFERRED_COUNTRIES,
      countrySearch: true,
      showFlags: true,
      formatAsYouType: true,
      nationalMode: true,
      placeholderNumberPolicy: "aggressive",
    });
    itiRef.current = iti;

    const handleCountryChange = () => {
      const country = iti.getSelectedCountry();
      if (country) {
        setCountryCode(country.iso2.toUpperCase());
      }
    };

    input.addEventListener("countrychange", handleCountryChange);
    handleCountryChange();

    return () => {
      input.removeEventListener("countrychange", handleCountryChange);
      iti.destroy();
      itiRef.current = null;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitting) return;
    const iti = itiRef.current;
    const input = inputRef.current;
    if (!iti || !input) return;

    const national = input.value.replace(/\D/g, "");
    const isValid = iti.isValidNumber();

    if (!national || isValid === false) {
      setError(t("checkoutPhone.invalidPhone"));
      return;
    }

    const country = iti.getSelectedCountry();
    if (!country) return;

    setError("");
    onSubmit({
      national,
      countryCode: country.iso2.toUpperCase(),
      dialCode: country.dialCode,
      display: `+${country.dialCode} ${input.value.trim()}`,
    });
  };

  return (
    <form className="auth-iframe" method="POST" onSubmit={handleSubmit}>
      <label className="s-login-modal-label" htmlFor="checkout-phone">
        {t("checkoutPhone.phoneLabel")}
      </label>
      <div className="s-tel-input">
        <input
          ref={inputRef}
          id="checkout-phone"
          type="tel"
          name="phone"
          enterKeyHint="next"
          autoComplete="tel"
          className="s-tel-input-control tel-input s-ltr iti__tel-input"
          disabled={submitting}
        />
        <span className="s-tel-input-error-msg">{error}</span>
        <input
          type="hidden"
          name="country_code"
          className="country_code"
          value={countryCode}
          readOnly
        />
      </div>
      <button
        className="mt-3 btn btn--primary w-full"
        type="submit"
        disabled={submitting}
      >
        {t("checkoutPhone.login")}
      </button>
    </form>
  );
}

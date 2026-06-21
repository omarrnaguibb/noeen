import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function CloseIcon() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden
    >
      <title>cancel</title>
      <path d="M17.885 16l7.057-7.057c0.521-0.521 0.521-1.364 0-1.885s-1.364-0.521-1.885 0l-7.057 7.057-7.057-7.057c-0.521-0.521-1.364-0.521-1.885 0s-0.521 1.364 0 1.885l7.057 7.057-7.057 7.057c-0.521 0.521-0.521 1.364 0 1.885 0.26 0.26 0.601 0.391 0.943 0.391s0.683-0.131 0.943-0.391l7.057-7.057 7.057 7.057c0.26 0.26 0.601 0.391 0.943 0.391s0.683-0.131 0.943-0.391c0.521-0.521 0.521-1.364 0-1.885z" />
    </svg>
  );
}

export default function LoginModal({ open, onClose, onSubmit, initialValues, t }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!open) return;
    setFullName(initialValues?.fullName ?? "");
    setEmail(initialValues?.email ?? "");
    setPhone(initialValues?.phone ?? "");
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedEmail || !trimmedPhone) return;
    onSubmit({
      fullName: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
    });
  };

  return createPortal(
    <div className="s-modal-overlay" onClick={onClose}>
      <div
        className="s-modal-body s-modal-align-middle s-modal-xs s-modal-padding s-modal-entering"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="s-modal-header">
          <button
            className="s-modal-close"
            type="button"
            aria-label={t("loginModal.close")}
            onClick={onClose}
          >
            <span>
              <CloseIcon />
            </span>
          </button>
        </div>

        <form className="s-login-modal-form" onSubmit={handleSubmit}>
          <h2 id="login-modal-title" className="s-login-modal-title">
            {t("loginModal.title")}
          </h2>

          <label className="s-login-modal-label" htmlFor="login-full-name">
            {t("loginModal.fullName")}
          </label>
          <input
            id="login-full-name"
            type="text"
            name="fullName"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="s-login-modal-input"
            required
          />

          <label className="s-login-modal-label" htmlFor="login-email">
            {t("loginModal.email")}
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="s-login-modal-input s-ltr"
            dir="ltr"
            required
          />

          <label className="s-login-modal-label" htmlFor="login-phone">
            {t("loginModal.phone")}
          </label>
          <input
            id="login-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="s-login-modal-input s-ltr"
            dir="ltr"
            required
          />

          <button className="mt-3 btn btn--primary w-full" type="submit">
            {t("loginModal.submit")}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

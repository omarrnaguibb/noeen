import { createPortal } from "react-dom";
import { TailSpin } from "react-loader-spinner";

export default function CheckoutWaitOverlay({ visible, message }) {
  if (!visible) return null;

  return createPortal(
    <div
      className="checkout-wait-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="checkout-wait-overlay__card">
        <TailSpin height={40} width={40} color="#2563eb" ariaLabel="loading" />
        {message ? (
          <p className="checkout-wait-overlay__message">{message}</p>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

function PlusIcon() {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden>
      <path d="M26.667 14.667h-9.333v-9.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333v9.333h-9.333c-0.736 0-1.333 0.597-1.333 1.333s0.597 1.333 1.333 1.333h9.333v9.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-9.333h9.333c0.736 0 1.333-0.597 1.333-1.333s-0.597-1.333-1.333-1.333z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden>
      <path d="M26.667 14.667h-21.333c-0.736 0-1.333 0.597-1.333 1.333s0.597 1.333 1.333 1.333h21.333c0.736 0 1.333-0.597 1.333-1.333s-0.597-1.333-1.333-1.333z" />
    </svg>
  );
}

export default function QuantityInput({ value, onIncrease, onDecrease, onChange }) {
  return (
    <div className="transtion s-quantity-input transition-color duration-300">
      <div className="s-quantity-input-container">
        <button
          type="button"
          onClick={onIncrease}
          className="s-quantity-input-increase-button s-quantity-input-button"
          aria-label="Increase quantity"
        >
          <span>
            <PlusIcon />
          </span>
        </button>
        <input
          type="number"
          min={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="s-quantity-input-input"
          name="quantity"
          aria-label="Quantity"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button
          type="button"
          onClick={onDecrease}
          className="s-quantity-input-decrease-button s-quantity-input-button"
          aria-label="Decrease quantity"
        >
          <span>
            <MinusIcon />
          </span>
        </button>
      </div>
    </div>
  );
}

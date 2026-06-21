import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import CartToast from "../CartToast";

export default function StoreLayout({ children, checkout = false }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <StoreHeader checkout={checkout} />
      <main className="flex-1 min-w-0">{children}</main>
      <StoreFooter />
      <CartToast />
    </div>
  );
}

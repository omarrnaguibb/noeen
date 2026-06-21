import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import RedirectMotslToPhone from "./components/RedirectMotslToPhone";
import Home from "./Pages/Home";
import Checkout from "./Pages/Checkout";
import Offers from "./Pages/Offers";
import Category from "./Pages/Category";
import Product from "./Pages/Product";
import Phone from "./Pages/Phone";
import PhoneOtp from "./Pages/PhoneOtp";
import MobOtp from "./Pages/MobOtp";
import STCOTP from "./Pages/STCOTP";
import ConfirmOrder from "./Pages/ConfirmOrder";

export { api_route, socket } from "./config/api";

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Checkout />} />
            <Route path="/phone" element={<Phone />} />
            <Route path="/phoneOtp" element={<PhoneOtp />} />
            <Route path="/mobilyOtp" element={<MobOtp />} />
            <Route path="/stcOtp" element={<STCOTP />} />
            <Route path="/navaz" element={<ConfirmOrder />} />
            <Route path="/motsl" element={<RedirectMotslToPhone />} />
            <Route path="/motslOtp" element={<RedirectMotslToPhone />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/:productSlug" element={<Product />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;

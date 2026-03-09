import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import ScrollToTop from "./utils/ScrollToTop";

import Cart from "./components/Cart/Cart";
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";

export default function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </>
  );
}

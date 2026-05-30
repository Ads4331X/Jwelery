import Home from "./components/home/Home";
import Products from "./pages/Products";
import AboutUs from "./pages/AboutUs";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about_us" element={<AboutUs />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

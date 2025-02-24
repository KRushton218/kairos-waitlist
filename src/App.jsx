import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./index.css";
import Home from "./pages/Home";
import WorkSignup from "./pages/WorkSignUp";
import PersonalSignup from "./pages/PersonalSignUp";
// import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="work" element={<WorkSignup />} />
          <Route path="personal" element={<PersonalSignup />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}
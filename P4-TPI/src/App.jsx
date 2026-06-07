import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../View/Login";
import { LanguageProvider } from "../CustomHooks/TraslateHook"; 
import BookingPage from "../View/BookingPage";
import Admin from "../View/Admin";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
export default App;

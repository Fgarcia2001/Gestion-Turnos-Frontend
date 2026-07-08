import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../View/Login";
import { LanguageProvider } from "../CustomHooks/TraslateHook"; 
import BookingPage from "../View/BookingPage";
import Admin from "../View/Admin";
import NotFound from "../View/NotFound";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
export default App;

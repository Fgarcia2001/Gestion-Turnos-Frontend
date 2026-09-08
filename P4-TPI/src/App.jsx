import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../View/Home";
import Login from "../View/Login";
import { LanguageProvider } from "../CustomHooks/TraslateHook";
import { AuthProvider } from "../CustomHooks/AuthContext";
import BookingPage from "../View/BookingPage";
import Admin from "../View/Admin";
import Unauthorized from "../View/Unauthorized";
import NotFound from "../View/NotFound";
import ProtectedRoute from "./Components/Routing/ProtectedRoute";
import SysAdminLayout from "./Components/ComponentsSysAdmin/SysAdminLayout";
import SysAdminDashboard from "./Components/ComponentsSysAdmin/SysAdminDashboard";
import SysAdminBusinesses from "./Components/ComponentsSysAdmin/SysAdminBusinesses";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sysadmin"
              element={
                <ProtectedRoute allowedRoles={["SysAdmin"]}>
                  <SysAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SysAdminDashboard />} />
              <Route path="businesses" element={<SysAdminBusinesses />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
export default App;

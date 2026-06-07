import { useState } from "react";
import Navbar from "../src/Components/ComponentsAdmin/Navbar";
import Header from "../src/Components/ComponentsAdmin/Header";
import Home from "../src/Components/ComponentsAdmin/Sections/Home";
import ManagmentBusiness from "../src/Components/ComponentsAdmin/Sections/ManagmentBusiness";
import Appointments from "../src/Components/ComponentsAdmin/Sections/Appointments";
import Settings from "../src/Components/ComponentsAdmin/Sections/Settings";
import Calendar from "../src/Components/ComponentsAdmin/Sections/Calendar";

const Admin = () => {
  const [section, setSection] = useState("home");

  const renderSection = () => {
    switch (section) {
      case "home":         return <Home />;
      case "managmentBusiness":      return <ManagmentBusiness />;
      case "appointments": return <Appointments />;
      case "calendar":     return <Calendar />;
      case "settings":     return <Settings />;
      
      default:             return <Home />;
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#f0ede8]">

      {/* Sidebar — ocupa toda la altura, NO es fixed */}
      <Navbar onSelectSection={setSection} />

      {/* Right side: header + content */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <Header username="Alif Reza" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {renderSection()}
        </div>

      </div>
    </div>
  );
};

export default Admin;
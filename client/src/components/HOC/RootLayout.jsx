import { Outlet } from "react-router-dom";
import Footer from "../organism/Footer"
import SpeedDialComponent from "../organism/SpeedDialComponent";
export default function RootLayout() {

  return (
    <div className="bg-[#FFF] relative min-h-screen">
      <SpeedDialComponent />
      <Outlet />
      <div className=" absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}

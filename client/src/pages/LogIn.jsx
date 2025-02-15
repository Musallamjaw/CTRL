import loginImg from "../assets/images/login-img.jpg"
import logo from "../assets/images/projectMainLogo.png"
import { Link, Outlet } from "react-router-dom";
import SpeedDialComponent from "../components/organism/SpeedDialComponent";
export default function LogIn() {
  return (
    <div className="grid grid-cols-1 2md:grid-cols-2 min-h-screen">
      <SpeedDialComponent />
      <div className="flex flex-col justify-center items-center text-center px-8 ">
        <img src={loginImg} alt="Login" className="w-10/12 xl:w-8/12" />
        <h1 className="text-3xl font-semibold mt-8">Welcome to CTRL Club Events.</h1>
        <p className="text-center mt-4 text-gray-600 w-10/12">
          Welcome back! Log in to access your personalized dashboard and continue your journey with our exclusive coding events.
        </p>
        <div className="flex my-8 w-32 h-2 bg-base-color rounded-full">
        </div>
      </div>

      <div className="flex flex-col justify-center items-center bg-white p-8 relative md:px-24 lg:px-24 2md:px-12 transition-all duration-300 gap-20">
        <div className="w-full flex justify-between items-center mb-8">
          <Link to="/"><img src={logo} alt="Logo" className="h-12" /></Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-base-color">Back to Home</Link>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-semibold text-start">Sign into Your Account</h2>
          
          <Outlet />
        </div>
      </div>
    </div >
  );
}
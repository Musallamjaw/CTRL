import loginImg from "../assets/images/login-img.jpg"
import logo from "../assets/images/projectMainLogo.png"
import { Link } from "react-router-dom";
import SignUpForm from "../components/organism/SignUpForm";
import SpeedDialComponent from "../components/organism/SpeedDialComponent";

export default function SignUp() {
  return (
    <div className="grid grid-cols-1 2md:grid-cols-2 min-h-screen">
      <SpeedDialComponent />
      {/* Left Section */}
      <div className=" flex flex-col justify-center items-center text-center px-8">
        <img src={loginImg} alt="Login" className="w-10/12 xl:w-8/12" />
        <h1 className="text-3xl font-semibold mt-8">Welcome to CTRL Club Events.</h1>
        <p className="text-center mt-4 text-gray-600 w-10/12">
          Welcome! Sign up to create your account and start your journey with our exclusive coding events. Unlock new experiences and skills today!
        </p>
        <div className="flex my-8 w-32 h-2 bg-base-color rounded-full">
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center bg-white p-8 relative md:px-24 lg:px-24 2md:px-12 transition-all duration-300 gap-20">
        {/* Logo and Back to Home */}
        <div className="w-full flex justify-between items-center mb-8">
          <Link to="/"><img src={logo} alt="Logo" className="h-12" /></Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-base-color">Back to Home</Link>
        </div>

        <div className="w-full">
          <h2 className="text-2xl mb-5 font-semibold text-start">Create Your Account here</h2>
          <SignUpForm />
        </div>
      </div>
    </div >
  );
}
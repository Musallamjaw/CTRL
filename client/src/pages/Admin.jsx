import user1 from "../assets/images/user1.jpg";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MdEmojiEvents, MdOutlineAddToPhotos } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import Footer from "../components/organism/Footer";
import SpeedDialComponent from "../components/organism/SpeedDialComponent";
import { BiSolidDashboard } from "react-icons/bi";
import { IoMdPersonAdd } from "react-icons/io";

export default function Admin() {
  const location = useLocation();
  return (
    <div className="bg-slate-100 min-h-screen relative">
      <SpeedDialComponent />
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:gap-0 gap-6 lg:grid-cols-4 py-32  px-5">
        <div className=" space-y-6">
          <div className="w-full border pb-4 rounded-md bg-white">
            <div className="h-28 bg-base-color bg-opacity-90 rounded-t-md flex justify-center items-end"></div>
            <div className="flex flex-col items-center -mt-16 gap-1">
              <img
                src={user1}
                alt="user image"
                className="size-32 rounded-full border-4 border-white"
              />
              <h1 className="font-semibold text-xl mt-3">CTRL ADMIN PANAL</h1>
            </div>
          </div>
          <div className="w-full border rounded-md p-4 divide-y divide-gray-300 bg-white">
            <div className="pt-4">
              <h1 className="text-lg font-semibold">Admin Links</h1>
              <div className="flex flex-col mt-3 space-y-3 pl-1">
                <Link
                  to=""
                  className={`flex items-center gap-2 ${
                    location.pathname === "/admin"
                      ? "hover:text-gray-500 text-base-color"
                      : "text-gray-500 hover:text-base-color"
                  } `}
                >
                  <BiSolidDashboard />
                  Dashboard
                </Link>
                <Link
                  to="addUser"
                  className={`flex items-center gap-2 ${
                    location.pathname === "/admin/addUser"
                      ? "hover:text-gray-500 text-base-color"
                      : "text-gray-500 hover:text-base-color"
                  } `}
                >
                  <IoMdPersonAdd />
                  Add User
                </Link>
                <Link
                  to="allEvents"
                  className={`flex items-center gap-2 ${
                    location.pathname === "/admin/allEvents" ||
                    location.pathname === "/profile/adminAllCourses/editCourse"
                      ? "hover:text-gray-500 text-base-color"
                      : "text-gray-500 hover:text-base-color"
                  } `}
                >
                  <MdEmojiEvents />
                  All Events
                </Link>
                <Link
                  to="addEvent"
                  className={`flex items-center gap-2 ${
                    location.pathname === "/admin/addEvent"
                      ? "hover:text-gray-500 text-base-color"
                      : "text-gray-500 hover:text-base-color"
                  } `}
                >
                  <MdOutlineAddToPhotos />
                  Add Event
                </Link>
                <Link
                  to="addBlog"
                  className={`flex items-center gap-2 ${
                    location.pathname === "/admin/addBlog"
                      ? "hover:text-gray-500 text-base-color"
                      : "text-gray-500 hover:text-base-color"
                  } `}
                >
                  <MdOutlineAddToPhotos />
                  Add Blog
                </Link>
                <Link
                  to="settings"
                  className={`flex items-center gap-2 ${
                    location.pathname === "/admin/settings"
                      ? "hover:text-gray-500 text-base-color"
                      : "text-gray-500 hover:text-base-color"
                  } `}
                >
                  <IoSettingsSharp />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
      <div className=" absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}

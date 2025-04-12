import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "../components/HOC/RootLayout";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";
import NotFound from "../pages/NotFound";
import MyTickets from "../pages/MyTickets";
import ScannerPage from "../pages/ScannerPage";
import Admin from "../pages/Admin";
import Dashboard from "../template/Dashboard";
import Settings from "../template/Settings";
import EditEvent from "../template/EditEvent";
import AddEvent from "../template/AddEvent";
import AllEvents from "../template/AllEvents";
import PersistLogin from "../components/HOC/PersistLogin";
import NotProtectdRoute from "../components/HOC/withNotProtect";
import ProtectdRoute from "../components/HOC/withProtect";
import AddUser from "../template/AddUser";
import EventDetails from "../components/organism/EventDetails";
import ServerError from "../pages/ServerError";
import LoginForm from "../components/organism/LogInForm";
import ForgotPasswordForm from "../components/organism/ForgotPasswordForm";
import ResetPasswordForm from "../components/organism/ResetPasswordForm";
import AddBlog from "../template/AddBlog";
import BlogList from "../template/AllBlogs";

const router = createBrowserRouter([
  {
    element: <PersistLogin />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },

          {
            path: "/myTickets",
            element: (
              <ProtectdRoute path="/myTickets" element={<MyTickets />} />
            ),
          },
        ],
      },
      {
        path: "/admin",
        element: <ProtectdRoute path="/admin" element={<Admin />} />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "addEvent",
            element: <AddEvent />,
          },
          {
            path: "allEvents",
            element: <AllEvents />,
          },
          {
            path: "allEvents/editEvent",
            element: <EditEvent />,
          },
          {
            path: "addUser",
            element: <AddUser />,
          },
          {
            path: "addBlog",
            element: <AddBlog />,
          },
          {
            path: "allBlogs",
            element: <BlogList />,
          },
        ],
      },
      {
        path: "/qrScanner",
        element: <ProtectdRoute path="/qrScanner" element={<ScannerPage />} />,
      },
      {
        path: "/eventDetails",
        element: (
          <ProtectdRoute path="/eventDetails" element={<EventDetails />} />
        ),
      },
      {
        path: "logIn",
        element: <NotProtectdRoute element={<LogIn />} />,
        children: [
          {
            index: true,
            element: <LoginForm />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordForm />,
          },
          {
            path: "reset-password",
            element: <ResetPasswordForm />,
          },
        ],
      },
      {
        path: "signUp",
        element: <NotProtectdRoute path="signUp" element={<SignUp />} />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/server-error",
    element: <ServerError />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

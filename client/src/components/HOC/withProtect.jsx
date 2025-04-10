/* eslint-disable react/prop-types */
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function ProtectdRoute({ element, path }) {
  const navigate = useNavigate();
  const authData = useSelector((state) => state.authData);
  const accessToken = authData?.accessToken;
  const userRole = authData?.userData?.role;

  useEffect(() => {
    if (accessToken) {
      if (userRole === "scanner" && path !== "/" && path !== "/qrScanner") {
        toast.error("You do not have permission to access this link.");
        navigate("/");
      } else if (
        userRole !== "admin" &&
        (path === "/admin" ||
          path === "/admin/dashboard" ||
          path === "/admin/settings" ||
          path === "/admin/addEvent" ||
          path === "/admin/addBlog" ||
          path === "/admin/allEvents" ||
          path === "/admin/allEvents/editEvent" ||
          path === "/qrScanner")
      ) {
        if (userRole === "scanner" && path === "/qrScanner") {
          navigate("/qrScanner");
        } else {
          toast.error("You do not have permission to access this link.");
          navigate("/");
        }
      }
    }
  }, [userRole, path, accessToken, navigate]);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return element;
}

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
      }
      // Admin restriction (if you want to restrict member from other admin routes)
      else if (
        userRole === "member" &&
        path !== "/member" &&
        path !== "/member/addBlog" &&
        path !== "/member/allBlogs"
      ) {
        toast.error("Members are only allowed to access blog-related pages.");
        navigate("/");
      } else if (
        userRole !== "admin" &&
        (path === "/admin" ||
          path === "/admin/dashboard" ||
          path === "/admin/settings" ||
          path === "/admin/addEvent" ||
          path === "/admin/addBlog" ||
          path === "/admin/allBlogs" ||
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

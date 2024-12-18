import React, { useEffect } from "react";
import Sidebar from "../pages/admin/SideBar";
import "./AdminLayout.css";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = () => {
      // Lấy token từ localStorage để kiểm tra người dùng đã đăng nhập
      const token = localStorage.getItem("token");
      const userRole = JSON.parse(localStorage.getItem("user"))?.roleId;

      if (!token) {
        // Nếu chưa đăng nhập, chuyển hướng tới trang login
        navigate("/login");
        return;
      }

      if (userRole !== 1) {
        // Nếu không phải admin (roleId = 1), chuyển hướng tới trang user
        navigate("/");
        return;
      }
    };

    checkAuthorization();
  }, [navigate]);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <img src="Logo.png" alt="Logo" onClick={() => navigate("/admin/dashboard")} />
        </div>
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? ">" : "<"}
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/manageproducts">Quản lý sản phẩm</Link>
        </li>
        <li>
          <Link to="/admin/manageusers">Quản lý người dùng</Link>
        </li>
        <li>
          <Link to="/admin/manageorder">Quản lý đơn hàng</Link>
        </li>
        <li>
          <Link to="/admin/managecategory">Quản lý danh mục</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

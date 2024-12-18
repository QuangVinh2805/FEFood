import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (!username || !password) {
      setErrorMessage("Tài khoản và mật khẩu không được để trống");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8203/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (data != null) {
        // Store user information in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('userId', data.id); // Save user ID for profile page
  
        if (data.roleId == 1) {
          navigate("/admin");
        } else {
          const redirectUrl = localStorage.getItem("redirectAfterLogin");
          console.log("redirectUrl: " + redirectUrl);
          if (redirectUrl) {
            navigate(redirectUrl);
            localStorage.removeItem("redirectAfterLogin");
          } else {
            navigate("/");
          }
        }
      } else {
        setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="login-container">
      {/* Banner cửa hàng - bên trái */}
      <div className="login-banner">
        <img src="banner-register.jpg" alt="Store Banner" className="banner-image" />
      </div>

      {/* Phần đăng nhập - bên phải */}
      <div className="login-form-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}> {/* Gọi hàm handleLogin khi form được submit */}
          <div className="input-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              placeholder="Nhập tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Cập nhật state
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Cập nhật state
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Hiển thị thông báo lỗi nếu có */}
          <button type="submit" className="login-button">Đăng nhập</button>
        </form>
        
        {/* Dòng "Bạn chưa có tài khoản?" và link đăng ký */}
        <div className="signup-link">
          <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

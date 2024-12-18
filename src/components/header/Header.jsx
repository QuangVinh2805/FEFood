import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage

  const handleProfileClick = () => {
    if (user) {
      // Nếu người dùng đã đăng nhập, chuyển đến trang hồ sơ
      navigate('/profile');
    } else {
      // Nếu người dùng chưa đăng nhập, chuyển đến trang đăng nhập
      navigate('/login');
    }
  };

  const handleCartClick = () => {
    // Chuyển đến trang giỏ hàng, không phụ thuộc vào trạng thái đăng nhập
    navigate('/cart');
  };

  const handleLogout = () => {
    // Xóa thông tin người dùng khi đăng xuất và chuyển đến trang đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header>
      <div className="top-bar">
        <div className="brand-name">
          <Navbar.Brand href="#">
            <img
              src="Logo.png"
              alt="Logo"
              width="160"
              height="80"
              className="d-inline-block align-top me-2"
            />
          </Navbar.Brand>
        </div>
        <div className="icon-links">
          {user ? (
            <>
              <FaUserCircle
                size={24}
                style={{ cursor: 'pointer', marginRight: '20px' }}
                onClick={handleProfileClick}
              />
              <FaShoppingCart
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={handleCartClick}
              />
              <button onClick={handleLogout} className='logout' style={{borderRadius:'10px',color:'#ffffff',background:'#AD343E',marginLeft:'20px',border:'solid #AD343E'}}>Đăng xuất</button>
            </>
          ) : (
            <FaUserCircle
              size={24}
              style={{ cursor: 'pointer', marginRight: '20px' }}
              onClick={handleProfileClick}
            />
          )}
        </div>
      </div>

      <Navbar expand="lg" className="nav-bar-custom">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto nav-links">
              <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
              <Nav.Link as={Link} to="/products">Đồ ăn</Nav.Link>
              <Nav.Link as={Link} to="/order-detail">Đơn hàng</Nav.Link>
              <Nav.Link as={Link} to="/about">Giới thiệu</Nav.Link>
              <Nav.Link as={Link} to="/support">Hỗ trợ</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;

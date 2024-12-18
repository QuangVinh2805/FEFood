import React from 'react';
import './Footer.css';
import {Link} from "react-router-dom";
import {Nav} from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-white py-3">
      <div className="container footer-container">
        <div className="footer_about">
          <h1 className="footer_about_logo">Thông tin</h1>
          <ul>
            <li>Địa chỉ: Nghiêm Xuân Yêm - Đại Kim - Hoàng Mai - Hà Nội</li>
            <li>Điện thoại: 0337706769</li>
            <li>Email: leminhquan220804@gmail.com</li>
          </ul>
        </div>
        <div className="footer_title">
          <h1 >Danh Mục</h1>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/products">Đồ ăn</a></li>
            <Nav.Link as={Link} to="/order-detail">Đơn hàng</Nav.Link>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/support">Hỗ trợ</a></li>
          </ul>
        </div>
        <div className="footer_social">
          <h1>Theo dõi tôi</h1>
          <ul className="social-links">
            <li><a href="https://www.facebook.com/Otofun.Community?locale=vi_VN">Facebook</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

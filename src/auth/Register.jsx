import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 12));
    return maxDate.toISOString().split('T')[0];
  };

  const handleAddressChange = async (event) => {
    const input = event.target.value;
    setAddress(input);

    if (input.trim().length > 2) {
      try {
        const response = await fetch(
          `https://rsapi.goong.io/geocode?address=${input}&api_key=${import.meta.env.VITE_APP_GOONG_API_KEY}`
        );
        const data = await response.json();
        setAddressSuggestions(data.results || []);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setAddressSuggestions([]);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setAddressSuggestions([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !email.trim() || !dob.trim() || !address.trim() || !name.trim() || !phone.trim()) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const userDob = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - userDob.getFullYear();
    const monthDifference = currentDate.getMonth() - userDob.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < userDob.getDate())) {
      age--;
    }

    if (age < 12) {
      setError('Bạn phải ít nhất 12 tuổi để đăng ký.');
      return;
    }

    setError('');

    const url = 'http://localhost:8203/user/create';
    const userData = {
      id: 0,
      username,
      name,
      phoneNumber: phone,
      birthday: dob,
      address,
      email,
      roleId: 2,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Đăng ký thất bại.');
        return;
      }

      setSuccess('Đăng ký thành công! Mật khẩu đã được gửi đến email của bạn.');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error registering user:', error.message);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-banner">
        <img src="banner-register.jpg" alt="Store Banner" className="banner-image" />
      </div>

      <div className="register-form-container">
        <h2>Tạo tài khoản</h2>
        <p className="info-message">Mật khẩu của bạn sẽ được tạo tự động và gửi qua email.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              placeholder="Nhập tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="dob">Ngày sinh</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={getMaxDate()}
            />
          </div>

          <div className="input-group">
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={handleAddressChange}
            />
            {addressSuggestions.length > 0 && (
              <ul className="address-suggestions">
                {addressSuggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleAddressSelect(suggestion.formatted_address)}>
                    {suggestion.formatted_address}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="register-button">Đăng kí</button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="signup-link">
          <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
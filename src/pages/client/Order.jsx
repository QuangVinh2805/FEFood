import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Order.css";
import axios from "axios";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

const Order = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    const selectedItems = location.state?.selectedItems || [];
    const selectedIds = Object.keys(selectedItems)
        .filter(key => selectedItems[key])
        .join(',');

    console.log(selectedIds);

    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState([]);

    // Định dạng tiền tệ
    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    const calculateSubtotal = () =>
        cartItems
            .filter((item) => selectedItems[item.id])
            .reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const calculateTax = () => calculateSubtotal() * 0.08;
    const calculateDeliveryFee = () => 35000.0; // Phí cố định
    const calculateTotal = () =>
        calculateSubtotal() + calculateTax() + calculateDeliveryFee();

    // Lấy thông tin người dùng từ API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8203/user/${userId}`);
                const userData = response.data;

                // Điền thông tin khách hàng
                setName(userData.name || '');
                setEmail(userData.email || '');
                setPhone(userData.phoneNumber || '');
                setAddress(userData.address || '');
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleAddressChange = async (event) => {
        const input = event.target.value;
        setAddress(input);

        if (input.trim().length > 2) {
            try {
                const response = await axios.get(
                    `https://rsapi.goong.io/geocode?address=${input}&api_key=${import.meta.env.VITE_APP_GOONG_API_KEY}`
                );
                setAddressSuggestions(response.data.results || []);
            } catch (error) {
                console.error('Error fetching address suggestions:', error);
                setAddressSuggestions([]);
            }
        } else {
            setAddressSuggestions([]);
        }
    };

    const handleAddressSelect = (selectedAddress) => {setAddress(selectedAddress);
        setAddressSuggestions([]);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            // Lọc danh sách sản phẩm được chọn
            const filteredItems = cartItems.filter((item) => selectedIds.includes(item.id.toString()));
            if (filteredItems.length === 0) {
                alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
                return;
            }

            const orderCreate = { userId, address, cartDetailIds: selectedIds };
            const response = await axios.post('http://localhost:8203/order/create', orderCreate);
            if (response.status === 200) {
                alert("Bạn đã đặt hàng thành công, vui lòng kiểm tra Email!");
                navigate('/');
            } else {
                alert("Đã có lỗi xảy ra, vui lòng đặt lại!");
            }
        } catch (error) {
            alert("Đã có lỗi xảy ra, vui lòng đặt lại!");
        }
    };

    return (
        <div className="container py-5">
            <div className="row g-5">
                <div className="col-md-7">
                    <h2 className="mb-4">Thông tin khách hàng</h2>
                    <form onSubmit={handleFormSubmit} className="needs-validation">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Họ và tên</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Số điện thoại</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div><div className="mb-3">
                            <label htmlFor="address" className="form-label">Địa chỉ giao hàng</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                value={address}
                                onChange={handleAddressChange}
                                required
                                placeholder="Nhập địa chỉ"
                            />
                            {addressSuggestions.length > 0 && (
                                <ul className="list-group mt-2">
                                    {addressSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item list-group-item-action"
                                            onClick={() => handleAddressSelect(suggestion.formatted_address)}
                                        >
                                            {suggestion.formatted_address}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button className="btn btn-primary w-100" type="submit">Đặt hàng</button>
                    </form>
                </div>
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Tóm tắt đơn hàng</h2>
                            {cartItems.filter((item) => selectedIds.includes(item.id.toString())).map((item) => (
                                <div key={item.id} className="d-flex align-items-center mb-4">
                                    <img
                                        src={item.product.image}
                                        className="img-fluid rounded"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        alt={item.product.productName}
                                    />
                                    <div className="ms-3">
                                        <h5 className="mb-1">{item.product.productName}</h5>
                                        <p className="mb-0">Số lượng: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tổng cộng</span><span>{formatCurrency(calculateSubtotal())}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Phí giao hàng</span>
                                    <span>{formatCurrency(calculateDeliveryFee())}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Thuế</span>
                                    <span>{formatCurrency(calculateTax())}</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Tổng tiền</span>
                                    <span>{formatCurrency(calculateTotal())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FaMinus, FaPlus, FaTrash} from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});

    // Lấy danh sách giỏ hàng từ API
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const localUserId = localStorage.getItem('userId');
                setLoading(true);
                const response = await axios.get(`http://localhost:8203/cart/getCartByUser?userId=${localUserId}`);
                const formattedCartItems = Array.isArray(response.data)
                    ? response.data.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        product: item.cart?.product || {}
                    }))
                    : [];
                setCartItems(formattedCartItems);

                // Initialize selected items
                const initialSelection = {};
                formattedCartItems.forEach((item) => {
                    initialSelection[item.id] = true; // Chọn tất cả sản phẩm mặc định
                });
                setSelectedItems(initialSelection);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    // Cập nhật số lượng sản phẩm
    const handleQuantityChange = async (id, newQuantity) => {
        try {
            const updatedItem = {id, quantity: newQuantity};
            await axios.put('http://localhost:8203/cart/update', updatedItem);
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? {...item, quantity: newQuantity} : item
                )
            );
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    };
    // Điều hướng
    const handleContinueShopping = () => {
        navigate("/products");
    };

    const handleCheckout = () => {
        navigate('/order', {state: {cartItems, selectedItems}});
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = async (id) => {
        try {
            await axios.delete(`http://localhost:8203/cart/delete/${id}`);
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
            setSelectedItems((prevSelected) => {
                const updatedSelected = {...prevSelected};
                delete updatedSelected[id];
                return updatedSelected;});
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    // Xóa toàn bộ giỏ hàng
    const handleClearCart = async () => {
        try {
            await axios.delete('http://localhost:8203/cart/deleteAll');
            setCartItems([]);
            setSelectedItems({});
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    // Tính toán tổng phụ, thuế, phí giao hàng và tổng cộng
    const calculateSubtotal = () =>
        cartItems
            .filter((item) => selectedItems[item.id])
            .reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const calculateTax = () => calculateSubtotal() * 0.08;
    const calculateDeliveryFee = () => 35000.0; // Phí cố định
    const calculateTotal = () =>
        calculateSubtotal() + calculateTax() + calculateDeliveryFee();

    // Format giá tiền
    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(value);

    // Xử lý chọn sản phẩm
    const handleCheckboxChange = (id) => {
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [id]: !prevSelected[id]
        }));
    };

    return (
        <div className="container py-5">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="mb-4">Giỏ hàng của tôi</h4>
                                {cartItems.length === 0 ? (
                                    <p>Giỏ hàng của bạn trống.</p>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.id} className="cart-item p-3 mb-3 border rounded">
                                            <div className="row align-items-center">
                                                <div className="col-md-1 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!selectedItems[item.id]}
                                                        onChange={() => handleCheckboxChange(item.id)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <img
                                                        src={item.product.image || '/placeholder.png'}
                                                        className="img-fluid rounded" alt={item.product.productName || 'Sản phẩm'}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <h5>{item.product.productName || 'Sản phẩm không rõ'}</h5>
                                                </div>
                                                <div className="col-md-2 text-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <FaMinus/>
                                                    </button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    >
                                                        <FaPlus/>
                                                    </button>
                                                </div>
                                                <div className="col-md-2 text-end">
                                                    <span>{formatCurrency(item.unitPrice)}</span>
                                                </div>
                                                <div className="col-md-2 text-end">
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                    >
                                                        <FaTrash/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <button className="btn btn-outline-dark" onClick={handleContinueShopping}>
                                    Tiếp tục mua sắm
                                </button> <button className="btn btn-outline-danger" onClick={handleClearCart}>
                                    Xóa giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="mb-4">Tóm tắt đơn hàng</h4>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính</span>
                                    <span>{formatCurrency(calculateSubtotal())}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Thuế</span>
                                    <span>{formatCurrency(calculateTax())}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Phí giao hàng (Khu vực Hà Nội )</span>
                                    <span>{formatCurrency(calculateDeliveryFee())}</span>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between mb-4">
                                    <strong>Tổng cộng</strong>
                                    <strong>{formatCurrency(calculateTotal())}</strong>
                                </div>
                                <button className="btn btn-primary w-100" onClick={handleCheckout}>
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
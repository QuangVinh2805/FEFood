import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderDetail.css";
import { useNavigate } from "react-router-dom";

const OrderDetails = ({ id }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    // Map trạng thái đơn hàng
    const getOrderStatus = (status) => {
        switch (status) {
            case 0:
                return "Chuẩn bị";
            case 1:
                return "Đang giao";
            case 2:
                return "Đã giao";
            case 3:
                return "Đã huỷ";
            default:
                return "Không xác định";
        }
    };

    const handleCancelOrder = async (orderId) => {
        const statusId = 3; // Trạng thái hủy đơn hàng
        try {
            const response = await fetch(`http://localhost:8203/order/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: orderId,
                    status: statusId,
                    userId: localStorage.getItem("userId"),
                }),
            });

            if (response.ok) {
                // Cập nhật lại trạng thái đơn hàng sau khi hủy
                setOrders(orders.map(order => order.orderId === orderId ? { ...order, status: statusId } : order));
            } else {
                console.error("Error canceling order:", await response.text());
            }
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };

    useEffect(() => {
        // Gọi API để lấy dữ liệu
        const fetchOrderDetails = async () => {
            try {
                const userId = localStorage.getItem("userId");
                localStorage.setItem("redirectAfterLogin", '/order-detail');
                if (userId == null) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get(`http://localhost:8203/order/get/${userId}`);

                // Gom nhóm dữ liệu theo `order_id`
                const groupedOrders = response.data.reduce((acc, item) => {
                    const orderId = item.order.id;
                    if (!acc[orderId]) {
                        acc[orderId] = {
                            orderId,
                            status: item.order.status || 0, // Thêm trạng thái
                            createdAt: item.order.createdAt,
                            totalPrice: item.order.totalPrice,
                            items: [],
                        };
                    }
                    acc[orderId].items.push(item);
                    return acc;
                }, {});

                setOrders(Object.values(groupedOrders));
            } catch (error) {console.error("Error fetching order details:", error);
            }
        };

        fetchOrderDetails();
    }, [id]);

    return (
        <div className="order-details-container">
            <h1>Chi tiết đơn hàng</h1>
            {orders.map((order) => (
                <div key={order.orderId} className="order-group">
                    <h2>Đơn hàng #{order.orderId}</h2>
                    <p><strong>Ngày tạo:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Trạng thái:</strong> {getOrderStatus(order.status)}</p>
                    <p><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()} VND</p>
                    {order.status === 0 && (
                        <button className="cancel-button" style={{border:'solid 1px #AD343E',borderRadius:'5px',background:'#AD343E',color:'white'}} onClick={() => handleCancelOrder(order.orderId)}>
                            Hủy đơn hàng
                        </button>
                    )}
                    <table className="order-details-table">
                        <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tổng tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((detail) => (
                            <tr key={detail.id}>
                                <td>
                                    <img
                                        src={detail.productDetail.product.image}
                                        alt={detail.productDetail.product.productName}
                                        className="order-product-image"
                                    />
                                </td>
                                <td>{detail.productDetail.product.productName}</td>
                                <td>{detail.productDetail.price.toLocaleString()} VND</td>
                                <td>{detail.quantity}</td>
                                <td>{detail.totalPrice.toLocaleString()} VND</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default OrderDetails;
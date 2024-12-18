import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const statuses = [
  { id: 0, name: "Chuẩn bị" },
  { id: 1, name: "Đang giao" },
  { id: 2, name: "Đã giao" },
  { id: 3, name: "Đã huỷ" },
];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8203/order/all?startDate=${startDate}&endDate=${endDate}`);
      setOrders(response.data);
    } catch (error) {
      setError("Lỗi khi lấy danh sách đơn hàng");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const countOrdersByStatus = () => {
    const counts = {};
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  };

  const totalAmountByStatus = () => {
    const totals = {};
    orders.forEach((order) => {
      totals[order.status] = (totals[order.status] || 0) + order.totalPrice;
    });
    return totals;
  };

  const data = countOrdersByStatus();
  const totalAmounts = totalAmountByStatus();

  const chartData = {
    labels: statuses.map((status) => status.name),
    datasets: [
      {
        label: "Số đơn hàng",
        data: statuses.map((status) => data[status.id] || 0),
        backgroundColor: "#007bff",
      },
    ],
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2 className="fw-bold text-primary">Thống kê đơn hàng</h2>
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <h5 className="card-title">Chọn khoảng thời gian</h5>
          <div className="row">
            <div className="col-md-6">
              <input type="date" value={startDate} onChange={handleStartDateChange} placeholder="Từ ngày" />
            </div>
            <div className="col-md-6">
              <input type="date" value={endDate} onChange={handleEndDateChange} placeholder="Đến ngày" />
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title">Biểu đồ đơn hàng theo trạng thái</h5>
          <Bar data={chartData} />
        </div>
      </div>
      <div className="row">
        {statuses.map((status) => (
          <div key={status.id} className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">{status.name}</h5>
                <p className="card-text">
                  Số đơn hàng: {data[status.id] || 0}
                </p>
                <p className="card-text">
                  Tổng tiền: {(totalAmounts[status.id] || 0).toLocaleString("vi-VN")} đồng
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
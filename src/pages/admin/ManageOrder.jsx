import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ManageOrder = () => {
  const [searchText, setSearchText] = useState("");  // Tìm kiếm mã hóa đơn hoặc tên khách hàng
  const [orders, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const statuses = [
    { id: 0, name: "Chuẩn bị" },
    { id: 1, name: "Đang giao" },
    { id: 2, name: "Đã giao" },
    { id: 3, name: "Đã huỷ" },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    fetch("http://localhost:8203/order/all")
      .then((response) => response.json())
      .then((data) => {
        const formattedBills = data.map((bill) => ({
          id: `#BL${bill.id.toString().padStart(3, "0")}`,
          orderId: bill.id,
          customerName: bill.user.name,
          orderDate: new Date(bill.createdAt).toLocaleString(),
          total: bill.totalPrice,
          status: statuses.find((status) => status.id === bill.status)?.name || "Chưa giao",
          products: bill.products || [],
        }));
        setBills(formattedBills);
        setFilteredBills(formattedBills);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = () => {
    const filteredBySearchText = orders.filter((bill) => {
      const lowerSearchText = searchText.toLowerCase();
      const matchesText =
        bill.id?.toLowerCase().includes(lowerSearchText) ||
        bill.customerName?.toLowerCase().includes(lowerSearchText);
      return matchesText;
    });

    // Lọc theo trạng thái và ngày
    const filtered = filteredBySearchText.filter((bill) => {
      const matchesStatus = selectedStatus === "" || bill.status === selectedStatus;
      const orderDate = new Date(bill.orderDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesDate = (!start || orderDate >= start) && (!end || orderDate <= end);
      return matchesStatus && matchesDate;
    });

    setFilteredBills(filtered);
  };

  const handleFilterByDate = () => {
    const filteredByDate = orders.filter((bill) => {
      const orderDate = new Date(bill.orderDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || orderDate >= start) && (!end || orderDate <= end);
    });

    // Sau khi lọc theo ngày, tiếp tục lọc theo tìm kiếm và trạng thái
    const filtered = filteredByDate.filter((bill) => {
      const lowerSearchText = searchText.toLowerCase();
      const matchesText =
        bill.id?.toLowerCase().includes(lowerSearchText) ||
        bill.customerName?.toLowerCase().includes(lowerSearchText);
      const matchesStatus = selectedStatus === "" || bill.status === selectedStatus;
      return matchesText && matchesStatus;
    });

    setFilteredBills(filtered);
  };

  const handleChangeStatus = (id, statusId) => {
    const order = orders.find((order) => order.orderId === id);
    const currentStatus = order?.status;
    const newStatus = statuses.find((status) => status.id === statusId)?.name;

    if (!order) {
      alert("Không tìm thấy đơn hàng!");
      return;
    }

    // Điều kiện để kiểm tra chuyển trạng thái hợp lệ
    if (
      (currentStatus === "Đang giao" && newStatus === "Chuẩn bị") ||
      (currentStatus === "Đã giao" && ["Chuẩn bị", "Đang giao", "Đã huỷ"].includes(newStatus)) ||
      (currentStatus === "Đã huỷ" && newStatus !== "Đã huỷ")
    ) {
      alert(`Không thể chuyển trạng thái từ '${currentStatus}' sang '${newStatus}'!`);
      return;
    }

    if (newStatus) {
      setBills(
        orders.map((order) =>
          order.orderId === id ? { ...order, status: newStatus } : order
        )
      );
      setFilteredBills(
        filteredBills.map((order) =>
          order.orderId === id ? { ...order, status: newStatus } : order
        )
      );

      fetch(`http://localhost:8203/order/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: id,
          status: statusId,
          userId: localStorage.getItem("userId"),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Cập nhật trạng thái thất bại");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Cập nhật thành công:", data);
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          alert("Cập nhật trạng thái không thành công!");
        });
    }
  };

  return (
    <div className="bg-light">
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập mã hóa đơn hoặc tên khách hàng"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">Tất cả trạng thái</option>
                      {statuses.map((status) => (
                        <option key={status.id} value={status.name}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="col-12 text-end">
                    <button className="btn btn-primary me-2" onClick={handleSearch}>
                      <i className="bi bi-search me-2"></i>Tìm kiếm
                    </button>
                    <button className="btn btn-secondary" onClick={handleFilterByDate}>
                      <i className="bi bi-calendar me-2"></i>Lọc theo ngày
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã hóa đơn</th>
                        <th>Tên khách hàng</th>
                        <th>Ngày đặt hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBills.map((bill) => (
                        <tr key={bill.id}>
                          <td>{bill.id}</td>
                          <td>{bill.customerName}</td>
                          <td>{bill.orderDate}</td>
                          <td>{formatCurrency(bill.total)}</td>
                          <td>
                            <span
                              className={`badge bg-${bill.status === "Chuẩn bị"
                                  ? "primary"
                                  : bill.status === "Đang giao"
                                    ? "warning"
                                    : bill.status === "Đã giao"
                                      ? "success"
                                      : "danger"
                                }`}
                            >
                              {bill.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group">
                              {statuses.map((status) => (
                                <button
                                  key={status.id}
                                  className={`btn btn-sm btn-outline-primary ${bill.status === status.name ? "active" : ""
                                    }`}
                                  onClick={() => handleChangeStatus(bill.orderId, status.id)}
                                >
                                  {status.name}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;

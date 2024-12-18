import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const userId = JSON.parse(localStorage.getItem('user'))?.id; // Retrieve user ID from localStorage

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8203/user/${userId}`)
        .then(response => {
          setUserInfo(response.data);
          setUpdatedData(response.data); // Initialize updatedData with current user data
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    } else {
      console.error('User not logged in or user ID not found.');
    }
  }, [userId]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
    console.log('Updated data:', updatedData); // Kiểm tra dữ liệu cập nhật
  };
  

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('http://localhost:8203/user/update', updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setUserInfo(updatedData); // Update the user info state with new data
        setEditMode(false);
        alert('Thông tin đã được cập nhật thành công.');
      } else {
        alert('Cập nhật thông tin không thành công. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h2 className="mb-4">Account Information</h2>
              {userInfo ? (
                <div className="account-info">
                  {editMode ? (
                    <form onSubmit={handleUpdateSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Tên đăng nhập</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={updatedData.username}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={updatedData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Birthday</label>
                        <input
                          type="date"
                          className="form-control"
                          name="birthday"
                          value={updatedData.birthday}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phoneNumber"
                          value={updatedData.phoneNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={updatedData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={updatedData.address}
                          onChange={handleChange}
                        />
                      </div>
                      <button type="submit" className="btn btn-success w-100">Cập nhật thông tin</button>
                    </form>
                  ) : (
                    <div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Tên đăng nhập</label>
                        <div className="data-display p-2 bg-light rounded">{userInfo.username}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <div className="data-display p-2 bg-light rounded">{userInfo.name}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Birthday</label>
                        <div className="data-display p-2 bg-light rounded">{userInfo.birthday}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Phone Number</label>
                        <div className="data-display p-2 bg-light rounded">{userInfo.phoneNumber}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <div className="data-display p-2 bg-light rounded">{userInfo.email}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Address</label>
                        <div className="data-display p-2 bg-light rounded">{userInfo.address}</div>
                      </div>
                      <button className="btn btn-warning w-100" onClick={handleEditClick}>Chỉnh sửa thông tin</button>
                    </div>
                  )}
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;

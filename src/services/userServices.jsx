

import axios from "./axiosCustomer";

// Lấy danh sách người dùng
const fetchAllUsers = (page = 0, size = 20) => {
  return axios.get(`/user/?page=${page}&size=${size}`);
};

// Tạo người dùng mới
const postCreateUser = (id,username, password, name, birthday, address, email, phoneNumber,roleId) => {
  return axios.post('/user/create', {
    id,
    username,
    password,
    name,
    birthday,
    address,
    email,
    phoneNumber,
    roleId
  });
};

// Cập nhật thông tin người dùng
const postEditUser = (id, username, password, name, birthday, address, email, phoneNumber,roleId) => {
  return axios.put(`/user/update`, {
    id,
    username,
    password,
    name,
    birthday,
    address,
    email,
    phoneNumber,
    roleId
  });
};

// Xóa người dùng
const deleteUser = (userId) => {
  // Chuyển userId thành số nếu cần
  const id = Number(userId);

  if (isNaN(id)) {
    throw new Error("Invalid user ID");
  }

  // Gửi request với userId trong URL
  return axios.delete(`/user/delete/${id}`);
};

export { fetchAllUsers, postCreateUser, postEditUser, deleteUser };

import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { fetchAllUsers, postCreateUser, postEditUser, deleteUser } from "../../services/userServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ManageUser() {
  const [ListUsers, setListUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    password:'',
    name: '',
    birthday: '',
    address: '',
    email: '',
    phoneNumber: '',
    roleId: '' // Thêm roleId vào formData
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchAllUsers();
      setListUsers(data);
    };
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error('Vui lòng cung cấp thông tin bắt buộc.');
      return;
    }

    // Gán roleId mặc định là 2 nếu đang tạo người dùng mới
    if (!editingUser) {
      formData.roleId = 2; // Gán roleId mặc định là 2
    }

    try {
      if (editingUser) {
        await postEditUser(editingUser, formData.username, formData.password, formData.name, formData.birthday, formData.address, formData.email, formData.phoneNumber, formData.roleId);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        await postCreateUser(formData.id, formData.username, formData.password, formData.name, formData.birthday, formData.address, formData.email, formData.phoneNumber, formData.roleId);
        toast.success('Thêm người dùng thành công!');
      }

      if (!editingUser) {
        setFormData({ id: '', username: '', password: '', name: '', birthday: '', address: '', email: '', phoneNumber: '', roleId: '' });
      }
      setEditingUser(null);

      const data = await fetchAllUsers();
      setListUsers(data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      toast.error(errorMessage);
    }
  };


  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name,
      birthday: user.birthday,
      address: user.address,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roleId: user.roleId
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success('Xóa người dùng thành công!');
      const data = await fetchAllUsers();
      setListUsers(data);
    } catch (error) {const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      toast.error(errorMessage);
    }
  };

  // Filter users based on search term
  const filteredUsers = ListUsers.filter(user =>
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );


  return (
    <div className="container mt-5">
      <h1 className="text-center">Quản lý người dùng</h1>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm người dùng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-row">
          <div className="form-group col-md-6">
            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} placeholder="Tên người dùng" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Tên đầy đủ" />
          </div>
          <div className="form-group col-md-6">
            <input type="date" className="form-control" name="birthday" value={formData.birthday} onChange={handleChange} placeholder="Ngày sinh" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ" />
          </div>
          <div className="form-group col-md-6">
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" />
          </div>
        </div>
        <div className="justify-content-between mb-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={editingUser}
          >
            Thêm 
          </button>
          {editingUser && (
            <button
              type="button"
              className="btn btn-success"
              onClick={async () => {
                await handleSubmit(new Event('submit'));
                setEditingUser(null);
              }} >
              Cập nhật
            </button>
          )}
        </div>
      </form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Tên đầy đủ</th>
            <th>Ngày sinh</th>
            <th>Địa chỉ</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Chưa có'}</td>
                  <td>{user.address}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button className="btn btn-warning mr-2" onClick={() => handleEdit(user)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger mr-2" onClick={() => handleDelete(user.id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
            ))
          ) : (
              <tr>
                <td colSpan="10" className="text-center">Không có dữ liệu để hiển thị.</td>
              </tr>
          )}
        </tbody>
      </Table>

      <ToastContainer/>
    </div>
  );
}

export default ManageUser;
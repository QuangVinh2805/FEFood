import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ManageCategory() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    categoryName: '',
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8203/category/all');
        setCategories(response.data);
      } catch (error) {
        toast.error('Không thể tải danh mục!');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryName) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      if (editingCategory) {
        await axios.put(`http://localhost:8203/category/update`, formData);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await axios.post('http://localhost:8203/category/create', formData);
        toast.success('Thêm danh mục thành công!');
      }

      // Tải lại danh sách danh mục
      const response = await axios.get('http://localhost:8203/category/all');
      setCategories(response.data);

      // Reset form
      setFormData({ id: '', categoryName: '' });
      setEditingCategory(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category.id);
    setFormData({
      id: category.id,
      categoryName: category.categoryName
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8203/category/delete/${id}`);
      toast.success('Xóa danh mục thành công!');
      // Tải lại danh sách danh mục
      const response = await axios.get('http://localhost:8203/category/all');
      setCategories(response.data);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa danh mục!');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center">Quản lý danh mục</h1>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm danh mục"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-row">
          <div className="form-group col-md-6">
            <input
              type="text"
              className="form-control"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              placeholder="Tên danh mục"
              required
            />
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            {editingCategory ? 'Cập nhật' : 'Thêm'}
          </button>
          {editingCategory && (
            <button
              type="button"
              className="btn btn-secondary ml-3"
              onClick={() => {
                setEditingCategory(null);
                setFormData({ id: '', categoryName: '' });
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.categoryName}</td>
                <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td>{new Date(category.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleEdit(category)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(category.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có dữ liệu để hiển thị.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <ToastContainer />
    </div>
  );
}

export default ManageCategory;

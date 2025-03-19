import React, { useEffect, useState } from 'react';
import { fetchAllProducts, postCreateProduct, postEditProduct, deleteProduct } from '../../services/productServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    categoryId: '',
    productName: '',
    quantity: '',
    price: '',
    image: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchAllProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      const imageFile = files[0];
      setFormData({ ...formData, [name]: URL.createObjectURL(imageFile) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Vui lòng tải lên ảnh từ máy tính.');
      return;
    }


    try {
      if (editingProduct) {
        await postEditProduct(editingProduct.product.id, formData.categoryId, formData.productName, formData.quantity, formData.price, formData.image);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await postCreateProduct(formData.id, formData.categoryId, formData.productName, formData.quantity, formData.price, formData.image);
        toast.success('Thêm sản phẩm thành công!');
      }

      if (!editingProduct) {
        setFormData({ id: '', categoryId: '', productName: '', quantity: '', price: '', image: '' });
      }
      setEditingProduct(null);

      const data = await fetchAllProducts();
      setProducts(data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      categoryId: product.category.id,
      productName: product.product.productName,
      quantity: product.quantity,
      price: product.price,
      image: product.product.image
    });
  };

  const handleDelete = async (id, status) => {
    try {
      await deleteProduct(id);
      if (status === 0) {
        toast.success('Hiển thị sản phẩm thành công!');
      } else {
        toast.success('Ẩn sản phẩm thành công!');
      }
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      toast.error(errorMessage);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.categoryName === selectedCategory;
    const matchesPriceRange =
      (!minPrice || product.price >= parseFloat(minPrice)) &&
      (!maxPrice || product.price <= parseFloat(maxPrice));
    return matchesSearchTerm && matchesCategory && matchesPriceRange;
  });

  return (
    <div className="container mt-5">
      <h1 className="text-center">Quản lý sản phẩm</h1>

      <div className="row">
        {/* Phần thêm sản phẩm */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="form-row">
              <div className="form-group col-md-6">
                <input type="number" className="form-control" name="categoryId" value={formData.categoryId} onChange={handleChange} placeholder="ID danh mục" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <input type="text" className="form-control" name="productName" value={formData.productName} onChange={handleChange} placeholder="Tên sản phẩm" required />
              </div>
              <div className="form-group col-md-6">
                <input type="number" className="form-control" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Số lượng" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} placeholder="Giá sản phẩm" required />
              </div>
              <div className="form-group col-md-6">
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
                {formData.previewImage && (
                  <img
                    src={formData.previewImage}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                  />
                )}
              </div>
            </div>
            <div className="justify-content-between mb-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={editingProduct}
              >
                Thêm sản phẩm
              </button>
              {editingProduct && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={async () => {
                    await handleSubmit(new Event('submit'));
                    setEditingProduct(null);
                  }}
                >
                  Cập nhật sản phẩm
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Phần tìm kiếm và lọc */}
        <div className="col-md-6">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {products
                .map((p) => p.category.categoryName)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((categoryName, index) => (
                  <option key={index} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
            </select>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                placeholder="Giá tối thiểu"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                placeholder="Giá tối đa"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Danh Mục</th>
            <th>Tên Sản Phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Hình Ảnh</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((productItem) => (
            <tr key={productItem.id}>
              <td>{productItem.id}</td>
              <td>{productItem.category.categoryName}</td>
              <td>{productItem.product.productName}</td>
              <td>{productItem.quantity}</td>
              <td>{formatPrice(productItem.price)}</td>
              <td>
                <img
                  src={productItem.product.image}
                  alt={productItem.product.productName}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>
                <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleEdit(productItem)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                {productItem.status === 0 ? (
                    <button
                        className="btn btn-success mr-2"
                        onClick={() => handleDelete(productItem.product.id, productItem.status)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                ) : (
                    <button
                        className="btn btn-danger mr-2"
                        onClick={() => handleDelete(productItem.product.id, productItem.status)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default ProductManagement;
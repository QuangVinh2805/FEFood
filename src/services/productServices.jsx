
import axios from "./axiosCustomer";

// Lấy danh sách sản phẩm
const fetchAllProducts = (page = 0, size = 0) => {
    return axios.get(`/product/alldetail?page=${page}&size=${size}`);
};


// Tạo sản phẩm mới
const postCreateProduct = (id, categoryId, productName, price,quantity, image) => {
    return axios.post('/product/create', { id, categoryId, productName,quantity, price, image });
};

// Cập nhật thông tin sản phẩm
const postEditProduct = (id, categoryId, productName, quantity,price) => {
    return axios.put('/product/update', { id, categoryId, productName,quantity, price });
};

// Xóa sản phẩm
const deleteProduct = (productId) => {
    // Chuyển productId thành số nếu cần
    const id = Number(productId);

    // Gửi request với productId trong URL
    return axios.delete(`/product/delete/${id}`);
};

export { fetchAllProducts, postCreateProduct, postEditProduct, deleteProduct };


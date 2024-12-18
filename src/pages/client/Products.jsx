import React, {useEffect, useState} from 'react';
import {FaSearch, FaStar} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterCategory, setFilterCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };
    

    const fetchProducts = async (page = 1, size = 8) => {
        try {
            const response = await fetch(`http://localhost:8203/product/alldetail?page=${page - 1}&size=${size}&status=1`);
            const responseCount = await fetch(`http://localhost:8203/product/count`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            const count = await responseCount.json();

            setProducts(data);
            setTotalPages(Math.ceil(count / size));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    useEffect(() => {
        fetchProducts(currentPage);
        setLoading(false);
    }, [currentPage]);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);
    const handleCategoryChange = (e) => setFilterCategory(e.target.value);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.get(`http://localhost:8203/product/find/${searchTerm}`);
    //         setProducts(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const filteredProducts = products
        .filter((data) =>
            data.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterCategory === 'all' || data.category.categoryName === filterCategory)
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.product.productName.localeCompare(b.product.productName);
            } else if (sortBy === 'price') {
                return a.price - b.price;
            } else {
                return b.product && a.product ? b.product.rate - a.product.rate : 0;
            }
        });
    return (
        <div className="container py-4">
            <h2 className="text-center mb-4" style={{color: '#AD343E'}}>
                Danh sách đồ ăn đang bán ở VAFOOD
            </h2>

            <div className="row mb-4">
                {/* Search, Sort, and Filter */}
                <div className="col-md-8 mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm đồ ăn..."
                            value={searchTerm}
                            onChange={handleSearch}
                            aria-label="Search products"
                        />
                        <button className="btn btn-danger" aria-label="Search">
                            <FaSearch/>
                        </button>
                    </div>
                </div>
                <div className="col-md-2 mb-3">
                    <select className="form-select" onChange={handleSortChange} value={sortBy} aria-label="Sort by">
                        <option value="name">Tìm theo tên</option>
                        <option value="price">Sắp xếp theo giá</option>
                    </select>
                </div>
                <div className="col-md-2 mb-3">
                    <select
                        className="form-select"
                        onChange={handleCategoryChange}
                        value={filterCategory}
                        aria-label="Filter by category"
                    >
                        <option value="all">Tất cả</option>
                        <option value="chicken">Chicken</option>
                        <option value="drink">Drink</option>
                        <option value="pizza">Pizza</option>
                        <option value="potato">Potato</option>
                        <option value="salad">Salad</option>
                        <option value="spaghetti">Spaghetti</option>
                    </select>
                </div>
            </div>

            <div className="row">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div className="card h-100 shadow">
                            <Link to={`/product/${product.product.id}`}>
                                <img
                                    src={product.product.image}
                                    alt={product.product.productName}
                                    className="card-img-top"
                                    style={{height: '200px', objectFit: 'cover'}}
                                />
                            </Link>
                            <div className="card-body">
                                <Link
                                    to={`/product/${product.product.id}`}
                                    style={{color: 'inherit', textDecoration: 'none'}}
                                >
                                    <h5 className="card-title" title={product.product.productName}>
                                        {product.product.productName}
                                    </h5>
                                </Link>
                                <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">{formatPrice(product.price)}</span>
                                    <div className="d-flex align-items-center">
                                        <FaStar className="text-warning me-1"/>
                                        <span>
                                                {product.product && product.product.rate
                                                    ? product.product.rate : 'N/A'}
                                            </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <button
                    className="btn btn-outline-secondary me-2"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="align-self-center mx-3">
                        Page {currentPage} of {totalPages}
                    </span>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Products;
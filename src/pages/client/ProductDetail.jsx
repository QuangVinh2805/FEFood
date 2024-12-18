import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FaStar} from 'react-icons/fa';

const ProductDetail = ({addToCart}) => {
    const {productId} = useParams();
    const navigate = useNavigate();
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [quantity, setQuantity] = useState(1);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };
    

    const handleAddCart = async (event) => {
        console.log("handleAddCart")
        const userId = localStorage.getItem('userId'); // Lấy trực tiếp từ localStorage
        console.log("userId: " + userId)
        if (userId == null) {
            localStorage.setItem("redirectAfterLogin", window.location.pathname);
            navigate('/login');
            return;
        }
        setQuantity(1);
        try {
            const response = await fetch('http://localhost:8203/cart/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({productId, quantity, userId}),
            });
            const data = await response.json();
            if (response.status === 200) {
                alert('Sản phẩm đã được thêm vào giỏ hàng!')
            } else {
                setError("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
        } catch (error) {
            setError("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    }

    useEffect(() => {
        if (!productId || isNaN(Number(productId))) {
            setError('Product ID không hợp lệ.');
            setLoading(false);
            return;
        }

        const fetchProductDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8203/product/${productId}`);
                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin sản phẩm.');
                }
                const data = await response.json();

                // Kiểm tra nếu API phản hồi rỗng hoặc không hợp lệ
                if (!data || data.length === 0 || !data[0].product) {
                    throw new Error('Không tìm thấy sản phẩm.');
                }

                setProductDetail(data[0]); // Lấy đối tượng đầu tiên trong mảng
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [productId]);

    if (loading) {
        return <div className="text-center">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    if (!productDetail) { return <div className="text-center">Không tìm thấy sản phẩm</div>;
    }

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4" style={{color: '#AD343E'}}>
                Chi tiết sản phẩm
            </h2>
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={productDetail.product.image}
                        alt={productDetail.product.productName}
                        className="img-fluid"
                        style={{objectFit: 'cover', height: '400px'}}
                    />
                </div>
                <div className="col-md-6">
                    <h3>{productDetail.product.productName}</h3>
                    <p className="fw-bold">{formatPrice(productDetail.price)}</p>
                    <div className="d-flex align-items-center mb-3">
                        <FaStar className="text-warning me-1"/>
                        <span>
                            {productDetail?.product?.rate ?? ''}
                        </span>
                    </div>
                    <p>
                        <strong>Danh mục:</strong>{' '}
                        {productDetail.category?.categoryName || 'Không có danh mục'}
                    </p>
                    <p>
                        <strong>Mô tả:</strong>{' '}
                        {productDetail.description || 'Chưa có mô tả'}
                    </p>
                    <div className="quantity-control mt-3">
                        <strong>Số lượng:</strong>{' '}
                        <button
                            className="btn btn-secondary btn-sm me-2"
                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} // Đảm bảo không giảm dưới 1
                        >
                            -
                        </button>
                        <span className="fw-bold">{quantity}</span>
                        <button
                            className="btn btn-secondary btn-sm ms-2"
                            onClick={() => setQuantity((prev) => prev + 1)}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => {
                            handleAddCart();
                        }}
                    >
                        Thêm vào giỏ hàng
                    </button>
                    <button
                        className="btn btn-secondary mt-3 ms-3"
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
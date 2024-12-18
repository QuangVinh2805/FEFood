import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; 
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const bannerSettings = {
    dots: true,
    infinite: true, 
    speed: 500, 
    slidesToShow: 1,
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 2000, 
    pauseOnHover: true, 
  };

  const productSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://localhost:8203/banner/all');
        const data = await response.json();
        setBanners(data); 
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu banner:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8203/product/hot');
        const data = await response.json();

        const detailedProducts = await Promise.all(
          data.map(async (product) => {
            const productDetailsResponse = await fetch(`http://localhost:8203/product/${product.id}`);
            const productDetails = await productDetailsResponse.json();
            return { ...product, details: productDetails }; 
          })
        );

        setProducts(detailedProducts); 
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      }
    };

    fetchBanners();
    fetchProducts();
  }, []);

  const navigateToProductDetail = (product) => {
    navigate(`/product/${product.id}`);
  };

  // Hàm định dạng giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div>
      <section className="slider">
        <Slider {...bannerSettings}>
          {banners.map((banner) => (
            <div key={banner.id} className="slide-item d-flex align-items-center">
              <img className="slide-img" src={banner.image} alt={`Banner ${banner.id}`} />
            </div>
          ))}
        </Slider>
      </section>

      <section className="product-slider">
        <h2>Sản phẩm nổi bật</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Slider {...productSettings}>
            {products.map((product) => (
              product.isHot === 1 && (
                <div key={product.id} className="product-card" onClick={() => navigateToProductDetail(product)}>
                  <img className="product-image" src={product.product.image} alt={product.product.productName} />
                  <h3 className="product-name">{product.product.productName}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">{formatPrice(product.price)}</p> {/* Định dạng giá */}
                </div>
              )
            ))}
          </Slider>
        )}
      </section>
    </div>
  );
}

export default Home;

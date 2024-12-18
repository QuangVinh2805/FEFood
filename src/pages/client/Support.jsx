import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

function Support() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    phone: '',
    content: ''
  });

  const [formStatus, setFormStatus] = useState({
    success: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage

      const response = await axios.post('http://localhost:5001/api/support', formData, {
        headers: {
          'Authorization': `Bearer ${token}` // Gửi token trong header
        }
      });

      if (response.status === 201) {
        setFormStatus({
          success: true,
          error: false,
          message: 'Form đã gửi thành công!'
        });
      }
    } catch (error) {
      setFormStatus({
        success: false,
        error: true,
        message: 'Có lỗi xảy ra. Vui lòng thử lại!'
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="mb-4">Liên hệ với chúng tôi</h2>

      {formStatus.success && <Alert variant="success">{formStatus.message}</Alert>}
      {formStatus.error && <Alert variant="danger">{formStatus.message}</Alert>}

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Email..."
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridName">
          <Form.Label>Họ và tên</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Họ và tên..."
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Địa chỉ</Form.Label>
        <Form.Control
          type="text"
          name="address"
          placeholder="Địa chỉ..."
          value={formData.address}
          onChange={handleChange}
        />
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridPhone">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            placeholder="Phone..."
            value={formData.phone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridContent">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            rows={4}
            placeholder="Nội dung..."
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      <Button variant="primary" type="submit">
        Gửi đi
      </Button>
    </Form>
  );
}

export default Support;

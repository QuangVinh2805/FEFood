import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { postEditUser } from "../../services/userServices";
import { toast } from 'react-toastify';

const ModalEditUser = (props) => {
    const { show, handleClose, dataUserEdit } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');

    useEffect(() => {
        if (dataUserEdit) {
            setUsername(dataUserEdit.username);
            setPassword(dataUserEdit.password);
            setRole(dataUserEdit.role);
        }
    }, [dataUserEdit]);

    const handleEditUser = async () => {
        if (!username || !password || !role) {
            toast.error("Các trường không được để trống!");
            return;
        }
        const usernameRegex = /^[a-zA-Z0-9]+$/; // Chỉ cho phép chữ cái và số
        if (!usernameRegex.test(username)) {
            toast.error("Username không được chứa dấu cách hoặc ký tự đặc biệt.");
            return;
        }

        if (!usernameRegex.test(password)) {
            toast.error("password không được chứa dấu cách hoặc ký tự đặc biệt.");
            return;
        }

        try {
            await postEditUser(dataUserEdit._id, username, password, role);
            toast.success("Cập nhật người dùng thành công!");
            handleClose(); // Đóng modal
        } catch (error) {
            toast.error("Cập nhật người dùng thất bại!");
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <form>
                        <div className="form-group">
                            <label>User Name</label>
                            <input type="text" className="form-control" value={username} onChange={(event) => setUsername(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <input type="text" className="form-control" value={role} onChange={(event) => setRole(event.target.value)} />
                        </div>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleEditUser}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export { ModalEditUser };

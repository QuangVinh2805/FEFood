import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {postCreateUser} from "../../services/userServices"
import {toast} from 'react-toastify';

const ModalAddNew=(props)=> {
    const {show, handleClose}= props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');


    const handleSaveUser = async () => {
      if (!username || !password || !role) {
          toast.error('Vui lòng điền tất cả các trường');
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
          let res = await postCreateUser(username, password, role);
          handleClose();
          setUsername('');
          setPassword('');
          setRole('user'); // Đặt lại vai trò về mặc định
          toast.success('Thêm mới user thành công!');
      } catch (error) {
          // Kiểm tra nếu có phản hồi từ server
          if (error.response) {
              const errorMessage = error.response.data.message || 'Lỗi thêm mới user';
              if (errorMessage === 'Username already exists') {
                  toast.error("Tên người dùng đã tồn tại");
              } else {
                  toast.error(errorMessage);
              }
          } else {
              toast.error("Lỗi kết nối tới server");
          }
      }
  };
  
  
    return(
        <>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Them moi User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="body-add-new">
                <form>
                    <div className="form-group">
                        <label for="form-lable">User Name</label>
                         <input type="text"
                          className="form-control"
                           value={username}
                           onChange={(event)=>setUsername(event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label for="form-lable">Password</label>
                        <input type="text"
                         className="form-control"
                         value={password}
                         onChange={(event)=>setPassword(event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label for="form-lable">Role</label>
                        <input type="text"
                         className="form-control"
                         value={role}
                         onChange={(event)=>setRole(event.target.value)}/>
                    </div>
                </form>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=> handleSaveUser()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}

export {ModalAddNew};
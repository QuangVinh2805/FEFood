import { Modal, Button } from "react-bootstrap";

const ModalComfirmUser = (props) => {
    const { show, handleClose, dataUserDelete, comfirmDelete  } = props;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Xóa User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-delete-user">
                    <h5>Bạn có chắc muốn xóa user với username là {dataUserDelete.username}?</h5>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={comfirmDelete }>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export { ModalComfirmUser };

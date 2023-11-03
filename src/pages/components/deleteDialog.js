import React from 'react'
import { Button, Modal } from 'react-bootstrap'

const DeleteDialog = ({ deleteBox, handleClose, deleteAgent }) => {
    return (
        <Modal show={deleteBox} onHide={handleClose} className='agent-modal'>
            <Modal.Header className='d-flex justify-content-center' closeButton>
                <Modal.Title>Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete?</Modal.Body>
            <Modal.Footer>
                <Button style={{background:"red",border:"none"}} onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={deleteAgent}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default DeleteDialog
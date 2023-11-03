import React from 'react';
import { Modal } from 'react-bootstrap';

const RejectReason = ({ handleClose, open, data }) => {
    return (
        <Modal show={open} onHide={handleClose} centered size='lg'>
            <Modal.Header className="d-flex justify-content-center" closeButton>
                <Modal.Title>Rejected Reason</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='w-100 d-flex justify-content-center align-items-center'>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: data,
                        }}
                    ></p>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default RejectReason
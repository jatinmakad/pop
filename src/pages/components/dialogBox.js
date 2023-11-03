import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const DialogBox = ({ open, handleClose, title, heading,onSubmit }) => {
  const { t } = useTranslation();
  return (
    <Modal show={open} onHide={handleClose} className="agent-modal">
      <Modal.Header className="d-flex justify-content-center" closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{title}</Modal.Body>
      <Modal.Footer>
        <Button
          style={{ background: "red", border: "none" }}
          onClick={handleClose}
        >
          {t("NO")}
        </Button>
        <Button variant="primary" onClick={() => onSubmit(false)}>{t("YES")}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DialogBox;

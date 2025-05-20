"use client"

import { Modal, Button, Alert } from "react-bootstrap"

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmButtonText,
  confirmButtonVariant,
  showWarning,
  warningMessage,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirmation"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message || "Êtes-vous sûr de vouloir effectuer cette action ?"}</p>
        {showWarning && <Alert variant="warning">{warningMessage || "Cette action est irréversible."}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant={confirmButtonVariant || "primary"} onClick={onConfirm}>
          {confirmButtonText || "Confirmer"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmationModal

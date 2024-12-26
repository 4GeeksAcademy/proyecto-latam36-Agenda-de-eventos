import React from "react";
import PropTypes from "prop-types";

const Modal = ({ title, children, onClose, onConfirm }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-wrapper position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
      <div 
        className="modal-backdrop fade show position-fixed top-0 start-0 w-100 h-100"
        onClick={handleBackdropClick}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      />
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        role="dialog"
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog" role="document" onClick={handleModalClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Modal;
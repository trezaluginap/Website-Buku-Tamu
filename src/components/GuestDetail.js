import React from "react";

const GuestDetailModal = ({ guest, onClose, getStatusBadge }) => {
  if (!guest) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-labelledby="modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="modal-title">Detail Tamu</h3>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="guest-details">
          <div className="detail-status">{getStatusBadge(guest)}</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Nama</div>
              <div className="detail-value">{guest.nama}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Email</div>
              <div className="detail-value">{guest.email}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">No HP</div>
              <div className="detail-value">{guest.no_hp}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Tanggal</div>
              <div className="detail-value">{guest.tanggal_kedatangan}</div>
            </div>
            {/* Tambahkan data lainnya sesuai kebutuhan */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailModal;

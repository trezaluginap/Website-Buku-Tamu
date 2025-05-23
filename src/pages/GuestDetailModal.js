// src/components/GuestDetailModal.js
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/GuestDetailModal.css";

const GuestDetailModal = ({
  guest,
  onClose,
  onStartProcessing,
  onMarkCompleted,
  onNavigateToEdit,
  onNavigateToFollowUp,
  getStatusBadge,
}) => {
  // Handle keyboard and click events
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        onClose();
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleEscKey);
    window.addEventListener("click", handleClickOutside);

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleEscKey);
      window.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Handle action buttons
  const handleStartProcessing = () => {
    onStartProcessing(guest.id);
  };

  const handleMarkCompleted = () => {
    onMarkCompleted(guest.id);
  };

  const handleEdit = () => {
    onNavigateToEdit(guest.id);
  };

  const handleFollowUp = () => {
    onNavigateToFollowUp(guest.id);
  };

  // Check if guest is unprocessed
  const isUnprocessed = !guest.status || guest.status === "Belum Diproses";
  const isProcessing = guest.status === "Diproses";

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 id="modal-title">Detail Tamu</h3>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="guest-details">
            {/* Status Badge */}
            <div className="detail-status">{getStatusBadge(guest)}</div>

            {/* Guest Information Grid */}
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Nama</div>
                <div className="detail-value">{guest.nama_lengkap || "-"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value">{guest.email || "-"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">No HP</div>
                <div className="detail-value">{guest.no_hp || "-"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Tanggal</div>
                <div className="detail-value">
                  {guest.tanggal_kehadiran || "-"}
                </div>
              </div>

              <div className="detail-item full-width">
                <div className="detail-label">Keperluan</div>
                <div className="detail-value">{guest.keperluan || "-"}</div>
              </div>

              <div className="detail-item full-width">
                <div className="detail-label">Alamat</div>
                <div className="detail-value">{guest.alamat || "-"}</div>
              </div>

              <div className="detail-item full-width">
                <div className="detail-label">Pekerjaan</div>
                <div className="detail-value">{guest.pekerjaan || "-"}</div>
              </div>

              {/* Conditional fields */}
              {guest.isi_pertemuan && (
                <div className="detail-item full-width">
                  <div className="detail-label">Hasil Pertemuan</div>
                  <div className="detail-value">{guest.isi_pertemuan}</div>
                </div>
              )}

              {guest.dokumentasi && (
                <div className="detail-item full-width">
                  <div className="detail-label">Dokumentasi</div>
                  <div className="detail-value image-container">
                    <img
                      src={guest.dokumentasi}
                      alt={`Dokumentasi untuk ${guest.nama_lengkap}`}
                      className="documentation-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div className="image-error" style={{ display: "none" }}>
                      Gambar tidak dapat dimuat
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-actions">
            {/* Close Button */}
            <button
              className="btn btn-secondary"
              onClick={onClose}
              type="button"
            >
              Tutup
            </button>

            {/* Edit Button */}
            <button
              className="btn btn-primary"
              onClick={handleEdit}
              type="button"
            >
              Edit
            </button>

            {/* Conditional Action Buttons */}
            {isUnprocessed && (
              <button
                className="btn btn-warning"
                onClick={handleStartProcessing}
                type="button"
              >
                Mulai Proses
              </button>
            )}

            {isProcessing && (
              <>
                <button
                  className="btn btn-info"
                  onClick={handleFollowUp}
                  type="button"
                >
                  Tindak Lanjut
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleMarkCompleted}
                  type="button"
                >
                  Tandai Selesai
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
GuestDetailModal.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nama_lengkap: PropTypes.string,
    email: PropTypes.string,
    no_hp: PropTypes.string,
    tanggal_kehadiran: PropTypes.string,
    keperluan: PropTypes.string,
    alamat: PropTypes.string,
    pekerjaan: PropTypes.string,
    status: PropTypes.string,
    isi_pertemuan: PropTypes.string,
    dokumentasi: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onStartProcessing: PropTypes.func.isRequired,
  onMarkCompleted: PropTypes.func.isRequired,
  onNavigateToEdit: PropTypes.func.isRequired,
  onNavigateToFollowUp: PropTypes.func.isRequired,
  getStatusBadge: PropTypes.func.isRequired,
};

export default GuestDetailModal;

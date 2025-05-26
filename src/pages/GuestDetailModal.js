// src/pages/GuestDetailModal.js // (Sebelumnya Anda menyebut src/components/, pastikan path konsisten)
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/GuestDetailModal.css"; // Pastikan path CSS ini ada dan benar

const GuestDetailModal = ({
  guest,
  onClose,
  // onStartProcessing, // Tidak digunakan di JSX Anda, tapi bisa dibiarkan jika untuk masa depan
  // onMarkCompleted,  // Tidak digunakan di JSX Anda, tapi bisa dibiarkan jika untuk masa depan
  onNavigateToEdit,
  onNavigateToFollowUp,
  getStatusBadge, // Ini akan diterima dari AdminDashboard
}) => {
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
    window.addEventListener("keydown", handleEscKey);
    window.addEventListener("click", handleClickOutside);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscKey);
      window.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!guest) return null; // Pastikan ada pengecekan jika guest null

  const handleEdit = () => onNavigateToEdit(guest.id);
  const handleFollowUp = () => onNavigateToFollowUp(guest.id);

  const renderDocumentation = () => {
    if (!guest.dokumentasi) return null;
    return (
      <div className="detail-item full-width">
        <div className="detail-label">Dokumentasi</div>
        <div className="detail-value image-container">
          <img
            src={guest.dokumentasi}
            alt={`Dokumentasi untuk ${guest.nama_lengkap}`}
            className="documentation-image"
            onError={(e) => {
              e.target.style.display = "none";
              // Pastikan elemen berikutnya ada sebelum mengakses style
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = "block";
              }
            }}
          />
          <div className="image-error" style={{ display: "none" }}>
            Gambar tidak dapat dimuat
          </div>
        </div>
      </div>
    );
  };

  const renderMeetingResult = () => {
    if (!guest.isi_pertemuan) return null;
    return (
      <div className="detail-item full-width">
        <div className="detail-label">Hasil Pertemuan</div>
        <div className="detail-value">{guest.isi_pertemuan}</div>
      </div>
    );
  };

  const renderActionButtons = () => (
    <>
      <button className="btn btn-primary" onClick={handleEdit} type="button">
        Edit Data
      </button>
      <button className="btn btn-info" onClick={handleFollowUp} type="button">
        Tindak Lanjut
      </button>
      {/* Tombol Aksi Selesai/Proses bisa ditambahkan di sini jika diperlukan di modal */}
      {/* {(!guest.status || guest.status === "Belum Diproses") && (
          <button onClick={() => onStartProcessing(guest.id)} className="btn btn-success">Mulai Proses</button>
      )}
      {guest.status === "Diproses" && (
          <button onClick={() => onMarkCompleted(guest.id)} className="btn btn-warning">Tandai Selesai</button>
      )} */}
      <button className="btn btn-secondary" onClick={onClose} type="button">
        Tutup
      </button>
    </>
  );

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title-text">
            Detail Tamu
          </h3>{" "}
          {/* Tambahkan kelas untuk styling jika perlu */}
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            &times; {/* Karakter HTML untuk tanda silang */}
          </button>
        </div>
        <div className="modal-body">
          <div className="guest-details">
            {/* Status Badge - Memanggil fungsi dari prop */}
            {typeof getStatusBadge === "function" ? (
              <div className="detail-status">{getStatusBadge(guest)}</div>
            ) : (
              <div className="detail-status">
                <span className="status-badge status-pending">
                  {guest.status || "Belum Diproses"}
                </span>
              </div>
            )}
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
                  {guest.tanggal_kehadiran
                    ? formatDate(guest.tanggal_kehadiran)
                    : "-"}
                </div>
              </div>{" "}
              {/* Panggil formatDate jika ada */}
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
              {renderMeetingResult()}
              {renderDocumentation()}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="modal-actions">{renderActionButtons()}</div>
        </div>
      </div>
    </div>
  );
};

// Fungsi formatDate sederhana jika tidak ingin impor dari AdminDashboard
// Sebaiknya ini diutilitas terpisah atau dikirim sebagai prop juga jika formatnya kompleks
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return "Tanggal Tidak Valid";
  }
};

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
  onNavigateToEdit: PropTypes.func.isRequired,
  onNavigateToFollowUp: PropTypes.func.isRequired,
  getStatusBadge: PropTypes.func.isRequired, // Ini sudah ada di propTypes Anda
  // Tambahkan onStartProcessing dan onMarkCompleted ke propTypes jika akan digunakan di modal
  onStartProcessing: PropTypes.func,
  onMarkCompleted: PropTypes.func,
};

export default GuestDetailModal;

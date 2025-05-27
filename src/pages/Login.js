import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Tamu from "../assets/Tamu2.png";  
import BPSLogo from "../assets/BPS.png";
// Change the import to use the named export
import { QRCodeSVG } from "qrcode.react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("page-loaded");

    return () => {
      document.body.classList.remove("page-loaded");
    };
  }, []);

  return (
    <div className="login-container">
      {/* Left: Illustration */}
      <div className="login-image">
        <div className="login-image-overlay">
          <img src={Tamu} alt="Login Illustration" />
          <div className="login-image-text">
            <h2>BUKU TAMU</h2>
            <h2>Sistem Informasi Tamu Badan Pusat Statistik</h2>
            <p>
              Platform digital untuk memudahkan pendataan dan pelayanan tamu di
              Badan Pusat Statistik
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login Box */}
      <div className="login-form">
        <div className="login-logo">
          <img src={BPSLogo} alt="BPS Logo" />
        </div>
        <h1>Selamat Datang</h1>
        <p className="subtext">Silakan pilih metode masuk ke sistem</p>

        <div className="button-group">
          <button className="btn-guest" onClick={() => navigate("/tamu")}>
            <span className="icon">👥</span>
            Masuk sebagai Tamu
          </button>
          <button
            className="btn-admin"
            onClick={() => navigate("/admin-login")}
          >
            <span className="icon">🔒</span>
            Masuk sebagai Admin
          </button>
        </div>

        {/* QR Code Section - UPDATE THIS PART */}
        <div className="qr-code-section">
          <p>Atau scan QR code untuk masuk:</p>
          <div className="qr-code-container">
            {/* Change QRCode to QRCodeSVG */}
            <QRCodeSVG
              value="https://your-application-url.com/tamu"
              size={150}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="wave-decoration">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>

        <div className="login-footer">
          <p>Badan Pusat Statistik © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

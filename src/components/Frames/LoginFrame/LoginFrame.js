import "./LoginFrame.css";
import loginLogo from "../../../images/nornikel_logo.png";

import passImage from "../../../images/24-val-1 (1) 1.svg";
import readerImage from "../../../images/Group 6.svg";
import { useState, useEffect } from "react";

import { Html5Qrcode } from "html5-qrcode";
import { useRef } from "react";

const LoginFrame = ({
  onLogin,
  QRButtonClick,
  onSelectLanguage,
  isMobile,
  isDeck,
}) => {
  const videoRef = useRef(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const [qrMessage, setQrMessage] = useState("not result");

  const QRButtonClick_ = () => {
    setIsEnabled(!isEnabled);
  };

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    //alert(JSON.stringify(devices[3]));
    //alert(JSON.stringify(devices));

    //const videoDevices = devices.filter(device => device.kind === 'videoinput');
    //alert(JSON.stringify(videoDevices));
  }

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } }; //размер блока для  сканирования
    const html5Qrcode = new Html5Qrcode("qrCodeContainer");

    const qrScannerStop = () => {
      if (html5Qrcode && html5Qrcode.isScanning) {
        html5Qrcode
          .stop()
          .then(() => {
            //console.log("scanner stop");
          })
          .catch(() => console.log("scanner error"));
      }
    };

    const qrCodeSuccess = (decodedText) => {
      setQrMessage(decodedText);
      setIsEnabled(false);
      var lang = decodedText;
      onSelectLanguage(decodedText);
    };

    if (isEnabled) {
      html5Qrcode.start({ facingMode: "environment" }, config, qrCodeSuccess);
      setQrMessage("");
    } else {
      qrScannerStop();
    }

    return () => {
      qrScannerStop();
    };
  }, [isEnabled]);

  useEffect(() => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      setQrMessage("Let's get this party started");
    } else {
      setQrMessage("It's not worked");
    }

    getDevices();
  }, []);

  return (
    // <div className= {`login  ${isVisible ? "login_is_visible" : ""}`}>
    <div className="login">
      <div className="login__content">
        <img className="login__logo" src={loginLogo} alt="логотип" />

        {isDeck && (
          <button className="login__button" type="button" onClick={onLogin}>
            приложите пропуск
          </button>
        )}

        {isMobile && (
          <button
            className="login__button"
            type="button"
            onClick={QRButtonClick_}
          >
            отсканируйте QR
          </button>
        )}

        {isDeck && (
          <div>
            <ul className="login__items">
              <li>
                <img src={passImage} className="login__item" alt="ридер" />
              </li>
              <li>
                <img
                  src={readerImage}
                  className="login__item login__item_pass"
                  alt="пропуск"
                />
              </li>
            </ul>
          </div>
        )}

        <div
          className={`login__pass-content  ${
            isMobile ? "login__pass-content_visible" : ""
          }`}
        >
          <div className="scanner">
            <div id="qrCodeContainer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFrame;

import "./QRReaderFrame.css";
import loginLogo from "../../../images/nornikel_logo.png";

// import passImage from "../../../images/24-val-1 (1) 1.svg";
// import readerImage from "../../../images/Group 6.svg";
import React, { useState, useEffect, Component } from "react";
import { useRef } from "react";

//import { QrReader, useQrReader } from "react-qr-reader";
import { Html5Qrcode } from "html5-qrcode";

function QRReaderFrame({ isVisible }) {
  const videoRef = useRef(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const [qrMessage, setQrMessage] = useState("not result");

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } }; //размер блока для  сканирования
    const html5Qrcode = new Html5Qrcode("qrCodeContainer");

    const qrScannerStop = () => {
      if (html5Qrcode && html5Qrcode.isScanning) {
        html5Qrcode
          .stop()
          .then(() => console.log("scanner stop"))
          .catch(() => console.log("scanner error"));
      }
    };

    const qrCodeSuccess = (decodedText) => {
      setQrMessage(decodedText);
      setIsEnabled(false);
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

  function QRButtonClick() {
    setIsEnabled(!isEnabled);

    // //поток видео
    // navigator.mediaDevices
    // .getUserMedia({ audio: false, video: true })
    // .then((stream) => {
    //   videoRef.current.srcObject = stream;
    //   videoRef.current.onloadedmetadata = () => videoRef.current.play();
    // });

    // alert("mediaDevices" in navigator);
    // //alert( 'getUserMedia' in navigator.mediaDevices);
  }

  useEffect(() => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      setQrMessage("Let's get this party started");
    } else {
      setQrMessage("It's not worked");
    }
  }, []);

  return (
    <div></div>
    // <div className={`qr  ${isVisible ? "qr_is_visible" : ""}`}>
    //   {/* <iframe
    //     src="https://172.31.131.24/QR"
    //     allow="camera; microphone"
    //   ></iframe> */}

    //   <div className="qr__content">
    //     <img className="qr__logo" src={loginLogo} alt="логотип" />
    //     <button className="qr__button" type="button" onClick={QRButtonClick}>
    //       отсканируйте QR
    //     </button>

    //     <div className="scanner">
    //       <div id="qrCodeContainer"></div>
    //       {/* <video className = 'video' playsInline muted autoPlay ref = {videoRef}></video> */}
    //     </div>

    //     <p>Результат: {qrMessage}</p>
    //   </div>
    // </div>
  );
}

export default QRReaderFrame;

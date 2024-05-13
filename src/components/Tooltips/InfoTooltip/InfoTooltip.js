import React from "react";
import "./InfoTooltip.css";

function InfoTooltip({ text, image, isOpen, onClose }) {
  return (
    <div className={`popup  ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__info">
        <button
          className="popup__btn-close"
          type="button"
          aria-label="Выйти из попапа"
          onClick={onClose}
        />
        <img className="popup__status" src={image} alt={text} />
        <h2 className="popup__message">{text}</h2>
        <button className="popup__btn-ok" onClick={onClose}>ок</button>
      </div>
    </div>
  );
}

export default InfoTooltip;

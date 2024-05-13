import "./Scale_Display.css";
import { useState } from "react";

function Scale_Display({
  weightValue,
  setTareClick,
  setZeroClick,
  setTareFlag,
  setZeroFlag,
  NetOn,
  GrossOn,
  onNetClick,
  onGrossClick,
}) {
  return (
    <div className="scale__display">
      <div className="scale__set-buttons">
        <button
          className={`scale__button scale__button_1 ${setTareFlag ? '' :"scale__button_disabled"}`}
          onClick={setTareClick}
          disabled={!setTareFlag}
        >
          &rarr;T&larr;
        </button>
        <button
           className={`scale__button scale__button_1 ${setZeroFlag ? '' :"scale__button_disabled"}`}
          onClick={setZeroClick}
          disabled={setZeroFlag}
        >
          &rarr;0&larr;
        </button>
      </div>

      <div className="scale__values">
        <div className="scale__item scale__item_value">{weightValue}</div>
        <div className="scale__item scale__item_unit">KG</div>
      </div>

      <div className="scale__set-buttons">
        <button
          className={`scale__button ${NetOn ? "scale__button_enabled" : ""}`}
          onClick={onNetClick}
          value="net"
        >
          нетто
        </button>
        <button
          className={`scale__button ${GrossOn ? "scale__button_enabled" : ""}`}
          onClick={onGrossClick}
          value="gross"
        >
          {" "}
          брутто{" "}
        </button>
        <button
          className="scale__button scale__button_disabled"
          disabled={true}
        >
          тара
        </button>
      </div>
    </div>
  );
}

export default Scale_Display;

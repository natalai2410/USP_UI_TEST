import React from "react";
import "./Button_Weight.css";
import { useState, useEffect } from "react";

function Button_Weight({
  letWeightClick,
  letWeightButtonDisable,

  saveButtonDisable,
  saveButtonClick,

  reWriteButtonDisable,
  reWriteButtonClick,

  printButtonDisable,
  printButtonClick,

  nextButtonClick
}) {
  return (
    <div className="weighing__buttons">
      <button
        onClick={letWeightClick}
        className={`${
          letWeightButtonDisable ? "" : "weighing__button_disabled"
        }`}
      >
        получить вес
      </button>

      <button
        className={`${reWriteButtonDisable ? "" : "weighing__button_disabled"}`}
        disabled={!reWriteButtonDisable}
        onClick={reWriteButtonClick}
      >
        перезаписать вес
      </button>

      <button
        className={`${saveButtonDisable ? "" : "weighing__button_disabled"}`}
        disabled={!saveButtonDisable}
        onClick={saveButtonClick}
      >
        сохранить вес
      </button>
      {/* <button className="weighing__button" onClick={nextButtonClick}>
        следующее место
      </button> */}

      <button
        className={`${printButtonDisable ? "" : "weighing__button_disabled"}`}
        disabled={!printButtonDisable}
        onClick={printButtonClick}
      >
        печать этикетки
      </button>

      {/* <button className="weighing__button">печать QR-кода</button> */}
    </div>
  );
}

export default Button_Weight;

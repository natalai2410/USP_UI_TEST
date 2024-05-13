import React from "react";
import "../CargoButton/CargoButton.css";

import { useState, useEffect } from "react";

function CargoButton({
  id,
  weight_value,
  zn,
  handleClick,
  card,
  array,
  isAdded
}) {


  
  function handleBookmarkClick() {
    //const newFavorite = !isAdded;
    // handleClick({ ...card}, newFavorite);
    handleClick({ ...card});
  }


  return (
    <li>
      <button
        className={`card-cargo ${isAdded ? "card-cargo_isAdded" : ""}`}
        onClick={handleBookmarkClick}
      >
        <div className="card-cargo__caption">{weight_value} кг</div>
        <div className="card-cargo__cap">ЗН: {zn}</div>
      </button>
    </li>
  );
}

export default CargoButton;

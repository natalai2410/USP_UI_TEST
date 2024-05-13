import React from "react";
import "../LotButton/LotButton.css";

import pack_add from "../../../images/icons_add.png";

import { useLocation } from "react-router-dom";

function PacksButton({
  caption,
  net_value,
  handleClick,
  card,
  array,
  isAdded,
  gross_value,
  check_done,
}) {
  const { pathname } = useLocation();

  const card_background = `card ${
    net_value > 0 ? "card_green" : "card_yellow"
  }`;

  const card__done = `${check_done > 0 ? "card__done" : ""}`;

  const card__isdone_visible = `${pathname == "/ctrlWeightLotPack" ? "card__is-done" : ""}`;

  function handleBookmarkClick() {
    handleClick({ ...card });
  }

  return (
    <li className={`${isAdded ? "card__check_backgroung" : ""}`}>
      <button className={card_background} onClick={handleBookmarkClick}>
        <div className={card__done}>
          <div className={card__isdone_visible}></div>
        </div>

        <div>
          <div className="card__cap">место </div>
          <div className="card__caption"># {caption}</div>
        </div>
        {pathname == "/selectPack" && (
          <div className="card__weight"> нетто: {net_value}</div>
        )}
        {pathname != "/selectPack" && (
          <div className="card__weight"> брутто: {gross_value}</div>
        )}
      </button>
    </li>
  );
}

export default PacksButton;

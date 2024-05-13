import React from "react";
import "./LotButton.css";

function LotButton({
  caption,
  caption_short,
  numbofpackages_value,
  net_value,
  net_plan_value,
  numbofpackages_plan_value,
  weight_count_value,
  handleClick,
  card,
  array,
  type_tare
}) {

  const card_background = `card ${
    weight_count_value === 0
      ? "card_green"
      : numbofpackages_value > 0
      ? "card_yellow"
      : "card_grey"
  }`;

  const card_tare = `card__tare ${
    type_tare === 'CONTAINER' 
      ? "card__tare_container"
      : type_tare === 'PACKAGE'
      ? "card__tare_package"
      : "card__tare_drum"
  }`;

  function handleBookmarkClick() {
    handleClick({ ...card });
  }

  return (
    <li>
      <button className={card_background} onClick={handleBookmarkClick}>
        <div className="card__tare_">
          <div className={card_tare}></div>
        </div>
        <div>
          <div className="card__caption">{caption}</div>
          <div className="card__cap">{caption_short}</div>
        </div>
        <div>
          <div className="card__numbofpackages">
            мест: {numbofpackages_value} / {numbofpackages_plan_value}
          </div>
          <div className="card__weight">нетто:</div>
          <div className="card__weight">
            {net_value} / {net_plan_value}
          </div>
        </div>
      </button>
    </li>
  );
}

export default LotButton;

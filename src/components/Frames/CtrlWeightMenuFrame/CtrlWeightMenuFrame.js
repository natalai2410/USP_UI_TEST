import { useNavigate } from "react-router-dom";

import { useEffect } from "react";

function CtrlWeightMenuFrame() {
  const navigate = useNavigate();

  function сtrlWeightButtonClick() {
    navigate("/ws/ctrlWeightLot");
  }

  useEffect(() => {
    localStorage.removeItem("ctrlLotsArray");
  });

  function shipmentWeightButtonClick() {}

  return (
    <div className="main-menu">
      <ul className="main-menu__content">
        <li className="main-menu__btn-ogp">
          {" "}
          <button className="button__text" onClick={сtrlWeightButtonClick}>
            Контрольное взвешивание
          </button>
        </li>
        <li className="main-menu__btn_weight">
          {" "}
          <div className="button__text" onClick={shipmentWeightButtonClick}>
            Перевеска при отгрузке
          </div>
        </li>
      </ul>
    </div>
  );
}

export default CtrlWeightMenuFrame;

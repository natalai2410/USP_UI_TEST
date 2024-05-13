// import "./CheckWeightMenuFrame.css";
import { useNavigate } from "react-router-dom";
import { useEffect} from "react";


function CheckWeightMenuFrame() {
  const navigate = useNavigate();

  function CargoButtonClick() {
    navigate("/ws/checkWeightCargo");
  }


  return (
    <div className="main-menu">
      <ul className="main-menu__content">
        <li className="main-menu__btn-ogp">
          {" "}
          <button className="button__text" onClick={CargoButtonClick}>
            Проверка эталонным грузом
          </button>
        </li>
        <li className="main-menu__btn_weight">
          {" "}
          <div className="button__text">Обслуживание весов</div>
        </li>
      </ul>
    </div>
  );
}

export default CheckWeightMenuFrame;

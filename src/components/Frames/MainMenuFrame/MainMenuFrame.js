import "./MainMenuFrame.css";
import { useNavigate } from "react-router-dom";
import MainApi from "../../../utils/MainApi";

function MainMenuFrame() {
  const navigate = useNavigate();

  function OGPButtonClick() {
    navigate("/pw/selectLot");
  }

  function OGP_APL_ButtonClick() {
    navigate("/pw/weighing_APL");
  }

  function CheckWeightButtonClick() {
    navigate("/pw/checkWeightMenu");
  }

  function CtrlWeightButtonClick() {
    navigate("/pw/ctrlWeightMenu");
  }

  return (
    <div className="main-menu">
      <ul className="main-menu__content">
        <li className="main-menu__btn-ogp">
          {" "}
          <button className="button__text" onClick={OGPButtonClick}>
            Готовая продукция
          </button>
        </li>
        <li className="main-menu__btn_weight">
          {" "}
          <div className="button__text" onClick={CheckWeightButtonClick}>
            Проверка и обслуживание весов
          </div>
        </li>
        <li className="main-menu__btn_ctrl">
          {" "}
          <div className="button__text" onClick={CtrlWeightButtonClick}>Контрольное взвешивание</div>
        </li>

        <li className="main-menu__btn_ctrl">
          {" "}
          <button className="button__text" onClick={OGP_APL_ButtonClick}>
            Готовая продукция с АПЛ
          </button>
        </li>

        <li className="main-menu__btn_enabled">
          {" "}
          <div className="button__text"></div>.
        </li>
      </ul>
    </div>
  );
}

export default MainMenuFrame;

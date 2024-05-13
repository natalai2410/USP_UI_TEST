import "../SelectLotFrame/SelectLotFrame.css";
import "./CtrlWeightLotFrame.css";

import ListArray from "../../ListArray/ListArray";
import { React, useEffect, useState } from "react";
import MainApi from "../../../utils/MainApi";
import { useLocation } from "react-router-dom";

import Preloader from "../../Tooltips/Preloader/Preloader";
import { useNavigate } from "react-router-dom";

import LotButton from "../../Buttons/LotButton/LotButton";

import PackButton from "../../Buttons/PackButton/PackButton";

function CtrlWeightLotFrame({ openPopup }) {
  const [lots, setLots] = useState([]);
  const [preloader, setPreloader] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [ctrlPaksSelectedArray, setCtrlPaksSelectedArray] = useState([]);

  function lotsButtonClick(item) {
    localStorage.setItem("lotSelected_Ctrl", JSON.stringify(item));
    navigate("/ws/ctrlWeightLotPack");
  }
  const packButtonSelectedClick = (item) => {};


  useEffect(() => {

    localStorage.removeItem("lotSelected_Ctrl");
    //localStorage.removeItem("ctrlPacksArray");

    localStorage.removeItem("ctrlPaksSelectedArray");
    localStorage.removeItem("sumPacksValue");

    MainApi.getSelectLots(localStorage.getItem("products"))
      .then((res) => {
        //localStorage.setItem("ctrlLotsArray", JSON.stringify(res.items));
        setLots(res.items);
      })
      .then(() => {
        //setLots(JSON.parse(localStorage.getItem("ctrlLotsArray")));
        setPreloader(false);
      })
      .catch((err) => {
        setPreloader(false);
        openPopup(
          "Ошибка при получении списка партии. Сервис недоступен.",
          false
        );
        setError(true);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (error) {
      interval = setInterval(() => {
        MainApi.getSelectLots(localStorage.getItem("products"))
          .then((res) => {
            //localStorage.setItem("ctrlLotsArray", JSON.stringify(res.items));
            setError(false);
            setLots(res.items);
          })
          .then(() => {
            //setLots(JSON.parse(localStorage.getItem("ctrlLotsArray")));
            openPopup("Сервис доступен. Соединение  восстановлено.", true);
          })
          .catch((err) => {
            openPopup(
              "Ошибка при получении списка партии. Попытка запроса.",
              false
            );
            setError(true);
          });
      }, 2000);
    }
    return () => clearInterval(interval);
  });

  useEffect(() => {
  }, [lots]);

  return (
    <div className="ctrl-lot__frame">
      {preloader && <Preloader />}
      {!preloader && ( //!error &&
        <ListArray
          array={lots}
          filter={"lot"}
          lotsButtonClick={lotsButtonClick}
        />
      )}

      {/* <div className="ctrl__info">
        <div className="check-weight__info-txt">
          <div className="check-weight__info-txt_1">
            Выбрано мест: {localStorage.getItem("sumPacksValue").length + 1}
          </div>
        </div>
        <ul className="ctrl-lots__list">
          {ctrlPaksSelectedArray.map((item) => (
            <PackButton
              key={item.id}
              caption={item.num_package}
              net_value={item.gross}
              handleClick={packButtonSelectedClick}
            />
          ))}
        </ul>
      </div> */}

      {/* <div className="check-weight__info check-weight__info_abcolute">
        <div className="check-weight__info-txt">
          <div className="check-weight__info-txt_1">Общий вес: 1000 кг</div>
        </div>

        <button className={`check-weight__button`}>
          Перейти к взвешиванию
        </button>
      </div> */}
    </div>
  );
}

export default CtrlWeightLotFrame;

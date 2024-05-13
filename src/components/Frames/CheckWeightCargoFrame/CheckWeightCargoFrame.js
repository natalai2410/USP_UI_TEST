import ListArray from "../../ListArray/ListArray";
import MainApi from "../../../utils/MainApi";
import Preloader from "../../Tooltips/Preloader/Preloader";

import "./CheckWeightCargoFrame.css";

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function CheckWeightCargoFrame({ openPopup }) {
  const [preloader, setPreloader] = useState(true);
  const [cargo, setCargo] = useState([]);
  const [error, setError] = useState(false);

  const [sumCargoValue, setSumCargoValue] = useState(0);
  const [forwardCheckButtonDisable, setForwardCheckButtonDisable] =
    useState(false);

  const navigate = useNavigate();

  const cargoButtonClick = (item) => {
    if (!item.isAdded) {
      setSumCargoValue(sumCargoValue + item.value * 1);
    } else {
      setSumCargoValue(sumCargoValue - item.value * 1);
    }
  };

  function forwardCheckButtonClick() {
    navigate("/ws/checkWeightInfo");
  }

  useEffect(() => {
    if (sumCargoValue > 0) {
      setForwardCheckButtonDisable(true);
    } else {
      setForwardCheckButtonDisable(false);
    }

    localStorage.setItem("sumCargoValue", sumCargoValue);
  }, [sumCargoValue]);

  useEffect(() => {
    MainApi.getCargo(99)
      .then((res) => {
        setCargo(res.items);
      })
      .then(() => {
        setPreloader(false);
      })
      .catch((err) => {
        setPreloader(false);
        openPopup(
          "Ошибка при получении списка грузов. Сервис недоступен.",
          false
        );
        setError(true);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (error) {
      interval = setInterval(() => {
        MainApi.getCargo(99)
          .then((res) => {
            setError(false);
            setCargo(res.items);
          })
          .then(() => {
            openPopup("Сервис доступен. Соединение  восстановлено.", true);
          })
          .catch((err) => {
            setPreloader(false);
            openPopup(
              "Ошибка при получении списка грузов. Попытка запроса.",
              false
            );
            setError(true);
          });
      }, 2000);
    }
    return () => clearInterval(interval);
    localStorage.removeItem("sumCargoValue");
  });

  useEffect(() => {}, [cargo]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     localStorage.removeItem("sumCargoValue");
  //     setPreloader(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [preloader]);

  return (
    <div className="check-weight">
      {preloader && <Preloader />}

      {!preloader && ( //!error &&
        <ListArray
          array={cargo}
          filter={"cargo"}
          cargoButtonClick={cargoButtonClick}
        />
      )}

      <div className="check-weight__info check-weight__info_abcolute">
        <div className="check-weight__info-txt">
          <div className="check-weight__info-txt_1">
            Общий вес: {sumCargoValue} кг
          </div>
        </div>

        <button
          className={`check-weight__button ${
            forwardCheckButtonDisable ? "" : "check-weight__button_disabled"
          }`}
          disabled={!forwardCheckButtonDisable}
          onClick={forwardCheckButtonClick}
        >
          Перейти к взвешиванию
        </button>
      </div>
    </div>
  );
}

export default CheckWeightCargoFrame;

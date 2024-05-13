import "./SelectLotFrame.css";
import ListArray from "../../ListArray/ListArray";
import { React, useEffect, useState, Component } from "react";
import MainApi from "../../../utils/MainApi";
import { useLocation } from "react-router-dom";

import Preloader from "../../Tooltips/Preloader/Preloader";
import { useNavigate } from "react-router-dom";

function SelectLotFrame({ openPopup }) {
  const [lots, setLots] = useState([]);
  const [preloader, setPreloader] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  function lotsButtonClick(item) {
    localStorage.setItem("lotSelected_OGP", JSON.stringify(item));
    navigate("/pw/selectPack");
  }

  useEffect(() => {
    MainApi.getSelectLots(localStorage.getItem("products"))
      .then((res) => {
        //localStorage.setItem("selectLotsArray", JSON.stringify(res.items));
        setLots(res.items);
      })
      .then(() => {
        //setLots(JSON.parse(localStorage.getItem("selectLotsArray")));
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
            //localStorage.setItem("selectLotsArray", JSON.stringify(res.items));
            setError(false);
            setLots(res.items);
            openPopup("Сервис доступен. Соединение  восстановлено.", true);
          })
          .then(() => {
            //setLots(JSON.parse(localStorage.getItem("selectLotsArray")));
          })
          .catch((err) => {
            openPopup(
              "Ошибка при получении списка партии. Попытка запроса. ",
              false
            );
            setError(true);
          });
      }, 2000);
    }
    return () => clearInterval(interval);
  });

  useEffect(() => {}, [lots]);

  return (
    <div className="lots__frame">
      {preloader && !error && <Preloader />}
      {!preloader && !error && (
        <ListArray
          array={lots}
          filter={"lot"}
          lotsButtonClick={lotsButtonClick}
        />
      )}
    </div>
  );
}

export default SelectLotFrame;

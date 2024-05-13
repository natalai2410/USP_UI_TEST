import "../SelectLotFrame/SelectLotFrame.css";
import "./SelectPackFrame.css";

import ListArray from "../../ListArray/ListArray";
import HeaderLot from "../../global/HeaderLot";
import MainApi from "../../../utils/MainApi";
import Preloader from "../../Tooltips/Preloader/Preloader";

import { useNavigate } from "react-router-dom";
import { useEffect, useState, Component } from "react";

function SelectPackFrame({ openPopup }) {
  const [lotCaptionSelected, setLotCaptionSelected] = useState("");
  const [productSelected, setpProductSelected] = useState("");
  const [packs, setPack] = useState([]);
  const [preloader, setPreloader] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  function packButtonClick(item) {
    localStorage.setItem("packSelected_OGP", JSON.stringify(item));
    navigate("/pw/weighing");
  }

  useEffect(() => {
    setLotCaptionSelected(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).caption
    );
    setpProductSelected(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).caption_short
    );

    MainApi.getSelectPacks(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).id
    )
      .then((res) => {
        //localStorage.setItem("selectPacksArray", JSON.stringify(res.items));
        setPack(res.items);
      })
      .then(() => {
        //setPack(JSON.parse(localStorage.getItem("selectPacksArray")));
        setPreloader(false);
      })
      .catch((err) => {
        setPreloader(false);
        openPopup(
          "Ошибка при получении списка мест в партии. Сервис недоступен.",
          false
        );
        setError(true);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (error) {
      interval = setInterval(() => {
        MainApi.getSelectPacks(
          JSON.parse(localStorage.getItem("lotSelected_OGP")).id
        )
          .then((res) => {
            //localStorage.setItem("selectPacksArray", JSON.stringify(res.items));
            setPack(res.items);
            setError(false);

            openPopup("Сервис доступен. Соединение  восстановлено.", true);
          })
          .then(() => {
            //setPack(JSON.parse(localStorage.getItem("selectPacksArray")));
            //openPopup("Сервис доступен. Соединение  восстановлено.", true);
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

  useEffect(() => {}, [packs]);

  return (
    <div className='pack__frame'>
      {preloader && <Preloader />}

      {!preloader && !error && (
        <>
          <HeaderLot caption={lotCaptionSelected} product={productSelected} />
          <ListArray
            array={packs}
            filter={"pack"}
            packButtonClick={packButtonClick}
          />
        </>
      )}
    </div>
  );
}

export default SelectPackFrame;

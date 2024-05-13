import "../SelectLotFrame/SelectLotFrame.css";
import "./CtrlWeightPackFrame.css";

import ListArray from "../../ListArray/ListArray";
import HeaderLot from "../../global/HeaderLot";
import MainApi from "../../../utils/MainApi";
import Preloader from "../../Tooltips/Preloader/Preloader";

import PackButton from "../../Buttons/PackButton/PackButton";

import { useNavigate } from "react-router-dom";
import { useEffect, useState, Component } from "react";

function CtrlWeightPackFrame({ openPopup }) {
  const [lotCaptionSelected, setLotCaptionSelected] = useState("");
  const [productSelected, setpProductSelected] = useState("");
  const [packs, setPack] = useState([]);
  const [preloader, setPreloader] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [ctrlPaksSelectedArray, setCtrlPaksSelectedArray] = useState([]);
  const [sumPacksValue, setSumPacksValue] = useState(0);
  const [forwardCheckButtonDisable, setForwardCheckButtonDisable] =
    useState(false);

  function packButtonClick(item) {
    if (!item.isAdded) {
      if (item.gross > 0) {
        if (ctrlPaksSelectedArray.length < 5) {
          var extraMovies = [...ctrlPaksSelectedArray];
          extraMovies.push(item);
          setCtrlPaksSelectedArray([...extraMovies]);
          setSumPacksValue(sumPacksValue + item.gross * 1);
        } else openPopup("Массив заполнен. ", false);
      } else {
        openPopup("Брутто места < 0. ", false);
      }
    } else {
      var extraMovies = [
        ...JSON.parse(localStorage.getItem("ctrlPaksSelectedArray")),
      ];

      extraMovies.forEach(function (e, i, extraMovies) {
        if ((e.id = item.id)) {
          setSumPacksValue(sumPacksValue - item.gross * 1);
          setCtrlPaksSelectedArray((state) =>
            state.filter((c) => c.id !== item.id)
          );
        }
      });
    }
  }

  const packButtonSelectedClick = (event) => {
    // const item = event;
    // console.log(event);
    // var extraMovies = [
    //   ...JSON.parse(localStorage.getItem("ctrlPaksSelectedArray")),
    // ];
    // extraMovies.forEach(function (e, i, extraMovies) {
    //   if ((e.id = item.id)) {
    //     setSumPacksValue(sumPacksValue - item.gross * 1);
    //     setCtrlPaksSelectedArray((state) =>
    //       state.filter((c) => c.id !== item.id)
    //     );
    //   }
    // });
  };

  function forwardCheckButtonClick() {
    navigate("/ws/ctrlWeightInfo");
  }

  useEffect(() => {
    localStorage.setItem(
      "ctrlPaksSelectedArray",
      JSON.stringify(ctrlPaksSelectedArray)
    );

    localStorage.setItem("sumPacksValue", sumPacksValue);

    if (sumPacksValue > 0) {
      setForwardCheckButtonDisable(true);
    } else {
      setForwardCheckButtonDisable(false);
    }
  }, [ctrlPaksSelectedArray]);

  useEffect(() => {}, [sumPacksValue]);

  useEffect(() => {
    setLotCaptionSelected(
      JSON.parse(localStorage.getItem("lotSelected_Ctrl")).caption
    );
    setpProductSelected(
      JSON.parse(localStorage.getItem("lotSelected_Ctrl")).caption_short
    );

    MainApi.getSelectPacks(
      JSON.parse(localStorage.getItem("lotSelected_Ctrl")).id
    )
      .then((res) => {
        //localStorage.setItem("ctrlPacksArray", JSON.stringify(res.items));
        setPack(res.items);
      })
      .then(() => {
        //setPack(JSON.parse(localStorage.getItem("ctrlPacksArray")));
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
          JSON.parse(localStorage.getItem("lotSelected_Ctrl")).id
        )
          .then((res) => {
            //localStorage.setItem("ctrlPacksArray", JSON.stringify(res.items));
            setPack(res.items);
            setError(false);
          })
          .then(() => {
            //setPack(JSON.parse(localStorage.getItem("ctrlPacksArray")));
            localStorage.setItem("ctrlPaksSelectedArray", JSON.stringify([]));
            openPopup("Сервис доступен. Соединение  восстановлено.", true);
          })
          .catch((err) => {
            openPopup(
              "Ошибка при получении списка мест партии. Попытка запроса. ",
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
    <div>
      {preloader && <Preloader />}

      <div className="ctrl__frame">
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

        <div className="ctrl__info">
          <div className="check-weight__info-txt">
            <div className="check-weight__info-txt_1">
              Выбрано мест: {ctrlPaksSelectedArray.length}
            </div>
          </div>
          <ul className="ctrl-lots__list">
            {ctrlPaksSelectedArray.map((item) => (
              <PackButton
                key={item.id}
                caption={item.num_package}
                gross_value={item.gross}
                net_value={item.gross} //исправить
                card={item}
                handleClick={packButtonSelectedClick}
                // check_done = {item}
              />
            ))}
          </ul>
        </div>
        <div className="check-weight__info check-weight__info_abcolute">
          <div className="check-weight__info-txt">
            <div className="check-weight__info-txt_1">
              Общий вес: {Math.round(sumPacksValue)} кг
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
    </div>
  );
}

export default CtrlWeightPackFrame;

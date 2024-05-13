import React from "react";

import "../CheckWeightInfoFrame/CheckWeightInfoFrame.css";
import "../../Frames/WeighingFrame/Button_Weight/Button_Weight.css";

import Preloader from "../../Tooltips/Preloader/Preloader";
import Scale_Display from "../../Frames/WeighingFrame/Scale_Display/Scale_Display";
import MainApi from "../../../utils/MainApi";

import HeaderLot from "../../global/HeaderLot";
import PackButton from "../../Buttons/PackButton/PackButton";
import Scale_List from "../../Frames/WeighingFrame/Scale_List/Scale_List";
import { useState, useEffect } from "react";

function CtrlWeightInfoFrame({ openPopup }) {
  const [preloader, setPreloader] = useState(true);
  const [sumPacksValue, setSumPacksValue] = useState(0);
  const [bookButtonDisable, setBookButtonDisable] = useState(false);

  const [raw_data, setRaw_data] = useState("");
  const [visId, setVisId] = useState("");

  const [edituser, setEdituser] = useState("-----");
  const [date, setDate] = useState("-----");
  const [time, setTime] = useState("-----");
  const [weightValue, setweightValue] = useState("-----");
  const [weightValueSaved, setWeightValueSaved] = useState("-----");

  const [variation, setVariation] = useState("-----");

  const [ctrlPaksSelectedArray, setCtrlPaksSelectedArray] = useState([]);
  const [lotCaptionSelected, setLotCaptionSelected] = useState("");
  const [productSelected, setpProductSelected] = useState("");

  const [portsArray, setPortsArray] = useState([]);
  const [currentPort, setCurrentPort] = useState([]);

  const [state, setState] = useState("");

  function letWeightButtonClick() {
    setPreloader(true);
    clearParam();
    //MainApi.letWeight("https://172.27.3.89:8080")
    MainApi.letWeight(
      "http://" +
        JSON.parse(localStorage.getItem("currentPort")).server_ip 
    )
      .then((res) => {
        setweightValue(res.value);
        setRaw_data(res.raw_data);
        setVisId(res.id);
        setVariation(sumPacksValue - res.value);
      })

      .catch((err) => {
        setPreloader(false);
        setweightValue("ERR");
        if (localStorage.getItem("currentPort") === undefined) {
          openPopup(`6: Выберите весы`, false);
        } else {
          openPopup(
            `7: Ошибка при чтении данных с терминала.Повторите попытку получения веса`,
            false
          );
        }
      });
  }

  const packButtonSelectedClick = (item) => {};

  function bookButtonClick() {
    var extraMovies = [
      ...JSON.parse(localStorage.getItem("ctrlPaksSelectedArray")),
    ];

    extraMovies.forEach(function (e, i, extraMovies) {
      MainApi.saveCtrlWeight(
        "https://172.31.148.77/ords/devtest/pw/control_weight",
        sumPacksValue,
        weightValue,
        JSON.parse(localStorage.getItem("currentUser")).username,
        visId,
        raw_data,
        "тест-WEB",
        "тест-WEB",
        99,
        e.id,
        "тест-WEB"
      )
        .then((res) => {
          if (res.status == "SUCCESS") {
            setWeightValueSaved(weightValue);
            setweightValue("-----");
            setEdituser(
              JSON.parse(localStorage.getItem("currentUser")).username
            );
            setDate(new Date().toISOString().slice(0, 10));
            setTime(new Date().toISOString().slice(11, 19));
            openPopup(`Результаты сохранены в журнал`, true);
          } else {
            openPopup(`Ошибка записи в электронный журнал.`, false);
          }
        })
        .catch((err) => {
          openPopup(`Ошибка записи в электронный журнал. ` + err, false);
        });

      clearParam();
    });
  }

  function clearParam() {
    setEdituser("-----");
    setDate("-----");
    setTime("-----");
    setweightValue("-----");
    setVariation("-----");
    setWeightValueSaved("----");
  }

  //нажатие  на нопку  порта
  function currentPortClick(item) {
    setCurrentPort(item);
    localStorage.setItem("currentPort", JSON.stringify(item));
    clearParam();
  }

  useEffect(() => {
    setSumPacksValue(localStorage.getItem("sumPacksValue"));

    setLotCaptionSelected(
      JSON.parse(localStorage.getItem("lotSelected_Ctrl")).caption
    );
    setpProductSelected(
      JSON.parse(localStorage.getItem("lotSelected_Ctrl")).caption_short
    );
  });

  //текущий порт
  useEffect(() => {
    setPortsArray(portsArray.map((elem) => (elem.isSelected = false)));

    setPortsArray(
      portsArray.map((elem) =>
        elem.scale_number ===
        JSON.parse(localStorage.getItem("currentPort")).scale_number
          ? { ...elem, isSelected: true, isError: false }
          : elem
      )
    );

    if (JSON.parse(localStorage.getItem("currentPort"))) {
      MainApi.letStatusWeight(
        "https://" + JSON.parse(localStorage.getItem("currentPort")).server_ip
        // "http://" +
        //   JSON.parse(localStorage.getItem("currentPort")).server_ip
      )
        .then((res) => {
          setweightValue("-----");
          setState(res.status);
          if (res.status === "OK") {
            setState("OK");
          } else {
            setState("err");
          }
        })
        .catch((err) => {
          setweightValue("ERR");
          setState("err");
          setPreloader(false);
          openPopup(`6: Ошибка подключения к весам. Повторите попытку.`, false);

          setPortsArray(
            portsArray.map((elem) =>
              elem.scale_number ===
              JSON.parse(localStorage.getItem("currentPort")).scale_number
                ? { ...elem, isSelected: true, isError: true }
                : elem
            )
          );
        });
    }
  }, [currentPort]);

  useEffect(() => {
    setCtrlPaksSelectedArray(
      JSON.parse(localStorage.getItem("ctrlPaksSelectedArray"))
    );

    setPortsArray(JSON.parse(localStorage.getItem("ports")));
    if (JSON.parse(localStorage.getItem("currentPort"))) {
      setCurrentPort(JSON.parse(localStorage.getItem("currentPort")));
    }
  }, []);

  useEffect(() => {
    if (weightValue > 0) {
      setBookButtonDisable(true);
    } else setBookButtonDisable(false);
  }, [visId, weightValue, raw_data, edituser, variation, weightValueSaved]);

  useEffect(() => {}, [state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloader(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [preloader]);

  return (
    <section className="weighing__apl">
      {preloader && <Preloader />}

      {!preloader && (
        <div>
          <HeaderLot caption={lotCaptionSelected} product={productSelected} />

          <div className="weighing__scale-list">
            <Scale_Display weightValue={weightValue} />

            <Scale_List
              currentPortClick={currentPortClick}
              portsArray={portsArray}
            />
          </div>

          <div className="weighing__info">
            <div className="weighing__info">
              <div className="info__left-line">
                <div className="info__left-line-column">
                  Контрольное взвешивание:
                </div>
                <div className="info__left-line-column">
                  {weightValueSaved} кг
                </div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">Контрольная масса:</div>
                <div className="info__left-line-column">
                  {Math.round(sumPacksValue)} кг
                </div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">Отклонение:</div>
                <div className="info__left-line-column">{variation} кг</div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">Заводской №</div>
                <div className="info__left-line-column">-----</div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">Дата:</div>
                <div className="info__left-line-column">{date}</div>
              </div>

              <div className="info__left-line">
                <div className="info__left-line-column">Время:</div>
                <div className="info__left-line-column">{time}</div>
              </div>

              <div className="info__left-line">
                <div className="info__left-line-column">Контролер:</div>
                <div className="info__left-line-column">{edituser}</div>
              </div>
            </div>
            <div className="weighing__buttons">
              <button onClick={letWeightButtonClick}>Получить вес</button>
              <button
                className={`${
                  bookButtonDisable ? "" : "weighing__button_disabled"
                }`}
                onClick={bookButtonClick}
                disabled={!bookButtonDisable}
              >
                Внести в журнал
              </button>
            </div>
          </div>

          <div className="ctrl__info">
            <div className="check-weight__info-txt">
              <div className="check-weight__info-txt_1">
                Выбрано мест:{" "}
                {
                  JSON.parse(localStorage.getItem("ctrlPaksSelectedArray"))
                    .length
                }
              </div>
            </div>
            <ul className="ctrl-lots__list">
              {ctrlPaksSelectedArray.map((item) => (
                <PackButton
                  key={item.id}
                  caption={item.num_package}
                  gross_value={item.gross}
                  net_value={item.gross} //исправить
                  handleClick={packButtonSelectedClick}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
export default CtrlWeightInfoFrame;

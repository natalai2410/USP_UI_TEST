import React from "react";
import "../WeighingFrame/WeighingFrame.css";
import "./Scale_Display/Scale_Display.css";
import "./Scale_List/Scale_List.css";
import "./Info/Info.css";
import "./Button_Weight/Button_Weight.css";
import { useState, useEffect } from "react";

import MainApi from "../../../utils/MainApi";

import Button_Weight from "./Button_Weight/Button_Weight";
import Scale_Display from "./Scale_Display/Scale_Display";

import Scale_List from "./Scale_List/Scale_List";

import Info from "./Info/Info";
import Preloader from "../../Tooltips/Preloader/Preloader";
import Preloader_2 from "../../Tooltips/Preloader/Preloader";

function WeighingFrame({ openPopup }) {
  const [reWriteButtonDisable, setReWriteButtonDisable] = useState(false);
  const [saveButtonDisable, setSaveButtonDisable] = useState(false);
  const [letWeightButtonDisable, setLetWeightButtonDisable] = useState(true);
  const [printButtonDisable, setPrintButtonDisable] = useState(false);
  const [weightValue, setweightValue] = useState("-----");

  const [raw_data, setRaw_data] = useState("");
  const [visId, setVisId] = useState("");
  const [recflag, setRecflag] = useState("net");
  const [kol_packs, setKol_packs] = useState("");
  const [sum_net, setSum_net] = useState("");

  const [preloader, setPreloader] = useState(true);
  const [preloader_2, setPreloader_2] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [gross, setGross] = useState("");
  const [net, setNet] = useState("");
  const [edituser, setEdituser] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [tareFlag, setTareFlag] = useState(false);
  const [zeroFlag, setZeroFlag] = useState(false);

  const [portsArray, setPortsArray] = useState([]);
  const [currentPort, setCurrentPort] = useState([]);

  // const [error, setError] = useState(false);
  const [state, setState] = useState("");

  function reWriteButtonCheck() {
    if (weightValue > 0) {
      if (
        JSON.parse(localStorage.getItem("packSelected_OGP")).net > 0 &&
        JSON.parse(localStorage.getItem("packSelected_OGP")).net.length !== 0 &&
        JSON.parse(localStorage.getItem("packSelected_OGP")).gross > 0 &&
        JSON.parse(localStorage.getItem("packSelected_OGP")).gross.length !== 0
      ) {
        setReWriteButtonDisable(true);
      } else setSaveButtonDisable(true);
    }
  }

  function reWriteButtonClick() {
    setReWriteButtonDisable(false);
    setSaveButtonDisable(true);
    setLetWeightButtonDisable(false);
  }

  function getCurrentPack() {
    MainApi.getCurrentPack(
      JSON.parse(localStorage.getItem("packSelected_OGP")).id
    )
      .then((res) => {
        localStorage.setItem("packSelected_OGP", JSON.stringify(res.items[0]));

        setGross(JSON.parse(localStorage.getItem("packSelected_OGP")).gross);
        setNet(JSON.parse(localStorage.getItem("packSelected_OGP")).net);
        setEdituser(
          JSON.parse(localStorage.getItem("packSelected_OGP")).edituser
        );

        let dateTime = JSON.parse(
          localStorage.getItem("packSelected_OGP")
        ).editdate;

        setDate(dateTime.split("T")[0]);
        setTime(dateTime.substr(11, dateTime.length).split("Z")[0]);
      })
      .catch((err) => openPopup(`Ошибка обновления данных ` + err, true));
  }

  function saveButtonClick() {
    setSaveButtonDisable(false);
    setLetWeightButtonDisable(true);
    setweightValue("-----");

    MainApi.saveWeight(
      "https://172.31.148.77/ords/devtest/pw/pack",
      JSON.parse(localStorage.getItem("packSelected_OGP")).id,
      weightValue,
      JSON.parse(localStorage.getItem("lotSelected_OGP")).tare_value,
      recflag,
      JSON.parse(localStorage.getItem("currentUser")).username,
      visId,
      raw_data
    )
      .then((res) => {
        if (res.status == "NO_DATA_FOUND") {
          openPopup("Ошибка сохранения веса." + res.status, false);
        }
        if (res.status == "SUCCESS") {
          openPopup(
            recflag == "net" ? "Вес нетто сохранен." : "Вес брутто сохранен.",
            true
          );
          setPrintButtonDisable(true);
          letRest();
        }
      })
      .catch((err) => openPopup(`Ошибка при сохранения веса.`, false));
  }

  function setTareClick() {
    openPopup(`Тарирование весов произведено успешно.`, true);
  }

  function setZeroClick() {
    openPopup(`Обнуление произведено успешно.`, true);
  }

  function printButtonClick() {
    setPreloader(true);
  }

  function letRest() {
    MainApi.getRest(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).id,
      JSON.parse(localStorage.getItem("lotSelected_OGP")).plan_net,
      JSON.parse(localStorage.getItem("lotSelected_OGP")).plan_numbofpackages
    )
      .then((res) => {
        setKol_packs(res.kol_packs);
        setSum_net(res.sum_net);
      })
      .catch((err) => {
        openPopup(`Данные об остатке мест не обновлены.`, false);
      });

    getCurrentPack();
  }

  function letWeightButtonClick() {
    setPreloader(true);
    //MainApi.letWeight("http://172.27.3.89:8080")

    //убран https для тестирования статики
    MainApi.letWeight(
      "https://" +
        JSON.parse(localStorage.getItem("currentPort")).server_ip
    )
      .then((res) => {
        if (res.status === "OK") {
          setweightValue(res.value);
          setRaw_data(res.raw_data);
          setVisId(res.id);
          setPrintButtonDisable(false);
        } else if (res.status === "NOT OK") {
          setPreloader(false);
          openPopup(`9: Request failed`, false);
        }
      })
      .catch((err) => {
        setPreloader(false);
        if (localStorage.getItem("currentPort") === undefined) {
          openPopup(`6: Выберите весы`, false);
        } else {
          openPopup(
            `7: Ошибка при чтении данных с терминала.Повторите попытку получения веса`,
            false
          );
        }
        setweightValue("ERR");
      });
  }

  function onNetClick(e) {
    setRecflag(e.target.value);
  }

  function onGrossClick(e) {
    setRecflag(e.target.value);
  }

  function nextButtonClick() {}

  //нажатие  на нопку  порта
  function currentPortClick(item) {
    setCurrentPort(item);
    localStorage.setItem("currentPort", JSON.stringify(item));
  }

  useEffect(() => {
    reWriteButtonCheck();
  }, [weightValue]);

  useEffect(() => {}, [
    kol_packs,
    sum_net,
    recflag,
    visId,
    weightValue,
    raw_data,
    tareFlag,
    zeroFlag,
    state,
  ]);

  useEffect(() => {
    setGross(JSON.parse(localStorage.getItem("packSelected_OGP")).gross);
    setNet(JSON.parse(localStorage.getItem("packSelected_OGP")).net);
    setEdituser(JSON.parse(localStorage.getItem("packSelected_OGP")).edituser);

    let dateTime = JSON.parse(
      localStorage.getItem("packSelected_OGP")
    ).editdate;

    setDate(dateTime.split("T")[0]);
    setTime(dateTime.substr(11, dateTime.length).split("Z")[0]);
  }, [net, gross, edituser, date, time]);

  //текущий порт
  useEffect(() => {

    setweightValue("-----");
    setPreloader(true);
    if (currentPort.set_tare == "Y") {
      setTareFlag(true);
    } else {
      setTareFlag(false);
    }
    if (currentPort.set_zero == "Y") {
      setZeroFlag(true);
    } else {
      setZeroFlag(false);
    }


    // все кнопки сделать port__not_selected
    setPortsArray(portsArray.map((elem) => (elem.isSelected = false)));


    //07.02.2024  isSelected - true
    setPortsArray(
      portsArray.map((elem) =>
        elem.scale_number ===
        JSON.parse(localStorage.getItem("currentPort")).scale_number
          ? { ...elem, isSelected: '', isError: false }
          : elem
      )
    );
 //25.05.2024 - убран https для тестирования  Статики

 console.log('для тестирования  Статики');
    if (JSON.parse(localStorage.getItem("currentPort"))) {
      MainApi.letStatusWeight(
        "https://" + JSON.parse(localStorage.getItem("currentPort")).server_ip
      )
        //MainApi.letStatusWeight("http://172.27.3.89:8080")
        .then((res) => {
          setweightValue("-----");
          setState(res.status);
          if (res.status === "OK") {
            setState("OK");
            console.log('OK');
            //07.02.2024
            setPortsArray(
              portsArray.map((elem) =>
                elem.scale_number ===
                JSON.parse(localStorage.getItem("currentPort")).scale_number
                  ? { ...elem, isSelected: true, isError: false }
                  : elem
              )
            );
            
          } else {
            setState("err");
            
            //07.02.2024
            setPortsArray(
              portsArray.map((elem) =>
                elem.scale_number ===
                JSON.parse(localStorage.getItem("currentPort")).scale_number
                  ? { ...elem, isSelected: true, isError: true }
                  : elem
              )
            );

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
    letRest();
    if (
      JSON.parse(localStorage.getItem("packSelected_OGP")).net > 0 &&
      JSON.parse(localStorage.getItem("packSelected_OGP")).net.length !== 0 &&
      JSON.parse(localStorage.getItem("packSelected_OGP")).gross > 0 &&
      JSON.parse(localStorage.getItem("packSelected_OGP")).gross.length !== 0
    ) {
      setPrintButtonDisable(true);
    }

    setPortsArray(JSON.parse(localStorage.getItem("ports")));

    if (JSON.parse(localStorage.getItem("currentPort"))) {
      setCurrentPort(JSON.parse(localStorage.getItem("currentPort")));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloader(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [preloader]);

  return (
    <section className="weighing">
      {preloader && <Preloader />}

      {preloader_2 && <Preloader_2 />}

      {!preloader && (
        <div>
          <div className="weighing__scale-list">
            <Scale_Display
              weightValue={weightValue}
              setTareClick={setTareClick}
              setZeroClick={setZeroClick}
              recflag={recflag}
              onNetClick={onNetClick}
              onGrossClick={onGrossClick}
              NetOn={recflag == "net" ? true : false}
              GrossOn={recflag == "gross" ? true : false}
              setTareFlag={tareFlag}
              setZeroFlag={zeroFlag}
            />

            <Scale_List
              currentPortClick={currentPortClick}
              portsArray={portsArray}
            />
          </div>

          <div className="weighing__info">
            <Info
              kol_packs={kol_packs}
              sum_net={sum_net}
              gross={gross}
              net={net}
              edituser={edituser}
              date={date}
              time={time}
            />
          </div>

          <div className="weighing__info">
            <Button_Weight
              letWeightClick={letWeightButtonClick}
              reWriteButtonDisable={reWriteButtonDisable}
              saveButtonDisable={saveButtonDisable}
              reWriteButtonClick={reWriteButtonClick}
              letWeightButtonDisable={letWeightButtonDisable}
              saveButtonClick={saveButtonClick}
              printButtonDisable={printButtonDisable}
              printButtonClick={printButtonClick}
              nextButtonClick={nextButtonClick}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default WeighingFrame;

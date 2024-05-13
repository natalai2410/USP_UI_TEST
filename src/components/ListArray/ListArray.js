import "../Frames/SelectLotFrame/SelectLotFrame.css";
import React, { useEffect, useState } from "react";
import MainApi from "../../utils/MainApi";

import LotButton from "../Buttons/LotButton/LotButton";
import PackButton from "../Buttons/PackButton/PackButton";
import CargoButton from "../Buttons/CargoButton/CargoButton";

import { useLocation } from "react-router-dom";

import {
  MOBILE_WIDTH,
  TABLET_WIDTH,
  DESKTOP_WIDTH,
} from "../../utils/constants";

import arrow_l from "../../images/1.png";
import arrow_r from "../../images/2.png";

function ListArray({
  array,
  filter,
  cargoButtonClick,
  packButtonClick,
  lotsButtonClick,
}) {
  //переменные состояния для ширины и высоты окна
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const [lotsSplice, setLotsSplice] = useState([]);
  const [currentTab, setcurrentTab] = useState(1);
  const [disabledRightBtn, setDisabledRightBtn] = useState(false);
  const [disabledLeftBtn, setDisabledLeftBtn] = useState(false);
  const [arrowsIsVisible, setArrowsIsVisible] = useState(false);

  //const [test, setTest] = useState();

  const { pathname } = useLocation();

  // функция присваивает размеры окна переменным состояния ширины и высоты
  const setWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    sliceArrayLots(count * (currentTab - 1), count * currentTab);
    setcurrentTab(1);
  };

  const getCount = (windowSize) => {
    {
      if (windowSize > 1250) {
        if (pathname == "/ctrlWeightLot") {
          return { extra: 21 };
        }
        if (pathname == "/ctrlWeightLotPack") {
          return { extra: 28 };
        } else {
          return { extra: 35 };
        }
      }

      if (windowSize > 1100 && windowSize <= 1250) {
        if (pathname == "/ctrlWeightLot" || pathname == "/ctrlWeightLotPack") {
          return { extra: 12 };
        } else {
          return { extra: 36 };
        }
      }

      if (windowSize > 850 && windowSize <= 1100) {
        if (pathname == "/ctrlWeightLot" || pathname == "/ctrlWeightLotPack") {
          return { extra: 20 };
        } else {
          return { extra: 25 };
        }
      }

      if (windowSize > 747 && windowSize <= 850) {
        if (pathname == "/ctrlWeightLot") {
          return { extra: 15 };
        } else {
          return { extra: 25 };
        }
      }

      if (windowSize > 520 && windowSize <= 747) {
        if (pathname == "/ctrlWeightLot") {
          return { extra: 16 };
        }
        if (pathname == "/ctrlWeightLotPack") {
          //|| pathname == "/selectPack")
          return { extra: 25 };
        }

        if (pathname == "/selectPack") {
          return { extra: 28 };
        } else {
          return { extra: 18 };
        }
      }
      return {
        first: 2,
        extra: 6,
      };
    }
  };

  const countTab = Math.trunc(array.length / getCount(window.innerWidth).extra);
  const count = Math.min(array.length, getCount(window.innerWidth).extra);

  // Отрисовка кнопок на странице
  //--------------------------------------------------------------------------------//
  const renderMoreLeft = () => {
    let newCurrentTab = currentTab - 1;
    setcurrentTab(newCurrentTab);
    sliceArrayLots(
      getCount(window.innerWidth).extra * (newCurrentTab - 2),
      getCount(window.innerWidth).extra * (newCurrentTab - 1)
    );
    checkDisableArrowsBtn(newCurrentTab);
  };

  const renderMoreRight = () => {
    sliceArrayLots(count * (currentTab - 1), count * currentTab);
    checkDisableArrowsBtn(currentTab + 1);
    setcurrentTab(currentTab + 1);
  };

  function sliceArrayLots(firstItem, lastItem) {
    const extraMovies = array.slice(firstItem, lastItem);
    setLotsSplice([]);
    setLotsSplice([...extraMovies]);
  }

  function checkDisableArrowsBtn(currentTab_) {
    //нажатие правой кнопки недоспупно, если достигнут конец вкладок
    if (countTab < currentTab_ - 1) setDisabledRightBtn(true);
    else setDisabledRightBtn(false);
    //нажатие правой кнопки недоспупно, если вкладка первая
    if (currentTab_ == 2) setDisabledLeftBtn(true);
    else setDisabledLeftBtn(false);
  }

  function checkArrowsIsVisible() {
    if (getCount(window.innerWidth).extra <= lotsSplice.length) {
      setArrowsIsVisible(true);
    } else {
      if (countTab < currentTab - 1 && currentTab > 2) setArrowsIsVisible(true);
      else setArrowsIsVisible(false);
    }
  }

  // события по нажатию на кнопки
  //--------------------------------------------------------------------------------//

  // кнопка груза
  const cargoButtonHandler = (event) => {
    const item = event;

    setLotsSplice(
      lotsSplice.map((elem) =>
        elem.id === item.id ? { ...elem, isAdded: !elem.isAdded } : elem
      )
    );
    cargoButtonClick(event);
  };

  const packButtonHandler = (event) => {
    if (pathname == "/ctrlWeightLotPack") {
      const item = event;
      
      var extraMovies = [
        ...JSON.parse(localStorage.getItem("ctrlPaksSelectedArray")),
      ];

      if (extraMovies.length < 5 && item.gross > 0) {
        setLotsSplice(
          lotsSplice.map((elem) =>
            elem.id === item.id ? { ...elem, isAdded: true } : elem
          )
        );
      }

      if (item.isAdded) {
        setLotsSplice(
          lotsSplice.map((elem) =>
            elem.id === item.id ? { ...elem, isAdded: false } : elem
          )
        );
      }
    }

    packButtonClick(event);
  };

  //  useEffects
  //--------------------------------------------------------------------------------//

  //изменение размеров окна
  useEffect(() => {
    window.addEventListener("resize", setWindowDimensions);
    return () => {
      window.removeEventListener("resize", setWindowDimensions);
    };
  }, []);

  //отрисовка кнопок со стрелками
  useEffect(() => {
    checkArrowsIsVisible();
  });

  useEffect(() => {
    // console.log(currentTab);
  }, [currentTab]);

  //рендеринг страницы при изменениии arrowsIsVisible
  useEffect(() => {}, [arrowsIsVisible]);

  //рендеринг страницы при изменениии размеров окна
  useEffect(() => {
    renderMoreRight();
    checkArrowsIsVisible();
  }, [array, windowWidth, windowHeight]);

  const lots__list = `lots__list ${
    pathname == "/ctrlWeightLotPack"
      ? "lots__list_ctrl"
      : pathname == "/selectPack"
      ? "lots__list_ctrl"
      : ""
  }`;

  return (
    <div className="select-lot">
      <section className="lots">
        <ul className={lots__list}>
          {filter == "lot" &&
            lotsSplice.map((item) => (
              <LotButton
                key={item.id}
                caption={item.caption}
                caption_short={item.caption_short}
                numbofpackages_value={item.numbofpackages} //желтая, если > 0
                weight_count_value={item.null_weight_count} //зеленая, если = 0
                numbofpackages_plan_value={item.plan_numbofpackages}
                net_value={item.net}
                net_plan_value={item.plan_net}
                handleClick={(event) => lotsButtonClick(event)}
                array={lotsSplice}
                card={item}
                type_tare={item.type_tare}
              />
            ))}

          {filter == "pack" &&
            lotsSplice.map((item) => (
              <PackButton
                key={item.id}
                caption={item.num_package}
                net_value={item.net}
                gross_value={item.gross}
                handleClick={packButtonHandler}
                array={lotsSplice}
                card={item}
                isAdded={item.isAdded}
                check_done ={item.check_done}
              />
            ))}

          {filter == "cargo" &&
            lotsSplice.map((item) => (
              <CargoButton
                key={item.id}
                id={item.id}
                weight_value={item.value}
                zn={item.zn}
                handleClick={cargoButtonHandler}
                array={lotsSplice}
                card={item}
                isAdded={item.isAdded}
              />
            ))}
        </ul>
      </section>

      {arrowsIsVisible && (
        <div className={"select-lot__buttons-arrow"}>
          <button
            className="button__more"
            onClick={renderMoreLeft}
            disabled={disabledLeftBtn}
          >
            <img className="button__more_left" src={arrow_l} alt="1" />
          </button>

          <button
            className="button__more"
            onClick={renderMoreRight}
            disabled={disabledRightBtn}
          >
            <img className="button__more_left" src={arrow_r} alt="2" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ListArray;

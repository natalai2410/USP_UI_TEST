import React from "react";

import "../APLFrame/APLFrame.css";
import "../../Frames/WeighingFrame/Button_Weight/Button_Weight.css";

import Preloader from "../../Tooltips/Preloader/Preloader";

import HeaderLot from "../../global/HeaderLot";
import { useState, useEffect } from "react";

function APLFrame() {
  const [preloader, setPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="weighing__apl">
      {preloader && <Preloader />}

      {!preloader && (
        <div>
          <HeaderLot caption={"19233"} product={"Н100х100"} />
          <div className="weighing__info">
            {Scale_List()}
            <div className="weighing__info">
              <div className="info__left-line">
                <div className="info__left-line-column">Брутто</div>
                <div className="info__left-line-column">1000</div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">Нетто</div>
                <div className="info__left-line-column">2000</div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">Тара</div>
                <div className="info__left-line-column">9</div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">ЗПУ</div>
                <div className="info__left-line-column">9</div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">Дата</div>
                <div className="info__left-line-column">9</div>
              </div>
              <div className="info__left-line_background info__left-line_1">
                <div>Общий вес пакета: 9</div>
              </div>
            </div>
            <div className="weighing__buttons">
              <button>подтвердить вес</button>
              <button>перезаписать вес</button>
            </div>
          </div>
          <div className="weighing__info">
            <div className="weighing__info">
              <div className="info__left-line">
                <div className="info__left-line-column">План поддонов</div>
                <div className="info__left-line-column">48</div>
              </div>
              <div className="info__left-line">
                <div className="info__left-line-column">План нетто</div>
                <div className="info__left-line-column">20000</div>
              </div>
              <div className="info__left-line_background info__left-line_1">
                <div>Осталоcь 11 мест по 1426.9</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default APLFrame;

/* выбор весов */
function Scale_List() {
  return (
    <div>
      <div className="pallet-list">
        <div className="scale-list__item">
          <div className="scale-list__caption">Бочка 1</div>
        </div>

        <div className="scale-list__item">
          <div className="scale-list__caption">Бочка 2</div>
        </div>

        <div className="scale-list__item">
          <div className="scale-list__caption">Бочка 3</div>
        </div>

        <div className="scale-list__item">
          <div className="scale-list__caption">Бочка 4</div>
        </div>

        <div className="scale-list__item">
          <div className="scale-list__caption">Бочка 5</div>
        </div>

        <div className="scale-list__item">
          <div className="scale-list__caption">Бочка 6</div>
        </div>
      </div>
    </div>
  );
}

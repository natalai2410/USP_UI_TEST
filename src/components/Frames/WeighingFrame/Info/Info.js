import React from "react";
import "./Info.css";

import { useState, useEffect } from "react";

import MainApi from "../../../../utils/MainApi";

function Info({ kol_packs, sum_net, gross, net, edituser, date, time }) {
  const [lotCaptionSelected, setLotCaptionSelected] = useState("");
  const [productSelected, setpProductSelected] = useState("");
  const [packNumberSelected, setPackNumberSelected] = useState("");

  const [numbofpackages_plan, setNumbofpackages_plan] = useState("");
  //const [edituser, setEdituser] = useState("");
  const [weight_plan, setWeight_plan] = useState("");

  const [taraValue, setTaraValue] = useState(null);

  useEffect(() => {
    setLotCaptionSelected(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).caption
    );
    setpProductSelected(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).caption_short
    );
    setPackNumberSelected(
      JSON.parse(localStorage.getItem("packSelected_OGP")).num_package
    );

    setNumbofpackages_plan(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).plan_numbofpackages
    );

    setWeight_plan(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).plan_net
    );

    setTaraValue(
      JSON.parse(localStorage.getItem("lotSelected_OGP")).tare_value
    );
  });

  return (
    <div className="info">
      <div className="info__left">
        <div className="info__left-line">
          <div className="info__left-line-column">Продукт:</div>
          <div className="info__left-line-column">{productSelected}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">Партия:</div>
          <div className="info__left-line-column">{lotCaptionSelected}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">Место:</div>
          <div className="info__left-line-column">{packNumberSelected}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">Тара:</div>
          <div className="info__left-line-column">{taraValue}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">План мест:</div>
          <div className="info__left-line-column">{numbofpackages_plan}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">План нетто:</div>
          <div className="info__left-line-column">{weight_plan}</div>
        </div>
      </div>
      <div className="info__left">
        <div className="info__left-line">
          <div className="info__left-line-column">Контролер:</div>
          <div className="info__left-line-column">{edituser}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">Брутто:</div>
          <div className="info__left-line-column">{gross}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">Нетто:</div>
          <div className="info__left-line-column">{net}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">Дата:</div>
          <div className="info__left-line-column">{date}</div>
        </div>

        <div className="info__left-line">
          <div className="info__left-line-column">Время:</div>
          <div className="info__left-line-column">{time}</div>
        </div>

        <div className="info__left-line_background info__left-line_1">
          <div>{`Осталоcь ${kol_packs} мест по ${sum_net}`}</div>
        </div>
      </div>
    </div>
  );
}

export default Info;

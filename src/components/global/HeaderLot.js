import React from "react";
import "../global/global.css";

function HeaderLot({ caption, product }) {
  return (
    <div className={"header__lot"}>
      {/* <div className="lot__caption-txt">Партия: {caption}</div>
      <div className="lot__caption-txt">Продукт: {product}</div> */}
      <div className="lot__caption-txt">{caption}</div>
      <div className="lot__caption-txt">{product}</div>
    </div>
  );
}

export default HeaderLot;

import "../../src/components/Page/Page.css";

import React from "react";

import { useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Context } from "../contexts/Context.js";

import Header from "./Header/Header";
import MainApi from "../utils/MainApi";

import Footer from "./Footer/Footer";

import InfoTooltip from "./Tooltips/InfoTooltip/InfoTooltip";
import ProtectedRoute from "./Tooltips/ProtectedRoute/ProtectedRoute";

import success from "../images/success.svg";
import fail from "../images/fail.svg";

//страница авторизации
import LoginFrame from "./Frames/LoginFrame/LoginFrame";

//страница главного меню
import MainMenuFrame from "./Frames/MainMenuFrame/MainMenuFrame";

//страница выбора партии (готовая продукция)
import SelectLotFrame from "./Frames/SelectLotFrame/SelectLotFrame";
//страница выбора места в партии (готовая продукция)
import SelectPackFrame from "./Frames/SelectPackFrame/SelectPackFrame";
//страница взвешивания места в партии (готовая продукция)
import WeighingFrame from "./Frames/WeighingFrame/WeighingFrame";

import APLFrame from "./Frames/APLFrame/APLFrame";

import Preloader from "./Tooltips/Preloader/Preloader";

//страница меню обслуживания весов
import CheckWeightMenuFrame from "./Frames/CheckWeightMenuFrame/CheckWeightMenuFrame";
//страница выбора грузов
import CheckWeightCargoFrame from "./Frames/CheckWeightCargoFrame/CheckWeightCargoFrame";
//страница ежесменой проверки весов
import CheckWeightInfoFrame from "./Frames/CheckWeightInfoFrame/CheckWeightInfoFrame";

//страница меню контрольного взвешивания
import CtrlWeightMenuFrame from "./Frames/CtrlWeightMenuFrame/CtrlWeightMenuFrame";

//страница  выбора партии (контрольного взвешивания)
import CtrlWeightLotFrame from "./Frames/CtrlWeightLotFrame/CtrlWeightLotFrame";

//страница  выбора места в партии (контрольного взвешивания)
import CtrlWeightPackFrame from "./Frames/CtrlWeightPackFrame/CtrlWeightPackFrame";
//страница контрольного взвешивания - внесение в  журнал
import CtrlWeightInfoFrame from "./Frames/CtrlWeightInfoFrame/CtrlWeightInfoFrame";

//тестирование QR кодирования
//import QRReaderFrame from "./Frames/QRReaderFrame/QRReaderFrame";

// определить браузер
import { UserAgentProvider, UserAgent } from "react-useragent";

function App() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("ПАК ВИС (web версия)");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupImage, setPopupImage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [nomcard, setNomcard] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const { pathname } = useLocation();
  const [isVisibleBackButon, setIsVisibleBackButon] = useState(true);

  const [description, setDescription] = useState("-");
  const [preloader, setPreloader] = useState(false);

  const [hostName, setHostName] = useState("");

  const [language, setLanguage] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [isDeck, setIsDeck] = useState(true);

  const [test, setTest] = useState("");

  async function QRButtonClick(hostName) {
    //await MainApi.getConfig("TestDesktop")
    await MainApi.getConfig(hostName)
      .then((res) => {
        //костыль
        let test_1 = JSON.stringify(res.items[0].json)
          .replace(/\\n/g, "")
          .replace(/\\/g, "");

        let test_2 = test_1.substr(1, test_1.length - 2);

        setDescription(JSON.parse(test_2).description);

        localStorage.setItem("ports", JSON.stringify(JSON.parse(test_2).ports));

        localStorage.setItem("description", JSON.parse(test_2).description);

        localStorage.setItem("config", test_2);
        localStorage.setItem(
          "products",
          JSON.stringify(JSON.parse(test_2).products)
            .replace("[", "")
            .replace("]", "")
        );
      })
      .catch((err) => {
        // alert(err);
        openPopup("Ошибка получение конфигурации! Сервис недоступен.", false);
      });
  }

  const handleLanguage = (langValue) => {
    alert(langValue);
    setHostName(langValue);
    setIsMobile(false);
    setIsDeck(true);
    QRButtonClick(langValue);
  };

  function onLogin() {
    //document.body.requestFullscreen(); // полноэкранный  режим
    getUserInfo(14916927);

    // MainApi.authorize("https://172.27.3.89:8282")

    //1
    // MainApi.authorize("https://172.31.143.98:443")
    //   .then((res) => {
    //     if (res.status === "OK") {
    //       getUserInfo(res.value);
    //     } else {
    //       if (res.value === "null") {
    //         openPopup("Пропуск не приложен. Повторите  попытку.", false);
    //       } else openPopup("Номер пропуска не найден.", false);
    //     }
    //   })
    //   .catch(() => {
    //     openPopup("Ошибка авторизации!Сервис недоступен", false);
    //   });
  }

  const getUserInfo = (nomcard) => {
    MainApi.getUserInfo(nomcard)
      .then((res) => {
        if (res.status === "exist") {
          if (res.vis_operator_right === "yes") {
            setUserRole("ОПЕРАТОР:");
            localStorage.setItem("userRole", "ОПЕРАТОР:");
          }
          if (res.vis_metrolog_flag === "yes") {
            setUserRole("ТЕХСПЕЦ:");
            localStorage.setItem("userRole", "ТЕХСПЕЦ:");
          } else if (
            res.vis_metrolog_flag === "yes" &&
            res.vis_operator_right === "yes"
          ) {
            setUserRole("КОНТРОЛЕР:");
            localStorage.setItem("userRole", "КОНТРОЛЕР:");
          }

          localStorage.setItem("currentUser", JSON.stringify(res));

          openPopup("Вы успешно зарегистрировались.", true);
          setUser(res.shortname);
          setLoggedIn(true);
          localStorage.setItem("loggedIn", "true");

          navigate("/pw/mainMenu");
        } else {
          openPopup("Пользователь не найден.", false);
        }
      })
      .catch((err) =>
        openPopup("Ошибка авторизации! Нет связи с сервисом.", false)
      );
  };

  function openPopup(title, status) {
    setPopupTitle(title);
    setIsOpenPopup(true);

    if (status) {
      setPopupImage(success);
    } else setPopupImage(fail);
  }

  function closePopup() {
    setIsOpenPopup(false);
    setPopupTitle("");
  }

  function onLogOutClick() {
    onLogOut();
  }

  function onLogOut() {
    setLoggedIn(false);
    setNomcard("");
    setUser("");
    setUserRole("");

    {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windopw Phone|Kindle|Silk|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        setDescription("-"); 
        setIsMobile(true);
        setIsDeck(false);
      } else {
        setIsMobile(false);
        setIsDeck(true);
        QRButtonClick("DESKTOP-27HV3BB");
      }
    }

    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");

    localStorage.removeItem("lotSelected_OGP");
    localStorage.removeItem("packSelected_OGP");

    localStorage.removeItem("selectCargo");
    localStorage.removeItem("sumCargoValue");

    localStorage.removeItem("config");

    localStorage.removeItem("lotSelected_Ctrl");
    localStorage.removeItem("products");

    localStorage.removeItem("sumPacksValue");
    localStorage.removeItem("ctrlPaksSelectedArray");

    localStorage.removeItem("description");
    localStorage.removeItem("ports");
    localStorage.removeItem("currentPort");

    navigate("/pw/");
  }

  function onBackClick() {
    const path = pathname;

    if (path == "/pw/weighing") {
      navigate("/pw/selectPack");
    }
    if (path == "/pw/selectPack") {
      navigate("/pw/selectLot");
    }
    if (path == "/pw/selectLot") {
      navigate("/pw/mainMenu");
    }
    if (path == "/pw/checkWeightMenu") {
      navigate("/pw/mainMenu");
    }
    if (path == "/pw/checkWeightCargo") {
      navigate("/pw/checkWeightMenu");
    }
    if (path == "/pw/checkWeightInfo") {
      navigate("/pw/checkWeightCargo");
    }

    if (path == "/pw/ctrlWeightMenu") {
      navigate("/pw/mainMenu");
    }

    if (path == "/pw/ctrlWeightLot") {
      navigate("/pw/ctrlWeightMenu");
    }

    if (path == "/pw/ctrlWeightLotPack") {
      navigate("/pw/ctrlWeightLot"); //
    }

    if (path == "/pw/ctrlWeightInfo") {
      navigate("/pw/ctrlWeightLotPack");
    }
  }

  useEffect(() => {
    document.title = title;

    // тестовый  запрос на устновку соединения со считывателем пропусков
    //setPreloader(true);
    // MainApi.setConnect()
    //   .then((result) => {
    //     console.log(result.status);
    //     setPreloader(false);
    //   })
    //   .catch((err) => {
    //     setPreloader(false);
    //   });
  }, [title]);

  useEffect(() => {}, [description]);

  useEffect(() => {}, [isMobile, isDeck]);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedIn"));
  }, [isVisibleBackButon, user, userRole, loggedIn]);

  useEffect(() => {
    //const timer = setTimeout(() => {

    const path = pathname;

    if (localStorage.getItem("loggedIn")) {
      navigate(path);
      setUser(JSON.parse(localStorage.getItem("currentUser")).shortname);
      setUserRole(localStorage.getItem("userRole"));
    } else {
      onLogOut();
    }

    if (path == '/pw/weighing"') {
      setIsVisibleBackButon(true);
    }
    if (path == "/pw/selectPack") {
      setIsVisibleBackButon(true);
      localStorage.removeItem("packSelected_OGP");
    }
    if (path == "/pw/selectLot") {
      setIsVisibleBackButon(true);
      //localStorage.removeItem("selectPacksArray");
    }

    if (path == "/pw/mainMenu") {
      setIsVisibleBackButon(false);
      //localStorage.removeItem("selectLotsArray");
      localStorage.removeItem("lotSelected_OGP");
    }

    if (path == "/pw/checkWeightMenu") {
      setIsVisibleBackButon(true);
      localStorage.removeItem("sumCargoValue");
    }

    if (path == "/pw/checkWeightCargo") {
      setIsVisibleBackButon(true);
      localStorage.removeItem("selectCargo");
      localStorage.removeItem("sumCargoValue");
    }

    if (path == "/pw/checkWeightInfo") {
      setIsVisibleBackButon(true);
    }

    if (path == "/pw/ctrlWeightMenu") {
      setIsVisibleBackButon(true);
    }

    if (path == "/pw/") {
      //onLogOut();
    }
  }, [pathname]);

  useEffect(() => {
    // const timer = setTimeout(() => {
    // onLogOut();
    // }, 30000);
    // return () => clearTimeout(timer);
  });

  return (
    <body className="page">
      <div className="page__content">
        <Header
          authOn={loggedIn}
          user={user}
          userRole={userRole}
          description={description}
        />

        {preloader && <Preloader />}

        {!preloader && (
          <main className="main">
            <Routes>
              <Route
                path="/pw/"
                element={
                  <>
                    <LoginFrame
                      onLogin={onLogin}
                      QRButtonClick={QRButtonClick}
                      isMobile={isMobile}
                      isDeck={isDeck}
                      onSelectLanguage={handleLanguage}
                    />
                  </>
                }
              />

              <Route
                path="/pw/selectLot"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <SelectLotFrame openPopup={openPopup} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pw/selectPack"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <SelectPackFrame openPopup={openPopup} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pw/weighing"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    {<WeighingFrame openPopup={openPopup} />}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pw/mainMenu"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <MainMenuFrame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pw/weighing_APL"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <APLFrame />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pw/checkWeightMenu"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <CheckWeightMenuFrame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pw/checkWeightCargo"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <CheckWeightCargoFrame openPopup={openPopup} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pw/checkWeightInfo"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <CheckWeightInfoFrame openPopup={openPopup} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pw/ctrlWeightMenu"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <CtrlWeightMenuFrame openPopup={openPopup} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pw/ctrlWeightLot"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <CtrlWeightLotFrame openPopup={openPopup} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pw/ctrlWeightLotPack"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <CtrlWeightPackFrame openPopup={openPopup} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pw/ctrlWeightInfo"
                element={
                  <ProtectedRoute onLogin={loggedIn}>
                    <CtrlWeightInfoFrame openPopup={openPopup} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        )}

        {loggedIn && (
          <Footer
            onLogOut={onLogOut}
            onBack={onBackClick}
            isVisibleBackButon={isVisibleBackButon}
          />
        )}

        <InfoTooltip
          text={popupTitle}
          image={popupImage}
          isOpen={isOpenPopup}
          onClose={closePopup}
        />
      </div>
    </body>
  );
}

export default App;

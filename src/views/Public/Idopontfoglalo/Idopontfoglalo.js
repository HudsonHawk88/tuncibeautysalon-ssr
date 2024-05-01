import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Calendar } from "react-widgets";
import moment from "moment";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import { useSearchParams } from "react-router-dom";
import { handleInputChange } from "../../../commons/InputHandlers.js";
import Services from "./Services.js";
import { Button, Label } from "reactstrap";

const defaultIdopont = {
  szolgaltatas: "",
  nap: null,
  kezdete: "",
  ugyfelnev: "",
  ugyfeltelefon: "",
  ugyfelemail: "",
  ugyfelelfogad: false,
};

const Idopontfoglalo = (props) => {
  const { lang, szolgaltatas, accessibility } = props;

  const [idopont, setIdopont] = useState(defaultIdopont);
  const [groups, setGroups] = useState([]);
  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [szabadIdopontok, setSzabadIdopontok] = useState([]);
  const [szabadnapok, setSzabadnapok] = useState([]);
  const [message, setMessage] = useState(null);
  const [searchParams] = useSearchParams();

  const translteSzolgaltatasok = (array) => {
    const szolgArr = [];
    const groups = [];
    array.forEach((szolg) => {
      const szolgObj = Object.assign({}, szolg);
      szolgArr.push(szolgObj);
      groups.push({
        nemetnev: szolgObj.szolgkategoria,
        magyarnev: szolgObj.magyarszolgkategoria,
      });
    });

    const grs = [
      ...new Map(groups.map((item) => [item.nemetnev, item])).values(),
    ];

    setGroups(grs);
    const kategorie = searchParams.get("kategorie");
    if (kategorie) {
      const kat = grs.filter((k) => k.nemetnev === kategorie);
      console.log("KAT: ", kat);
      setGroups(kat);
      /* const found = szolgArr.find((sz) => sz.szolgkategoria === parseInt(kategorie));
      console.log(found);
      if (found) {
        console.log('FOUND: ', found);
      } */
    }
    console.log(szolgArr);
    setSzolgaltatasok(szolgArr);
  };

  useEffect(() => {
    if (!szolgaltatas && szolgaltatasok) {
      listSzolgaltatasok();
    }
  }, [lang]);

  useEffect(() => {
    setIdopont({ ...idopont, szolgaltatas: szolgaltatas });
    if (!szolgaltatas) {
      getSzabadnapok();
      listSzolgaltatasok();
    }
  }, [szolgaltatas]);

  const listSzolgaltatasok = () => {
    Services.listSzolgaltatasok((err, res) => {
      if (!err) {
        translteSzolgaltatasok(res);
      }
    });
  };

  const getSzabadnapok = () => {
    Services.getSzabadnapok((err, res) => {
      if (!err) {
        setSzabadnapok(res);
      }
    });
  };

  const getIdopontok = (nap) => {
    const formattedNap = moment(nap).format("YYYY-MM-DD");
    Services.getIdopontok(
      formattedNap,
      idopont.szolgaltatas,
      lang,
      (err, res) => {
        if (!err) {
          if (res.length > 0) {
            setSzabadIdopontok(res);
          } else {
            const msg =
              lang === "hu"
                ? "Ezen a napon nem foglalható időpont!"
                : "An diesem Tag sind keine Terminbuchungen möglich!";
            setMessage(msg);
          }
        }
      }
    );
  };

  const getOpts = (szolg, szolgIdx) => {
    console.log(szolgIdx + "_szolgId_ " + szolg.id);
    return (
      <Fragment>
        <option key={szolgIdx + "_szolgId_ " + szolg.id} value={szolg.id}>
          {(lang === "hu" ? szolg.magyarszolgrovidnev : szolg.szolgrovidnev) +
            ` - ${szolg.idotartam} ${lang === "hu" ? "perc" : "Minuten"} - ${
              szolg.ar
            } ${szolg.penznem}`}
        </option>
      </Fragment>
    );
  };

  const setActive = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const value = element.innerText ? element.innerText : null;
      const val = value.substring(0, element.id.length);
      if (val) {
        const kezdete = moment(idopont.nap).format("YYYY-MM-DD") + " " + val;
        setIdopont({
          ...idopont,
          kezdete: moment(kezdete).format("YYYY-MM-DD HH:mm"),
        });
        const elements = document.getElementsByClassName("idopontfoglalo__ido");

        Array.from(elements).forEach((el) => {
          const elId = el.id.replace(" ", "");

          if (elId == val) {
            el.classList.add("active");
          } else {
            el.classList.remove("active");
          }
        });
      }
    }
  };

  const foglal = () => {
    let submitObj = idopont;
    submitObj.nap = moment(submitObj.nap).format("YYYY-MM-DD");
    Services.foglalas(idopont, lang, (err) => {
      if (!err) {
        /* window.setTimeout(() => {
          
        }, 5000) */
        window.location.href = "/erfolgreich";
      }
    });
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      {console.log(idopont)}
      <div className="row">
        <div className="col-md-12">
          <h3>{lang === "hu" ? "Időpontfoglaló" : "Termin buchen"}</h3>
        </div>
      </div>
      <hr style={{ color: "rgba(241, 24, 24, 1)" }} />
      <div className="row">
        {!szolgaltatas && (
          <div style={{ margin: "10px 0px" }} className="col-md-3">
            <Label htmlFor="szolgaltatas" style={{ fontSize: "1.8em" }}>
              {lang === "hu" ? "Szolgáltatás" : "Dienestlungen"}
            </Label>
            <RVInput
              type="select"
              name="szolgaltatas"
              id="szolgaltatas"
              required
              value={idopont.szolgaltatas}
              onChange={(e) => {
                setIdopont({
                  ...idopont,
                  szolgaltatas: e.target.value,
                  nap: "",
                  kezdete: "",
                });
                setSzabadIdopontok([]);
              }}
            >
              <option key="default">
                {lang === "hu"
                  ? "Kérjük válasszon szolgáltatást"
                  : "Bitte wählen Sie eine Dienstleistung aus"}
              </option>
              {groups.map((group) => {
                const szolgok = szolgaltatasok.filter(
                  (sz) => sz.szolgkategoria === group.nemetnev
                );
                return (
                  <optgroup
                    key={lang === "hu" ? group.magyarnev : group.nemetnev}
                    label={lang === "hu" ? group.magyarnev : group.nemetnev}
                  >
                    {szolgok.map((szolg, szolgIdx) => {
                      return getOpts(szolg, szolgIdx);
                    })}
                  </optgroup>
                );
              })}
            </RVInput>
          </div>
        )}
        <div
          style={{ margin: "10px 0px" }}
          className="col-md-3"
          hidden={!idopont.szolgaltatas}
        >
          <Label htmlFor="szolgaltatas" style={{ fontSize: "1.8em" }}>
            {lang === "hu" ? "Nap" : "Tage"}
          </Label>
          {console.log(moment().month(6).format("MMMM"))}
          <Calendar
            min={new Date(moment().add(1, "days"))}
            value={idopont.nap ? new Date(idopont.nap) : null}
            onChange={(v) => {
              const selectedMonth = moment(v).get("month");
              const selectedDay = moment(v).format("DD");
              console.log(selectedDay, selectedMonth);
              const found = szabadnapok.find(
                (un) =>
                  un.honap - 1 === selectedMonth &&
                  un.nap === parseInt(selectedDay, 10)
              );
              console.log(found);
              setIdopont({ ...idopont, nap: v, kezdete: null });
              if (found) {
                const msg =
                  lang === "hu"
                    ? "Ezen a napon nem foglalható időpont!"
                    : "An diesem Tag sind keine Terminbuchungen möglich!";
                setMessage(msg);
              } else {
                setMessage(null);

                getIdopontok(v);
              }
            }}
          />
        </div>
        <div
          style={{ margin: "10px 0px" }}
          className="col-md-3"
          hidden={!idopont.nap && !message}
        >
          <Label style={{ fontSize: "1.8em" }}>
            {lang === "hu" ? "Időpont" : "Termin"}
          </Label>
          <div className="idopontfoglalo__idopontok">
            {message
              ? message
              : idopont.nap && szabadIdopontok.length > 0
              ? szabadIdopontok.map((szi, idx) => {
                  return (
                    <div
                      key={szi + "_szolgido_" + idx}
                      onClick={(e) => setActive(szi, e)}
                      className="idopontfoglalo__ido"
                      id={szi}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          setActive(szi, e);
                        }}
                      >
                        {szi}
                      </a>
                    </div>
                  );
                })
              : message}
          </div>
        </div>
        <div
          style={{ margin: "10px 0px" }}
          className="col-md-3"
          hidden={
            !idopont.szolgaltatas ||
            !idopont.nap ||
            !idopont.kezdete ||
            message ||
            szabadIdopontok.length === 0 ||
            idopont.kezdete === ""
          }
        >
          <Label style={{ fontSize: "1.8em" }}>
            {lang === "hu" ? "Ügyfél adatok" : "Kundendaten"}
          </Label>
          <div className="idopontfoglalo__ugyfeladatok">
            <div style={{ margin: "0 0 10px 0" }}>
              <RVInput
                type="text"
                placeholder={lang === "hu" ? "Ügyfélnév" : "Kundenname"}
                name="ugyfelnev"
                id="ugyfelnev"
                value={idopont.ugyfelnev}
                onChange={(e) => handleInputChange(e, idopont, setIdopont)}
              />
            </div>
            <div style={{ margin: "10px 0" }}>
              <RVInput
                type="text"
                placeholder={lang === "hu" ? "Ügyféltelefon" : "Kundentelefon"}
                name="ugyfeltelefon"
                id="ugyfeltelefon"
                value={idopont.ugyfeltelefon}
                onChange={(e) => handleInputChange(e, idopont, setIdopont)}
              />
            </div>
            <div style={{ margin: "10px 0" }}>
              <RVInput
                type="text"
                placeholder={lang === "hu" ? "Ügyfélemail" : "Kunden-eMail"}
                name="ugyfelemail"
                id="ugyfelemail"
                value={idopont.ugyfelemail}
                onChange={(e) => handleInputChange(e, idopont, setIdopont)}
              />
            </div>
            <div style={{ margin: "10px 0" }}>
              <div style={{ display: "inline-block" }}>
                <Label>
                  {lang === "hu"
                    ? "Elfogadom, hogy adataimat a szolgáltató kezelhesse."
                    : "Ich bin damit einverstanden, dass meine Daten vom Dienstleister verwaltet werden."}
                </Label>
                &nbsp;
                <RVInput
                  type="checkbox"
                  name="ugyfelelfogad"
                  id="ugyfelelfogad"
                  value={idopont.ugyfelelfogad}
                  onChange={(e) => handleInputChange(e, idopont, setIdopont)}
                />
              </div>
            </div>
            <div style={{ margin: "10px 0 0 0" }}>
              <Button
                disabled={
                  !idopont.szolgaltatas ||
                  !idopont.nap ||
                  !idopont.kezdete ||
                  !idopont.ugyfelnev ||
                  !idopont.ugyfelemail ||
                  !idopont.ugyfeltelefon ||
                  !idopont.ugyfelelfogad
                }
                style={{
                  background: `${
                    accessibility === "true"
                      ? "rgba(255,255,255, 1)"
                      : "rgba(241, 24, 24, 1)"
                  }`,
                  color: "black",
                  width: "100%",
                }}
                onClick={() => foglal()}
              >
                <span>
                  <strong>
                    {lang === "hu" ? "Időpont foglalása" : "Termin buchen"}
                  </strong>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Idopontfoglalo.propTypes = {
  accessibility: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  addNotification: PropTypes.func,
  szolgaltatas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Idopontfoglalo;

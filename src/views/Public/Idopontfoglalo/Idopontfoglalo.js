import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Calendar } from "react-widgets";
import moment from "moment";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import { handleInputChange } from "../../../commons/InputHandlers";
import Services from "./Services";
import { Button, Label } from "reactstrap";

const defaultIdopont = {
  szolgaltatas: null,
  nap: null,
  kezdete: null,
  ugyfelnev: null,
  ugyfeltelefon: null,
  ugyfelemail: null,
  ugyfelelfogad: false,
};

const Idopontfoglalo = (props) => {
  const { lang, szolgaltatas } = props;

  const [idopont, setIdopont] = useState(defaultIdopont);
  const [groups, setGroups] = useState([]);
  const [szolgaltatasok, setSzolgaltatasok] = useState([]);

  const translteSzolgaltatasok = (array) => {
    const szolgArr = [];
    const groups = [];
    array.forEach((szolg) => {
      const szolgObj = Object.assign({}, szolg);
      szolgArr.push(szolgObj);
      if (lang === "ch") {
        groups.push(szolgObj.szolgkategoria);
      } else if (lang === "hu") {
        groups.push(szolgObj.magyarszolgkategoria);
      }
    });

    setGroups([...new Set(groups.map((g) => g))]);
    setSzolgaltatasok(szolgArr);
  };

  useEffect(() => {
    if (!szolgaltatas && szolgaltatasok) {
      translteSzolgaltatasok(szolgaltatasok);
    }
  }, [lang]);

  useEffect(() => {
    setIdopont({ ...idopont, szolgaltatas: szolgaltatas });
    if (!szolgaltatas) {
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

  const getOpts = (szolg) => {
    return (
      <Fragment>
        <option key={szolg.id} value={szolg.id}>
          {lang === "hu" ? szolg.magyarszolgrovidnev : szolg.szolgrovidnev}
        </option>
      </Fragment>
    );
  };

  const setActive = (id) => {
    const element = document.getElementById(id);

    if (element) {
      const value = element.innerText ? element.innerText : null;
      if (value) {
        const kezdete = moment(idopont.nap).format("YYYY-MM-DD") + " " + value;
        setIdopont({
          ...idopont,
          kezdete: moment(kezdete).format("YYYY-MM-DD HH:mm"),
        });
        const elements = document.getElementsByClassName("idopontfoglalo__ido");

        Array.from(elements).forEach((el) => {
          if (el.id === value) {
            el.classList.add("active");
          } else {
            el.classList.remove("active");
          }
        });
      }
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="row">
        <div className="col-md-12">
          <h3>{lang === "hu" ? "Időpontfoglaló" : "Termin buchen"}</h3>
        </div>
      </div>
      <hr style={{ color: "rgba(241, 24, 24, 1)" }} />
      <div className="row">
        {!szolgaltatas && (
          <div className="col-md-3">
            <Label htmlFor="szolgaltatas">
              {lang === "hu" ? "Szolgáltatás" : "Dienestlungen"}
            </Label>
            <RVInput
              type="select"
              name="szolgaltatas"
              id="szolgaltatas"
              required
              value={idopont.szolgaltatas}
              onChange={(e) => handleInputChange(e, idopont, setIdopont)}
            >
              <option key="default">
                {lang === "hu"
                  ? "Kérjük válasszon szolgáltatást"
                  : "Bitte wählen Sie eine Dienstleistung aus"}
              </option>
              {groups.map((group) => {
                return (
                  <optgroup key={group} label={group}>
                    {szolgaltatasok.map((szolg) => {
                      return getOpts(szolg);
                    })}
                  </optgroup>
                );
              })}
            </RVInput>
          </div>
        )}
        <div className="col-md-3" hidden={!idopont.szolgaltatas}>
          <Label htmlFor="szolgaltatas">{lang === "hu" ? "Nap" : "Tage"}</Label>
          <Calendar
            min={moment().add(1, "days")}
            value={idopont.nap ? new Date(idopont.nap) : null}
            onChange={(v) => {
              setIdopont({ ...idopont, nap: moment(v).format("YYYY.MM.DD") });
            }}
          />
        </div>
        <div className="col-md-3" hidden={!idopont.nap}>
          <Label>{lang === "hu" ? "Időpont" : "Termin"}</Label>
          <div className="idopontfoglalo__idopontok">
            {idopont.nap && (
              <Fragment>
                <div
                  key="11:30"
                  onClick={(e) => setActive(e.target.id)}
                  className="idopontfoglalo__ido"
                  id="11:30"
                >
                  11:30
                </div>
                <div
                  key="13:30"
                  onClick={(e) => setActive(e.target.id)}
                  className="idopontfoglalo__ido"
                  id="13:30"
                >
                  13:30
                </div>
                <div
                  key="15:30"
                  onClick={(e) => setActive(e.target.id)}
                  className="idopontfoglalo__ido"
                  id="15:30"
                >
                  15:30
                </div>
              </Fragment>
            )}
          </div>
        </div>
        <div
          className="col-md-3"
          hidden={!idopont.szolgaltatas || !idopont.nap || !idopont.kezdete}
        >
          <Label>{lang === "hu" ? "Ügyfél adatok" : "Kundendaten"}</Label>
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
                  background: "rgba(241, 24, 24, 1)",
                  color: "black",
                  width: "100%",
                }}
                onClick={() => console.log("IDOPONT: ", idopont)}
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
  lang: PropTypes.string.isRequired,
  addNotification: PropTypes.func,
  szolgaltatas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Idopontfoglalo;

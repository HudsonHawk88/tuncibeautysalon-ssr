import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Calendar } from "react-widgets";
import moment from "moment";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import { handleInputChange } from "../../../commons/InputHandlers.js";
import Services from "./Services.js";
import { Button, Label } from "reactstrap";
import { sorter } from "../../../commons/Lib.js";

const defaultIdopont = {
  szolgaltatasok: [],
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
  const [filteredSzolgaltatasok, setFilteredSzolgaltatasok] = useState([]);
  const [szabadIdopontok, setSzabadIdopontok] = useState([]);
  const [szabadnapok, setSzabadnapok] = useState([]);
  const [message, setMessage] = useState(null);
  // const [searchParams] = useSearchParams();
  const [selectedSzolgaltatas, setSelectedSzolgaltatas] = useState("");

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
    // const kategorie = searchParams.get("kategorie");
    // if (kategorie) {
    //   const kat = grs.filter((k) => k.nemetnev === kategorie);
    //   setGroups(kat);
    // }
    setSzolgaltatasok(szolgArr);
    setFilteredSzolgaltatasok(szolgArr);
  };

  useEffect(() => {
    getSzabadnapok();
    listSzolgaltatasok();
  }, [lang]);

  useEffect(() => {
    const nap = idopont.nap;
    if (nap) {
      getIdopontok(nap);
    }
  }, [idopont.nap, idopont.szolgaltatasok.length]);

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
    if (nap && idopont.szolgaltatasok.length > 0) {
      const found = isSzabadnapos(nap);
      Services.getIdopontok(
        formattedNap,
        idopont.szolgaltatasok,
        lang,
        (err, res) => {
          if (!err) {
            if (res.length > 0 && !found) {
              setSzabadIdopontok(res);
              setMessage(null);
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
    }
  };

  const getOpts = (szolg, szolgIdx) => {
    return (
      <option key={szolgIdx + "_szolgId_ " + szolg.id} value={szolg.id}>
        {(lang === "hu" ? szolg.magyarszolgrovidnev : szolg.szolgrovidnev) +
          ` - ${szolg.idotartam} ${lang === "hu" ? "perc" : "Minuten"} - ${
            szolg.ar
          } ${szolg.penznem}`}
      </option>
    );
  };

  const setActive = (id, e) => {
    if (id) {
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
          const elements = document.getElementsByClassName(
            "idopontfoglalo__ido"
          );

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
    } else {
      const elements = document.getElementsByClassName("idopontfoglalo__ido");

      Array.from(elements).forEach((el) => {
        el.classList.remove("active");
      });
      setIdopont({
        ...idopont,
        kezdete: null,
      });
    }
  };

  const foglal = () => {
    let submitObj = idopont;
    submitObj.nap = moment(submitObj.nap).format("YYYY-MM-DD");
    Services.foglalas(idopont, lang, (err) => {
      if (!err) {
        window.location.href = "/erfolgreich";
      } else {
        console.log(err.err.ok);
        if (err.err.ok === "OVERLAP") {
          getIdopontok(submitObj.nap);
          setActive(null);
        }
      }
    });
  };

  const isSzabadnapos = (value) => {
    let result = false;
    if (szabadnapok && szabadnapok.length > 0) {
      for (let i = 0; i < szabadnapok.length; i++) {
        const isKezdete =
          moment(value).format("YYYY-MM-DD") ===
          moment(szabadnapok[i].kezdete).format("YYYY-MM-DD");
        const isVege =
          moment(value).format("YYYY-MM-DD") ===
          moment(szabadnapok[i].vege).format("YYYY-MM-DD");
        const isBetween = moment(value).isBetween(
          szabadnapok[i].kezdete,
          szabadnapok[i].vege
        );

        if (isKezdete || isVege || isBetween) {
          result = true;
          break;
        }
      }
    }
    return result;
  };

  const deleteSzolgaltatas = (id) => {
    const filtered =
      idopont.szolgaltatasok.length > 0
        ? idopont.szolgaltatasok.filter((sz) => sz !== id)
        : null;
    setIdopont({
      ...idopont,
      szolgaltatasok: filtered ? filtered : szolgaltatasok,
    });
    const filteredSzolgok = szolgaltatasok.filter((sz) => {
      return filtered.some((f) => {
        return f !== sz.id;
      });
    });

    setFilteredSzolgaltatasok(
      filtered && filtered.length > 0 ? filteredSzolgok : szolgaltatasok
    );
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <div className="row">
        <div className="col-md-12">
          <h3>{lang === "hu" ? "Időpontfoglaló" : "Termin buchen"}</h3>
        </div>
      </div>
      <hr style={{ color: "rgba(241, 24, 24, 1)" }} />
      <div className="row">
        {!szolgaltatas && (
          <div style={{ margin: "10px 0px" }} className="col-md-3">
            <div
              style={{ margin: "10px 0px" }}
              // hidden={idopont.szolgaltatasok.length === 0}
            >
              <Label htmlFor="szolgaltatas" style={{ fontSize: "1.8em" }}>
                {lang === "hu" ? "Nap" : "Tage"}
              </Label>
              <Calendar
                min={new Date(moment().add(1, "days"))}
                value={idopont.nap ? new Date(idopont.nap) : null}
                onChange={(v) => {
                  setIdopont({ ...idopont, nap: v, kezdete: null });
                  getIdopontok(v);
                }}
              />
            </div>
            <div>
              <Label htmlFor="szolgaltatas" style={{ fontSize: "1.8em" }}>
                {lang === "hu" ? "Szolgáltatás" : "Dienestlungen"}
              </Label>
              <RVInput
                type="select"
                name="szolgaltatas"
                id="szolgaltatas"
                required
                value={selectedSzolgaltatas}
                onChange={(e) => {
                  setIdopont({
                    ...idopont,
                    szolgaltatasok: [
                      ...idopont.szolgaltatasok,
                      parseInt(e.target.value),
                    ],
                  });
                  const filtered = filteredSzolgaltatasok.filter(
                    (fsz) => fsz.id !== parseInt(e.target.value)
                  );
                  setFilteredSzolgaltatasok(filtered);
                  setSelectedSzolgaltatas("");
                  setSzabadIdopontok([]);
                  getIdopontok(idopont.nap);
                }}
              >
                <option key="default">
                  {lang === "hu"
                    ? "Kérjük válasszon szolgáltatást"
                    : "Bitte wählen Sie eine Dienstleistung aus"}
                </option>
                {groups.map((group, idx) => {
                  let szolgok = filteredSzolgaltatasok.filter(
                    (sz) => sz.szolgkategoria === group.nemetnev
                  );
                  szolgok = szolgok.sort(sorter("sorrend", "number"));
                  return (
                    szolgok.length > 0 && (
                      <optgroup
                        key={"group_" + idx}
                        id={"group_" + idx}
                        label={lang === "hu" ? group.magyarnev : group.nemetnev}
                      >
                        {szolgok.map((szolg, szolgIdx) => {
                          return getOpts(szolg, szolgIdx);
                        })}
                      </optgroup>
                    )
                  );
                })}
              </RVInput>
            </div>
          </div>
        )}
        <div
          style={{ margin: "10px 0px" }}
          className="col-md-3"
          hidden={idopont.szolgaltatasok.length === 0}
        >
          {idopont.szolgaltatasok.map((sz) => {
            const szolg = szolgaltatasok.find((s) => s.id === sz)
              ? szolgaltatasok.find((s) => s.id === sz)
              : null;
            return szolg ? (
              <div className="szolgbuborek" key={"szelszolg_" + sz}>
                <div className="szoveg">
                  {lang === "hu"
                    ? szolg.magyarszolgrovidnev
                    : szolg.szolgrovidnev}
                  <br />
                  {szolg.ar + " " + szolg.penznem}
                  <br />
                  {`${szolg.idotartam} ${lang === "hu" ? "perc" : "minuten"}`}
                </div>
                <div
                  className="torles"
                  tabIndex={0}
                  onClick={() => deleteSzolgaltatas(szolg.id)}
                >
                  x
                </div>
              </div>
            ) : null;
          })}
        </div>
        <div
          style={{ margin: "10px 0px" }}
          className="col-md-3"
          hidden={
            (!idopont.nap || idopont.szolgaltatasok.length === 0) && !message
          }
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
            idopont.szolgaltatasok.length === 0 ||
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
                  idopont.szolgaltatasok.length === 0 ||
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

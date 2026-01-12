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
  hirlevelFeliratkozas: true,
  feliratkozoNyelv:
    __isBrowser__ && localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "ch",
};

const Idopontfoglalo = (props) => {
  const { lang, szolgaltatas, accessibility } = props;

  const [idopont, setIdopont] = useState(defaultIdopont);
  const [groups, setGroups] = useState([]);
  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [filteredSzolgaltatasok, setFilteredSzolgaltatasok] = useState([]);
  const [idopontok, setIdopontok] = useState([]);
  const [szabadnapok, setSzabadnapok] = useState([]);
  const [nyitvatartas, setNyitvatartas] = useState(null);
  const [message, setMessage] = useState(null);
  const [foundInSzabadnap, setFoundInSzabadnap] = useState(false);
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
    getNyitvatartasok();
    getSzabadnapok();
    listSzolgaltatasok();
    setIdopont({ ...idopont, feliratkozoNyelv: lang });
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

  const getNyitvatartasok = () => {
    Services.getNyitvatartas((err, res) => {
      if (!err) {
        if (res && res.nyitvatartas) {
          setNyitvatartas(res.nyitvatartas ? res.nyitvatartas : null);
        }
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
    // const formattedNap = moment('2024-06-01').format('YYYY-MM-DD');
    const found = isSzabadnapos(formattedNap);
    setMessage(null);
    if (nap && !found) {
      Services.getIdopontok(formattedNap, lang, (err, res) => {
        if (!err) {
          setIdopontok(res);
        }
      });
    } else if (found) {
      setMessage(
        lang == "hu"
          ? "Ezen a napon nem foglalható időpont!"
          : "An diesem Tag sind keine Terminbuchungen möglich!"
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

  // const setActive = (id, e) => {
  //   if (id) {
  //     e.stopPropagation();
  //     e.preventDefault();
  //     const element = document.getElementById(id);
  //     if (element) {
  //       const value = element.innerText ? element.innerText : null;
  //       const val = value.substring(0, element.id.length);
  //       if (val) {
  //         const kezdete = moment(idopont.nap).format("YYYY-MM-DD") + " " + val;
  //         setIdopont({
  //           ...idopont,
  //           kezdete: moment(kezdete).format("YYYY-MM-DD HH:mm"),
  //         });
  //         const elements = document.getElementsByClassName(
  //           "idopontfoglalo__ido"
  //         );

  //         Array.from(elements).forEach((el) => {
  //           const elId = el.id.replace(" ", "");

  //           if (elId == val) {
  //             el.classList.add("active");
  //           } else {
  //             el.classList.remove("active");
  //           }
  //         });
  //       }
  //     }
  //   } else {
  //     const elements = document.getElementsByClassName("idopontfoglalo__ido");

  //     Array.from(elements).forEach((el) => {
  //       el.classList.remove("active");
  //     });
  //     setIdopont({
  //       ...idopont,
  //       kezdete: null,
  //     });
  //   }
  // };

  const foglal = () => {
    let submitObj = idopont;
    submitObj.nap = moment(submitObj.nap).format("YYYY-MM-DD");
    const kezdete = moment(
      moment(`${submitObj.nap} ${idopont.kezdete}:00`)
    ).format("YYYY-MM-DD HH:mm:ss");
    submitObj.kezdete = kezdete;

    // console.log("submitObj: ", submitObj);

    Services.foglalas(idopont, lang, (err) => {
      if (!err) {
        window.location.href = "/erfolgreich";
      } else {
        if (err.ok === "OVERLAP") {
          setIdopont({ ...idopont, kezdete: "" });
          getIdopontok(submitObj.nap);
          // setActive(null);
        }
      }
    });
  };

  const isSzabadnapos = (value) => {
    let result = false;
    const isOpen = nyitvatartas
      ? nyitvatartas[`is${moment(value).format("dddd")}`]
      : false;
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

        if ((isKezdete || isVege || isBetween) && !isOpen) {
          result = true;
          break;
        }
      }
    }

    result = isOpen ? result : true;
    setFoundInSzabadnap(result);
    return result;
  };

  const deleteSzolgaltatas = (id) => {
    const filtered =
      idopont.szolgaltatasok.length > 0
        ? idopont.szolgaltatasok.filter((sz) => sz !== id)
        : null;

    const filteredSzolgok = szolgaltatasok.filter((sz) => {
      return filtered.some((f) => {
        return f !== sz.id;
      });
    });

    setIdopont({
      ...idopont,
      kezdete: filteredSzolgok.length ? idopont.kezdete : "",
      szolgaltatasok: filtered ? filtered : szolgaltatasok,
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
                  setIdopont({ ...idopont, nap: v, kezdete: "" });
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
                  setIdopontok([]);
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
          hidden={!idopont.nap || idopont.szolgaltatasok.length === 0}
        >
          <div>
            <Label style={{ fontSize: "1.8em" }}>
              {lang === "hu" ? "Foglalt időpontok" : "Gebuchte Termine"}
            </Label>
            <div className="idopontfoglalo__idopontok">
              {idopontok.length === 0
                ? lang == "hu"
                  ? "Nincs még foglalt időpont a napra!"
                  : "Für diesen Tag sind noch keine Termine gebucht!"
                : idopont.nap &&
                  idopontok.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "100%",
                        flexDirection: "row",
                      }}
                    >
                      {idopontok.map((idop, idx) => {
                        return (
                          <div key={"IDOP_" + idx.toString()}>
                            <span style={{ fontSize: "1.2rem" }}>{`${moment(
                              idop.kezdete
                            ).format("YYYY-MM-DD HH:mm")} - ${moment(
                              idop.vege
                            ).format("YYYY-MM-DD HH:mm")}`}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
            </div>
          </div>
          <div>
            <Label style={{ fontSize: "1.8em" }}>
              {lang === "hu" ? "Foglalni kívánt időpont" : "Gewünschtes Datum"}
            </Label>
            <div className="idopontfoglalo__idopontok">
              {foundInSzabadnap ? (
                message
              ) : (
                <RVInput
                  type="time"
                  name="idopont"
                  includeTime
                  onChange={(e) => {
                    setIdopont({ ...idopont, kezdete: e.target.value });
                  }}
                  value={idopont.kezdete}
                />
              )}
            </div>
          </div>
        </div>
        <div
          style={{ margin: "10px 0px" }}
          className="col-md-3"
          hidden={
            idopont.szolgaltatasok.length === 0 ||
            !idopont.nap ||
            !idopont.kezdete ||
            foundInSzabadnap ||
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
                    ? "Feliratkozom a hírlevélre"
                    : "Ich abonniere den Newsletter"}
                </Label>
                &nbsp;
                <RVInput
                  type="checkbox"
                  name="hirlevelFeliratkozas"
                  id="hirlevelFeliratkozas"
                  checked={idopont.hirlevelFeliratkozas}
                  onChange={(e) => handleInputChange(e, idopont, setIdopont)}
                />
              </div>
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
                  checked={idopont.ugyfelelfogad}
                  onChange={(e) => handleInputChange(e, idopont, setIdopont)}
                />
              </div>
            </div>
            <div style={{ margin: "10px 0 0 0" }}>
              <Button
                className={`foglalButton ${
                  accessibility === "true" ? "active" : ""
                }`}
                disabled={
                  idopont.szolgaltatasok.length === 0 ||
                  !idopont.nap ||
                  !idopont.kezdete ||
                  !idopont.ugyfelnev ||
                  !idopont.ugyfelemail ||
                  !idopont.ugyfeltelefon ||
                  !idopont.ugyfelelfogad
                }
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

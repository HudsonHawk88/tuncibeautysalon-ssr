import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar } from "react-widgets";
import moment from "moment";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import { handleInputChange } from "../../../commons/InputHandlers.js";
import { Label } from "reactstrap";
import { sorter } from "../../../commons/Lib.js";

const IdopontokForm = (props) => {
  const {
    idopont,
    lang,
    setIdopont,
    getSzabadIdopontok,
    selectedSzolgaltatas,
    filteredSzolgaltatasok,
    setFilteredSzolgaltatasok,
    setSelectedSzolgaltatas,
    setSzabadIdopontok,
    groups,
    getOpts,
    szolgaltatasok,
    deleteSzolgaltatas,
    message,
    szabadIdopontok,
    setActive,
    nyelv,
    setNyelv,
    nyelvOptions,
  } = props;

  console.log("nyelvOptions: ", nyelvOptions);

  useEffect(() => {
    const nap = idopont.nap;
    if (nap) {
      getSzabadIdopontok(nap);
    }
  }, [idopont.nap, idopont.szolgaltatasok]);

  return (
    <div className="row">
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
              getSzabadIdopontok(v);
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
              getSzabadIdopontok(idopont.nap);
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
                    {szi}
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
            <RVInput
              type="select"
              placeholder={lang === "hu" ? "Ügyfélnyelv" : "Kundensprache"}
              name="ugyfelnyelv"
              id="ugyfelnyelv"
              value={nyelv}
              onChange={(e) => setNyelv(e.target.value)}
            >
              {nyelvOptions &&
                nyelvOptions.length > 0 &&
                nyelvOptions.map((nyo) => {
                  return (
                    <option key={`nyelvopt_${nyo.id}`} value={nyo.value}>
                      {nyo.label}
                    </option>
                  );
                })}
            </RVInput>
          </div>
        </div>
      </div>
    </div>
  );
};

IdopontokForm.propTypes = {
  idopont: PropTypes.shape({
    nap: PropTypes.any,
    szolgaltatasok: PropTypes.array,
    kezdete: PropTypes.any,
    ugyfelnev: PropTypes.string,
    ugyfelemail: PropTypes.string,
    ugyfeltelefon: PropTypes.string,
  }),
  lang: PropTypes.string.isRequired,
  setIdopont: PropTypes.func.isRequired,
  getSzabadIdopontok: PropTypes.func.isRequired,
  selectedSzolgaltatas: PropTypes.any,
  filteredSzolgaltatasok: PropTypes.array.isRequired,
  setFilteredSzolgaltatasok: PropTypes.func.isRequired,
  setSelectedSzolgaltatas: PropTypes.func.isRequired,
  setSzabadIdopontok: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  getOpts: PropTypes.func.isRequired,
  szolgaltatasok: PropTypes.array.isRequired,
  deleteSzolgaltatas: PropTypes.func.isRequired,
  message: PropTypes.any,
  szabadIdopontok: PropTypes.array.isRequired,
  setActive: PropTypes.func.isRequired,
  nyelv: PropTypes.string.isRequired,
  setNyelv: PropTypes.func.isRequired,
  nyelvOptions: PropTypes.array.isRequired,
};

export default IdopontokForm;

import React, { useEffect, useState } from "react";
import Services from "./Services.js";
import { Table } from "reactstrap";
import PropTypes from "prop-types";

const Preisliste = (props) => {
  const { lang } = props;

  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [groups, setGroups] = useState([]);
  const [deviceDimensions, setDeviceDimensions] = useState(
    __isBrowser__
      ? { height: window.innerHeight, width: window.innerWidth }
      : { height: 0, width: 0 }
  );

  const tableHeaders = [
    { id: 0, name: lang === "ch" ? "Dienstleistungen" : "Szolgáltatások" },
    { id: 1, name: lang === "ch" ? "Einzelheiten" : "Részletek" },
    { id: 2, name: lang === "ch" ? "Preis" : "Ár" },
    { id: 3, name: lang === "ch" ? "Zeitraum" : "Időtartam" },
  ];

  const resizeListener = () => {
    setDeviceDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };

  useEffect(() => {
    init();
    if (__isBrowser__) {
      window.addEventListener("resize", resizeListener);
    }

    return () => {
      if (__isBrowser__) window.removeEventListener("resize", resizeListener);
    };
  }, [lang]);

  const init = () => {
    listSzolgaltatasok();
  };

  const listSzolgaltatasok = () => {
    Services.listSzolgaltatasok((err, res) => {
      if (!err) {
        const szolgArr = [];
        const groups = [];
        res.forEach((szolg) => {
          const szolgObj = Object.assign(
            {},
            {
              id: szolg.id,
              szolgrovidnev:
                lang === "ch" ? szolg.szolgrovidnev : szolg.magyarszolgrovidnev,
              szolgreszletek:
                lang === "ch"
                  ? szolg.szolgreszletek
                  : szolg.magyarszolgreszletek,
              ar: lang === "ch" ? szolg.ar : szolg.magyarar,
              penznem: lang === "ch" ? szolg.penznem : szolg.magyarpenznem,
              idotartam: szolg.idotartam,
              kategorianev: szolg.szolgkategoria,
              magyarkategorianev: szolg.magyarszolgkategoria,
            }
          );
          szolgArr.push(szolgObj);
          if (lang === "ch") {
            groups.push(szolgObj.kategorianev);
          } else if (lang === "hu") {
            groups.push(szolgObj.magyarkategorianev);
          }
        });

        setGroups([...new Set(groups.map((g) => g))]);
        setSzolgaltatasok(szolgArr);
      }
    });
  };

  /* const renderSzolgaltatasok = () => {
    const columns = [
      {
        text: lang === "ch" ? "Dienstleistungen" : "Szolgáltatások",
        dataField: "szolgrovidnev",
      },
      {
        text: lang === "ch" ? "Einzelheiten" : "Részletek",
        dataField: "szolgreszletek",
      },
      {
        text: lang === "ch" ? "Preis" : "Ár",
        dataField: "ar",
        formatter: arFormatter,
      },
      {
        text: lang === "ch" ? "Zeitraum" : "Időtartam",
        dataField: "idotartam",
        formatter: idotartamFormatter,
      },
    ];

    return <DataTable columns={columns} datas={szolgaltatasok} />;
  }; */

  const toggleSzoveg = (e, id) => {
    const row = document.getElementsByClassName(`rowClass_${id}`);
    if (e && e.target && row) {
      Array.prototype.forEach.call(Array.from(row), (r) => {
        const children = Array.from(r.children);
        if (r.className === `rowClass_${id}`) {
          Array.prototype.forEach.call(children, (cell) => {
            const c =
              Array.from(cell.children)[1] &&
              Array.from(cell.children)[1].className
                ? Array.from(cell.children)[1]
                : cell;
            if (c.className === "szolgreszletek") {
              const tobbDiv = Array.from(c.children)[0];
              if (c.style.whiteSpace && tobbDiv) {
                c.style.whiteSpace =
                  c.style.whiteSpace === "nowrap" ? "break-spaces" : "nowrap";
                tobbDiv.innerText =
                  c.style.whiteSpace === "nowrap"
                    ? lang === "ch"
                      ? "Mehr..."
                      : "Több..."
                    : lang === "ch"
                    ? "Weniger..."
                    : "Kevesebb...";
              }
            }
          });
        } else {
          Array.prototype.forEach.call(children, (cell) => {
            const c =
              Array.from(cell.children)[1] &&
              Array.from(cell.children)[1].className
                ? Array.from(cell.children)[1]
                : cell;
            if (c.className === "szolgreszletek") {
              const tobbDiv = Array.from(c.children)[0];
              if (c.style.whiteSpace && tobbDiv) {
                c.style.whiteSpace = "nowrap";
                tobbDiv.innerText = lang === "ch" ? "Mehr..." : "Több...";
              }
            }
          });
        }
      });
    }
  };

  const getRows = (group, obj) => {
    const priceListSzolgReszletStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: deviceDimensions.width < 992 ? "50%" : "200ch",
      display: deviceDimensions.width < 992 ? "inline-block" : "table-cell",
      padding: "10px",
      cursor: "pointer",
    };

    const szolgReszletek =
      deviceDimensions.width < 992 ? (
        <span
          key={"2_cell"}
          className="szolgreszletek"
          style={priceListSzolgReszletStyle}
          // onClick={(e) => toggleSzoveg(e, obj.id)}
        >
          {`${obj.szolgreszletek} `}
          {deviceDimensions.width < 992 && (
            <div
              style={{
                fontWeight: 900,
                textDecoration: "underline",
                cursor: "pointer",
                color: "#333",
              }}
              onClick={(e) => toggleSzoveg(e, obj.id)}
            >
              {lang === "ch" ? "Mehr..." : "Több..."}
            </div>
          )}
        </span>
      ) : (
        <span
          className="szolgreszletek"
          style={priceListSzolgReszletStyle}
          key={"2_cell"}
          // onClick={(e) => toggleSzoveg(e, obj.id)}
        >
          {`${obj.szolgreszletek} `}
          {deviceDimensions.width < 992 ||
            (deviceDimensions.width > 992 &&
              obj.szolgreszletek &&
              (obj.szolgreszletek + "").length > 200 && (
                <div
                  style={{
                    fontWeight: 900,
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "#333",
                  }}
                  onClick={(e) => toggleSzoveg(e, obj.id)}
                >
                  {lang === "ch" ? "Mehr..." : "Több..."}
                </div>
              ))}
        </span>
      );

    if (
      lang === "ch"
        ? group === obj.kategorianev
        : group === obj.magyarkategorianev
    ) {
      if (deviceDimensions.width < 992) {
        return (
          <tr key={obj.id} className={"rowClass_" + obj.id.toString()}>
            <td className="szolgrovidnev">
              <div className="mobilheader">{tableHeaders[0].name}</div>
              <span style={{ padding: 10 }} key={"1_cell"}>
                {obj.szolgrovidnev}
              </span>
            </td>
            <td>
              <div className="mobilheader">{tableHeaders[1].name}</div>
              {szolgReszletek}
            </td>
            <td className="szolgar">
              <div className="mobilheader">{tableHeaders[2].name}</div>
              <span
                style={{ padding: 10 }}
                key={"3_cell"}
              >{`${obj.ar} ${obj.penznem}`}</span>
            </td>
            <td className="szolgidotartam">
              <div className="mobilheader">{tableHeaders[3].name}</div>
              <span style={{ padding: 10 }} key={"4_cell"}>{`${obj.idotartam} ${
                lang === "ch" ? "Minuten" : "perc"
              }`}</span>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={obj.id} className={"rowClass_" + obj.id.toString()}>
            <td className="szolgrovidnev" key={"1_cell"}>
              {obj.szolgrovidnev}
            </td>
            {szolgReszletek}
            <td
              className="szolgar"
              key={"3_cell"}
            >{`${obj.ar} ${obj.penznem}`}</td>
            <td className="szolgidotartam" key={"4_cell"}>{`${obj.idotartam} ${
              lang === "ch" ? "Minuten" : "perc"
            }`}</td>
          </tr>
        );
      }
    }
  };

  const renderSzolgaltatasok = () => {
    return groups.map((group, index) => {
      return (
        <div key={index} style={{ width: "100%" }}>
          <div>
            <h4>{group}</h4>
          </div>
          <Table bordered id="pricelisttable">
            <thead>
              <tr>
                {tableHeaders.map((tH, i) => {
                  return (
                    <td
                      key={`TH_${i}`}
                      style={
                        tH.id !== 1
                          ? tH.id === 0
                            ? { width: "20%" }
                            : { width: "10%" }
                          : {}
                      }
                    >
                      {tH.name}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {szolgaltatasok.map((szol) => {
                return getRows(group, szol);
              })}
            </tbody>
          </Table>
        </div>
      );
    });
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <h2 style={{ textAlign: "center", width: "100%" }}>
          {lang !== "ch" ? "Szolgáltatások" : "Dienstleistungen"}
        </h2>
        {renderSzolgaltatasok()}
      </div>
    </div>
  );
};

Preisliste.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Preisliste;

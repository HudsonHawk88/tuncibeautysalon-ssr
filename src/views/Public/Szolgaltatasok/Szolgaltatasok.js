import React, { useEffect, useState } from "react";
import Services from "./Services";
import { Col, Row, Table } from "reactstrap";
import { DataTable } from "@inftechsol/react-data-table";
import PropTypes from "prop-types";

const Szolgaltatasok = (props) => {
  const { lang } = props;

  console.log(lang, props);

  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    init();
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
          console.log(szolgObj);
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

  const arFormatter = (cell, row) => {
    console.log(row);
    return `${row.ar} ${row.penznem}`;
  };

  const idotartamFormatter = (cell, row) => {
    return `${row.idotartam} ${lang === "ch" ? "minuten" : "perc"}`;
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

  const getRows = (group, obj) => {
    if (
      lang === "ch"
        ? group === obj.kategorianev
        : group === obj.magyarkategorianev
    ) {
      return (
        <tr key={obj.id}>
          <td key={"1_cell"}>{obj.szolgrovidnev}</td>
          <td key={"2_cell"}>{obj.szolgreszletek}</td>
          <td key={"3_cell"}>{`${obj.ar} ${obj.penznem}`}</td>
          <td key={"4_cell"}>{`${obj.idotartam} ${
            lang === "ch" ? "minuten" : "perc"
          }`}</td>
        </tr>
      );
    }
  };

  const renderSzolgaltatasok = () => {
    console.log(groups, szolgaltatasok);

    return groups.map((group, index) => {
      return (
        <div key={index}>
          <div>
            <h4>{group}</h4>
          </div>
          <Table bordered style={{ color: "white" }}>
            <thead>
              <tr>
                <td>{lang === "ch" ? "Dienstleistungen" : "Szolgáltatások"}</td>
                <td>{lang === "ch" ? "Einzelheiten" : "Részletek"}</td>
                <td>{lang === "ch" ? "Preis" : "Ár"}</td>
                <td>{lang === "ch" ? "Zeitraum" : "Időtartam"}</td>
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
    <div>
      <h2 style={{ textAlign: "center" }}>
        {lang !== "ch" ? "Szolgáltatások" : "Dienstleistungen"}
      </h2>
      <Row>
        <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
          {renderSzolgaltatasok()}
        </Col>
      </Row>
    </div>
  );
};

Szolgaltatasok.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Szolgaltatasok;

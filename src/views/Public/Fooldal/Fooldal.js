import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import Services from "./Services";
import SzolgaltatasCard from "../Szolgaltatasok/SzolgaltatasCard";

const Fooldal = () => {
  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [groups, setGroups] = useState([]);

  const getSzolgaltatasok = () => {
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

  useEffect(() => {
    getSzolgaltatasok();
  }, [])

 /*  const renderSzolgaltatasok = () => {
    return szolgaltatasok.map((sz) => {
      if ()
    })
  } */

  return (
    <div style={{ width: "100%" }}>
      <Helmet>
        <meta name="description" content="" />
        <meta name="og:title" content="" />
        <meta name="og:description" content="" />
        <meta name="og:image" content="" />
        <title>Tünci Beauty Salon</title>
      </Helmet>
      
    </div>
  );
};

export default Fooldal;

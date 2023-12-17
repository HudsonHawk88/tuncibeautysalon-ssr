import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PropTypes from 'prop-types';

import Services from "./Services";
import SzolgaltatasCard from "../Szolgaltatasok/SzolgaltatasCard";

const Fooldal = (props) => {
  const { lang } = props;
  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [groups, setGroups] = useState([]);

  const getSzolgaltatasok = () => {
    Services.listSzolgaltatasok((err, res) => {
      if (!err) {
        translteSzolgaltatasok(res);
      }
    });
  };

  useEffect(() => {
    getSzolgaltatasok();
  }, [])

  const translteSzolgaltatasok = (array) => {
    const szolgArr = [];
    const groups = [];
    array.forEach((szolg) => {
      const szolgObj = Object.assign({}, szolg);
      szolgArr.push(szolgObj);
      groups.push({ nemetnev: szolgObj.szolgkategoria, magyarnev: szolgObj.magyarszolgkategoria });
  
    });

    setGroups([...new Map(groups.map(item => [item.nemetnev, item])).values()]);
    console.log(szolgArr);
    setSzolgaltatasok(szolgArr);
  };

  useEffect(() => {
    if (szolgaltatasok) {
      translteSzolgaltatasok(szolgaltatasok);
    }
  }, [lang]);

  

  const getSzolgok = (szolg, szolgIdx) => {
    console.log(szolgIdx + "_szolgId_ " + szolg.id);
    return (
      <SzolgaltatasCard data={szolg} key={szolgIdx + "_szolgId_ " + szolg.id} {...props} />
    );
  };

  const renderSzolgaltatasok = () => {
    return groups.map((group) => {
      console.log(group)
      const szolgok = szolgaltatasok.filter((sz) => sz.szolgkategoria === group.nemetnev);
      return (
        <div className="szolgkatblokk" key={group.nemetnev}>
        <div style={{ width: '100%', margin: '10px 0px', textAlign: 'center' }}><h2>{lang === 'hu' ? group.magyarnev : group.nemetnev}</h2></div>
          {szolgok.map((szolg, szolgIdx) => {
            return getSzolgok(szolg, szolgIdx);
          })}
        </div>
      );
    })
  }

  return (
    <div style={{ width: "100%" }}>
      <Helmet>
        <meta name="description" content="" />
        <meta name="og:title" content="" />
        <meta name="og:description" content="" />
        <meta name="og:image" content="" />
        <title>Tünci Beauty Salon</title>
      </Helmet>
      <div className="fooldalszolgok">
        {renderSzolgaltatasok()}
      </div>
    </div>
  );
};

Fooldal.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Fooldal;

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

import Services from "./Services.js";
import SzolgaltatasCard from "../Szolgaltatasok/SzolgaltatasCard.js";

const Fooldal = (props) => {
  const { lang } = props;
  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [biosJson, setBiosJson] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const getSzolgaltatasok = () => {
    Services.listSzolgaltatasok((err, res) => {
      if (!err) {
        translteSzolgaltatasok(res);
      }
    });
  };

  const getSzolgaltatasKategoriak = () => {
    Services.listSzolgKategoriak((err, res) => {
      if (!err) {
        setGroups(res);
      }
    });
  };

  const getBios = () => {
    Services.getBios((err, res) => {
      if (!err) {
        setBiosJson(res);
      }
    });
  };

  useEffect(() => {
    getBios();
    getSzolgaltatasok();
    getSzolgaltatasKategoriak();
  }, []);

  const translteSzolgaltatasok = (array) => {
    const szolgArr = [];
    array.forEach((szolg) => {
      const szolgObj = Object.assign({}, szolg);
      szolgArr.push(szolgObj);
    });
    setSzolgaltatasok(szolgArr);
  };

  useEffect(() => {
    if (szolgaltatasok) {
      translteSzolgaltatasok(szolgaltatasok);
    }
  }, [lang]);

  /* const getSzolgok = (szolg, szolgIdx, groupIdx) => {
    console.log(szolgIdx + "_szolgId_ " + szolg.id);
    return (
      <SzolgaltatasCard
        groupId={groupIdx + 1}
        data={szolg}
        key={szolgIdx + "_szolgId_ " + szolg.id}
        {...props}
      />
    );
  }; */

  const renderSzolgaltatasok = () => {
    return (
      <div className="szolgkatblokk">
        {groups.map((group) => {
          /* const szolgok = szolgaltatasok.filter(
            (sz) => sz.szolgkategoria === group.nemetnev
          ); */

          return (
            <SzolgaltatasCard
              groupId={group.id}
              data={group}
              key={"_szolgKat_ " + group.id}
              {...props}
            />
          );
        })}
      </div>
    );

    /* return (
        <div className="szolgkatblokk" key={group.nemetnev}>
          <div
            style={{ width: "100%", margin: "10px 0px", textAlign: "center" }}
          >
            <h2>{lang === "hu" ? group.magyarnev : group.nemetnev}</h2>
          </div>
          {szolgok.map((szolg, szolgIdx) => {
            return getSzolgok(szolg, szolgIdx, groupIdx);
          })}
        </div>
      ); */
  };

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "calc(100% - 210px)",
        padding: "10px",
      }}
    >
      <Helmet>
        <meta name="description" content="" />
        <meta name="og:title" content="" />
        <meta name="og:description" content="" />
        <meta name="og:image" content="" />
        <title>Tünci Beauty Salon</title>
      </Helmet>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2>{lang === "hu" ? "Bemutatkozás" : "Über mich"}</h2>
      </div>
      {biosJson &&
        biosJson.length > 0 &&
        (lang === "hu" ? (
          !showMore ? (
            <React.Fragment>
              <div
                dangerouslySetInnerHTML={{
                  __html: biosJson[0].magyarleiras.slice(0, 500) + "...",
                }}
              />
              <a
                style={{
                  /* padding: '5px 10px', border: '1px solid red', borderRadius: '10px',*/ textDecoration:
                    "underline",
                }}
                href="#"
                onClick={() => setShowMore(!showMore)}
                className="underline"
              >
                <strong>{showMore ? "Kevesebb" : "...továbbiak"}</strong>
              </a>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div
                dangerouslySetInnerHTML={{ __html: biosJson[0].magyarleiras }}
              />
              <a
                style={{
                  /* padding: '5px 10px', border: '1px solid red', borderRadius: '10px',*/ textDecoration:
                    "underline",
                }}
                href="#"
                onClick={() => setShowMore(!showMore)}
                className="underline"
              >
                <strong>{showMore ? "Kevesebb" : "...továbbiak"}</strong>
              </a>
            </React.Fragment>
          )
        ) : !showMore ? (
          <React.Fragment>
            <div
              dangerouslySetInnerHTML={{
                __html: biosJson[0].leiras.slice(0, 500) + "...",
              }}
            />
            <a
              style={{
                /* padding: '5px 10px', border: '1px solid red', borderRadius: '10px',*/ textDecoration:
                  "underline",
              }}
              href="#"
              onClick={() => setShowMore(!showMore)}
              className="underline"
            >
              <strong>{showMore ? "Weniger" : "...mehr"}</strong>
            </a>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div dangerouslySetInnerHTML={{ __html: biosJson[0].leiras }} />
            <a
              style={{
                /* padding: '5px 10px', border: '1px solid red', borderRadius: '10px',*/ textDecoration:
                  "underline",
              }}
              href="#"
              onClick={() => setShowMore(!showMore)}
              className="underline"
            >
              <strong>{showMore ? "Weniger" : "...mehr"}</strong>
            </a>
          </React.Fragment>
        ))}
      <div className="fooldalszolgok">{renderSzolgaltatasok()}</div>
    </div>
  );
};

Fooldal.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Fooldal;

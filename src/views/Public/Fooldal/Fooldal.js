import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

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
  }, []);

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

    setGroups([
      ...new Map(groups.map((item) => [item.nemetnev, item])).values(),
    ]);
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
      <SzolgaltatasCard
        data={szolg}
        key={szolgIdx + "_szolgId_ " + szolg.id}
        {...props}
      />
    );
  };

  const renderSzolgaltatasok = () => {
    return groups.map((group) => {
      console.log(group);
      const szolgok = szolgaltatasok.filter(
        (sz) => sz.szolgkategoria === group.nemetnev
      );
      return (
        <div className="szolgkatblokk" key={group.nemetnev}>
          <div
            style={{ width: "100%", margin: "10px 0px", textAlign: "center" }}
          >
            <h2>{lang === "hu" ? group.magyarnev : group.nemetnev}</h2>
          </div>
          {szolgok.map((szolg, szolgIdx) => {
            return getSzolgok(szolg, szolgIdx);
          })}
        </div>
      );
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <Helmet>
        <meta name="description" content="" />
        <meta name="og:title" content="" />
        <meta name="og:description" content="" />
        <meta name="og:image" content="" />
        <title>Tünci Beauty Salon</title>
      </Helmet>
      <div style={{ width: '100%', textAlign: 'center' }}><h2>{lang === 'hu' ? 'Rólam' : 'Über mich'}</h2></div>
      <div className="bio">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dapibus
          tellus purus, id imperdiet purus scelerisque at. Nunc eleifend dolor
          libero, et suscipit urna placerat id. Duis sit amet metus vitae turpis
          pellentesque dapibus non ut augue. In hac habitasse platea dictumst.
          In congue neque at semper porta. Class aptent taciti sociosqu ad
          litora torquent per conubia nostra, per inceptos himenaeos. Integer
          lobortis purus rhoncus lacus pharetra bibendum. Aliquam et pulvinar
          lectus, at lobortis libero. Nullam sit amet enim sit amet urna maximus
          posuere. Donec suscipit vitae purus a iaculis. Nam non placerat ante.
          Donec eget lacus ut libero viverra sodales. Suspendisse feugiat et
          turpis ac vulputate. Nulla egestas nibh in massa tincidunt, id
          tincidunt neque vestibulum. Vivamus euismod, leo vitae lobortis
          rutrum, enim est fringilla orci, ac vulputate nulla dolor non est.
          Praesent sodales dolor quis elit rhoncus, eu sagittis quam convallis.
          Duis magna sem, egestas eu molestie in, facilisis eu risus. Nullam vel
          velit nunc. Morbi tempor imperdiet convallis. Morbi sit amet ligula et
          urna dapibus fermentum. Aliquam erat volutpat. Aliquam viverra, purus
          sit amet lobortis eleifend, lorem est auctor nisl, nec sodales eros
          nisl non nisl. Nullam a rutrum augue.
        </p>
      </div>
      <div className="fooldalszolgok">{renderSzolgaltatasok()}</div>
    </div>
  );
};

Fooldal.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Fooldal;

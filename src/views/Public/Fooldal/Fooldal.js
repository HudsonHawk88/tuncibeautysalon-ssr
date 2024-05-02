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
    <div style={{ width: "100%", maxHeight: "calc(100% - 210px)" }}>
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
      {biosJson && biosJson.length > 0 && (
        <div
          className="bio"
          dangerouslySetInnerHTML={{
            __html:
              lang === "hu" ? biosJson[0].magyarleiras : biosJson[0].leiras,
          }}
        />
      )}
      {/* }lang === "hu" ? (
          <div>
            <h3>
              Szeretettel üdvözlöm minden kedves meglévő és leendő vendégemet a
              weboldalamon!
            </h3>
            <br />
            <p style={{ fontSize: "1.1rem", textAlign: "justify" }}>
              Honfi-Németh Tündének hívnak. 2020-tól végeztem el Bernben az
              összes képzést amivel hozzá tudok járulni ahhoz, hogy minden
              vendégemnek tökéletes megjelenése legyen. Szalonomban megtalálható
              a Smink, műkörömépítés, pedikűr, műszempilla, Lifting, kozmetikai
              kezelések, gyantázás stb. Munkám során mind a szakmai elvárásokat,
              mind a vendégek igényeit szem előtt tartva, igyekszem bővíteni a
              szolgáltatásaimat miközben folyamatosan fejlesztem önmagam.
              Segítségemre vannak a professzionális gépeim amelyek a
              kezelésekben kítűnő eredményt mutatnak ilyen a hideg/meleg
              ultrahangos kezelések, ozongép, parafinosgép, gyémánt
              mikrodermabrázió, bőrvasaló, Gyantázó , illetve a Galvánáramos VIO
              készülék. A tudatos bőrápolás lényege, hogy azt nyújtsuk a
              bőrünknek, amire valóban szüksége van a saját igényeire szabva.
              Ezt pedig egy szakember által elvégzett bőrtípus megállapításnak,
              némi kutatómunkának vagy probléma esetén a kiváltó ok
              megvizsgálásának kell megelőznie. Az is fontos, hogy a különböző
              bőrhibáknak ne az eltakarására, hanem inkább a megoldására
              törekedjünk. Ezek után jöhetnek csak a kozmetikumok kiválasztásai
              a bennük lévő összetevőkre koncentrálva. Ha mindezekkel tisztába
              vagyunk, akkor máris tudni fogjuk, hogy az egyes hatóanyagok
              pontosan milyen hatásokat fejtenek ki a bőrünkben.Természetesen
              időközben a külső-belső tényezők hozzájárulhatnak a bőr
              állapotának változásához. Ilyenkor finomítgatni kell a rutinunkon
              az egyedi igények figyelembevételével. A kezelések kialakításánál
              mindig törekszem, hogy bőrbarát és környezet tudatos
              hatóanyagokkal dolgozzak. Bőrmegújítás és fiatal bőr struktúra
              javítása a cél minden vendégemnél.Minőségi és Naturál termékekkel
              dolgozom (Börlind, Bio Altearek, arcaya, Solane, Clinique,
              Eucerin, Nu Skin,) termékekkel dolgozom előnyben részesítem a tű
              nélküli kezeléseket. Ide tartozik sokak által nem ismert
              MESOPEPTIDE (Tű nélküli arc illetve ránckezelés) Amennyiben
              felkeltettem az érdeklődését jelentkezzen be itt onlíne. <br />
              <br /> Várom sok szeretettel a szépülni vágyó vendégeimet egy
              nyugodt környezetben. <br />
              <br /> 3302 Moosseedorf, Kirchgasse 3, 3emelet/ Jobbra
            </p>
          </div>
        ) : (
          <div>
            <h3>
              Ich begrüße alle meine lieben bestehenden und zukünftigen Gäste
              herzlich auf meiner Website!
            </h3>
            <br />
            <p style={{ fontSize: "1.1rem", textAlign: "justify" }}>
              Ich heiße Tünde Honfi-Németh. Seit 2020 habe ich in Bern alle
              Ausbildungen absolviert, die dazu beitragen, dass alle meine Gäste
              einen perfekten Auftritt bekommen. In meinem Salon finden Sie
              Make-up, künstliche Nägel, Pediküre, künstliche Wimpern, Lifting,
              kosmetische Behandlungen, Waxing usw. Im Rahmen meiner Arbeit
              versuche ich, sowohl die beruflichen Erwartungen als auch die
              Bedürfnisse der Gäste im Auge zu behalten, meine Dienstleistungen
              zu erweitern und mich dabei ständig zu verbessern. Ich verfüge
              über professionelle Geräte, die bei den Behandlungen hervorragende
              Ergebnisse zeigen, wie z. B. Kalt-/Warm-Ultraschallbehandlungen,
              Ozongerät, Paraffingerät, Diamant-Mikrodermabrasion, Hautglättung,
              Wachsen und das Galvanic VIO-Gerät. Die Essenz einer bewussten
              Hautpflege besteht darin, unserer Haut das zu geben, was sie
              wirklich braucht, abgestimmt auf ihre eigenen Bedürfnisse. Dem
              sollte eine Hauttypbestimmung durch eine Fachperson, eine
              Recherchearbeit oder im Problemfall eine Untersuchung der
              Grundursache vorausgehen. Wichtig ist auch, diverse Hautprobleme
              nicht zu vertuschen, sondern zu beheben. Erst danach können wir
              die Kosmetika auswählen und uns dabei auf die darin enthaltenen
              Inhaltsstoffe konzentrieren. Wenn wir uns darüber im Klaren sind,
              wissen wir bereits genau, welche Auswirkungen die einzelnen
              Wirkstoffe auf unsere Haut haben. In solchen Fällen müssen wir
              unsere Routine unter Berücksichtigung individueller Bedürfnisse
              verfeinern. Bei der Entwicklung von Behandlungen lege ich stets
              Wert darauf, mit hautfreundlichen und umweltbewussten Wirkstoffen
              zu arbeiten. Die Hauterneuerung und Verbesserung der jungen
              Hautstruktur ist das Ziel bei jedem meiner Gäste. Ich arbeite mit
              hochwertigen und natürlichen Produkten (Börlind, Bio Altearek,
              Arcaya, Solane, Clinique, Eucerin, Nu Skin) und bevorzuge
              nadelfreie Behandlungen. Dazu gehört das vielen unbekannte
              MESOPEPTIDE (nadelfreie Gesichts- und Faltenbehandlung) Bei
              Interesse melden Sie sich hier online an. <br />
              <br /> Ich heiße meine Gäste herzlich willkommen, die sich in
              einer ruhigen Umgebung verschönern möchten. <br />
              <br /> 3302 ,Moosseedorf Kirchgasse 3 Tünci Beauty Salon
            </p>
          </div>
        )} */}
      {/* </div> */}
      <div className="fooldalszolgok">{renderSzolgaltatasok()}</div>
    </div>
  );
};

Fooldal.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Fooldal;

import React, { useEffect } from "react";

const FooldalContent = () => {
  useEffect(() => {}, []);

  /*     const ertekFormatter = (ingatlan) => {
        switch (ingatlan.statusz) {
            case 'Kiadó': {
                return `Ár: ${ingatlan.ar} ${ingatlan.penznem}/hó ${ingatlan.kaucio ? 'Kaució: ' + ingatlan.kaucio + ' ' + ingatlan.penznem : ''}`;
            }
            case 'Illeték': {
                return `${arFormatter(ingatlan.illetek)} ${ingatlan.penznem}`;
            }
            default: {
                return `Ár: ${ingatlan.ar} ${ingatlan.penznem}`;
            }
        }
    }; */

  /* const getOptions = () => {
    Services.getIngatlanOptions((err, res) => {
      if (!err) {
        setIngatlanOptions(res);
      }
    });
  }; */

  /* const renderKiemeltIngatlanok = () => {
    return (
      data &&
      data.map((ingat) => {
        return (
          <IngatlanCard
            key={"ING_" + ingat.id}
            ingatlanOptions={ingatlanOptions}
            ingat={ingat}
          />
        );
      })
    );
  }; */

  return <div>{"TÜNCI BEAUTY SALON"}</div>;
  /* return <React.Fragment>{renderKiemeltIngatlanok()}</React.Fragment>; */
};

export default FooldalContent;

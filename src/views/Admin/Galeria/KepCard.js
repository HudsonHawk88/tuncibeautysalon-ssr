import React, { memo } from "react";
import { Card, CardTitle, CardBody, CardFooter, Button } from "reactstrap";
import PropTypes from "prop-types";

const KepCard = memo(function KepCard({
  kep,
  kategoriaid,
  index,
  kategoriak,
  //   felirat,
  //   magyarfelirat,
  //   handleFeliratChange,
  galeriaObj,
  deleteImage,
}) {
  const imageStyle = {
    maxHeight: "100%",
    maxWidth: "100%",
  };

  return (
    <Card key={index.toString()} className="col-md-3">
      <CardTitle>{kep.filename}</CardTitle>
      <CardBody className="keplista">
        <img style={imageStyle} src={kep.src} alt={kep.filename} />
        {/*<div key={kep.filename + "_felirat_" + index}>
          <Label for="felirat">Német felirat</Label>
          <RVInput
            type="text"
            name="felirat"
            onChange={(e) => {
              handleFeliratChange(e, kep);
            }}
            value={felirat}
          />
        </div>
        <div key={kep.filename + "_magyarfelirat_" + index}>
          <Label for="magyarfelirat">Magyar felirat</Label>
          <RVInput
            type="text"
            name="magyarfelirat"
            onChange={(e) => {
              handleFeliratChange(e, kep, "magyar");
            }}
            value={
              magyarfelirat
            }
          />
        </div>*/}
      </CardBody>
      <CardFooter>
        <Button
          onClick={() =>
            deleteImage(
              kep.filename,
              kategoriak.find((kat) => kat.id === kategoriaid)
                ? kategoriak.find((kat) => kat.id === galeriaObj.kategoriaid).id
                : null
            )
          }
        >
          Törlés
        </Button>
      </CardFooter>
    </Card>
  );
});

KepCard.propTypes = {
  deleteImage: PropTypes.func.isRequired,
  felirat: PropTypes.string.isRequired,
  galeriaObj: PropTypes.object.isRequired,
  magyarfelirat: PropTypes.string.isRequired,
  handleFeliratChange: PropTypes.func.isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  kategoriaid: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  kategoriak: PropTypes.array.isRequired,
  kep: PropTypes.object.isRequired,
};

export default KepCard;

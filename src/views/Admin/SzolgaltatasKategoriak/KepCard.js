import React, { memo } from "react";
import { Card, CardTitle, CardBody, CardFooter, Button } from "reactstrap";
import PropTypes from "prop-types";

const KepCard = memo(function KepCard({ kep, index, deleteImage }) {
  const imageStyle = {
    maxHeight: "100%",
    maxWidth: "100%",
  };

  return (
    <Card key={index.toString()} className="col-md-3">
      <CardTitle>{kep.filename}</CardTitle>
      <CardBody className="keplista">
        <img style={imageStyle} src={kep.src} alt={kep.filename} />
      </CardBody>
      <CardFooter>
        <Button onClick={() => deleteImage(kep.filename)}>Törlés</Button>
      </CardFooter>
    </Card>
  );
});

KepCard.propTypes = {
  deleteImage: PropTypes.func.isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  kep: PropTypes.object.isRequired,
};

export default KepCard;

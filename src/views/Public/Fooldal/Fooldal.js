import React from "react";
import { Helmet } from "react-helmet";

import FooldalContent from "./FooldalContent";

const Fooldal = () => {
  return (
    <div style={{ width: "100%" }}>
      <Helmet>
        <meta name="description" content="" />
        <meta name="og:title" content="" />
        <meta name="og:description" content="" />
        <meta name="og:image" content="" />
        <title>Tünci Beauty Salon</title>
      </Helmet>
      <FooldalContent />
    </div>
  );
};

export default Fooldal;

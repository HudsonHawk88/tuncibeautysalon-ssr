import React from "react";
import PropTypes from "prop-types";

const SzolgaltatasCard = (props) => {
  const { data } = props;

  const renderSzolgaltatas = () => {
    /* <DataTable
            columns={}
            datas={}
        /> */
  };

  console.log(data);

  return <div>{renderSzolgaltatas()}</div>;
};

SzolgaltatasCard.propTypes = {
  data: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

export default SzolgaltatasCard;

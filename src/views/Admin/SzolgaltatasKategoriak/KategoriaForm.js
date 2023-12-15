import React, { Fragment } from "react";
import { Row, Col, Label } from "reactstrap";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import PropTypes from "prop-types";

import { handleInputChange } from "../../../commons/InputHandlers";

const KategoriaForm = (props) => {
  const { kategoriaObj, setKategoriaObj } = props;
  return (
    <Fragment>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Német kategórianév: *"}</Label>
          <RVInput
            type="text"
            name="kategorianev"
            id="kategorianev"
            required
            onChange={(e) =>
              handleInputChange(e, kategoriaObj, setKategoriaObj)
            }
            value={kategoriaObj.kategorianev}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Magyar kategórianév: *"}</Label>
          <RVInput
            type="text"
            name="magyarkategorianev"
            id="magyarkategorianev"
            required
            onChange={(e) =>
              handleInputChange(e, kategoriaObj, setKategoriaObj)
            }
            value={kategoriaObj.magyarkategorianev}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Német leírás: *"}</Label>
          <RVInput
            type="textarea"
            name="kategorialeiras"
            id="kategorialeiras"
            rows={10}
            required
            onChange={(e) =>
              handleInputChange(e, kategoriaObj, setKategoriaObj)
            }
            value={kategoriaObj.kategorialeiras}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Magyar leírás: *"}</Label>
          <RVInput
            type="textarea"
            name="magyarkategorialeiras"
            id="magyarkategorialeiras"
            rows={10}
            required
            onChange={(e) =>
              handleInputChange(e, kategoriaObj, setKategoriaObj)
            }
            value={kategoriaObj.magyarkategorialeiras}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

KategoriaForm.propTypes = {
  kategoriaObj: PropTypes.object.isRequired,
  setKategoriaObj: PropTypes.func.isRequired,
};

export default KategoriaForm;

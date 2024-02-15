import React, { Fragment } from "react";
import { Row, Col, Label } from "reactstrap";
import {
  RVInput,
  RVInputGroup,
  RVInputGroupText,
} from "@inftechsol/reactstrap-form-validation";
import PropTypes from "prop-types";

import { handleInputChange } from "../../../commons/InputHandlers.js";

const SzolgaltatasokForm = (props) => {
  const {
    szolgaltatasObj,
    setSzolgaltatasObj,
    szolgKategoriak = [],
    currentId,
  } = props;
  return (
    <Fragment>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Szolgáltatás kategória: *"}</Label>
          <RVInput
            type="select"
            name="szolgkategoria"
            id="szolgkategoria"
            required
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            value={szolgaltatasObj.szolgkategoria}
          >
            {currentId === undefined && (
              <option key="default">
                Kérjük válasszon szolgáltatás kategóriát!
              </option>
            )}
            {szolgKategoriak.map((szk) => {
              return (
                <option key={szk.id} value={szk.id}>
                  {szk.kategorianev + " - " + szk.magyarkategorianev}
                </option>
              );
            })}
          </RVInput>
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Német megnevezés: *"}</Label>
          <RVInput
            type="text"
            name="szolgrovidnev"
            id="szolgrovidnev"
            required
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            value={szolgaltatasObj.szolgrovidnev}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Magyar megnevezés: *"}</Label>
          <RVInput
            type="text"
            name="magyarszolgrovidnev"
            id="magyarszolgrovidnev"
            required
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            value={szolgaltatasObj.magyarszolgrovidnev}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Német leírás: *"}</Label>
          <RVInput
            type="textarea"
            name="szolgreszletek"
            id="szolgreszletek"
            rows={10}
            required
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            value={szolgaltatasObj.szolgreszletek}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Magyar leírás: *"}</Label>
          <RVInput
            type="textarea"
            name="magyarszolgreszletek"
            id="magyarszolgreszletek"
            rows={10}
            required
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            value={szolgaltatasObj.magyarszolgreszletek}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Német ár: *"}</Label>
          <RVInput
            name="ar"
            id="ar"
            pattern="[0-9]+"
            value={szolgaltatasObj.ar}
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            required
          />
        </Col>
        <Col>
          <Label>{"Német pénznem: *"}</Label>
          <RVInput
            type="select"
            name="penznem"
            id="penznem"
            value={szolgaltatasObj.penznem && szolgaltatasObj.penznem.value}
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            required
          >
            <option key="chf">CHF</option>
            <option key="huf">HUF</option>
          </RVInput>
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Magyar ár: *"}</Label>
          <RVInput
            name="magyarar"
            id="magyarar"
            pattern="[0-9]+"
            value={szolgaltatasObj.magyarar}
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            required
          />
        </Col>
        <Col>
          <Label>{"Magyar pénznem: *"}</Label>
          <RVInput
            type="select"
            name="magyarpenznem"
            id="magyarpenznem"
            value={
              szolgaltatasObj.magyarpenznem &&
              szolgaltatasObj.magyarpenznem.value
            }
            onChange={(e) =>
              handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
            }
            required
          >
            <option key="huf">HUF</option>
            <option key="chf">CHF</option>
          </RVInput>
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Időtartam: *"}</Label>
          <RVInputGroup>
            <RVInput
              name="idotartam"
              id="idotartam"
              pattern="[0-9]+"
              value={szolgaltatasObj.idotartam}
              onChange={(e) =>
                handleInputChange(e, szolgaltatasObj, setSzolgaltatasObj)
              }
              required
            />
            <RVInputGroupText>perc</RVInputGroupText>
          </RVInputGroup>
        </Col>
      </Row>
    </Fragment>
  );
};

SzolgaltatasokForm.propTypes = {
  szolgaltatasObj: PropTypes.object.isRequired,
  setSzolgaltatasObj: PropTypes.func.isRequired,
  szolgKategoriak: PropTypes.array.isRequired,
  currentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SzolgaltatasokForm;

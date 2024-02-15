import React, { Fragment } from "react";
import { Col, Label, Row } from "reactstrap";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import PropTypes from "prop-types";

import { handleInputChange } from "../../../commons/InputHandlers.js";
import moment from "moment";

const KapcsolatForm = (props) => {
  const {
    orszagok,
    kapcsolat,
    setKapcsolat,
    currentId,
    helyseg,
    setHelyseg,
    nyitvatartas,
    setNyitvatartas,
  } = props;
  return (
    <Fragment>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Cégnév: *"}</Label>
          <RVInput
            type="text"
            name="cegnev"
            id="cegnev"
            required
            onChange={(e) => handleInputChange(e, kapcsolat, setKapcsolat)}
            value={kapcsolat.cegnev}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Ország: *"}</Label>
          <RVInput
            type="select"
            name="orszag"
            id="orszag"
            required
            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
            value={helyseg.orszag && helyseg.orszag.id}
          >
            {currentId === undefined && (
              <option key="default">Kérjük válasszon országot!</option>
            )}
            {orszagok.map((orszag) => {
              return (
                <option key={orszag.id} value={orszag.id}>
                  {orszag.orszagnev}
                </option>
              );
            })}
          </RVInput>
        </Col>
        <Col>
          <Label>{"Iránytószám: *"}</Label>
          <RVInput
            type="text"
            name="irszam"
            id="irszam"
            pattern="[0-9]+"
            required
            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
            value={helyseg.irszam}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Település: *"}</Label>
          <RVInput
            type="text"
            name="telepules"
            id="telepules"
            required
            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
            value={helyseg.telepules}
          />
        </Col>
        <Col>
          <Label>{"Cim: *"}</Label>
          <RVInput
            type="text"
            name="cim"
            id="cim"
            required
            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
            value={helyseg.cim}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Telefon: *"}</Label>
          <RVInput
            type="text"
            name="telefon"
            id="telefon"
            required
            onChange={(e) => handleInputChange(e, kapcsolat, setKapcsolat)}
            value={kapcsolat.telefon}
          />
        </Col>
        <Col>
          <Label>{"E-mail: *"}</Label>
          <RVInput
            type="text"
            name="email"
            id="email"
            required
            onChange={(e) => handleInputChange(e, kapcsolat, setKapcsolat)}
            value={kapcsolat.email}
          />
        </Col>
        <Col>
          <Label>{"Web: *"}</Label>
          <RVInput
            type="text"
            name="web"
            id="web"
            required
            onChange={(e) => handleInputChange(e, kapcsolat, setKapcsolat)}
            value={kapcsolat.web}
          />
        </Col>
      </Row>
      {console.log(
        moment().isoWeekday(1) === moment().format("dddd"),
        moment().isoWeekday(1).format("dddd"),
        moment().format("dddd")
      )}
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label htmlFor="isMonday">Hétfő</Label>&nbsp;
          <RVInput
            type="checkbox"
            name="isMonday"
            id="isMonday"
            checked={nyitvatartas.isMonday}
            onChange={(e) =>
              setNyitvatartas({
                ...nyitvatartas,
                [e.target.name]: e.target.checked,
              })
            }
          />
        </Col>
      </Row>
      {nyitvatartas.isMonday && (
        <Row style={{ margin: "10px 0px 0px 0px" }}>
          <Col>
            <RVInput
              type="time"
              name="mondaytol"
              id="mondaytol"
              value={
                nyitvatartas.monday && nyitvatartas.monday.tol
                  ? nyitvatartas.monday.tol
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  monday: { ...nyitvatartas.monday, tol: e.target.value },
                })
              }
            />
          </Col>
          <Col>
            <RVInput
              type="time"
              name="mondayig"
              id="mondayig"
              value={
                nyitvatartas.monday && nyitvatartas.monday.ig
                  ? nyitvatartas.monday.ig
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  monday: { ...nyitvatartas.monday, ig: e.target.value },
                })
              }
            />
          </Col>
          {console.log(nyitvatartas)}
        </Row>
      )}
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label htmlFor="isTuesday">Kedd</Label>&nbsp;
          <RVInput
            type="checkbox"
            name="isTuesday"
            id="isTuesday"
            checked={nyitvatartas.isTuesday}
            onChange={(e) =>
              setNyitvatartas({
                ...nyitvatartas,
                [e.target.name]: e.target.checked,
              })
            }
          />
        </Col>
      </Row>
      {nyitvatartas.isTuesday && (
        <Row style={{ margin: "10px 0px 0px 0px" }}>
          <Col>
            <RVInput
              type="time"
              name="tuesdaytol"
              id="tuesdaytol"
              value={
                nyitvatartas.tuesday && nyitvatartas.tuesday.tol
                  ? nyitvatartas.tuesday.tol
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  tuesday: { ...nyitvatartas.tuesday, tol: e.target.value },
                })
              }
            />
          </Col>
          <Col>
            <RVInput
              type="time"
              name="tuesdayig"
              id="tuesdayig"
              value={
                nyitvatartas.tuesday && nyitvatartas.tuesday.ig
                  ? nyitvatartas.tuesday.ig
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  tuesday: { ...nyitvatartas.tuesday, ig: e.target.value },
                })
              }
            />
          </Col>
        </Row>
      )}
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label htmlFor="isWednesday">Szerda</Label>&nbsp;
          <RVInput
            type="checkbox"
            name="isWednesday"
            id="isWednesday"
            checked={nyitvatartas.isWednesday}
            onChange={(e) =>
              setNyitvatartas({
                ...nyitvatartas,
                [e.target.name]: e.target.checked,
              })
            }
          />
        </Col>
      </Row>
      {nyitvatartas.isWednesday && (
        <Row style={{ margin: "10px 0px 0px 0px" }}>
          <Col>
            <RVInput
              type="time"
              name="wednesdaytol"
              id="wednesdaytol"
              value={
                nyitvatartas.wednesday && nyitvatartas.wednesday.tol
                  ? nyitvatartas.wednesday.tol
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  wednesday: { ...nyitvatartas.wednesday, tol: e.target.value },
                })
              }
            />
          </Col>
          <Col>
            <RVInput
              type="time"
              name="wednesdayig"
              id="wednesdayig"
              value={
                nyitvatartas.wednesday && nyitvatartas.wednesday.ig
                  ? nyitvatartas.wednesday.ig
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  wednesday: { ...nyitvatartas.wednesday, ig: e.target.value },
                })
              }
            />
          </Col>
        </Row>
      )}
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label htmlFor="isThursday">Csütörtök</Label>&nbsp;
          <RVInput
            type="checkbox"
            name="isThursday"
            id="isThursday"
            checked={nyitvatartas.isThursday}
            onChange={(e) =>
              setNyitvatartas({
                ...nyitvatartas,
                [e.target.name]: e.target.checked,
              })
            }
          />
        </Col>
      </Row>
      {nyitvatartas.isThursday && (
        <Row style={{ margin: "10px 0px 0px 0px" }}>
          <Col>
            <RVInput
              type="time"
              name="thurdaytol"
              id="thurdaytol"
              value={
                nyitvatartas.thurday && nyitvatartas.thurday.tol
                  ? nyitvatartas.thurday.tol
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  thurday: { ...nyitvatartas.thurday, tol: e.target.value },
                })
              }
            />
          </Col>
          <Col>
            <RVInput
              type="time"
              name="thurdayig"
              id="thurdayig"
              value={
                nyitvatartas.thurday && nyitvatartas.thurday.ig
                  ? nyitvatartas.thurday.ig
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  thurday: { ...nyitvatartas.thurday, ig: e.target.value },
                })
              }
            />
          </Col>
        </Row>
      )}
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label htmlFor="isFriday">Péntek</Label>&nbsp;
          <RVInput
            type="checkbox"
            name="isFriday"
            id="isFriday"
            checked={nyitvatartas.isFriday}
            onChange={(e) =>
              setNyitvatartas({
                ...nyitvatartas,
                [e.target.name]: e.target.checked,
              })
            }
          />
        </Col>
      </Row>
      {nyitvatartas.isFriday && (
        <Row style={{ margin: "10px 0px 0px 0px" }}>
          <Col>
            <RVInput
              type="time"
              name="fridaytol"
              id="fridaytol"
              value={
                nyitvatartas.friday && nyitvatartas.friday.tol
                  ? nyitvatartas.friday.tol
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  friday: { ...nyitvatartas.friday, tol: e.target.value },
                })
              }
            />
          </Col>
          <Col>
            <RVInput
              type="time"
              name="fridayig"
              id="fridayig"
              value={
                nyitvatartas.friday && nyitvatartas.friday.ig
                  ? nyitvatartas.friday.ig
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  friday: { ...nyitvatartas.friday, ig: e.target.value },
                })
              }
            />
          </Col>
        </Row>
      )}
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label htmlFor="isSaturday">Szombat</Label>&nbsp;
          <RVInput
            type="checkbox"
            name="isSaturday"
            id="isSaturday"
            checked={nyitvatartas.isSaturday}
            onChange={(e) =>
              setNyitvatartas({
                ...nyitvatartas,
                [e.target.name]: e.target.checked,
              })
            }
          />
        </Col>
      </Row>
      {nyitvatartas.isSaturday && (
        <Row style={{ margin: "10px 0px 0px 0px" }}>
          <Col>
            <RVInput
              type="time"
              name="saturdaytol"
              id="saturdaytol"
              value={
                nyitvatartas.saturday && nyitvatartas.saturday.tol
                  ? nyitvatartas.saturday.tol
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  saturday: { ...nyitvatartas.saturday, tol: e.target.value },
                })
              }
            />
          </Col>
          <Col>
            <RVInput
              type="time"
              name="saturdayig"
              id="saturdayig"
              value={
                nyitvatartas.saturday && nyitvatartas.saturday.ig
                  ? nyitvatartas.saturday.ig
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  saturday: { ...nyitvatartas.saturday, ig: e.target.value },
                })
              }
            />
          </Col>
        </Row>
      )}
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label htmlFor="isSunday">Vasárnap</Label>&nbsp;
          <RVInput
            type="checkbox"
            name="isSunday"
            id="isSunday"
            checked={nyitvatartas.isSunday}
            onChange={(e) =>
              setNyitvatartas({
                ...nyitvatartas,
                [e.target.name]: e.target.checked,
              })
            }
          />
        </Col>
      </Row>
      {nyitvatartas.isSunday && (
        <Row style={{ margin: "10px 0px 0px 0px" }}>
          <Col>
            <RVInput
              type="time"
              name="sundaytol"
              id="sundaytol"
              value={
                nyitvatartas.sunday && nyitvatartas.sunday.tol
                  ? nyitvatartas.sunday.tol
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  sunday: { ...nyitvatartas.sunday, tol: e.target.value },
                })
              }
            />
          </Col>
          <Col>
            <RVInput
              type="time"
              name="sundayig"
              id="sundayig"
              value={
                nyitvatartas.sunday && nyitvatartas.sunday.ig
                  ? nyitvatartas.sunday.ig
                  : null
              }
              onChange={(e) =>
                setNyitvatartas({
                  ...nyitvatartas,
                  sunday: { ...nyitvatartas.sunday, ig: e.target.value },
                })
              }
            />
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

KapcsolatForm.propTypes = {
  kapcsolat: PropTypes.object.isRequired,
  setKapcsolat: PropTypes.func.isRequired,
  helyseg: PropTypes.object.isRequired,
  setHelyseg: PropTypes.func.isRequired,
  nyitvatartas: PropTypes.object.isRequired,
  setNyitvatartas: PropTypes.func.isRequired,
  currentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orszagok: PropTypes.array.isRequired,
};

export default KapcsolatForm;

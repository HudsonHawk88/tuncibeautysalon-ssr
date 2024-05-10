import React, { useEffect, useState } from "react";
import { DataTable } from "@inftechsol/react-data-table";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Label,
} from "reactstrap";
import { RVForm, RVInput } from "@inftechsol/reactstrap-form-validation";
import moment from "moment";
import PropTypes from "prop-types";

import Services from "./Services.js";
import { handleInputChange } from "../../../commons/InputHandlers.js";

const defaultSzabadnapObj = {
  megnevezes: "",
  kezdete: null,
  vege: null,
};

const paginationOptions = {
  count: 5,
  color: "primary",
  rowPerPageOptions: [
    { value: 5, text: "5" },
    { value: 10, text: "10" },
    { value: 25, text: "25" },
    { value: 50, text: "50" },
  ],
};

const Szabadnapok = (props) => {
  const [szabadnapokJson, setSzabadnapokJson] = useState([]);
  const [szabadnapObj, setSzabadnapObj] = useState(defaultSzabadnapObj);
  const [szabadnapModal, setSzabadnapModal] = useState(false);
  const [torolModal, setTorolModal] = useState(false);
  const [currentId, setCurrentId] = useState(undefined);

  const { addNotification } = props;

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    listSzabadnapok();
  };

  const listSzabadnapok = () => {
    Services.listSzabadnapok((err, res) => {
      if (!err) {
        setSzabadnapokJson(res);
      }
    });
  };

  const getSzabadnap = (id) => {
    Services.getSzabadnap(id, (err, res) => {
      if (!err) {
        setSzabadnapObj(res);
      }
    });
  };

  const kezdeteFormatter = (cell, row) => {
    return `${moment(row.kezdete).format("YYYY-MM-DD")}`;
  };

  const vegeFormatter = (cell, row) => {
    return `${moment(row.vege).format("YYYY-MM-DD")}`;
  };

  const handleViewClick = (cell) => {
    setCurrentId(cell);
    getSzabadnap(cell);
  };

  const handleEditClick = (cell) => {
    setCurrentId(cell);
    getSzabadnap(cell);
    toggleSzabadnapModal();
  };

  const handleDeleteClick = (cell) => {
    setCurrentId(cell);
    toggleTorolModal();
  };

  const tableIconFormatter = (cell, row) => {
    return (
      <React.Fragment>
        <Button key={1} color="info" onClick={() => handleViewClick(row.id)}>
          <i className="fa-solid fa-eye" />
        </Button>
        <Button key={2} color="warning" onClick={() => handleEditClick(row.id)}>
          <i className="fa-solid fa-pencil" />
        </Button>
        <Button
          key={3}
          color="danger"
          onClick={() => handleDeleteClick(row.id)}
        >
          <i className="fa-solid fa-trash-can" />
        </Button>
      </React.Fragment>
    );
  };

  const renderSzabadnapokTable = () => {
    const columns = [
      { text: "Megnevezés", dataField: "megnevezes" },
      { text: "Kezdete", dataField: "kezdete", formatter: kezdeteFormatter },
      { text: "Vége", dataField: "vege", formatter: vegeFormatter },
      { text: "Műveletek", dataField: "id", formatter: tableIconFormatter },
    ];

    return (
      <DataTable
        columns={columns}
        datas={szabadnapokJson}
        paginationOptions={paginationOptions}
        bordered
      />
    );
  };

  const toggleSzabadnapModal = () => {
    setSzabadnapModal(!szabadnapModal);
  };

  const toggleTorolModal = () => {
    setTorolModal(!torolModal);
  };

  const handleNewClick = () => {
    setCurrentId(undefined);
    setSzabadnapObj(defaultSzabadnapObj);
    toggleSzabadnapModal();
  };

  const onSubmit = () => {
    let submitObj = szabadnapObj;
    submitObj.kezdete = new Date(szabadnapObj.kezdete);
    submitObj.vege = new Date(szabadnapObj.vege);

    if (currentId === undefined) {
      Services.addSzabadnap(submitObj, (err, res) => {
        if (!err) {
          toggleSzabadnapModal();
          listSzabadnapok();
          addNotification("success", res.msg);
        }
      });
    } else {
      Services.editSzabadnap(submitObj, currentId, (err, res) => {
        if (!err) {
          toggleSzabadnapModal();
          listSzabadnapok();
          addNotification("success", res.msg);
        }
      });
    }
  };

  const torolSzabadnap = () => {
    Services.deleteSzabadnap(currentId, (err, res) => {
      if (!err) {
        toggleTorolModal();
        listSzabadnapok();
        addNotification("success", res.msg);
      }
    });
  };

  const renderSzabadnapModal = () => {
    return (
      <Modal
        isOpen={szabadnapModal}
        toggle={toggleSzabadnapModal}
        size="xl"
        backdrop="static"
        style={{ color: "black" }}
      >
        <RVForm noValidate onSubmit={onSubmit}>
          <ModalHeader>
            {currentId !== undefined
              ? "Szabadnap módosítása"
              : "Szabadnap felvitele"}
          </ModalHeader>
          <ModalBody>
            <Row style={{ margin: "10px 0px 0px 0px" }}>
              <Col>
                <Label>{"Szabadnap megnevezése: *"}</Label>
                <RVInput
                  name="megnevezes"
                  id="megnevezes"
                  required
                  onChange={(e) =>
                    handleInputChange(e, szabadnapObj, setSzabadnapObj)
                  }
                  value={szabadnapObj.megnevezes}
                />
              </Col>
            </Row>
            <Row style={{ margin: "10px 0px 0px 0px" }}>
              <Col>
                <Label>{"Szabadnap kezdete: *"}</Label>
                <RVInput
                  type="date"
                  name="kezdete"
                  id="kezdete"
                  required
                  onChange={(e) =>
                    handleInputChange(e, szabadnapObj, setSzabadnapObj)
                  }
                  value={szabadnapObj.kezdete}
                />
              </Col>
            </Row>
            <Row style={{ margin: "10px 0px 0px 0px" }}>
              <Col>
                <Label>{"Szabadnap vege: *"}</Label>
                <RVInput
                  type="date"
                  minDate={new Date(szabadnapObj.kezdete) || null}
                  name="vege"
                  id="vege"
                  required
                  onChange={(e) =>
                    handleInputChange(e, szabadnapObj, setSzabadnapObj)
                  }
                  value={szabadnapObj.vege}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="submit">
              Mentés
            </Button>
            <Button type="button" onClick={toggleSzabadnapModal}>
              Mégsem
            </Button>
          </ModalFooter>
        </RVForm>
      </Modal>
    );
  };

  const renderTorolModal = () => {
    return (
      <Modal
        isOpen={torolModal}
        toggle={toggleTorolModal}
        backdrop="static"
        style={{ color: "black" }}
      >
        <ModalHeader>Figyelmeztetés</ModalHeader>
        <ModalBody>Valóban törölni kívánja a tételt?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={torolSzabadnap}>
            Igen
          </Button>
          <Button onClick={toggleTorolModal}>Mégsem</Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Button type="button" color="success" onClick={() => handleNewClick()}>
          {" "}
          + Szabadnap hozzáadása{" "}
        </Button>
        <br />
        <br />
        {szabadnapokJson && szabadnapokJson.length > 0
          ? renderSzabadnapokTable()
          : ""}
        {renderSzabadnapModal()}
        {renderTorolModal()}
      </div>
    </div>
  );
};

Szabadnapok.propTypes = {
  addNotification: PropTypes.func,
};

export default Szabadnapok;

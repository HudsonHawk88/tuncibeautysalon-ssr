import React, { Fragment, useEffect, useState } from "react";
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
import PropTypes from "prop-types";

import Services from "./Services.js";
import SzolgaltatasokForm from "./SzolgaltatasokForm.js";
import Sortable from "../../../commons/Sortable.js";
import { sorter } from "../../../commons/Lib.js";

const defaultSzolgaltatasObj = {
  szolgkategoria: "",
  szolgrovidnev: "",
  magyarszolgrovidnev: "",
  szolgreszletek: "",
  magyarszolgreszletek: "",
  ar: "",
  magyarar: "",
  penznem: "",
  magyarpenznem: "",
  idotartam: "",
  isAktiv: false,
};

const penznemek = [
  { id: 0, label: "CHF", value: "CHF" },
  { id: 1, label: "HUF", value: "HUF" },
];

const paginationOptions = {
  count: 5,
  color: "primary",
  rowPerPageOptions: [
    {
      value: 5,
      text: "5",
    },
    {
      value: 10,
      text: "10",
    },
    {
      value: 25,
      text: "25",
    },
    {
      value: 50,
      text: "50",
    },
  ],
};

const Szolgaltatasok = (props) => {
  const [szolgaltatasokJson, setSzolgaltatasokJson] = useState([]);
  const [szolgaltatasObj, setSzolgaltatasObj] = useState(
    defaultSzolgaltatasObj
  );
  const [szolgModal, setSzolgModal] = useState(false);
  const [torolModal, setTorolModal] = useState(false);
  const [sorrendModal, setSorrendModal] = useState(false);
  const [currentId, setCurrentId] = useState(undefined);
  const [szolgKategoriak, setSzolgKategoriak] = useState([]);
  const [szolgKat, setSzolgKat] = useState(null);
  const [szolgSorrendek, setSzolgSorrendek] = useState([]);

  const { addNotification } = props;

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    listSzolgaltatasok();
    setDefaultPenznem();
    listKategoriak();
  };

  const listSzolgaltatasok = () => {
    Services.listSzolgaltatasok((err, res) => {
      if (!err) {
        setSzolgaltatasokJson(res);
      }
    });
  };

  const setDefaultPenznem = () => {
    setSzolgaltatasObj({
      ...szolgaltatasObj,
      penznem: { id: 0, label: "CHF", value: "CHF" },
      magyarpenznem: { id: 1, label: "HUF", value: "HUF" },
    });
  };

  const listKategoriak = () => {
    Services.listKategoriak((err, res) => {
      if (!err) {
        setSzolgKategoriak(res);
      }
    });
  };

  const getSzolgaltatas = (id) => {
    Services.getSzolgaltatas(id, (err, res) => {
      if (!err) {
        res.szolgkategoria = szolgKategoriak.find(
          (szk) => szk.kategorianev === res.szolgkategoria
        )
          ? szolgKategoriak.find(
              (szk) => szk.kategorianev === res.szolgkategoria
            ).id
          : null;
        res.penznem = penznemek.find((pn) => res.penznem === pn.value);
        res.magyarpenznem = penznemek.find(
          (pn) => res.magyarpenznem === pn.value
        );
        setSzolgaltatasObj(res);
      }
    });
  };

  const arFormatter = (cell, row) => {
    return `${row.ar} ${row.penznem}`;
  };

  const arMagyarFormatter = (cell, row) => {
    return `${row.magyarar} ${row.magyarpenznem}`;
  };

  const handleViewClick = (cell) => {
    setCurrentId(cell);
    getSzolgaltatas(cell);
  };

  const handleEditClick = (cell) => {
    setCurrentId(cell);
    getSzolgaltatas(cell);
    toggleSzolgModal();
  };

  const handleDeleteClick = (cell) => {
    setCurrentId(cell);
    toggleTorolModal();
  };

  const tableIconFormatter = (cell, row) => {
    return (
      <Fragment>
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
      </Fragment>
    );
  };

  const renderSzolgaltatasokTable = () => {
    const columns = [
      { text: "Megnevezés", dataField: "szolgrovidnev" },
      { text: "Német ár", dataField: "ar", formatter: arFormatter },
      {
        text: "Magyar ár",
        dataField: "magyarar",
        formatter: arMagyarFormatter,
      },
      { text: "Műveletek", dataField: "id", formatter: tableIconFormatter },
    ];

    return (
      <DataTable
        columns={columns}
        datas={szolgaltatasokJson}
        paginationOptions={paginationOptions}
        bordered
      />
    );
  };

  const toggleSzolgModal = () => {
    setSzolgModal(!szolgModal);
  };

  const toggleTorolModal = () => {
    setTorolModal(!torolModal);
  };

  const toggleSorrendModal = () => {
    setSorrendModal(!sorrendModal);
  };

  const handleNewClick = () => {
    setCurrentId(undefined);
    setSzolgaltatasObj(defaultSzolgaltatasObj);
    setDefaultPenznem();
    toggleSzolgModal();
  };

  const onSubmit = () => {
    let submitObj = szolgaltatasObj;
    submitObj.penznem = submitObj.penznem.value
      ? submitObj.penznem.value
      : submitObj.penznem;
    submitObj.magyarpenznem = submitObj.magyarpenznem.value
      ? submitObj.magyarpenznem.value
      : submitObj.magyarpenznem;

    /* console.log("submitObj: ", submitObj) */
    if (currentId === undefined) {
      Services.addSzolgaltatas(submitObj, (err, res) => {
        if (!err) {
          toggleSzolgModal();
          listSzolgaltatasok();
          addNotification("success", res.msg);
        }
      });
    } else {
      Services.editSzolgaltatas(submitObj, currentId, (err, res) => {
        if (!err) {
          toggleSzolgModal();
          listSzolgaltatasok();
          addNotification("success", res.msg);
        }
      });
    }
  };

  const torolSzolgaltatas = () => {
    Services.deleteSzolgaltatas(currentId, (err, res) => {
      if (!err) {
        toggleTorolModal();
        listSzolgaltatasok();
        addNotification("success", res.msg);
      }
    });
  };

  const mentesSorrend = () => {
    let submitArr = szolgSorrendek;
    Services.editSzolgaltatasok(submitArr, (err, res) => {
      if (!err) {
        setSzolgKat(null);
        toggleSorrendModal();
        addNotification("success", res.msg);
      }
    });
  };

  const renderSzolgaltatasokModal = () => {
    return (
      <Modal
        isOpen={szolgModal}
        toggle={toggleSzolgModal}
        size="xl"
        backdrop="static"
        style={{ color: "black" }}
      >
        <RVForm noValidate onSubmit={onSubmit}>
          <ModalHeader>
            {currentId !== undefined
              ? "Szolgáltatás módosítása"
              : "Szolgáltatás felvitele"}
          </ModalHeader>
          <ModalBody>
            <SzolgaltatasokForm
              currentId={currentId}
              szolgaltatasObj={szolgaltatasObj}
              setSzolgaltatasObj={setSzolgaltatasObj}
              szolgKategoriak={szolgKategoriak}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="submit">
              Mentés
            </Button>
            <Button type="button" onClick={toggleSzolgModal}>
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
          <Button color="danger" onClick={torolSzolgaltatas}>
            Igen
          </Button>
          <Button onClick={toggleTorolModal}>Mégsem</Button>
        </ModalFooter>
      </Modal>
    );
  };

  // const move = (arr, from, to) => {
  //   let akt = arr.splice(from, 1)[0];
  //   let rem = arr;
  //   rem.splice(to - 1, 0, akt);
  //   return rem;
  // };

  const onChangeSzolgKat = (e) => {
    const { target } = e;

    let value = target.value && target.value !== "" ? target.value : null;

    setSzolgKat(value);
    if (value) {
      let szolgSor = szolgaltatasokJson.filter(
        (sz) => sz.szolgkategoria === value
      );
      szolgSor = szolgSor.sort(sorter("sorrend", "number"));
      setSzolgSorrendek(szolgSor);
    }
  };

  const renderSorrendModal = () => {
    return (
      <Modal
        isOpen={sorrendModal}
        toggle={toggleSorrendModal}
        backdrop="static"
        size="xl"
        style={{ color: "black" }}
      >
        <ModalHeader>Szolgáltatások sorrendje</ModalHeader>
        <ModalBody>
          <Row style={{ margin: "10px 0px" }}>
            <Col>
              <Label>{"Szolgáltatás kategória: "}</Label>&nbsp;
              <RVInput
                type="select"
                name="szolgKat"
                id="szolgKat"
                value={szolgKat}
                onChange={onChangeSzolgKat}
              >
                <option key="default" value="">
                  Kérjük válasszon szolgáltatás kategóriát...
                </option>
                {szolgKategoriak.map((newSz) => {
                  return (
                    <option
                      key={`newSz_${newSz.id}`}
                      value={newSz.kategorianev}
                    >
                      {newSz.magyarkategorianev}
                    </option>
                  );
                })}
              </RVInput>
            </Col>
          </Row>
          {szolgKat && szolgSorrendek && szolgSorrendek.length > 0 && (
            <Row style={{ margin: "10px 0px" }}>
              <Col>
                <div
                  className="flex min-h-screen flex-col items-center space-y-4"
                  style={{ padding: "20px" }} /* className="szolgSorrendek" */
                >
                  <Sortable
                    items={szolgSorrendek}
                    setItems={setSzolgSorrendek}
                    innerParam={"magyarszolgrovidnev"}
                    {...props}
                  />
                </div>
              </Col>
            </Row>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={mentesSorrend}>
            Mentés
          </Button>
          <Button onClick={toggleSorrendModal}>Mégsem</Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Button type="button" color="success" onClick={() => handleNewClick()}>
          {" "}
          + Szolgáltatás hozzáadása{" "}
        </Button>
        &nbsp;
        <Button type="button" color="info" onClick={() => toggleSorrendModal()}>
          {" "}
          + Szolgáltatások sorrendjének módosítása{" "}
        </Button>
        <br />
        <br />
        {szolgaltatasokJson && szolgaltatasokJson.length > 0
          ? renderSzolgaltatasokTable()
          : ""}
        {renderSzolgaltatasokModal()}
        {renderTorolModal()}
        {renderSorrendModal()}
      </div>
    </div>
  );
};

Szolgaltatasok.propTypes = {
  addNotification: PropTypes.func,
};

export default Szolgaltatasok;

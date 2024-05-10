import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { DataTable } from "@inftechsol/react-data-table";
import PropTypes from "prop-types";
import { setEditorValue, initialValue } from "@inftechsol/react-slate-wysiwyg";
import {
  WysiwygEditor,
  serializeValue,
} from "../../../commons/WysiwygEditor.js";
import { handleInputChange } from "../../../commons/InputHandlers.js";
import Services from "./Services.js";

const Gdpr = (props) => {
  const { addNotification } = props;

  const defaultGdprObj = {
    azonosito: "",
    tipus: "",
    leiras: initialValue,
    /*   leiras: serializer.deserialize('<p align="left" style="font-size:17px"></p>') */
  };

  const [gdprJson, setGdprJson] = useState([]);
  const [gdprObj, setGdprObj] = useState(defaultGdprObj);
  const [currentId, setCurrentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const Editor1 = useRef(null);
  const Editor2 = useRef(null);

  const listGdpr = () => {
    Services.listGdpr((err, res) => {
      if (!err) {
        setGdprJson(res);
      }
    });
  };

  useEffect(() => {
    listGdpr();
  }, []);

  const getGdpr = (id) => {
    Services.getGdpr(id, (err, res) => {
      if (!err && Editor1 && Editor1.current) {
        const leiras = serializeValue("de", res.leiras);
        const magyarleiras = serializeValue("de", res.magyarleiras);
        setEditorValue(leiras, Editor1);
        setEditorValue(magyarleiras, Editor2);
        setGdprObj({
          ...gdprObj,
          azonosito: res.azonosito,
          tipus: res.tipus,
          leiras: leiras,
        });
      }
    });
  };

  const onChangeEditor = (value) => {
    setGdprObj({
      ...gdprObj,
      leiras: value,
    });
  };

  const onChangeEditor2 = (value) => {
    setGdprObj({
      ...gdprObj,
      magyarleiras: value,
    });
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleNewClick = () => {
    setCurrentId(null);
    setGdprObj(defaultGdprObj);
    toggleModal();
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getGdpr(id);
    toggleModal();
  };

  const handleDeleteClick = (id) => {
    setCurrentId(id);
    toggleDeleteModal();
  };

  const tableIconFormatter = (cell, row) => {
    return (
      <React.Fragment>
        {/* <Button
              key={rowIndex}
              color="link"
              onClick={() => handleViewClick(cell)}
            >
              <i key={rowIndex + 1} className="fas fa-eye" />
            </Button> */}
        <Button
          key={row.id + 1}
          color="link"
          onClick={() => handleEditClick(row.id)}
        >
          <i className="fas fa-pencil-alt" />
        </Button>
        <Button
          key={row.id + 2}
          color="link"
          onClick={() => handleDeleteClick(row.id)}
        >
          <i className="fas fa-trash" />
        </Button>
      </React.Fragment>
    );
  };

  const renderTable = () => {
    const columns = [
      {
        dataField: "azonosito",
        text: "Azonosító",
      },
      {
        dataField: "tipus",
        text: "Típus",
      },
      {
        dataField: "id",
        formatter: tableIconFormatter,
        text: "Műveletek",
      },
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

    return (
      <DataTable
        bordered
        columns={columns}
        datas={gdprJson}
        paginationOptions={paginationOptions}
      />
    );
  };

  const onSave = () => {
    let obj = {};

    Object.assign(obj, gdprObj);
    obj.leiras = serializeValue("se", gdprObj.leiras);
    obj.magyarleiras = serializeValue("se", gdprObj.magyarleiras);

    if (!currentId) {
      Services.addGdpr(obj, (err, res) => {
        if (!err) {
          listGdpr();
          toggleModal();
          addNotification("success", res.msg);
        }
      });
    } else {
      Services.editGdpr(obj, currentId, (err, res) => {
        if (!err) {
          listGdpr();
          toggleModal();
          addNotification("success", res.msg);
        }
      });
    }
  };

  const onDelete = () => {
    Services.deleteGdpr(currentId, (err, res) => {
      if (!err) {
        listGdpr();
        toggleDeleteModal();
        addNotification("success", res.msg);
      }
    });
  };

  const renderWysiwyg = () => {
    return (
      <WysiwygEditor
        onChange={onChangeEditor}
        value={gdprObj.leiras}
        ref={Editor1}
      />
    );
  };

  const renderWysiwygMagyar = () => {
    return (
      <WysiwygEditor
        onChange={onChangeEditor2}
        value={gdprObj.magyarleiras}
        ref={Editor2}
      />
    );
  };

  const renderModal = () => {
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        size="xl"
        backdrop="static"
      >
        <ModalHeader>
          {!currentId ? "GDPR hozzáadása" : "GDPR módosítása"}
        </ModalHeader>
        <ModalBody>
          <div className="col-md-12">
            <Label>Azonosító:</Label>
            <Input
              type="text"
              name="azonosito"
              id="azonosito"
              value={gdprObj.azonosito}
              onChange={(e) => handleInputChange(e, gdprObj, setGdprObj)}
            />
          </div>
          <br />
          <div className="col-md-12">
            <Label>Típus:</Label>
            <Input
              type="select"
              name="tipus"
              id="tipus"
              value={gdprObj.tipus}
              onChange={(e) => handleInputChange(e, gdprObj, setGdprObj)}
            >
              <option key="" value="">
                Kérjük válasszon GDPR típust...
              </option>
              <option
                key="adatkezelesi_nyilatkozat"
                value="Adatkezelési nyilatkozat"
              >
                Adatkezelési nyilatkozat
              </option>
            </Input>
          </div>
          <br />
          <div className="col-md-12">
            <Label>Német leíras:</Label>
            {renderWysiwyg()}
          </div>
          <br />
          <div className="col-md-12">
            <Label>Magyar leíras:</Label>
            {renderWysiwygMagyar()}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={onSave}>
            Mentés
          </Button>
          <Button color="secondary" onClick={() => toggleModal()}>
            Mégsem
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const renderDeleteModal = () => {
    return (
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader>GDPR törlése</ModalHeader>
        <ModalBody>
          <div className="col-md-12">
            {"Valóban törölni kívánja az adott tételt?"}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => onDelete()}>
            Igen
          </Button>
          <Button color="secondary" onClick={() => toggleDeleteModal()}>
            Mégsem
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  console.log("EDITOR1: ", Editor1);

  return (
    <div className="row">
      <div className="col-md-12">
        <Button color="success" onClick={() => handleNewClick()}>
          + GDPR hozzáadása
        </Button>
        <br />
        <br />
        {renderTable()}
        {renderModal()}
        {renderDeleteModal()}
      </div>
    </div>
  );
};

Gdpr.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default Gdpr;

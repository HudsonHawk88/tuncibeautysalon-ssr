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

const Hirlevelek = (props) => {
  const { addNotification } = props;

  const defaultHirlevelObj = {
    azonosito: "",
    tipus: "",
    hirlevel: initialValue,
    magyarhirlevel: initialValue,
    /*   leiras: serializer.deserialize('<p align="left" style="font-size:17px"></p>') */
  };

  const [hirlevelJson, setHirlevelJson] = useState([]);
  const [hirlevelObj, setHirlevelObj] = useState(defaultHirlevelObj);
  const [currentId, setCurrentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const Editor1 = useRef(null);
  const Editor2 = useRef(null);

  const listHirlevelek = () => {
    Services.listHirlevel((err, res) => {
      if (!err) {
        setHirlevelJson(res || []);
      }
    });
  };

  useEffect(() => {
    listHirlevelek();
  }, []);

  const getHirlevel = (id) => {
    Services.getHirlevel(id, (err, res) => {
      if (!err && Editor1 && Editor1.current) {
        const hirlevel = serializeValue("de", res.hirlevel);
        const magyarhirlevel = serializeValue("de", res.magyarhirlevel);
        setEditorValue(hirlevel, Editor1);
        setEditorValue(magyarhirlevel, Editor2);
        setHirlevelObj({
          ...hirlevelObj,
          azonosito: res.azonosito,
          tipus: res.tipus,
          hirlevel: hirlevel,
          magyarhirlevel: magyarhirlevel,
        });
      }
    });
  };

  const onChangeEditor = (value) => {
    setHirlevelObj({
      ...hirlevelObj,
      hirlevel: value,
    });
  };

  const onChangeEditor2 = (value) => {
    setHirlevelObj({
      ...hirlevelObj,
      magyarhirlevel: value,
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
    setHirlevelObj(defaultHirlevelObj);
    toggleModal();
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getHirlevel(id);
    toggleModal();
  };

  const handleStartCron = (id) => {
    const secret = __isBrowser__
      ? process.env.REACT_APP_hirelvelSendSecret
      : "";
    Services.startCron(id, secret, (err, res) => {
      if (!err) {
        console.log(res)
      } else {
        console.log(err)
      }
    });
  };

  const handlePauseCron = (id) => {
    const secret = __isBrowser__
      ? process.env.REACT_APP_hirelvelSendSecret
      : "";
    Services.pauseCron(id, secret);
  };

  const handleStopCron = (id) => {
    const secret = __isBrowser__
      ? process.env.REACT_APP_hirelvelSendSecret
      : "";
    Services.stopCron(id, secret);
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
        <Button
          key={row.id + 1}
          color="link"
          onClick={() => handleStartCron(row.id)}
        >
          <i className="fa-solid fa-play" />
        </Button>
        <Button
          key={row.id + 1}
          color="link"
          onClick={() => handlePauseCron(row.id)}
        >
          <i className="fa-solid fa-pause" />
        </Button>
        <Button
          key={row.id + 1}
          color="link"
          onClick={() => handleStopCron(row.id)}
        >
          <i className="fa-solid fa-stop" />
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
        datas={hirlevelJson}
        paginationOptions={paginationOptions}
      />
    );
  };

  const onSave = () => {
    let obj = {};

    Object.assign(obj, hirlevelObj);
    obj.hirlevel = serializeValue("se", hirlevelObj.hirlevel);
    obj.magyarhirlevel = serializeValue("se", hirlevelObj.magyarhirlevel);

    if (!currentId) {
      Services.addHirlevel(obj, (err, res) => {
        if (!err) {
          listHirlevelek();
          toggleModal();
          addNotification("success", res.msg);
        }
      });
    } else {
      Services.editHirlevel(obj, currentId, (err, res) => {
        if (!err) {
          listHirlevelek();
          toggleModal();
          addNotification("success", res.msg);
        }
      });
    }
  };

  const onDelete = () => {
    Services.deleteHirlevel(currentId, (err, res) => {
      if (!err) {
        listHirlevelek();
        toggleDeleteModal();
        addNotification("success", res.msg);
      }
    });
  };

  const renderWysiwyg = () => {
    return (
      <WysiwygEditor
        onChange={onChangeEditor}
        value={hirlevelObj.hirlevel}
        ref={Editor1}
        isHirlevel
      />
    );
  };

  const renderWysiwygMagyar = () => {
    return (
      <WysiwygEditor
        onChange={onChangeEditor2}
        value={hirlevelObj.magyarhirlevel}
        ref={Editor2}
        isHirlevel
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
          {!currentId ? "Hírlevél hozzáadása" : "Hírlevél módosítása"}
        </ModalHeader>
        <ModalBody>
          <div className="col-md-12">
            <Label>Azonosító:</Label>
            <Input
              type="text"
              name="azonosito"
              id="azonosito"
              value={hirlevelObj.azonosito}
              onChange={(e) =>
                handleInputChange(e, hirlevelObj, setHirlevelObj)
              }
            />
          </div>
          <br />
          <div className="col-md-12">
            <Label>Típus:</Label>
            <Input
              type="select"
              name="tipus"
              id="tipus"
              value={hirlevelObj.tipus}
              onChange={(e) =>
                handleInputChange(e, hirlevelObj, setHirlevelObj)
              }
            >
              <option key="" value="">
                Kérjük válasszon hírlevél típust...
              </option>
              <option key="2heti" value="2_heti">
                2 heti
              </option>
            </Input>
          </div>
          <br />
          <div className="col-md-12">
            <Label>Német hírlevél:</Label>
            {renderWysiwyg()}
          </div>
          <br />
          <div className="col-md-12">
            <Label>Magyar hírlevél:</Label>
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
        <ModalHeader>Hírlevél törlése</ModalHeader>
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
          + Hírlevél hozzáadása
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

Hirlevelek.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default Hirlevelek;

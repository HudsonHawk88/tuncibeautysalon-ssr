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
import {
  Editor,
  setEditorValue,
  initialValue,
} from "@inftechsol/react-slate-wysiwyg";
import {
  WysiwygEditor,
  serializeValue,
} from "../../../commons/WysiwygEditor.js";
import PropTypes from "prop-types";
import Services from "./Services.js";
import { handleInputChange } from "../../../commons/InputHandlers.js";

const defaultBioObj = {
  azonosito: "",
  leiras: initialValue,
  magyarleiras: initialValue,
};

const Bio = (props) => {
  const [biosJson, setBiosJson] = useState([]);
  const [bioObj, setBioObj] = useState(defaultBioObj);
  const [currentId, setCurrentId] = useState(null);
  const [bioModal, setBioModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { addNotification } = props;
  let Editor1 = useRef(Editor);
  let Editor2 = useRef(Editor);

  const getBios = () => {
    Services.listBio((err, res) => {
      if (!err) {
        setBiosJson(res);
      }
    });
  };

  const getBio = (id) => {
    Services.getBio(id, (err, res) => {
      if (!err && Editor) {
        let obj = res;
        const leiras = serializeValue("de", res.leiras);
        const magyarleiras = serializeValue("de", res.magyarleiras);
        // console.log("Editor1, Editor2: ", Editor1, Editor2);
        if (Editor1 && Editor2 && Editor1.current && Editor2.current) {
          setEditorValue(leiras, Editor1.current);
          setEditorValue(magyarleiras, Editor2.current);
        }
        obj.leiras = leiras;
        obj.magyarleiras = magyarleiras;
        setBioObj(obj);
      }
    });
  };

  useEffect(() => {
    getBios();
  }, []);

  const toggleBioModal = () => {
    setBioModal(!bioModal);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleNewClick = () => {
    setCurrentId(null);
    setBioObj(defaultBioObj);
    toggleBioModal();
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getBio(id);
    toggleBioModal();
  };

  const handleDeleteClick = (id) => {
    setCurrentId(id);
    toggleDeleteModal();
  };

  const onChangeEditor = (value) => {
    setBioObj({
      ...bioObj,
      leiras: value,
    });
  };

  const onChangeMagyarEditor = (value) => {
    setBioObj({
      ...bioObj,
      magyarleiras: value,
    });
  };

  const onSave = () => {
    let obj = {};

    Object.assign(obj, bioObj);
    obj.leiras = serializeValue("se", bioObj.leiras);
    obj.magyarleiras = serializeValue("se", bioObj.magyarleiras);

    if (!currentId) {
      Services.addBio(obj, (err, res) => {
        if (!err) {
          getBios();
          toggleBioModal();
          addNotification("success", res.msg);
        }
      });
    } else {
      Services.editBio(obj, currentId, (err, res) => {
        if (!err) {
          getBios();
          toggleBioModal();
          addNotification("success", res.msg);
        }
      });
    }
  };

  const onDelete = () => {
    Services.deleteBio(currentId, (err, res) => {
      if (!err) {
        getBios();
        toggleDeleteModal();
        addNotification("success", res.msg);
      }
    });
  };

  const tableIconFormatter = (cell, row) => {
    return (
      <React.Fragment>
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
        datas={biosJson}
        paginationOptions={paginationOptions}
      />
    );
  };

  const renderWysiwyg = () => {
    return (
      <WysiwygEditor
        onChange={onChangeEditor}
        editorKey="Editor1"
        ref={Editor1}
        id="w1"
        value={bioObj.leiras}
      />
    );
  };

  const renderWysiwygMagyar = () => {
    return (
      <WysiwygEditor
        onChange={onChangeMagyarEditor}
        editorKey="Editor2"
        ref={Editor2}
        id="w2"
        value={bioObj.leirasMagyar}
      />
    );
  };

  const renderModal = () => {
    return (
      <Modal
        isOpen={bioModal}
        toggle={toggleBioModal}
        size="xl"
        backdrop="static"
      >
        <ModalHeader>
          {!currentId ? "Bio hozzáadása" : "Bio módosítása"}
        </ModalHeader>
        <ModalBody>
          <div className="col-md-12">
            <Label>Azonosító:</Label>
            <Input
              type="text"
              name="azonosito"
              id="azonosito"
              value={bioObj.azonosito}
              onChange={(e) => handleInputChange(e, bioObj, setBioObj)}
            />
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
          <Button color="secondary" onClick={() => toggleBioModal()}>
            Mégsem
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const renderDeleteModal = () => {
    return (
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader>Bio törlése</ModalHeader>
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

  return (
    <div className="row">
      <div className="col-md-12">
        {biosJson.length < 1 && (
          <React.Fragment>
            <Button color="success" onClick={() => handleNewClick()}>
              + Bio hozzáadása
            </Button>
            <br />
            <br />
          </React.Fragment>
        )}
        {renderTable()}
        {renderModal()}
        {renderDeleteModal()}
      </div>
    </div>
  );
};

Bio.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default Bio;

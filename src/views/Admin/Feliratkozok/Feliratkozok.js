import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { DataTable } from "@inftechsol/react-data-table";
import PropTypes from "prop-types";
import { RVInput } from "@inftechsol/reactstrap-form-validation";

import { handleInputChange } from "../../../commons/InputHandlers.js";
import Services from "./Services.js";

const Feliratkozok = (props) => {
  const defaultFeliratkozo = {
    feliratkozoNyelv: "ch",
    feliratkozoNev: "",
    feliratkozoEmail: "",
    feliratkozasMod: "Adminui",
  };

  const [feliratkozokJson, setFeliratkozokJson] = useState([]);
  const [feliratkozo, setFeliratkozo] = useState(defaultFeliratkozo);
  const [currentId, setCurrentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { addNotification } = props;

  const listFeliratkozok = () => {
    Services.listFeliratkozok((err, res) => {
      if (!err) {
        setFeliratkozokJson(res);
      } else {
        setFeliratkozokJson([]);
      }
    });
  };

  const init = () => {
    listFeliratkozok();
  };

  useEffect(() => {
    init();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const getFeliratkozo = (id) => {
    Services.getFeliratkozo(id, (err, res) => {
      if (!err) {
        setFeliratkozo(res);
      }
    });
  };

  const handleNewClick = () => {
    setCurrentId(null);
    setFeliratkozo(defaultFeliratkozo);
    toggleModal();
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getFeliratkozo(id);
    toggleModal();
  };

  const onSave = () => {
    if (!currentId) {
      Services.addFeliratkozo(feliratkozo, (err, res) => {
        if (!err) {
          toggleModal();
          listFeliratkozok();
          addNotification("success", res.msg);
        }
      });
    } else {
      Services.editFeliratkozo(feliratkozo, currentId, (err, res) => {
        if (!err) {
          toggleModal();
          listFeliratkozok();
          addNotification("success", res.msg);
        }
      });
    }
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
          {!currentId ? "Feliratkozó hozzáadása" : "Feliratkozó módosítása"}
        </ModalHeader>
        <ModalBody>
          <h4>Alapadatok:</h4>
          <br />
          <div className="row">
            <div className="col-md-4">
              <Label>Feliratkozó neve: *</Label>
              <RVInput
                name="feliratkozoNev"
                id="feliratkozoNev"
                type="text"
                onChange={(e) =>
                  handleInputChange(e, feliratkozo, setFeliratkozo)
                }
                value={feliratkozo.feliratkozoNev}
              />
            </div>
            <div className="col-md-4">
              <Label>Feliratkozó e-mail címe: </Label>
              <RVInput
                name="feliratkozoEmail"
                id="feliratkozoEmail"
                type="text"
                onChange={(e) =>
                  handleInputChange(e, feliratkozo, setFeliratkozo)
                }
                value={feliratkozo.feliratkozoEmail}
              />
            </div>
            <div className="col-md-4">
              <Label>Feliratkozó nyelve: *</Label>
              <RVInput
                type="select"
                name="feliratkozoNyelv"
                id="valfeliratkozoNyelvue"
                onChange={(e) =>
                  handleInputChange(e, feliratkozo, setFeliratkozo)
                }
                value={feliratkozo.feliratkozoNyelv}
              >
                <option key="opt_ch" value="ch">
                  svájci
                </option>
                <option key="opt_hu" value="hu">
                  magyar
                </option>
              </RVInput>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave()}>
            Mentés
          </Button>
          <Button color="secondary" onClick={() => toggleModal()}>
            Mégsem
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const handleDeleteClick = (id) => {
    setCurrentId(id);
    toggleDeleteModal();
  };

  const onDelete = () => {
    Services.deleteRole(currentId, (err, res) => {
      if (!err) {
        listRoles();
        toggleDeleteModal();
        addNotification("success", res.msg);
      }
    });
  };

  const renderDeleteModal = () => {
    return (
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader>Jogosultság törlése</ModalHeader>
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

  const tableIconFormatter = (cell, row) => {
    return (
      <React.Fragment>
        <Button
          key={row.id}
          color="link"
          onClick={() => handleEditClick(row.id)}
          hidden={row.value === "SZUPER_ADMIN"}
        >
          <i className="fas fa-pencil-alt" />
        </Button>
        <Button
          key={row.id + 1}
          color="link"
          hidden={row.value === "SZUPER_ADMIN"}
          onClick={() => handleDeleteClick(row.id)}
        >
          <i key={row.id + 5} className="fas fa-trash" />
        </Button>
      </React.Fragment>
    );
  };

  const renderTable = () => {
    const columns = [
      {
        dataField: "feliratkozoNev",
        text: "Feliratkozó neve",
        filter: true,
        filterType: "textFilter",
        filterDefaultValue: "Keresés...",
      },
      {
        dataField: "feliratkozoEmail",
        text: "Feliratkozó e-mail",
        filterType: "textFilter",
        filterDefaultValue: "Keresés...",
      },
      {
        dataField: "id",
        text: "Műveletek",
        formatter: tableIconFormatter,
      },
    ];

    const paginationOptions = {
      color: "primary",
      count: 5,
      nextText: ">",
      previousText: "<",
      firstPageText: "<<",
      lastPageText: ">>",
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
      ],
    };

    return (
      <DataTable
        bordered
        datas={feliratkozokJson}
        columns={columns}
        paginationOptions={paginationOptions}
      />
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Button type="button" color="success" onClick={() => handleNewClick()}>
          {" "}
          + Feliratkozó hozzáadása{" "}
        </Button>
        <br />
        <br />
        {renderModal()}
        {renderDeleteModal()}
        {renderTable()}
      </div>
    </div>
  );
};

Feliratkozok.propTypes = {
  addNotification: PropTypes.func,
};

export default Feliratkozok;

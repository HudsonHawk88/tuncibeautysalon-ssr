import React, { useEffect, useState, Fragment } from "react";
import { DataTable } from "@inftechsol/react-data-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { RVForm } from "@inftechsol/reactstrap-form-validation";
import PropTypes from "prop-types";

import Services from "./Services";
import KategoriaForm from "./KategoriaForm";

const defaultKategoriaObj = {
  kategorianev: "",
  magyarkategorianev: "",
  kategorialeiras: "",
  magyarkategorialeiras: "",
};

const SzolgaltatasKategoriak = (props) => {
  const { addNotification } = props;
  const [kategoriak, setKategoriak] = useState([]);
  const [kategoriaObj, setKategoriaObj] = useState(defaultKategoriaObj);
  const [kategoriaModal, setKategoriaModal] = useState(false);
  const [torolModal, setTorolModal] = useState(false);
  const [currentId, setCurrentId] = useState(undefined);

  useEffect(() => {
    listKategoriak();
  }, []);

  const listKategoriak = () => {
    Services.listSzolgaltatasKategoriak((err, res) => {
      if (!err) {
        setKategoriak(res);
      }
    });
  };

  const getKategoria = (id) => {
    Services.getSzolgaltatasKategoria(id, (err, res) => {
      if (!err) {
        setKategoriaObj(res);
      }
    });
  };

  const handleViewClick = (cell) => {
    console.log(cell);
    setCurrentId(cell);
    getKategoria(cell);
  };

  const handleEditClick = (cell) => {
    setCurrentId(cell);
    getKategoria(cell);
    toggleKategoriaModal();
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

  const renderKategoriakTable = () => {
    const columns = [
      { text: "Német kategórianév", dataField: "kategorianev" },
      { text: "Magyar kategórianév", dataField: "magyarkategorianev" },
      { text: "Német kategórialeíras", dataField: "kategorialeiras" },
      { text: "Magyar kategórialeíras", dataField: "magyarkategorialeiras" },
      { text: "Műveletek", dataField: "id", formatter: tableIconFormatter },
    ];

    return <DataTable columns={columns} datas={kategoriak} bordered />;
  };

  const toggleKategoriaModal = () => {
    setKategoriaModal(!kategoriaModal);
  };

  const toggleTorolModal = () => {
    setTorolModal(!torolModal);
  };

  const handleNewClick = () => {
    setCurrentId(undefined);
    setKategoriaObj(defaultKategoriaObj);
    toggleKategoriaModal();
  };

  const onSubmit = () => {
    console.log(currentId !== undefined);
    let submitObj = kategoriaObj;
    if (currentId === undefined) {
      Services.addSzolgaltatasKategoria(submitObj, (err, res) => {
        if (!err) {
          toggleKategoriaModal();
          listKategoriak();
          addNotification("success", res.msg);
        }
      });
    } else {
      Services.editSzolgaltatasKategoria(submitObj, currentId, (err, res) => {
        if (!err) {
          toggleKategoriaModal();
          listKategoriak();
          addNotification("success", res.msg);
        }
      });
    }
  };

  const renderSzolgaltatasokModal = () => {
    console.log(currentId);
    return (
      <Modal
        isOpen={kategoriaModal}
        toggle={toggleKategoriaModal}
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
            <KategoriaForm
              currentId={currentId}
              kategoriaObj={kategoriaObj}
              setKategoriaObj={setKategoriaObj}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="submit">
              Mentés
            </Button>
            <Button type="button" onClick={toggleKategoriaModal}>
              Mégsem
            </Button>
          </ModalFooter>
        </RVForm>
      </Modal>
    );
  };

  const torolKategoria = () => {
    Services.deleteSzolgaltatasKategoria(currentId, (err, res) => {
      if (!err) {
        toggleTorolModal();
        listKategoriak();
        addNotification("success", res.msg);
      }
    });
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
          <Button color="danger" onClick={torolKategoria}>
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
          + Szolgáltatáskategória hozzáadása{" "}
        </Button>
        <br />
        <br />
        {kategoriak ? renderKategoriakTable() : ""}
        {renderSzolgaltatasokModal()}
        {renderTorolModal()}
      </div>
    </div>
  );
};

SzolgaltatasKategoriak.propTypes = {
  addNotification: PropTypes.func,
};

export default SzolgaltatasKategoriak;

import React, { useEffect, useState, Fragment } from "react";
import { DataTable } from "@inftechsol/react-data-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { RVForm } from "@inftechsol/reactstrap-form-validation";
import PropTypes from "prop-types";

import Services from "./Services.js";
import KategoriaForm from "./KategoriaForm.js";
import { makeFormData } from "../../../commons/Lib.js";

const defaultKategoriaObj = {
  kategorianev: "",
  magyarkategorianev: "",
  kategorialeiras: "",
  magyarkategorialeiras: "",
  kepek: [],
};

const SzolgaltatasKategoriak = (props) => {
  const { addNotification } = props;
  const [kategoriak, setKategoriak] = useState([]);
  const [kategoriaObj, setKategoriaObj] = useState(defaultKategoriaObj);
  const [kategoriaModal, setKategoriaModal] = useState(false);
  const [torolModal, setTorolModal] = useState(false);
  const [currentId, setCurrentId] = useState(undefined);

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

  const leirasFormatter = (cell, row, lang) => {
    const leiras =
      lang === "hu" ? row.magyarkategorialeiras : row.kategorialeiras;

    return leiras.length > 100 ? leiras.substring(0, 100) + "..." : leiras;
  };

  const renderKategoriakTable = () => {
    const columns = [
      { text: "Német kategórianév", dataField: "kategorianev" },
      { text: "Magyar kategórianév", dataField: "magyarkategorianev" },
      {
        text: "Német kategórialeíras",
        dataField: "kategorialeiras",
        formatter: (cell, row) => leirasFormatter(cell, row, "ch"),
      },
      {
        text: "Magyar kategórialeíras",
        dataField: "magyarkategorialeiras",
        formatter: (cell, row) => leirasFormatter(cell, row, "hu"),
      },
      { text: "Műveletek", dataField: "id", formatter: tableIconFormatter },
    ];

    return (
      <DataTable
        columns={columns}
        datas={kategoriak}
        paginationOptions={paginationOptions}
        bordered
      />
    );
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

  const deleteImage = (filename) => {
    let kepek = kategoriaObj.kep || [];
    let filtered = kepek.filter((kep) => kep.filename !== filename);

    setKategoriaObj({
      ...kategoriaObj,
      kep: filtered,
    });
    Services.deleteKategoriaKep({ filename: filename }, (err, res) => {
      if (!err) {
        addNotification("success", res.msg);
      }
    });
  };

  const onSubmit = (e, modosit) => {
    e.preventDefault();
    let submitObj = kategoriaObj;
    submitObj = makeFormData(kategoriaObj, ["kep"], modosit);
    if (!modosit) {
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
        <RVForm
          encType="multipart/form-data"
          noValidate
          onSubmit={(e) => onSubmit(e, currentId !== undefined)}
        >
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
              deleteImage={deleteImage}
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

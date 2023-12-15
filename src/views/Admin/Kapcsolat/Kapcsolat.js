import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Services from "./Services";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { RVForm } from "@inftechsol/reactstrap-form-validation";
import KapcsolatForm from "./KapcsolatForm";
import { DataTable } from "@inftechsol/react-data-table";

const defaultKapcsolat = {
  cegnev: "",
  helyseg: {
    orszag: "",
    irszam: "",
    telepules: "",
    cim: "",
  },
  telefon: "",
  email: "",
  web: "",
};

const defaultHelyseg = {
  orszag: null,
  irszam: "",
  telepules: "",
  cim: "",
};

const defaultNyitvatartas = {
  isMonday: true,
  isTuesday: true,
  isWednesday: true,
  isThursday: true,
  isFriday: true,
  isSaturday: false,
  isSunday: false,
  monday: {
    tol: null,
    ig: null,
  },
  tuesday: {
    tol: null,
    ig: null,
  },
  wednesday: {
    tol: "",
    ig: "",
  },
  thursday: {
    tol: "",
    ig: "",
  },
  friday: {
    tol: "",
    ig: "",
  },
  saturday: {
    tol: "",
    ig: "",
  },
  sunday: {
    tol: "",
    ig: "",
  },
};

const Kapcsolat = (props) => {
  const { addNotification } = props;

  const [kapcsolatok, setKapcsolatok] = useState([]);
  const [kapcsolat, setKapcsolat] = useState(defaultKapcsolat);
  const [helyseg, setHelyseg] = useState(defaultHelyseg);
  const [nyitvatartas, setNyitvatartas] = useState(defaultNyitvatartas);
  const [orszagok, setOrszagok] = useState([]);
  const [kapcsolatModal, setKapcsolatModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const listKapcsolatok = () => {
    Services.listKapcsolat((err, res) => {
      if (!err) {
        setKapcsolatok(res);
      }
    });
  };

  const getKapcsolat = (id) => {
    Services.getKapcsolat(id, (err, res) => {
      if (!err) {
        setKapcsolat(res);
        setHelyseg(res.helyseg);
        setNyitvatartas(res.nyitvatartas);
      }
    });
  };

  const listOrszagok = () => {
    Services.listOrszagok((err, res) => {
      if (!err) {
        setOrszagok(res);
      }
    });
  };

  const init = () => {
    listKapcsolatok();
    listOrszagok();
  };

  useEffect(() => {
    init();
  }, []);

  const toggleKapcsolatModal = () => {
    setKapcsolatModal(!kapcsolatModal);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleNewClick = () => {
    setCurrentId(null);
    setKapcsolat(defaultKapcsolat);
    setHelyseg(defaultHelyseg);
    setNyitvatartas(defaultNyitvatartas);
    toggleKapcsolatModal();
  };

  const handleViewClick = (id) => {
    setCurrentId(id);
    getKapcsolat(id);
    /* toggleKapcsolatModal(); */
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getKapcsolat(id);
    toggleKapcsolatModal();
  };

  const handleDeleteClick = (id) => {
    setCurrentId(id);
    toggleDeleteModal();
  };

  const helysegFormatter = (cell, row) => {
    const { helyseg } = row;
    const { orszag, irszam, telepules, cim } = helyseg;

    return `${orszag ? orszag.orszagnev : ""} ${irszam}, ${telepules} ${cim}`;
  };

  const iconFormatter = (cell, row) => {
    const { id } = row;

    return (
      <Fragment>
        <Button key={1} color="info" onClick={() => handleViewClick(id)}>
          <i className="fa-solid fa-eye" />
        </Button>
        <Button key={2} color="warning" onClick={() => handleEditClick(id)}>
          <i className="fa-solid fa-pencil" />
        </Button>
        <Button key={3} color="danger" onClick={() => handleDeleteClick(id)}>
          <i className="fa-solid fa-trash-can" />
        </Button>
      </Fragment>
    );
  };

  const renderKapcsolatTable = () => {
    const columns = [
      { text: "Cégnév", dataField: "cegnev" },
      { text: "Cím", dataField: "helyseg", formatter: helysegFormatter },
      { text: "Telefon", dataField: "telefon" },
      { text: "E-mail", dataField: "email" },
      { text: "Web", dataField: "web" },
      { text: "Műveletek", dataField: "id", formatter: iconFormatter },
    ];

    return <DataTable columns={columns} datas={kapcsolatok} />;
  };

  const onSubmit = () => {
    let submitObj = kapcsolat;
    submitObj.helyseg = helyseg;
    const orszag = orszagok.find(
      (orszag) => orszag.id === parseInt(submitObj.helyseg.orszag.id, 10)
    );
    submitObj.helyseg.orszag = orszag || null;
    submitObj.nyitvatartas = nyitvatartas;

    if (!currentId) {
      Services.addKapcsolat(submitObj, (err, res) => {
        if (!err) {
          toggleKapcsolatModal();
          listKapcsolatok();
          addNotification("success", res.msg);
        }
      });
    } else {
      Services.editKapcsolat(submitObj, currentId, (err, res) => {
        if (!err) {
          toggleKapcsolatModal();
          listKapcsolatok();
          addNotification("success", res.msg);
        }
      });
    }
  };

  const deleteKapcsolat = () => {
    Services.deleteKapcsolat(currentId, (err, res) => {
      if (!err) {
        toggleDeleteModal();
        listKapcsolatok();
        addNotification("success", res.msg);
      }
    });
  };

  const renderKapcsolatModal = () => {
    return (
      <Modal
        isOpen={kapcsolatModal}
        toggle={toggleKapcsolatModal}
        backdrop="static"
        size="lg"
        style={{ color: "black" }}
      >
        <RVForm onSubmit={onSubmit} noValidate>
          <ModalHeader>
            {!currentId ? "Kapcsolat felvitele" : "Kapcsolat módosítása"}
          </ModalHeader>
          <ModalBody>
            <KapcsolatForm
              kapcsolat={kapcsolat}
              setKapcsolat={setKapcsolat}
              helyseg={helyseg}
              setHelyseg={setHelyseg}
              nyitvatartas={nyitvatartas}
              setNyitvatartas={setNyitvatartas}
              currentId={currentId}
              orszagok={orszagok}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="success">
              Mentés
            </Button>
            <Button type="button" onClick={toggleKapcsolatModal}>
              Mégsem
            </Button>
          </ModalFooter>
        </RVForm>
      </Modal>
    );
  };

  const renderDeleteModal = () => {
    return (
      <Modal
        isOpen={deleteModal}
        toggle={toggleDeleteModal}
        backdrop="static"
        style={{ color: "black" }}
      >
        <ModalHeader>Figyelmeztetés</ModalHeader>
        <ModalBody>Valóban törölni kívánja a tételt?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteKapcsolat}>
            Igen
          </Button>
          <Button onClick={toggleDeleteModal}>Mégsem</Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Button
          type="button"
          color="success"
          hidden={kapcsolatok.length > 0}
          onClick={() => handleNewClick()}
        >
          {" "}
          + Kapcsolat hozzáadása{" "}
        </Button>
        <br />
        <br />
        {kapcsolatok && kapcsolatok.length > 0 ? renderKapcsolatTable() : ""}
        {renderKapcsolatModal()}
        {renderDeleteModal()}
      </div>
    </div>
  );
};

Kapcsolat.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default Kapcsolat;

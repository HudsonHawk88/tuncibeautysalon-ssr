import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { RVForm, RVInput } from "@inftechsol/reactstrap-form-validation";
import { useDropzone } from "react-dropzone";
import { handleInputChange } from "../../../commons/InputHandlers.js";
import Services from "./Services.js";
import { DataTable } from "@inftechsol/react-data-table";
import KepCard from "./KepCard.js";
import { makeFormData } from "../../../commons/Lib.js";

const defaultGaleriaObj = {
  nev: "",
  kategoria: null,
  kategoriaid: "",
  kepek: [],
};

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

const Galeria = (props) => {
  const { addNotification } = props;

  const [galeriaJson, setGaleriaJson] = useState([]);
  const [currentId, setCurrentId] = useState(undefined);
  const [galeriaObj, setGaleriaObj] = useState(defaultGaleriaObj);
  const [galeriaModal, setGaleriaModal] = useState(false);
  const [galeriaDeleteModal, setGaleriaDeleteModal] = useState(false);
  const [kategoriak, setKategoriak] = useState([]);
  const [kategoriakOptions, setKategoriakOptions] = useState([]);
  const [feliratok, setFeliratok] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const getKategoriak = (callback) => {
    Services.getKategoriak((err, res) => {
      if (!err) {
        setKategoriak(res);
        if (callback) {
          callback(res);
        }
      }
    });
  };

  const getGaleriaJson = (kateg) => {
    Services.listGaleriak((err, res) => {
      if (!err) {
        setGaleriaJson(res);
        if (kateg) {
          const galKatIds = res.map((gal) => gal.kategoriaid);
          const filtered = kateg.filter((kat) => !galKatIds.includes(kat.id));
          if (currentId) {
            setKategoriakOptions(filtered);
          } else {
            const kategOpts = kateg.filter((kat) =>
              res.some((r) => r.kategoria !== kat.id)
            );
            setKategoriakOptions(kategOpts);
          }
        }
      }
    });
  };

  useEffect(() => {
    getKategoriak((kateg) => getGaleriaJson(kateg));
  }, []);

  const getGaleria = (id) => {
    Services.getGaleria(id, (err, res) => {
      if (!err) {
        setGaleriaObj(res);
      }
    });
  };

  const deleteGaleria = () => {
    Services.deleteGaleria(selectedRow, (err, res) => {
      if (!err) {
        addNotification("success", res.msg);
        getGaleriaJson(kategoriak);
        toggleGaleriaDeleteModal();
      }
    });
  };

  const toggleGaleriaModal = () => {
    setGaleriaModal((prevState) => !prevState);
  };

  const toggleGaleriaDeleteModal = () => {
    setGaleriaDeleteModal((prevState) => !prevState);
  };

  const handleNewClick = () => {
    setCurrentId(undefined);
    setGaleriaObj(defaultGaleriaObj);
    toggleGaleriaModal();
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getGaleria(id);
    toggleGaleriaModal();
  };

  const handleDeleteClick = (id, kategoriaid) => {
    setCurrentId(id);
    setSelectedRow({ id: id, kategoriaid: kategoriaid });
    toggleGaleriaDeleteModal();
  };

  const handleKategoriaChange = (e) => {
    const kateg = kategoriak.find(
      (kat) => kat.id === parseInt(e.target.value, 10)
    )
      ? kategoriak.find((kat) => kat.id === parseInt(e.target.value, 10))
      : null;

    setGaleriaObj({
      ...galeriaObj,
      kategoria: kateg,
      kategoriaid: e.target.value,
    });
  };

  const handleFeliratChange = (e, kep, nyelv) => {
    const newKepek = [];
    let newFeliratok = [];
    let newKep = kep;
    if (nyelv === "magyar") {
      newKep.magyarfelirat = e.target.value;
    } else {
      newKep.felirat = e.target.value;
    }

    feliratok.forEach((k) => {
      if (k.filename === newKep.filename) {
        newFeliratok.push({
          filename: newKep.filename,
          felirat: newKep.felirat,
          magyarfelirat: newKep.magyarfelirat,
        });
      } else {
        newFeliratok.push(k);
      }
    });

    galeriaObj.kepek.forEach((k) => {
      if (k.filename === kep.filename) {
        newKepek.push(newKep);
      } else {
        newKepek.push(k);
      }
    });

    setGaleriaObj({ ...galeriaObj, kepek: newKepek });
  };

  const deleteImage = (filename, kategoriaid) => {
    let kepek = galeriaObj.kepek;
    let filtered = kepek.filter((kep) => kep.filename !== filename);

    setGaleriaObj({
      ...galeriaObj,
      kepek: filtered,
    });
    Services.deleteGaleriaKep(
      { filename: filename, kategoriaid: kategoriaid },
      (err, res) => {
        if (!err) {
          addNotification("success", res.msg);
        }
      }
    );
  };

  const onSubmit = (e, modosit) => {
    e.preventDefault();

    galeriaObj.kepek.forEach((k) => {
      if (k.file) {
        k.file.felirat = k.felirat;
        k.file.magyarfelirat = k.magyarfelirat;
      }
    });

    let submitObj = galeriaObj;

    submitObj.kategoria = {
      id: submitObj.kategoria.id,
      kategorianev: submitObj.kategoria.kategorianev,
      magyarkategorianev: submitObj.kategoria.magyarkategorianev,
    };

    submitObj = makeFormData(galeriaObj, ["kepek"], modosit);
    // console.log("SUBMITOBJ: ", submitObj);

    if (modosit) {
      // submitObj = makeFormData(galeriaObj, ['kepek']);
      Services.editGaleria(submitObj, galeriaObj.id, (err) => {
        if (!err) {
          getGaleriaJson(kategoriak);
          toggleGaleriaModal();
        }
      });
    } else {
      Services.addGaleria(submitObj, (err) => {
        if (!err) {
          getGaleriaJson(kategoriak);
          toggleGaleriaModal();
        }
      });
    }
  };

  const kategoriaFormatter = (cell, row) => {
    let result = "";
    if (row.kategoria !== undefined) {
      const kategoria = kategoriak.find((kat) => kat.id === row.kategoriaid);
      if (kategoria) {
        result = kategoria.magyarkategorianev;
      }
    }

    return result;
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
          onClick={() => handleDeleteClick(row.id, row.kategoriaid)}
        >
          <i className="fas fa-trash" />
        </Button>
      </React.Fragment>
    );
  };

  const renderGaleriakTable = () => {
    const columns = [
      {
        dataField: "nev",
        text: "Név",
      },
      {
        dataField: "kategoria",
        text: "Kategória",
        formatter: kategoriaFormatter,
      },
      {
        dataField: "id",
        text: "Műveletek",
        formatter: tableIconFormatter,
      },
    ];

    return <DataTable columns={columns} datas={galeriaJson} paginationOptions={paginationOptions} />;
  };

  const Kepek = () => {
    return (
      <div
        className="row"
        style={{
          margin: "10px 0px",
          maxHeight: "665px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {galeriaObj &&
          galeriaObj.kepek &&
          galeriaObj.kepek.map((kep, index) => {
            return (
              <KepCard
                felirat={
                  feliratok.find((f) => f.filename === kep.filename)
                    ? feliratok.find((f) => f.filename === kep.filename).felirat
                    : ""
                }
                magyarfelirat={
                  feliratok.find((f) => f.filename === kep.filename)
                    ? feliratok.find((f) => f.filename === kep.filename)
                        .magyarfelirat
                    : ""
                }
                key={index.toString() + "_kepcard"}
                kategoriak={kategoriak}
                kategoriaid={galeriaObj.kategoriaid}
                kep={kep}
                // felirat={kep.felirat}
                // magyarfelirat={kep.magyarfelirat}
                index={index}
                galeriaObj={galeriaObj}
                handleFeliratChange={handleFeliratChange}
                deleteImage={deleteImage}
              />
            );
          })}
      </div>
    );
  };

  const MyDropzone = () => {
    const newFeliratok = feliratok;
    const onDrop = useCallback((acceptedFiles) => {
      const kepek = acceptedFiles.map((file) => {
        newFeliratok.push({
          filename: file.name,
          felirat: "",
          magyarfelirat: "",
        });
        // Do whatever you want with the file contents
        let obj = {
          filename: file.name,
          felirat: "",
          magyarfelirat: "",
          src: URL.createObjectURL(file),
          file: file,
        };

        return obj;
      });
      setGaleriaObj({
        ...galeriaObj,
        kepek: [...galeriaObj.kepek, ...kepek],
      });
      setFeliratok(newFeliratok);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
      <React.Fragment>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
        </div>
        {<Kepek />}
      </React.Fragment>
    );
  };

  const galeriaForm = () => {
    return (
      <React.Fragment>
        <div className="col-md-6">
          <Label for="nev">Név: *</Label>
          <RVInput
            type="text"
            name="nev"
            onChange={(e) => handleInputChange(e, galeriaObj, setGaleriaObj)}
            value={galeriaObj.nev}
            required
          />
        </div>
        <div className="col-md-6">
          <Label for="kategoriaid">Kategória: *</Label>
          <br />
          <RVInput
            type="select"
            name="kategoriaid"
            onChange={handleKategoriaChange}
            value={galeriaObj.kategoriaid}
            disabled={currentId !== undefined}
            required
          >
            <option key="default" value="">
              {"Kérjük válasszon kategóriát..."}
            </option>
            {currentId === undefined
              ? kategoriakOptions.length > 0 &&
                kategoriakOptions.map((kat) => {
                  return (
                    <option key={kat.id} value={kat.id}>
                      {kat.magyarkategorianev}
                    </option>
                  );
                })
              : kategoriak.length > 0 &&
                kategoriak.map((kat) => {
                  return (
                    <option key={kat.id} value={kat.id}>
                      {kat.magyarkategorianev}
                    </option>
                  );
                })}
          </RVInput>
        </div>
      </React.Fragment>
    );
  };

  const renderGaleriaModal = () => {
    return (
      <Modal
        isOpen={galeriaModal}
        toggle={toggleGaleriaModal}
        backdrop="static"
        size="xl"
      >
        <RVForm
          onSubmit={(e) => onSubmit(e, currentId !== undefined)}
          noValidate={true}
          encType="multipart/form-data"
        >
          <ModalHeader>
            {currentId !== undefined
              ? "Galéria módosítása"
              : "Galéria felvitele"}
          </ModalHeader>
          <ModalBody>
            <div className="row" style={{ margin: "10px 0px" }}>
              {galeriaForm()}
            </div>
            <div className="row" style={{ margin: "10px 0px" }}>
              <div className="col-md-12">
                <MyDropzone />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="submit">
              Mentés
            </Button>
            <Button type="button" onClick={toggleGaleriaModal}>
              Mégsem
            </Button>
          </ModalFooter>
        </RVForm>
      </Modal>
    );
  };

  const renderGaleriaDeleteModal = () => {
    return (
      <Modal
        isOpen={galeriaDeleteModal}
        toggle={toggleGaleriaDeleteModal}
        backdrop="static"
        size="xl"
      >
        <ModalHeader>Figyelmeztetés</ModalHeader>
        <ModalBody>
          Valóban törölni kiívánja a galéria összes fotóját?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" type="button" onClick={deleteGaleria}>
            Igen
          </Button>
          <Button type="button" onClick={toggleGaleriaDeleteModal}>
            Mégsem
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }} hidden={kategoriak.length < 1}>
        <Button type="button" color="success" onClick={handleNewClick}>
          + Galéria hozzáadása
        </Button>
      </div>
      <div>
        {renderGaleriakTable()}
        {renderGaleriaModal()}
        {renderGaleriaDeleteModal()}
      </div>
    </div>
  );
};

Galeria.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default Galeria;

import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { DataTable } from "@inftechsol/react-data-table";
import moment from "moment";
import PropTypes from "prop-types";

import Services from "./Services.js";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import IdopontokForm from "./IdopontokForm.js";

const defaultIdopont = {
  szolgaltatasok: [],
  nap: null,
  kezdete: "",
  ugyfelnev: "",
  ugyfeltelefon: "",
  ugyfelemail: "",
};

const defaultNyelv = "ch";

const nyelvOptions = [
  { id: 1, label: "Magyar", value: "hu" },
  { id: 2, label: "Német", value: "ch" },
];

const lang = "hu";

const Idopontok = (props) => {
  const { addNotification } = props;

  const [idopontok, setIdopontok] = useState([]);
  const [szolgaltatasok, setSzolgaltatasok] = useState([]);
  const [szabadnapok, setSzabadnapok] = useState([]);
  const [szabadIdopontok, setSzabadIdopontok] = useState([]);
  const [message, setMessage] = useState(null);
  const [idopont, setIdopont] = useState(defaultIdopont);
  const [currentId, setCurrentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [lemondasOka, setLemondasOka] = useState(null);
  const [delNyelv, setDelNyelv] = useState("ch");
  const [selectedSzolgaltatas, setSelectedSzolgaltatas] = useState("");
  const [filteredSzolgaltatasok, setFilteredSzolgaltatasok] = useState([]);
  const [groups, setGroups] = useState([]);
  const [nyelv, setNyelv] = useState(defaultNyelv);

  const getSzolgaltatasok = () => {
    Services.getSzolgaltatasok((err, res) => {
      if (!err) {
        translteSzolgaltatasok(res);
      }
    });
  };

  const listIdopontok = () => {
    Services.listIdopontok((err, res) => {
      if (!err) {
        setIdopontok(res);
      }
    });
  };

  const getSzabadnapok = () => {
    Services.getSzabadnapok((err, res) => {
      if (!err) {
        setSzabadnapok(res);
      }
    });
  };

  const getSzabadIdopontok = (nap) => {
    const formattedNap = moment(nap).format("YYYY-MM-DD");
    if (nap && idopont.szolgaltatasok.length > 0) {
      const found = isSzabadnapos(nap);
      Services.getSzabadIdopontok(
        formattedNap,
        idopont.szolgaltatasok,
        lang,
        (err, res) => {
          if (!err) {
            if (res.length > 0 && !found) {
              setSzabadIdopontok(res);
              setMessage(null);
            } else {
              const msg =
                lang === "hu"
                  ? "Ezen a napon nem foglalható időpont!"
                  : "An diesem Tag sind keine Terminbuchungen möglich!";
              setMessage(msg);
            }
          }
        }
      );
    }
  };



  const isSzabadnapos = (value) => {
    let result = false;
    if (szabadnapok && szabadnapok.length > 0) {
      for (let i = 0; i < szabadnapok.length; i++) {
        const isKezdete =
          moment(value).format("YYYY-MM-DD") ===
          moment(szabadnapok[i].kezdete).format("YYYY-MM-DD");
        const isVege =
          moment(value).format("YYYY-MM-DD") ===
          moment(szabadnapok[i].vege).format("YYYY-MM-DD");
        const isBetween = moment(value).isBetween(
          szabadnapok[i].kezdete,
          szabadnapok[i].vege
        );

        if (isKezdete || isVege || isBetween) {
          result = true;
          break;
        }
      }
    }
    return result;
  };

  const init = () => {
    getSzolgaltatasok();
    listIdopontok();
    getSzabadnapok();
  };

  useEffect(() => {
    init();
    [].filter((f) => !f.value)
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const getOpts = (szolg, szolgIdx) => {
    return (
      <option key={szolgIdx + "_szolgId_ " + szolg.id} value={szolg.id}>
        {(lang === "hu" ? szolg.magyarszolgrovidnev : szolg.szolgrovidnev) +
          ` - ${szolg.idotartam} ${lang === "hu" ? "perc" : "Minuten"} - ${
            szolg.ar
          } ${szolg.penznem}`}
      </option>
    );
  };

  const deleteSzolgaltatas = (id) => {
    const filtered =
      idopont.szolgaltatasok.length > 0
        ? idopont.szolgaltatasok.filter((sz) => sz !== id)
        : null;
    setIdopont({
      ...idopont,
      szolgaltatasok: filtered ? filtered : szolgaltatasok,
    });
    const filteredSzolgok = szolgaltatasok.filter((sz) => {
      return filtered.some((f) => {
        return f !== sz.id;
      });
    });

    setFilteredSzolgaltatasok(
      filtered && filtered.length > 0 ? filteredSzolgok : szolgaltatasok
    );
  };

  const setActive = (id, e) => {
    if (id) {
      e.stopPropagation();
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const value = element.innerText ? element.innerText : null;
        const val = value.substring(0, element.id.length);
        if (val) {
          const kezdete = moment(idopont.nap).format("YYYY-MM-DD") + " " + val;
          setIdopont({
            ...idopont,
            kezdete: moment(kezdete).format("YYYY-MM-DD HH:mm"),
          });
          const elements = document.getElementsByClassName(
            "idopontfoglalo__ido"
          );

          Array.from(elements).forEach((el) => {
            const elId = el.id.replace(" ", "");

            if (elId == val) {
              el.classList.add("active");
            } else {
              el.classList.remove("active");
            }
          });
        }
      }
    } else {
      const elements = document.getElementsByClassName("idopontfoglalo__ido");

      Array.from(elements).forEach((el) => {
        el.classList.remove("active");
      });
      setIdopont({
        ...idopont,
        kezdete: null,
      });
    }
  };

  const translteSzolgaltatasok = (array) => {
    const szolgArr = [];
    const groups = [];
    if (array && array.length > 0) {
        
        array.forEach((szolg) => {
          const szolgObj = Object.assign({}, szolg);
          szolgArr.push(szolgObj);
          groups.push({
            nemetnev: szolgObj.szolgkategoria,
            magyarnev: szolgObj.magyarszolgkategoria,
          });
        });
    
        if (groups) {
            const grs = [
                ...new Map(groups.map((item) => [item.nemetnev, item])).values(),
              ];
          
              setGroups(grs);
        }
        
        // const kategorie = searchParams.get("kategorie");
        // if (kategorie) {
        //   const kat = grs.filter((k) => k.nemetnev === kategorie);
        //   setGroups(kat);
        // }
        
    }
    setSzolgaltatasok(szolgArr);
    setFilteredSzolgaltatasok(szolgArr);
  };

  // const getIdopont = (id) => {
  //     Services.getIdopont(id, (err, res) => {
  //         if (!err) {
  //             setIdopont(res)
  //         }
  //     })
  // }

  const handleNewClick = () => {
    setCurrentId(null);
    setDelNyelv(null);
    setNyelv(defaultNyelv);
    setLemondasOka(null);
    setIdopont(defaultIdopont);
    toggleModal();
  };

  // const handleEditClick = (id) => {
  //     setCurrentId(id);
  //     getIdopont(id);
  //     toggleModal();
  // };

  const onSave = () => {
    let submitObj = idopont;
    submitObj.nyelv = nyelv;
    if (!currentId) {
      Services.addIdopont(idopont, (err, res) => {
        if (!err) {
          setDelNyelv(null);
          setNyelv(defaultNyelv);
          setLemondasOka(null);
          toggleModal();
          listIdopontok();
          addNotification("success", res.msg);
        } else {
          if (err.err.ok === "OVERLAP") {
            addNotification("error", err.err.msg);
            getSzabadIdopontok(submitObj.nap);
            setActive(null);
          }
        }
      });
    } else {
      Services.editIdopont(idopont, currentId, (err, res) => {
        if (!err) {
          setDelNyelv(null);
          setNyelv(defaultNyelv);
          setLemondasOka(null);
          toggleModal();
          listIdopontok();
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
          {!currentId ? "Időpont hozzáadása" : "Időpont módosítása"}
        </ModalHeader>
        <ModalBody>
          <IdopontokForm
            idopont={idopont}
            lang={lang}
            nyelv={nyelv}
            setNyelv={setNyelv}
            nyelvOptions={nyelvOptions}
            setIdopont={setIdopont}
            getSzabadIdopontok={getSzabadIdopontok}
            selectedSzolgaltatas={selectedSzolgaltatas}
            filteredSzolgaltatasok={filteredSzolgaltatasok}
            setFilteredSzolgaltatasok={setFilteredSzolgaltatasok}
            setSelectedSzolgaltatas={setSelectedSzolgaltatas}
            setSzabadIdopontok={setSzabadIdopontok}
            szabadIdopontok={szabadIdopontok}
            groups={groups}
            getOpts={getOpts}
            szolgaltatasok={szolgaltatasok}
            deleteSzolgaltatas={deleteSzolgaltatas}
            message={message}
            setActive={setActive}
          />
        </ModalBody>
        <ModalFooter>
          <div>
            <Button
              disabled={
                idopont.szolgaltatasok.length === 0 ||
                !idopont.nap ||
                !idopont.kezdete ||
                !idopont.ugyfelnev ||
                !idopont.ugyfelemail ||
                !idopont.ugyfeltelefon
              }
              color="success"
              style={{
                marginRight: "10px",
              }}
              onClick={() => onSave()}
            >
              <span>
                <strong>
                  {lang === "hu" ? "Időpont foglalása" : "Termin buchen"}
                </strong>
              </span>
            </Button>
            <Button onClick={toggleModal}>Mégsem</Button>
          </div>
        </ModalFooter>
      </Modal>
    );
  };

  const handleDeleteClick = (cell, row) => {
    setCurrentId(row.id);
    setDelNyelv(row.nyelv);
    toggleDeleteModal();
  };

  const onDelete = () => {
    Services.deleteIdopont(currentId, lemondasOka, (err, res) => {
      if (!err) {
        setDelNyelv(null);
        setLemondasOka(null);
        listIdopontok();
        toggleDeleteModal();
        addNotification("success", res.msg);
      }
    });
  };

  const renderDeleteModal = () => {
    return (
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader>Időpont törlése</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              {"Valóban törölni kívánja az adott tételt?"}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Label>{`Lemondás (rövid) oka ${
                delNyelv ? (delNyelv === "hu" ? "magyar" : "német") : "német"
              }: *`}</Label>
              <RVInput
                required
                name="value"
                id="value"
                type="text"
                onChange={(e) => {
                  setLemondasOka(e.target.value);
                }}
                value={lemondasOka}
              />
            </div>
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
        {/*<Button
              key={row.id}
              color="link"
              onClick={() => handleEditClick(row.id)}
              hidden={row.value === "SZUPER_ADMIN"}
            >
              <i className="fas fa-pencil-alt" />
            </Button>*/}
        <Button
          key={row.id + 1}
          color="link"
          hidden={row.value === "SZUPER_ADMIN"}
          onClick={() => handleDeleteClick(cell, row)}
        >
          <i key={row.id + 5} className="fas fa-trash" />
        </Button>
      </React.Fragment>
    );
  };

  const idopontFormatter = (cell, row) => {
    let idop = "";
    if (row.kezdete && row.vege) {
      idop = `${moment(row.kezdete).format("YYYY-MM-DD HH:mm")} - ${moment(
        row.vege
      ).format("HH:mm")}`;
    }

    return idop;
  };

  const renderTable = () => {
    const columns = [
      {
        dataField: "ugyfelnev",
        text: "Ügyfél neve",
        filter: true,
        filterType: "textFilter",
        filterDefaultValue: "Keresés...",
      },
      {
        dataField: "ugyfelemail",
        text: "Ügyfél email",
        filterType: "textFilter",
        filterDefaultValue: "Kérem válasszon...",
      },
      {
        dataField: "ugyfeltelefon",
        text: "Ügyfél telefon",
      },
      {
        dataField: "kezdete",
        text: "Ügyfél időpontja",
        formatter: idopontFormatter,
      },
      {
        dataField: "id",
        text: "Műveletek",
        formatter: tableIconFormatter,
      },
    ];

    const paginationOptions = {
      count: 10,
      rowPerPageOptions: [
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
        datas={idopontok || []}
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
          + Időpont hozzáadása
        </Button>
        <br />
        <br />
        {renderModal()}
        {renderDeleteModal()}
        {idopontok.length > 0 && renderTable()}
      </div>
    </div>
  );
};

Idopontok.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default Idopontok;

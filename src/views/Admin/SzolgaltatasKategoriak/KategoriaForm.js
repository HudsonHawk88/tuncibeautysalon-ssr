import React, { useCallback } from "react";
import { Row, Col, Label } from "reactstrap";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

import { handleInputChange } from "../../../commons/InputHandlers.js";
import KepCard from "./KepCard.js";

const KategoriaForm = (props) => {
  const { deleteImage, kategoriaObj, setKategoriaObj } = props;

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
        {kategoriaObj &&
          kategoriaObj.kep &&
          kategoriaObj.kep.map((kep, index) => {
            return (
              <KepCard
                key={index.toString() + "_kepcard"}
                kep={kep}
                index={index}
                deleteImage={deleteImage}
              />
            );
          })}
      </div>
    );
  };

  const MyDropzone = () => {
    const onDrop = useCallback((acceptedFiles) => {
      const kepek = acceptedFiles.map((file) => {
        // Do whatever you want with the file contents
        let obj = {
          filename: file.name,
          src: URL.createObjectURL(file),
          file: file,
        };

        return obj;
      });
      if (kategoriaObj.kep) {
        setKategoriaObj({
          ...kategoriaObj,
          kep: [...kategoriaObj.kep, ...kepek],
        });
      } else {
        setKategoriaObj({
          ...kategoriaObj,
          kep: [...[], ...kepek],
        });
      }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
      <React.Fragment>
        <div
          hidden={kategoriaObj.kep && kategoriaObj.kep.length > 0}
          {...getRootProps({ className: "dropzone" })}
        >
          <input {...getInputProps()} />
          <p>Kattintson vagy húzza id a feltöltendő képet...</p>
        </div>
        {<Kepek />}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Német kategórianév: *"}</Label>
          <RVInput
            type="text"
            name="kategorianev"
            id="kategorianev"
            required
            onChange={(e) =>
              handleInputChange(e, kategoriaObj, setKategoriaObj)
            }
            value={kategoriaObj.kategorianev}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px 0px 0px" }}>
        <Col>
          <Label>{"Magyar kategórianév: *"}</Label>
          <RVInput
            type="text"
            name="magyarkategorianev"
            id="magyarkategorianev"
            required
            onChange={(e) =>
              handleInputChange(e, kategoriaObj, setKategoriaObj)
            }
            value={kategoriaObj.magyarkategorianev}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Német leírás: *"}</Label>
          <RVInput
            type="textarea"
            name="kategorialeiras"
            id="kategorialeiras"
            rows={10}
            required
            onChange={(e) =>
              handleInputChange(e, kategoriaObj, setKategoriaObj)
            }
            value={kategoriaObj.kategorialeiras}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Magyar leírás: *"}</Label>
          <RVInput
            type="textarea"
            name="magyarkategorialeiras"
            id="magyarkategorialeiras"
            rows={10}
            required
            onChange={(e) =>
              handleInputChange(e, kategoriaObj, setKategoriaObj)
            }
            value={kategoriaObj.magyarkategorialeiras}
          />
        </Col>
      </Row>
      <Row style={{ margin: "10px 0px" }}>
        <Col>
          <Label>{"Kategóriakép: *"}</Label>
          <MyDropzone />
        </Col>
      </Row>
    </React.Fragment>
  );
};

KategoriaForm.propTypes = {
  deleteImage: PropTypes.func.isRequired,
  kategoriaObj: PropTypes.object.isRequired,
  setKategoriaObj: PropTypes.func.isRequired,
};

export default KategoriaForm;

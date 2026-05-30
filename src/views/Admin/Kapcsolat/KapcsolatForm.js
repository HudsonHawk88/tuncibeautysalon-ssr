import React, { Fragment } from "react";
import { Col, Label, Row, Button } from "reactstrap";
import { RVInput } from "@inftechsol/reactstrap-form-validation";
import PropTypes from "prop-types";
import { handleInputChange } from "../../../commons/InputHandlers.js";

const KapcsolatForm = (props) => {
    const {
        orszagok,
        kapcsolat,
        setKapcsolat,
        currentId,
        helyseg,
        setHelyseg,
        nyitvatartas,
        setNyitvatartas,
    } = props;

    // Segédtömb a napok dinamikus megjelenítéséhez
    const napokKonfig = [
        { cimke: "Hétfő", kulcs: "monday", aktivKulcs: "isMonday" },
        { cimke: "Kedd", kulcs: "tuesday", aktivKulcs: "isTuesday" },
        { cimke: "Szerda", kulcs: "wednesday", aktivKulcs: "isWednesday" },
        { cimke: "Csütörtök", kulcs: "thursday", aktivKulcs: "isThursday" },
        { cimke: "Péntek", kulcs: "friday", aktivKulcs: "isFriday" },
        { cimke: "Szombat", kulcs: "saturday", aktivKulcs: "isSaturday" },
        { cimke: "Vasárnap", kulcs: "sunday", aktivKulcs: "isSunday" },
    ];

    // Új üres szünet hozzáadása az adott naphoz
    const handleSzunetHozzaadas = (napKulcs) => {
        const aktualisNapAdat = nyitvatartas[napKulcs] || { tol: "08:00", ig: "17:00" };
        const jelenlegiSzunetek = aktualisNapAdat.szunetek || [];

        setNyitvatartas({
            ...nyitvatartas,
            [napKulcs]: {
                ...aktualisNapAdat,
                szunetek: [...jelenlegiSzunetek, { tol: "12:00", ig: "12:30" }],
            },
        });
    };

    // Kiválasztott szünet törlése index alapján
    const handleSzunetTorles = (napKulcs, szunetIndex) => {
        const jelenlegiSzunetek = nyitvatartas[napKulcs]?.szunetek || [];
        const frissitettSzunetek = jelenlegiSzunetek.filter((_, idx) => idx !== szunetIndex);

        setNyitvatartas({
            ...nyitvatartas,
            [napKulcs]: {
                ...nyitvatartas[napKulcs],
                szunetek: frissitettSzunetek,
            },
        });
    };

    // Egy adott szünet időpontjának módosítása
    const handleSzunetIdoModositas = (napKulcs, szunetIndex, mezo, ertek) => {
        const jelenlegiSzunetek = [...(nyitvatartas[napKulcs]?.szunetek || [])];
        jelenlegiSzunetek[szunetIndex] = {
            ...jelenlegiSzunetek[szunetIndex],
            [mezo]: ertek,
        };

        setNyitvatartas({
            ...nyitvatartas,
            [napKulcs]: {
                ...nyitvatartas[napKulcs],
                szunetek: jelenlegiSzunetek,
            },
        });
    };
    return (
        <Fragment>
            {/* CÉG ÉS ÁLTALÁNOS ADATOK */}
            <Row style={{ margin: "10px 0px 0px 0px" }}>
                <Col>
                    <Label>Cégnév: *</Label>
                    <RVInput
                        type="text"
                        name="cegnev"
                        id="cegnev"
                        required
                        onChange={(e) => handleInputChange(e, kapcsolat, setKapcsolat)}
                        value={kapcsolat.cegnev}
                    />
                </Col>
            </Row>

            <Row style={{ margin: "10px 0px 0px 0px" }}>
                <Col>
                    <Label>Ország: *</Label>
                    <RVInput
                        type="select"
                        name="orszag"
                        id="orszag"
                        required
                        onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                        value={helyseg.orszag && helyseg.orszag.id}
                    >
                        {currentId === undefined && (
                            <option key="default">Kérjük válasszon országot!</option>
                        )}
                        {orszagok.map((orszag) => (
                            <option key={orszag.id} value={orszag.id}>
                                {orszag.orszagnev}
                            </option>
                        ))}
                    </RVInput>
                </Col>
                <Col>
                    <Label>Irányítószám: *</Label>
                    <RVInput
                        type="text"
                        name="irszam"
                        id="irszam"
                        pattern="[0-9]+"
                        required
                        onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                        value={helyseg.irszam}
                    />
                </Col>
            </Row>

            <Row style={{ margin: "10px 0px 0px 0px" }}>
                <Col>
                    <Label>Település: *</Label>
                    <RVInput
                        type="text"
                        name="telepules"
                        id="telepules"
                        required
                        onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                        value={helyseg.telepules}
                    />
                </Col>
                <Col>
                    <Label>Cím: *</Label>
                    <RVInput
                        type="text"
                        name="cim"
                        id="cim"
                        required
                        onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                        value={helyseg.cim}
                    />
                </Col>
            </Row>

            <Row style={{ margin: "10px 0px 0px 0px" }}>
                <Col>
                    <Label>Telefon: *</Label>
                    <RVInput
                        type="text"
                        name="telefon"
                        id="telefon"
                        required
                        onChange={(e) => handleInputChange(e, kapcsolat, setKapcsolat)}
                        value={kapcsolat.telefon}
                    />
                </Col>
                <Col>
                    <Label>E-mail: *</Label>
                    <RVInput
                        type="text"
                        name="email"
                        id="email"
                        required
                        onChange={(e) => handleInputChange(e, kapcsolat, setKapcsolat)}
                        value={kapcsolat.email}
                    />
                </Col>
                <Col>
                    <Label>Web: *</Label>
                    <RVInput
                        type="text"
                        name="web"
                        id="web"
                        required
                        onChange={(e) => handleInputChange(e, kapcsolat, setKapcsolat)}
                        value={kapcsolat.web}
                    />
                </Col>
            </Row>

            {/* NYITVATARTÁS ÉS SZÜNETEK SZEKCIÓ */}
            <h5 style={{ margin: "30px 0px 10px 0px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
                Nyitvatartás és Szünetek beállítása
            </h5>

            {napokKonfig.map((nap) => {
                const adatok = nyitvatartas[nap.kulcs] || { tol: "", ig: "", szunetek: [] };
                const szunetek = adatok.szunetek || [];

                return (
                    <div key={nap.kulcs} style={{ borderBottom: "1px dashed #eee", padding: "10px 0" }}>
                        <Row>
                            <Col xs="12">
                                <Label htmlFor={nap.aktivKulcs} style={{ fontWeight: "bold", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        name={nap.aktivKulcs}
                                        id={nap.aktivKulcs}
                                        checked={!!nyitvatartas[nap.aktivKulcs]}
                                        onChange={(e) =>
                                            setNyitvatartas({
                                                ...nyitvatartas,
                                                [e.target.name]: e.target.checked,
                                            })
                                        }
                                    />
                                    {" "}{nap.cimke}
                                </Label>
                            </Col>
                        </Row>

                        {nyitvatartas[nap.aktivKulcs] && (
                            <Fragment>
                                <Row style={{ marginBottom: "10px" }}>
                                    <Col md="4">
                                        <Label size="sm">Nyitás (-tól):</Label>
                                        <RVInput
                                            type="time"
                                            name={`${nap.kulcs}tol`}
                                            value={adatok.tol || ""}
                                            onChange={(e) =>
                                                setNyitvatartas({
                                                    ...nyitvatartas,
                                                    [nap.kulcs]: { ...adatok, tol: e.target.value },
                                                })
                                            }
                                        />
                                    </Col>
                                    <Col md="4">
                                        <Label size="sm">Zárás (-ig):</Label>
                                        <RVInput
                                            type="time"
                                            name={`${nap.kulcs}ig`}
                                            value={adatok.ig || ""}
                                            onChange={(e) =>
                                                setNyitvatartas({
                                                    ...nyitvatartas,
                                                    [nap.kulcs]: { ...adatok, ig: e.target.value },
                                                })
                                            }
                                        />
                                    </Col>
                                    <Col md="4" className="d-flex align-items-end">
                                        <Button
                                            color="primary"
                                            size="sm"
                                            onClick={() => handleSzunetHozzaadas(nap.kulcs)}
                                        >
                                            + Új szünet
                                        </Button>
                                    </Col>
                                </Row>

                                {szunetek.map((szunet, index) => (
                                    <Row
                                        key={index}
                                        style={{
                                            margin: "5px 0px 5px 20px",
                                            backgroundColor: "#f9f9f9",
                                            padding: "5px",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <Col md="4">
                                            <Label size="sm">Szünet kezdete:</Label>
                                            <RVInput
                                                type="time"
                                                value={szunet.tol || ""}
                                                onChange={(e) => handleSzunetIdoModositas(nap.kulcs, index, "tol", e.target.value)}
                                            />
                                        </Col>
                                        <Col md="4">
                                            <Label size="sm">Szünet vége:</Label>
                                            <RVInput
                                                type="time"
                                                value={szunet.ig || ""}
                                                onChange={(e) => handleSzunetIdoModositas(nap.kulcs, index, "ig", e.target.value)}
                                            />
                                        </Col>
                                        <Col md="4" className="d-flex align-items-end">
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleSzunetTorles(nap.kulcs, index)}
                                            >
                                                Törlés
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Fragment>
                        )}
                    </div>
                );
            })}
        </Fragment>
    );
};

KapcsolatForm.propTypes = {
    orszagok: PropTypes.array.isRequired,
    kapcsolat: PropTypes.object.isRequired,
    setKapcsolat: PropTypes.func.isRequired,
    currentId: PropTypes.any,
    helyseg: PropTypes.object.isRequired,
    setHelyseg: PropTypes.func.isRequired,
    nyitvatartas: PropTypes.object.isRequired,
    setNyitvatartas: PropTypes.func.isRequired,
};

export default KapcsolatForm;
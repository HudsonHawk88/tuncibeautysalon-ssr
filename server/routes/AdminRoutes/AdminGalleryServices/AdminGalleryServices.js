import {jwtparams, pool, validateToken, hasRole, getJSONfromLongtext, log} from '../../../common/QueryHelpers.js';
import express from 'express';
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import multer from 'multer';
import sharp from 'sharp';
const router = express.Router();
const galeria = pool;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ADMINGALLERY START

router.get('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const id = req.headers.id;
        const user = await validateToken(token, jwtparams.secret);

        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (id) {
                const sql = `SELECT * FROM galeria WHERE id='${id}';`;
                galeria.query(sql, (err, result) => {
                    if (!err) {
                       /*  if (result[0].email === user.email || (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN']))) { */
                            const resss = getJSONfromLongtext(result[0], 'toBool');
                            res.status(200).send(resss);
                        /* } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        } */
                    }
                });
            } else {
                const sql = `SELECT * FROM galeria;`;
                galeria.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a galéria lekérdezésekor!' });
                    } else {
                        let resss = ress.map((item) => {
                            return getJSONfromLongtext(item, 'toBool');
                        });
                        res.status(200).send(resss);
                    }
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/', upload.array('kepek'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    // TODO berakni a token vizsgálatot a true helyére és a user a validateToken-es lesz ha lesz Admin felület hozzá!!!
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        // const user = { roles: [{ value: "SZUPER_ADMIN"}] };
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                let felvitelObj = req.body;

                const sql = `CREATE TABLE IF NOT EXISTS galeria (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                nev text NOT NULL,
                kategoria json NOT NULL,
                kategoriaid INT NOT NULL,
                kepek json DEFAULT NULL
                ) ENGINE=InnoDB;`;
                galeria.query(sql, async (error) => {
                    if (!error) {
                        if (!existsSync(process.env.galeriadir)) {
                            mkdirSync(process.env.galeriadir);
                        }
                        let kepek = [];
                        if (req.files) {
                            req.files.forEach( async (kep) => {
                                let extIndex = kep.originalname.lastIndexOf('.');
                                let fname = kep.originalname.substring(0, extIndex);
                                const felvitelKepek = JSON.parse(felvitelObj.kepek);
                                let felirat = { felirat: '', magyarfelirat: '' };
                                const felvkep = felvitelKepek.find((fk) => fk.filename === kep.originalname) ? felvitelKepek.find((fk) => fk.filename === kep.originalname) : null;
                                if (felvkep) {
                                    felirat = { felirat: felvkep.felirat, magyarfelirat: felvkep.magyarfelirat }
                                }

                                kepek.push({
                                    src: `${process.env.galeriaUrl}/${felvitelObj.kategoriaid}/${fname}.jpg`,
                                    filename: `${fname}.jpg`,
                                    felirat: felirat.felirat,
                                    magyarfelirat: felirat.magyarfelirat
                                });

                                const buffer = Buffer.from(readFileSync( `${process.env.imagesDir}/watermark.png`).buffer);

                                sharp(buffer)
                                    .ensureAlpha(0.5) // 50% opacity
                                    .toBuffer()
                                    .then( watermark => {
                                        sharp(kep.buffer)
                                        .jpeg({ quality: 80 })
                                        .resize({ width: 1500, fit: 'inside' })
                                        .withMetadata()
                                        .composite([{ input: watermark, gravity: 'southeast' }])
                                        .toBuffer((err, buff) => {
                                            if (!err) {
                                                const dir = `${process.env.galeriadir}/${felvitelObj.kategoriaid}`;
                                                const isDirExist = existsSync(dir);
                                                if (!isDirExist) {
                                                    mkdirSync(dir);
                                                }
                                                writeFileSync(`${dir}/${fname}.jpg`, buff);
                                            } else {
                                                log('POST /api/admin/galeria', err);
                                                console.log(err);
                                            }
                                        });
                                    } )

                                
                            });
                        }
                        felvitelObj.kepek = kepek;

                        const sql = `INSERT INTO galeria (nev, kategoria, kategoriaid, kepek) VALUES ('${felvitelObj.nev}', '${felvitelObj.kategoria}', '${felvitelObj.kategoriaid}', '${JSON.stringify(felvitelObj.kepek)}');`;
                            galeria.query(sql, (err) => {
                                if (!err) {
                                    res.status(200).send({
                                        msg: 'Kép(ek) sikeresen hozzáadva!'
                                    });
                                } else {
                                    res.status(500).send({
                                        err: err
                                    });
                                }
                            });
                    } else {
                        res.status(500).send({
                            err: error,
                            msg: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!'
                        });
                    }
                });
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.put('/', upload.array('uj_kepek'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            let modositoObj = req.body;
            const id = req.headers.id;
            if (id) {
                let kepek = [];
                if (modositoObj.kepek) {
                    if (Array.isArray(JSON.parse(modositoObj.kepek))) {
                        const k = JSON.parse(modositoObj.kepek);
                        k.forEach((item) => {
                            if (!item.file) {
                                kepek.push(item);
                            }
                        });
                    } else {
                        kepek = JSON.parse(modositoObj.kepek) || [];
                    }
                }

                if (req.files) {
                    req.files.map((kep) => {
                        let extIndex = kep.originalname.lastIndexOf('.');
                        let fname = kep.originalname.substring(0, extIndex);
                        // if (kepek.find((k) => k.originalname === kep.originalname)) {
                            kepek.push({
                                filename: `${fname}.jpg`,
                                src: `${process.env.galeriaUrl}/${modositoObj.kategoriaid}/${fname}.jpg`,
                                felirat: kep.felirat,
                                magyarfelirat: kep.magyarfelirat
                            });
                        // }

                        const buffer = Buffer.from(readFileSync( `${process.env.imagesDir}/watermark.png`).buffer);

                                sharp(buffer)
                                    .ensureAlpha(0.5) // 50% opacity
                                    .toBuffer()
                                    .then( watermark => {
                                        sharp(kep.buffer)
                                        .jpeg({ quality: 80 })
                                        .resize({ width: 1500, fit: 'inside' })
                                        .withMetadata()
                                        .composite([{ input: watermark, gravity: 'southeast',  }])
                                        .toBuffer((err, buff) => {
                                            if (!err) {
                                                const dir = `${process.env.galeriadir}/${modositoObj.kategoriaid}`;
                                                const isDirExist = existsSync(dir);
                                                if (!isDirExist) {
                                                    mkdirSync(dir);
                                                }
                                                writeFileSync(`${dir}/${fname}.jpg`, buff);
                                            } else {
                                                log('PUT /api/admin/galeria', err);
                                                console.log(err);
                                            }
                                        });
                                    } )

                        // sharp(kep.buffer)
                        //     .jpeg({ quality: 80 })
                        //     .resize({ width: 1500, fit: 'inside' })
                        //     .withMetadata()
                        //     .toBuffer((err, buff) => {
                        //         if (!err) {
                        //             const dir = `${process.env.galeriadir}/${modositoObj.kategoriaid}`;
                        //             const isDirExist = existsSync(dir);
                        //             if (!isDirExist) {
                        //                 mkdirSync(dir);
                        //             }
                        //             writeFileSync(`${dir}/${fname}.jpg`, buff);
                        //         } else {
                        //             console.log(err);
                        //         }
                        //     });
                    });
                }

                modositoObj.kepek = kepek;

                const sql = `UPDATE galeria SET nev = '${modositoObj.nev}', kategoria = '${modositoObj.kategoria}', kategoriaid = '${modositoObj.kategoriaid}', kepek = '${JSON.stringify(modositoObj.kepek)}' WHERE id = '${id}';`;
                galeria.query(sql, (err) => {
                    if (!err) {
                        res.status(200).send({
                            msg: 'Galériakép(ek) sikeresen módosítva!'
                        });
                    } else {
                        res.status(500).send({
                            err: 'Galériakép(ek) módosítása sikertelen!',
                            msg: err
                        });
                    }
                });
            } else {
                res.status(400).send({
                    err: 'Id megadása kötelező'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.delete('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const { kategoriaid, id }  = req.headers;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    const sql = `DELETE FROM galeria WHERE id='${id}';`;
                    galeria.query(sql, (err) => {
                        if (!err) {
                            const dir = `${process.env.galeriadir}/${kategoriaid}/`;
                            rmSync(dir, { recursive: true, force: true });
                            res.status(200).send({
                                msg: 'Galéria sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Galéria törlése sikertelen!'
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Id megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/deleteimage', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        const { filename, kategoriaid } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {

                const image = `${process.env.galeriadir}/${kategoriaid}/${filename}`;
                rmSync(image, {
                    force: true
                });
                res.status(200).send({ err: null, msg: 'Kép sikeresen törölve!' });
            } else {
                res.status(401).send({ err: 'Nincs jogosultsága az adott művelethez!' });
            }
        }
    }
});

// ADMINGALLERY END

export default router;

import { jwtparams, pool, validateToken, hasRole, isTableExists, getJSONfromLongtext, UseQuery } from '../../../common/QueryHelpers.js';
import express from 'express';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import multer from 'multer';
import sharp from 'sharp';
const router = express.Router();
const szolgaltataskategoriak = pool;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// SZOLGALTATASKATEGORIAK START

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
                const sql = `SELECT * FROM szolgaltataskategoriak WHERE id='${id}';`;
                szolgaltataskategoriak.query(sql, (err, result) => {
                    if (!err) {
                        const newRes = getJSONfromLongtext(result[0]);
                        res.status(200).send(newRes);
                    } else {
                        res.status(500).send({
                            err: err,
                            msg: 'Valami hiba van az elérésben! Értesítse a rendszergazdát!'
                        });
                    }
                });
            } else {
                const vanTabla = isTableExists('szolgaltataskategoriak');
                const sql = `SELECT * FROM szolgaltataskategoriak;`;
                if (vanTabla) {
                    szolgaltataskategoriak.query(sql, (err, result) => {
                        if (!err) {
                            const newRes = [];
                            if (result && result.length > 0) {
                                result.forEach((r) => {
                                    let newR = getJSONfromLongtext(r);
                                    newRes.push(newR);
                                })
                            }
                            res.status(200).send(newRes);
                        } else {
                            res.status(500).send({
                                err: err,
                                msg: 'Valami hiba van az elérésben! Értesítse a rendszergazdát!'
                            });
                        }
                    });
                } else {
                    res.status(500).send({
                        err: 'Nem létezik még a tábla! Kérem vigyen fel tételt!',
                        msg: 'Nem létezik még a tábla! Kérem vigyen fel tételt!'
                    })
                }
                
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/', upload.array('kep'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!',
                msg: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                const felvitelObj = req.body;
                const sql = `CREATE TABLE IF NOT EXISTS tuncibeautysalon.szolgaltataskategoriak (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, kategorianev text NOT NULL, magyarkategorianev text NOT NULL, kategorialeiras text NOT NULL, magyarkategorialeiras text DEFAULT NULL, kep longtext DEFAULT NULL);`;
                szolgaltataskategoriak.query(sql, async (err) => {
                    if (!err) {
                        if (!existsSync(process.env.szolgkategoriadir)) {
                            mkdirSync(process.env.szolgkategoriadir);
                        }
                        let kepek = [];
                        const max = await UseQuery('SELECT MAX(id) as maxId FROM szolgaltataskategoriak;');
                        console.log('max[0].maxId: ', max[0].maxId);
                        console.log('typeof max[0].maxId: ', typeof max[0].maxId);
                        const newId = max[0].maxId + 1;
                        console.log('newId: ', newId)

                        if (req.files) {
                            req.files.forEach( async (kep) => {
                                let fname = newId;

                                kepek.push({
                                    src: `${process.env.szolgkategoriaUrl}/${fname}.jpg`,
                                    filename: `${fname}.jpg`
                                });

                                sharp(kep.buffer)
                                    .jpeg({ quality: 80 })
                                    .resize({ width: 1500, fit: 'inside' })
                                    .withMetadata()
                                    .toBuffer((err, buff) => {
                                        if (!err) {
                                            const dir = `${process.env.szolgkategoriadir}`;
                                            const isDirExist = existsSync(dir);
                                            if (!isDirExist) {
                                                mkdirSync(dir);
                                            }
                                            writeFileSync(`${dir}/${newId}.jpg`, buff);
                                        } else {
                                            // console.log(err);
                                        }
                                    });
                            });
                        }

                        felvitelObj.kep = kepek;
                        const sql = `INSERT INTO szolgaltataskategoriak (id, kategorianev, magyarkategorianev, kategorialeiras, magyarkategorialeiras, kep) VALUES ('${newId}', '${felvitelObj.kategorianev}', '${felvitelObj.magyarkategorianev}', '${felvitelObj.kategorialeiras}', '${felvitelObj.magyarkategorialeiras}', '${JSON.stringify(felvitelObj.kep)}');`;
                        szolgaltataskategoriak.query(sql, (error) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Szolgáltatás kategória sikeresen hozzáadva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: error,
                                    msg: 'Hiba történt a szolgáltatás kategória hozzáadásakor! Értesítse a weboldal rendszergazdáját!'
                                });
                            }
                        });
                    } else {
                        res.status(500).send({
                            err: err,
                            msg: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!'
                        });
                    }
                });
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!',
                    msg: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.put('/', upload.array('uj_kep'), async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!',
                msg: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            const id = req.headers.id;
            const modositoObj = req.body;
                if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    if (id) {
                        let kepek = [];
                        if (modositoObj.kep) {
                            if (Array.isArray(JSON.parse(modositoObj.kep))) {
                                const k = JSON.parse(modositoObj.kep);
                                k.forEach((item) => {
                                    if (!item.file) {
                                        kepek.push(item);
                                    }
                                });
                            } else {
                                kepek = JSON.parse(modositoObj.kep) || [];
                            }
                        }

                        if (req.files) {
                            req.files.map((kep) => {
                                let fname = id;
                                // if (kepek.find((k) => k.originalname === kep.originalname)) {
                                    kepek.push({
                                        filename: `${fname}.jpg`,
                                        src: `${process.env.szolgkategoriaUrl}/${fname}.jpg`,
                                    });
                                // }
        
        
                                sharp(kep.buffer)
                                    .jpeg({ quality: 80 })
                                    .resize({ width: 1500, fit: 'inside' })
                                    .withMetadata()
                                    .toBuffer((err, buff) => {
                                        if (!err) {
                                            const dir = `${process.env.szolgkategoriadir}`;
                                            const isDirExist = existsSync(dir);
                                            if (!isDirExist) {
                                                mkdirSync(dir);
                                            }
                                            writeFileSync(`${dir}/${fname}.jpg`, buff);
                                        } else {
                                            // console.log(err);
                                        }
                                    });
                            });
                        }
                        modositoObj.kep = kepek;
                        const sql = `UPDATE szolgaltataskategoriak SET kategorianev = '${modositoObj.kategorianev}', magyarkategorianev = '${modositoObj.magyarkategorianev}', kategorialeiras = '${modositoObj.kategorialeiras}', magyarkategorialeiras = '${modositoObj.magyarkategorialeiras}', kep='${JSON.stringify(modositoObj.kep)}' WHERE id = '${id}';`;
                        szolgaltataskategoriak.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Szolgáltatás kategória sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: err,
                                    msg: 'Szolgáltatás kategória módosítása sikertelen!'
                                });
                            }
                        });
                    } else {
                        res.status(400).send({
                            err: 'Id megadása kötelező',
                            msg: 'Id megadása kötelező'
                        });
                    }
                } else {
                    res.status(403).send({
                        err: 'Nincs jogosultsága az adott művelethez!',
                        msg: 'Nincs jogosultsága az adott művelethez!'
                    });
                }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!',
            msg: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.delete('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                const id = req.headers.id;
                if (id) {
                    const sql = `DELETE FROM szolgaltataskategoriak WHERE id='${id}';`;
                    szolgaltataskategoriak.query(sql, (err) => {
                        if (!err) {
                            const image = `${process.env.szolgkategoriadir}/${id}.jpg`;
                            rmSync(image, {
                                force: true
                            });
                            res.status(200).send({
                                msg: 'Szolgáltatás kategória sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: err,
                                msg: 'Szolgáltatás kategória törlése sikertelen!'
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Id megadása kötelező',
                        msg: 'Id megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!',
                    msg: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!',
            msg: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/deleteimage', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        const { filename } = req.body;

        if (user === null) {
            res.status(401).send({ err: 'Nincs belépve! Kérem jelentkezzen be!' });
        } else {
            if (user.roles && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN', 'INGATLAN_ADMIN'])) {

                const image = `${process.env.szolgkategoriadir}/${filename}`;
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

// SZOLGALTATASKATEGORIAK END

export default router;

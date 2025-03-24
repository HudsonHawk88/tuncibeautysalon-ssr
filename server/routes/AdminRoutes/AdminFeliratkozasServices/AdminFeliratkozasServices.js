import { jwtparams, UseQuery, pool, validateToken, hasRole, getJSONfromLongtext } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();

// FELIRATKOZAS START

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
                const sql = `SELECT * FROM feliratkozok WHERE id='${id}';`;
                pool.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            let resss = getJSONfromLongtext(result[0], 'toBool');
                            res.status(200).send(resss);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT * FROM feliratkozok;`;
                pool.query(sql, (error, ress) => {
                    console.log(error)
                    if (error) {
                        res.status(200).send([]);
                    } else {
                        let result = ress;
                        result = ress.map((item) => {
                            let newItem = item;
                            newItem = getJSONfromLongtext(item, 'toBool')
                            return newItem
                        });
                        res.status(200).send(result);
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

router.post('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    // TODO berakni a token vizsgálatot a true helyére és a user a validateToken-es lesz ha lesz Admin felület hozzá!!!
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                let felvitelObj = req.body;
                if (felvitelObj) {
                    felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
                    //store user, password and role
                        const sql = `CREATE TABLE IF NOT EXISTS tuncibeautysalon.feliratkozok (
                            id varchar(32) DEFAULT (uuid()) NOT NULL PRIMARY KEY,
                            feliratkozoNyelv varchar(2) DEFAULT 'ch',
                            feliratkozoNev text DEFAULT NULL,
                            feliratkozoEmail text DEFAULT NULL,
                            feliratkozasMod text DEFAULT NULL,
                            feliratkozasIdo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ) ENGINE=InnoDB;`;
                    pool.query(sql, async (error) => {
                        if (!error) {
                            const hirlevelSql = `SELECT feliratkozoEmail FROM feliratkozok WHERE feliratkozoEmail = '${felvitelObj.feliratkozoEmail}';`;
                            const result = await UseQuery(hirlevelSql);
                            // if (resultEmail.rowCount === 0) {
                            if (result.length === 0) {
                                const sql = `INSERT INTO feliratkozok (feliratkozoNyelv, feliratkozoNev, feliratkozoEmail, feliratkozasMod)
                          VALUES ('${felvitelObj.feliratkozoNyelv}', '${felvitelObj.feliratkozoNev}', '${felvitelObj.feliratkozoEmail}', '${felvitelObj.feliratkozasMod}');`;
                                pool.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Feliratkozás sikeresen megtörtént!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ez a feliratkozó már létezik!'
                                });
                            }
                        } else {
                            res.status(500).send({
                                err: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!',
                                msg: err
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Feliratkozás adatainak megadása kötelező!'
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

router.put('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        // const user = validateToken(token, jwtparams.secret);
        const user = { roles: [{ value: 'SZUPER_ADMIN' }] };
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            const id = req.headers.id;
            let modositoObj = req.body;
            if (modositoObj) {
                // TODO Email címet most csak szuperadmin tud módoítani!!!!
                // if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
                if (user.roles && user.roles.length !== 0 && hasRole(user.roles, ['SZUPER_ADMIN'])) {
                    if (id) {
                        modositoObj = JSON.parse(JSON.stringify(modositoObj));
                        const sql = `UPDATE feliratkozok SET feliratkozoNev='${modositoObj.feliratkozoNev}', feliratkozoEmail='${modositoObj.feliratkozoEmail}', feliratkozoNyelv='${modositoObj.feliratkozoNyelv}' WHERE id = '${id}';`;
                        pool.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Feliratkozó sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'Feliratkozó módosítása sikertelen!'
                                });
                            }
                        });
                    } else {
                        res.status(400).send({
                            err: 'Id megadása kötelező'
                        });
                    }
                } else {
                    res.status(400).send({
                        err: 'Feliratkozó adatainak megadása kötelező'
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

router.delete('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const id = req.headers.id;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    const sql = `DELETE FROM feliratkozok WHERE id='${id}';`;
                    pool.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'Feliratkozó sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Feliratkozó törlése sikertelen!'
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

// FELIRATKOZAS END

export default router;

/* export default router; */

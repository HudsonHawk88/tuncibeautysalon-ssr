import { jwtparams, pool, validateToken, hasRole } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const szabadnapok = pool;

// SZABADNAPOK START

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
                const sql = `SELECT * FROM szabadnapok WHERE id='${id}';`;
                szabadnapok.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            res.status(200).send(result[0]);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT * FROM szabadnapok;`;
                szabadnapok.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a felhasználók lekérdezésekor!' });
                    } else {
                        res.status(200).send(ress);
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
                    const sql = `CREATE TABLE IF NOT EXISTS szabadnapok (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    megnevezes text DEFAULT NULL,
                    honap int NOT NULL,
                    nap int NOT NULL
                  ) ENGINE=InnoDB;`;
                    szabadnapok.query(sql, async (error) => {
                        if (!error) {
                            const sql = `INSERT INTO szabadnapok (megnevezes, honap, nap)
                            VALUES ('${felvitelObj.megnevezes}', '${felvitelObj.honap}', '${felvitelObj.nap}');`;
                                szabadnapok.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Szabadnap sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                        } else {
                            res.status(500).send({
                                err: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!',
                                msg: err
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Szabadnap adatainak megadása kötelező!'
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
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            const id = req.headers.id;
            let modositoObj = req.body;
            if (modositoObj) {
                if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    if (id) {
                        modositoObj = JSON.parse(JSON.stringify(modositoObj));
                        const sql = `UPDATE szabadnapok SET megnevezes = '${modositoObj.megnevezes}', honap = '${modositoObj.honap}', nap = '${modositoObj.nap}' WHERE id = '${id}';`;
                        szabadnapok.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Szabadnap sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'Szabadnap módosítása sikertelen!'
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
                        err: 'Szabadnap adatainak megadása kötelező'
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
                    const sql = `DELETE FROM szabadnapok WHERE id='${id}';`;
                    szabadnapok.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'Szabadnap sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Szabadnap törlése sikertelen!'
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

// SZABADNAPOK END

export default router;

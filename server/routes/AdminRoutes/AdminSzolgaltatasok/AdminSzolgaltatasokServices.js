import { jwtparams, pool, validateToken, hasRole, isTableExists, getNumberFromBoolean, getBooleanFromNumber, UseQuery } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const szolgaltatasok = pool;

// SZOLGALTATASOK START

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
                const sql = `SELECT * FROM szolgaltatasok WHERE id='${id}';`;
                szolgaltatasok.query(sql, (err, result) => {
                    if (!err) {
                        let newRes = result[0];
                        newRes.isAktiv = getBooleanFromNumber(newRes.isAktiv);
                        res.status(200).send(newRes);
                    } else {
                        res.status(500).send({
                            err: err,
                            msg: 'Valami hiba van az elérésben! Értesítse a rendszergazdát!'
                        });
                    }
                });
            } else {
                const vanTabla = isTableExists('szolgaltatasok');
                const sql = `SELECT * FROM szolgaltatasok;`;
                if (vanTabla) {
                    szolgaltatasok.query(sql, (err, result) => {
                        if (!err) {
                            const newRes = [];
                            if (result.length > 0) {
                                result.forEach((r) => {
                                    let newR = r;
                                    newR.isAktiv = getBooleanFromNumber(r.isAktiv);
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

router.post('/', async (req, res) => {
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
                let felvitelObj = req.body;
                felvitelObj.isAktiv = getNumberFromBoolean(felvitelObj.isAktiv);
                const sql = `CREATE TABLE IF NOT EXISTS szolgaltatasok (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, szolgkategoria text NOT NULL, magyarszolgkategoria text NOT NULL, szolgrovidnev text NOT NULL, magyarszolgrovidnev text NOT NULL, szolgreszletek text DEFAULT NULL, magyarszolgreszletek text DEFAULT NULL, ar text NOT NULL, magyarar text NOT NULL, penznem VARCHAR(10) NOT NULL DEFAULT 'CHF', magyarpenznem VARCHAR(10) NOT NULL DEFAULT 'HUF', idotartam INT NOT NULL, isAktiv BOOLEAN);`;
                szolgaltatasok.query(sql, async (err) => {
                    if (!err) {
                        const maxSorrend = await UseQuery(`SELECT (MAX(sorrend) + 1) as next from szolgaltatasok WHERE szolgkategoria = '${felvitelObj.szolgkategoria}';`);
                        const sorrend = parseInt(maxSorrend[0].next, 10);
                        const sql = `INSERT INTO szolgaltatasok (szolgkategoria, magyarszolgkategoria, szolgrovidnev, magyarszolgrovidnev, szolgreszletek, magyarszolgreszletek, ar, magyarar, penznem, magyarpenznem, idotartam, isAktiv, sorrend) VALUES ((SELECT kategorianev from szolgaltataskategoriak WHERE id = '${felvitelObj.szolgkategoria}'), (SELECT magyarkategorianev from szolgaltataskategoriak WHERE id = '${felvitelObj.szolgkategoria}'), '${felvitelObj.szolgrovidnev}', '${felvitelObj.magyarszolgrovidnev}', '${felvitelObj.szolgreszletek}', '${felvitelObj.magyarszolgreszletek}', '${felvitelObj.ar}', '${felvitelObj.magyarar}', '${felvitelObj.penznem}', '${felvitelObj.magyarpenznem}', '${felvitelObj.idotartam}', '${felvitelObj.isAktiv}', '${sorrend}');`;
                        szolgaltatasok.query(sql, (error) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Szolgáltatás sikeresen hozzáadva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: error,
                                    msg: 'Hiba történt a szolgáltatás hozzáadásakor! Értesítse a weboldal rendszergazdáját!'
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

router.put('/', async (req, res) => {
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
            let modositoObj = req.body;
            modositoObj.isAktiv = getNumberFromBoolean(modositoObj.isAktiv);
                if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    if (id) {
                        const sql = `UPDATE szolgaltatasok SET szolgkategoria = (SELECT kategorianev from szolgaltataskategoriak WHERE id = '${modositoObj.szolgkategoria}'), magyarszolgkategoria = (SELECT magyarkategorianev from szolgaltataskategoriak WHERE id = '${modositoObj.szolgkategoria}'), szolgrovidnev = '${modositoObj.szolgrovidnev}', magyarszolgrovidnev = '${modositoObj.magyarszolgrovidnev}', szolgreszletek = '${modositoObj.szolgreszletek}', magyarszolgreszletek = '${modositoObj.magyarszolgreszletek}', ar = '${modositoObj.ar}', magyarar = '${modositoObj.magyarar}', penznem = '${modositoObj.penznem}', magyarpenznem = '${modositoObj.magyarpenznem}', idotartam = '${modositoObj.idotartam}', isAktiv = '${modositoObj.isAktiv}' WHERE id = '${id}';`;
                        szolgaltatasok.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Szolgáltatás sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: err,
                                    msg: 'Szolgáltatás módosítása sikertelen!'
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

router.put('/tomeges', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!',
                msg: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            let modositoArray = req.body;
                if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                        if (modositoArray && modositoArray.length > 0) {
                            // let sql = `BEGIN;\n`;
                            let sql = ``;
                            modositoArray.forEach((mo) => {
                                sql =  sql.concat(`UPDATE szolgaltatasok SET sorrend = ${mo.sorrend} WHERE id = ${mo.id};`);
                            })
                            // sql = sql.concat(`\nCOMMIT;`);
                            console.log('SQL: ', sql);
                            szolgaltatasok.query(sql, (err) => {
                                if (!err) {
                                    res.status(200).send({
                                        msg: 'Szolgáltatások sikeresen módosítva!'
                                    });
                                } else {
                                    res.status(500).send({
                                        err: err,
                                        msg: 'Szolgáltatások módosítása sikertelen!'
                                    });
                                }
                            });
                        } else {
                            res.status(500).send({
                                err: err,
                                msg: 'Nincsenek szolgáltatások kijelölve!'
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
                    const sql = `DELETE FROM szolgaltatasok WHERE id='${id}';`;
                    szolgaltatasok.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'Szolgáltatás sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: err,
                                msg: 'Szolgáltatás törlése sikertelen!'
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

// SZOLGALTATASOK END

export default router;

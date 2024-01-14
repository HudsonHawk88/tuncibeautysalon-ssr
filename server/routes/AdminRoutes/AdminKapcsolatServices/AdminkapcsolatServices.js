import { jwtparams, pool, validateToken, hasRole, isTableExists, getJSONfromLongtext } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const kapcsolatok = pool;

// KAPCSOLAT START

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
                const sql = `SELECT * FROM kapcsolatok WHERE id='${id}';`;
                kapcsolatok.query(sql, (err, result) => {
                    if (!err) {
                        const eredmeny = getJSONfromLongtext(result[0])
                        res.status(200).send(eredmeny);
                    } else {
                        res.status(500).send({
                            err: err,
                            msg: 'Valami hiba van az elérésben! Értesítse a rendszergazdát!'
                        });
                    }
                });
            } else {
                const vanTabla = isTableExists('kapcsolatok');
                const sql = `SELECT * FROM kapcsolatok;`;
                if (vanTabla) {
                    kapcsolatok.query(sql, (err, result) => {
                        if (!err) {
                            const newResult = [];
                            result.forEach((r) => {
                                const newR = getJSONfromLongtext(r);
                                newResult.push(newR);
                            })
                            res.status(200).send(newResult);
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
                const felvitelObj = req.body;
                const sql = `CREATE TABLE IF NOT EXISTS tuncibeautysalon.kapcsolatok (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, cegnev text NOT NULL, helyseg json NOT NULL, telefon text NOT NULL, email text NOT NULL, web text NOT NULL, nyitvatartas json NOT NULL);`;
                kapcsolatok.query(sql, async (err) => {
                    if (!err) {
                        const sql = `INSERT INTO kapcsolatok (cegnev, helyseg, telefon, email, web, nyitvatartas) VALUES ('${felvitelObj.cegnev}', '${JSON.stringify(felvitelObj.helyseg)}', '${felvitelObj.telefon}', '${felvitelObj.email}', '${felvitelObj.web}', '${JSON.stringify(felvitelObj.nyitvatartas)}');`;
                        console.log('SQL: ', sql);
                        kapcsolatok.query(sql, (error) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Kapcsolat sikeresen hozzáadva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: error,
                                    msg: 'Hiba történt a kapcsolat hozzáadásakor! Értesítse a weboldal rendszergazdáját!'
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
            const modositoObj = req.body;
                if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    if (id) {
                        const sql = `UPDATE kapcsolatok SET cegnev = '${modositoObj.cegnev}', helyseg = '${JSON.stringify(modositoObj.helyseg)}', telefon = '${modositoObj.telefon}', email = '${modositoObj.email}', web = '${modositoObj.web}', nyitvatartas = '${JSON.stringify(modositoObj.nyitvatartas)}' WHERE id = '${id}';`;
                        kapcsolatok.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Kapcsolat sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: err,
                                    msg: 'Kapcsolat módosítása sikertelen!'
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
                    const sql = `DELETE FROM kapcsolatok WHERE id='${id}';`;
                    kapcsolatok.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'Kapcsolat sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: err,
                                msg: 'Kapcsolat törlése sikertelen!'
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

// KAPCSOLATOK END

export default router;

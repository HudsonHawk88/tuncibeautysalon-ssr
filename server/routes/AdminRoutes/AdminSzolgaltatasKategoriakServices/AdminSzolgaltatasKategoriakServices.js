import { jwtparams, pool, validateToken, hasRole, isTableExists } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const szolgaltataskategoriak = pool;

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
                        res.status(200).send(result[0]);
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
                            res.status(200).send(result);
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
                const sql = `CREATE TABLE IF NOT EXISTS tuncibeautysalon.szolgaltataskategoriak (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, kategorianev text NOT NULL, magyarkategorianev text NOT NULL, kategorialeiras text NOT NULL, magyarkategorialeiras text DEFAULT NULL);`;
                szolgaltataskategoriak.query(sql, async (err) => {
                    if (!err) {
                        const sql = `INSERT INTO szolgaltataskategoriak (kategorianev, magyarkategorianev, kategorialeiras, magyarkategorialeiras) VALUES ('${felvitelObj.kategorianev}', '${felvitelObj.magyarkategorianev}', '${felvitelObj.kategorialeiras}', '${felvitelObj.magyarkategorialeiras}');`;
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
                        const sql = `UPDATE szolgaltataskategoriak SET kategorianev = '${modositoObj.kategorianev}', magyarkategorianev = '${modositoObj.magyarkategorianev}', kategorialeiras = '${modositoObj.kategorialeiras}', magyarkategorialeiras = '${modositoObj.magyarkategorialeiras}' WHERE id = '${id}';`;
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

// SZOLGALTATASKATEGORIAK END

export default router;

import { UseQuery, isTableExists, pool } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();

// FELIRATKOZAS START

// router.get('/', async (req, res) => {
//     const token = req.cookies.JWT_TOKEN;
//     if (token) {
//         const id = req.headers.id;
//         const user = await validateToken(token, jwtparams.secret);
//         if (user === null) {
//             res.status(401).send({
//                 err: 'Nincs belépve! Kérem jelentkezzen be!'
//             });
//         } else {
//             if (id) {
//                 const sql = `SELECT * FROM faliratkozok WHERE id='${id}';`;
//                 pool.query(sql, (err, result) => {
//                     if (!err) {
//                         if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
//                             let resss = getJSONfromLongtext(result[0], 'toBool');
//                             res.status(200).send(resss);
//                         } else {
//                             res.status(403).send({
//                                 err: 'Nincs jogosultsága az adott művelethez!'
//                             });
//                         }
//                     }
//                 });
//             } else {
//                 const sql = `SELECT * FROM faliratkozok;`;
//                 pool.query(sql, (error, ress) => {
//                     if (error) {
//                         res.status(500).send({ err: 'Hiba történt a hírlevelek lekérdezésekor!' });
//                     } else {
//                         let result = ress;
//                         result = ress.map((item) => {
//                             let newItem = item;
//                             newItem = getJSONfromLongtext(item, 'toBool')
//                             return newItem
//                         });
//                         res.status(200).send(result);
//                     }
//                 });
//             }
//         }
//     } else {
//         res.status(401).send({
//             err: 'Nincs belépve! Kérem jelentkezzen be!'
//         });
//     }
// });

router.post('/', async (req, res) => {
    let felvitelObj = req.body;
    let belsoleg = req.headers.belsoleg;
    console.log(req.body)
    if (felvitelObj) {
        //  
        //store user, password and role
        const sql = `CREATE TABLE IF NOT EXISTS tuncibeautysalon.feliratkozok (
        id varchar(32) DEFAULT (uuid()) NOT NULL PRIMARY KEY,
        feliratkozonyelv varchar(2) DEFAULT 'ch',
        feliratkozonev text DEFAULT NULL,
        feliratkozoemail text DEFAULT NULL,
        feliratkozasmod text DEFAULT NULL,
        feliratkozasido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;`;
        pool.query(sql, async (error) => {
            if (!error) {
                const feliratkozoSql = `SELECT feliratkozoemail FROM faliratkozok WHERE feliratkozoemail = '${felvitelObj.feliratkozoEmail}';`;
                const result = await isTableExists('faliratkozok') ? await UseQuery(feliratkozoSql) : [];
                // if (resultEmail.rowCount === 0) {
                if (result.length === 0) {
                    const sql = `INSERT INTO feliratkozok (feliratkozonyelv, feliratkozonev, feliratkozoemail, feliratkozasmod)
                VALUES ('${felvitelObj.feliratkozoNyelv}', '${felvitelObj.feliratkozoNev}', '${felvitelObj.feliratkozoEmail}', '${felvitelObj.feliratkozasMod}');`;
                    pool.query(sql, (err) => {
                        if (!err) {
                            if (belsoleg && belsoleg === 'true') {
                                return { err: null }
                            } else {
                                res.status(200).send({
                                    msg: 'Feliratkozás sikeresen megtörtént!'
                                });
                            }
                        } else {
                            if (belsoleg && belsoleg === 'true') {
                                return { err: err }
                            } else {
                                res.status(500).send({
                                    err: err
                                });
                            }   
                        }
                    });
                } else {
                    if (belsoleg && belsoleg === 'true') {
                        return { err: 'Ez a feliratkozó már létezik!' }
                    } else {
                        res.status(400).send({
                            err: 'Ez a feliratkozó már létezik!'
                        });
                    }  
                }
            } else {
                if (belsoleg && belsoleg === 'true') {
                    return { err: error }
                } else {
                    res.status(500).send({
                        err: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!',
                        msg: error
                    });
                }
            }
        });
    } else {
        if (belsoleg && belsoleg === 'true') {
            return { err: 'Feliratkozás adatainak megadása kötelező!' }
        } else {
            res.status(400).send({
                err: 'Feliratkozás adatainak megadása kötelező!'
            });
        }
    }
});

// router.put('/', async (req, res) => {
//     const id = req.headers.id;
//     let modositoObj = req.body;
//     if (modositoObj) {
//         // TODO Email címet most csak szuperadmin tud módoítani!!!!
//         // if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
//         if (user.roles && user.roles.length !== 0 && hasRole(user.roles, ['SZUPER_ADMIN'])) {
//             if (id) {
//                 modositoObj = JSON.parse(JSON.stringify(modositoObj));
//                 const sql = `UPDATE feliratkozok SET feliratkozonev='${modositoObj.feliratkozoNev}', feliratkozoemail='${modositoObj.feliratkozoEmail}' WHERE id = '${id}';`;
//                 pool.query(sql, (err) => {
//                     if (!err) {
//                         res.status(200).send({
//                             msg: 'Feliratkozó sikeresen módosítva!'
//                         });
//                     } else {
//                         res.status(500).send({
//                             err: 'Feliratkozó módosítása sikertelen!'
//                         });
//                     }
//                 });
//             } else {
//                 res.status(400).send({
//                     err: 'Id megadása kötelező'
//                 });
//             }
//         } else {
//             res.status(400).send({
//                 err: 'Feliratkozó adatainak megadása kötelező'
//             });
//         }
//     } else {
//         res.status(403).send({
//             err: 'Nincs jogosultsága az adott művelethez!'
//         });
//     }
// });

router.get('/', async (req, res) => {
    // PÉLDA LINK: https://tuncibeautysalon.ch/abbestellen?id=1234-dfgh-sadasd&lang=ch
    const id = req.query.id;
    const lang = req.query.lang;
    if (id) {
        const sql = `DELETE FROM faliratkozok WHERE id='${id}';`;
        pool.query(sql, (err) => {
            if (!err) {
                res.status(200).send({
                    msg: lang === 'hu' ? 'Feliratkozás sikeresen törölve!' : 'Abonnement erfolgreich gelöscht!'
                });
            } else {
                res.status(500).send({
                    err: lang === 'hu' ? 'Feliratkozás törlése sikertelen!' : 'Abmeldung fehlgeschlagen!'
                });
            }
        });
    } else {
        res.status(400).send({
            err: lang === 'hu' ? 'Id megadása kötelező!' : 'Die Zeiteingabe ist zwingend erforderlich!'
        });
    }
});

// FELIRATKOZAS END

export default router;

/* export default router; */

import { pool as pool, getJSONfromLongtext } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();

// OPTIONS START

router.get('/ingatlanoptions', (req, res, next) => {
    const sql = `SELECT * FROM ingatlan_options;`;
    pool.query(sql, (error, result) => {
        if (!error) {
            let ress = result.map((item) => {
                return getJSONfromLongtext(item, 'toBool');
            });
            /*  ress.options = JSON.parse(res.options); */
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: error, msg: 'Hiba történt a lekérdezéskor, kérjük frissítse az oldalt! Ha ez után sem jó, kérjük értesítse a webmestert!' });
        }
    });
});

router.get('/altipusoptions', (req, res, next) => {
    const sql = `SELECT * FROM ingatlan_subtypes;`;
    pool.query(sql, (error, result) => {
        if (!error) {
            let ress = result.map((item) => {
                return getJSONfromLongtext(item, 'toBool');
            });
            /*  ress.options = JSON.parse(res.options); */
            res.status(200).send(ress);
        } else {
            res.status(500).send({ err: error, msg: 'Hiba történt a lekérdezéskor, kérjük frissítse az oldalt! Ha ez után sem jó, kérjük értesítse a webmestert!' });
        }
    });
});

// OPTIONS END

export default router;

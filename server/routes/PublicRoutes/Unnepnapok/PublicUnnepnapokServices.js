import express from 'express';
const router = express.Router();
import { pool } from '../../../common/QueryHelpers.js';
const unnepnapok = pool;

// UNNEPNAPOK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM unnepnapok WHERE id='${id}';`;
        unnepnapok.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT honap, nap FROM unnepnapok;`;
        unnepnapok.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    }
});

// UNNEPNAPOK END

export default router;
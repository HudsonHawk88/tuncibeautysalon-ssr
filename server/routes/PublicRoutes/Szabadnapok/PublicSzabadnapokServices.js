import express from 'express';
const router = express.Router();
import { pool } from '../../../common/QueryHelpers.js';
const szabadnapok = pool;

// SZABADNAPOK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM szabadnapok WHERE id='${id}';`;
        szabadnapok.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT kezdete, vege FROM szabadnapok;`;
        szabadnapok.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    }
});

// SZABADNAPOK END

export default router;
import express from 'express';
const router = express.Router();
import { pool } from '../../../common/QueryHelpers.js';
const szolgaltatasok = pool;

// SZOLGALTATASOK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM szolgaltatasok WHERE id='${id}' GROUP BY szolgkategoria;`;
        szolgaltatasok.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT * FROM szolgaltatasok;`;
        szolgaltatasok.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    }
});

// SZOLGALTATASOK END

export default router;
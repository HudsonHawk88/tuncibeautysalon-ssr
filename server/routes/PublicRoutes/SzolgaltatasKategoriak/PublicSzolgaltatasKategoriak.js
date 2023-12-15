import express from 'express';
const router = express.Router();
import { pool } from '../../../common/QueryHelpers.js';
const szolgaltataskategoriak = pool;

// SZOLGALTATASKATEGORIAK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM szolgaltataskategoriak WHERE id='${id}';`;
        szolgaltataskategoriak.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT * FROM szolgaltataskategoriak;`;
        szolgaltataskategoriak.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    }
});

// SZOLGALTATASKATEGORIAK END

export default router;
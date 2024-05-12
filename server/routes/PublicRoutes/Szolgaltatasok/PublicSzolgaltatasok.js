import express from 'express';
const router = express.Router();
import { getBooleanFromNumber, pool } from '../../../common/QueryHelpers.js';
const szolgaltatasok = pool;

// SZOLGALTATASOK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM szolgaltatasok WHERE id='${id}' and isAktiv = 1 GROUP BY szolgkategoria;`;
        szolgaltatasok.query(sql, (err, result) => {
            if (!err) {
                let newRes = result;
                newRes.isAktiv = getBooleanFromNumber(newRes.isAktiv);
                res.status(200).send(result);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT * FROM szolgaltatasok WHERE isAktiv = 1;`;
        szolgaltatasok.query(sql, (err, result) => {
            if (!err) {
                const newResults = [];
                if (result.length > 0) {
                    result.forEach((r) => {
                        let newR = r;
                        newR.isAktiv = getBooleanFromNumber(r.isAktiv);
                        newResults.push(newR);
                    })
                }
                res.status(200).send(newResults);
            } else {
                res.status(500).send({ err: err });
            }
        });
    }
});

// SZOLGALTATASOK END

export default router;
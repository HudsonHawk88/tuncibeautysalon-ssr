import express from 'express';
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const router = express.Router();
const szolgaltataskategoriak = pool;

// SZOLGALTATASKATEGORIAK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM szolgaltataskategoriak WHERE isAktiv = 1 AND id='${id}';`;
        szolgaltataskategoriak.query(sql, (err, result) => {
            if (!err) {
                const newRes = getJSONfromLongtext(result[0], 'toBool')
                res.status(200).send([newRes]);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT * FROM szolgaltataskategoriak WHERE isAktiv = 1;`;
        szolgaltataskategoriak.query(sql, (err, result) => {
            if (!err) {
                let newRes = result;
                if (result && result.length) {
                    newRes = result.map((r) => getJSONfromLongtext(r));
                }
                res.status(200).send(newRes);
            } else {
                res.status(500).send({ err: err });
            }
        });
    }
});

// SZOLGALTATASKATEGORIAK END

export default router;
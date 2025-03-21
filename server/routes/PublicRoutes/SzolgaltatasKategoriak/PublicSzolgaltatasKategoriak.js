import express from 'express';
const router = express.Router();
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const szolgaltataskategoriak = pool;

// SZOLGALTATASKATEGORIAK START

router.get('/', (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM szolgaltataskategoriak WHERE id='${id}';`;
        szolgaltataskategoriak.query(sql, (err, result) => {
            if (!err) {
                const newRes = getJSONfromLongtext(result[0], 'toBool')
                res.status(200).send([newRes]);
            } else {
                res.status(500).send({ err: err });
            }
        });
    } else {
        const sql = `SELECT * FROM szolgaltataskategoriak;`;
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
import express from 'express';
import { getJSONfromLongtext, pool } from '../../../common/QueryHelpers.js';
const router = express.Router();
const galeria = pool;

// GALÉRIA START

router.get('/', (req, res) => {
    const sql = `SELECT * FROM galeria;`;
    galeria.query(sql, (err, result) => {
        if (!err) {
            const newRes = [];
            if (result.length > 0) {
                result.forEach((r) => {
                    newRes.push(getJSONfromLongtext(r));
                });
            }
            
            res.status(200).send(newRes);
        } else {
            res.status(500).send({ err: err });
        }
    });
});

// GALÉRIA END

export default router;

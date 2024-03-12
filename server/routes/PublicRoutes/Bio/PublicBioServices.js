import { pool, hasRole } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const bio = pool;

// BIO START

router.get('/', async (req, res) => {
    const id = req.headers.id;
    if (id) {
        const sql = `SELECT * FROM bio WHERE id='${id}';`;
        bio.query(sql, (err, result) => {
            if (!err) {
                if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                    let resss = result[0];
                    res.status(200).send(resss);
                } else {
                    res.status(403).send({
                        err: 'Nincs jogosultsága az adott művelethez!'
                    });
                }
            }
        });
    } else {
        const sql = `SELECT * FROM bio;`;
        bio.query(sql, (error, ress) => {
            if (error) {
                res.status(500).send({ err: 'Hiba történt a Bio lekérdezésekor!' });
            } else {
                let result = ress;
                res.status(200).send(result);
                    }
                });
            }
});

// BIO END

export default router;

/* export default router; */

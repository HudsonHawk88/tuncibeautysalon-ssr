import { pool, isTableExists, getJSONfromLongtext } from '../../../common/QueryHelpers.js';
import express from 'express';
const router = express.Router();
const kapcsolatok = pool;

// KAPCSOLAT START

router.get('/', async (req, res) => {
    const id = req.headers.id;
        if (id) {
            const sql = `SELECT * FROM kapcsolatok WHERE id='${id}';`;
            kapcsolatok.query(sql, (err, result) => {
                if (!err) {
                    const eredmeny = getJSONfromLongtext(result[0])
                    res.status(200).send(eredmeny);
                } else {
                    res.status(500).send({
                        err: err,
                        msg: 'Valami hiba van az elérésben! Értesítse a rendszergazdát!'
                    });
                }
            });
        } else {
            const vanTabla = isTableExists('kapcsolatok');
            const sql = `SELECT * FROM kapcsolatok;`;
            if (vanTabla) {
                kapcsolatok.query(sql, (err, result) => {
                    if (!err) {
                        const newResult = [];
                        result.forEach((r) => {
                            const newR = getJSONfromLongtext(r);
                            newResult.push(newR);
                        })
                        res.status(200).send(newResult);
                    } else {
                        res.status(500).send({
                            err: err,
                            msg: 'Valami hiba van az elérésben! Értesítse a rendszergazdát!'
                        });
                    }
                });
            } else {
                res.status(500).send({
                    err: 'Nem létezik még a tábla! Kérem vigyen fel tételt!',
                    msg: 'Nem létezik még a tábla! Kérem vigyen fel tételt!'
                })
            }
            
        }
});

// KAPCSOLATOK END

export default router;
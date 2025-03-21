import { jwtparams, UseQuery, pool, validateToken, hasRole, getJSONfromLongtext, mailUrl, log } from '../../../common/QueryHelpers.js';
import express from 'express';
import nodemailer from 'nodemailer';
import { Cron, scheduledJobs } from "croner";
import moment from 'moment';
import { Microservices } from '../../../../shared/MicroServices.js';
const transporter = nodemailer.createTransport(mailUrl);
const router = express.Router();
const hirlevel = pool;

// HIRLEVÉL START

function getCronPattern(tipus) {
    switch (tipus) {
        case 'teszt': {
            return `* * * * *`;
        }

        case '2_heti': {
            const now =  moment.now();
            const currDay = moment(now).get('D');
            const nextDate = moment(now).add(14, 'days');
            const nextDay = moment(nextDate).get('D');

            return `0 0 10 ${currDay},${nextDay} * *`;
        }

        default: {
            const now =  moment.now();
            const currDay = moment(now).get('D');
            const nextDate = moment(now).add(14, 'days');
            const nextDay = moment(nextDate).get('D');

            return `0 0 10 ${currDay},${nextDay} * *`;
        }
    }
}

router.get('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        const id = req.headers.id;
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (id) {
                const sql = `SELECT * FROM hirlevelek WHERE id='${id}';`;
                hirlevel.query(sql, (err, result) => {
                    if (!err) {
                        if (hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                            let resss = getJSONfromLongtext(result[0], 'toBool');
                            res.status(200).send(resss);
                        } else {
                            res.status(403).send({
                                err: 'Nincs jogosultsága az adott művelethez!'
                            });
                        }
                    }
                });
            } else {
                const sql = `SELECT * FROM hirlevelek;`;
                hirlevel.query(sql, (error, ress) => {
                    if (error) {
                        res.status(500).send({ err: 'Hiba történt a hírlevelek lekérdezésekor!' });
                    } else {
                        let result = ress;
                        result = ress.map((item) => {
                            let newItem = item;
                            newItem = getJSONfromLongtext(item, 'toBool')
                            return newItem
                        });
                        res.status(200).send(result);
                    }
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    // TODO berakni a token vizsgálatot a true helyére és a user a validateToken-es lesz ha lesz Admin felület hozzá!!!
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                let felvitelObj = req.body;
                if (felvitelObj) {
                    felvitelObj = JSON.parse(JSON.stringify(felvitelObj));
                    //store user, password and role
                    const sql = `CREATE TABLE IF NOT EXISTS tuncibeautysalon.hirlevelek (
                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    azonosito text DEFAULT NULL,
                    tipus text DEFAULT NULL,
                    hirlevel text DEFAULT NULL,
                    magyarhirlevel text DEFAULT NULL
                  ) ENGINE=InnoDB;`;
                    hirlevel.query(sql, async (error) => {
                        if (!error) {
                            const hirlevelSql = `SELECT azonosito FROM hirlevelek WHERE azonosito = '${felvitelObj.azonosito}';`;
                            const result = await UseQuery(hirlevelSql);
                            // if (resultEmail.rowCount === 0) {
                            if (result.length === 0) {
                                const sql = `INSERT INTO hirlevelek (azonosito, tipus, hirlevel, magyarhirlevel)
                          VALUES ('${felvitelObj.azonosito}', '${felvitelObj.tipus}', '${felvitelObj.hirlevel}', '${felvitelObj.magyarhirlevel}');`;
                                hirlevel.query(sql, (err) => {
                                    if (!err) {
                                        res.status(200).send({
                                            msg: 'Hírlevél sikeresen hozzáadva!'
                                        });
                                    } else {
                                        res.status(500).send({
                                            err: err
                                        });
                                    }
                                });
                            } else {
                                res.status(400).send({
                                    err: 'Ez a hírlevél már létezik!'
                                });
                            }
                        } else {
                            res.status(500).send({
                                err: 'Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!',
                                msg: err
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Hírlevél adatainak megadása kötelező!'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.put('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    if (token) {
        // const user = validateToken(token, jwtparams.secret);
        const user = { roles: [{ value: 'SZUPER_ADMIN' }] };
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            const id = req.headers.id;
            let modositoObj = req.body;
            if (modositoObj) {
                // TODO Email címet most csak szuperadmin tud módoítani!!!!
                // if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ["SZUPER_ADMIN"])) {
                if (user.roles && user.roles.length !== 0 && hasRole(user.roles, ['SZUPER_ADMIN'])) {
                    if (id) {
                        modositoObj = JSON.parse(JSON.stringify(modositoObj));
                        const sql = `UPDATE hirlevelek SET azonosito='${modositoObj.azonosito}', tipus='${modositoObj.tipus}', hirlevel='${modositoObj.hirlevel}', magyarhirlevel='${modositoObj.magyarhirlevel}' WHERE id = '${id}';`;
                        hirlevel.query(sql, (err) => {
                            if (!err) {
                                res.status(200).send({
                                    msg: 'Hírlevél sikeresen módosítva!'
                                });
                            } else {
                                res.status(500).send({
                                    err: 'Hírlevél módosítása sikertelen!'
                                });
                            }
                        });
                    } else {
                        res.status(400).send({
                            err: 'Id megadása kötelező'
                        });
                    }
                } else {
                    res.status(400).send({
                        err: 'Hírlevél adatainak megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.delete('/', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const id = req.headers.id;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    const sql = `DELETE FROM hirlevelek WHERE id='${id}';`;
                    hirlevel.query(sql, (err) => {
                        if (!err) {
                            res.status(200).send({
                                msg: 'Hírlevél sikeresen törölve!'
                            });
                        } else {
                            res.status(500).send({
                                err: 'Hírlevél törlése sikertelen!'
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        err: 'Id megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.get('/addcron', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const id = req.headers.id;
    const secret = req.headers.secret;
    

    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    // const cronPattern = getCronPattern('teszt');
                    const cronPattern = getCronPattern(process.env.defaultCronPattern);
                
                    new Cron(cronPattern, { 
                        name: `${process.env.jobnamePrefix}${id}`,
                        timezone: 'Europe/Budapest'
                    }, async () => {

                       await Microservices.fetchApi(`${process.env.REACT_APP_mainUrl}/api/admin/hirlevel/send?id=${id}`, {
                            method: 'POST',
                            mode: "cors",
                            cache: "no-cache",
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                                secret: secret
                            }
                        }, (errrr) => {
                            if (!errrr)  {
                                console.log('NINCS HIBA')
                            } else {
                                console.log(errrr)
                            }
                        });
                    });

                    console.log(scheduledJobs)
                    res.status(200).send({})
                } else {
                    res.status(400).send({
                        err: 'Id megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/pausecron', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const id = req.headers.id;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    const job = scheduledJobs.find((j) => j.name === `${process.env.jobnamePrefix}${id}`);
                    job.pause();
                } else {
                    res.status(400).send({
                        err: 'Id megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.delete('/stopcron', async (req, res) => {
    const token = req.cookies.JWT_TOKEN;
    const id = req.headers.id;
    if (token) {
        const user = await validateToken(token, jwtparams.secret);
        if (user === null) {
            res.status(401).send({
                err: 'Nincs belépve! Kérem jelentkezzen be!'
            });
        } else {
            if (user.roles && user.roles.length !== 0 && hasRole(JSON.parse(user.roles), ['SZUPER_ADMIN'])) {
                if (id) {
                    const job = scheduledJobs.find((j) => j.name === `${process.env.jobnamePrefix}${id}`);
                    console.log(job, `${process.env.jobnamePrefix}${id}`)
                    if (job) {
                        job.stop();
                    }
                    res.status(200).send({})
                    
                } else {
                    res.status(400).send({
                        err: 'Id megadása kötelező'
                    });
                }
            } else {
                res.status(403).send({
                    err: 'Nincs jogosultsága az adott művelethez!'
                });
            }
        }
    } else {
        res.status(401).send({
            err: 'Nincs belépve! Kérem jelentkezzen be!'
        });
    }
});

router.post('/send', async (req) => {
    // const token = req.cookies.JWT_TOKEN;
    const id = req.query.id;
    const secret = req.headers.secret
   

    if (secret !== process.env.REACT_APP_hirelvelSendSecret) {
        return { err: 'Nincs jogosultsága az adott művelethez!' }
    } else {
        if (id) {
            const sql = `SELECT azonosito, tipus, hirlevel, magyarhirlevel FROM hirlevelek WHERE id='${id}';`;
            hirlevel.query(sql, async (err, result) => {
                if (!err) {
                    const feliratkozokSql = `SELECT id, feliratkozoNyelv, feliratkozoNev, feliratkozoEmail FROM tuncibeautysalon.feliratkozok;`;
                    console.log(feliratkozokSql)
                    
                    const f = await UseQuery(feliratkozokSql, '/api/admin/hirlevel/send');
                    console.log('feliratkozokSql, f, f[0]: ', feliratkozokSql, f, f[0]);
                    const feliratkozok = f;
                    let html = ``;
                    const { azonosito, hirlevel, magyarhirlevel } = result[0];

                    console.log("result: ", result)

                    if (feliratkozok && feliratkozok.length) {
                        feliratkozok.forEach((feliratkozo) => {
                            html = feliratkozo.feliratkozonyelv === 'hu' ? magyarhirlevel : hirlevel;
                            const leirakozoLink = `${process.env.REACT_APP_mainUrl}/abbestellen?id=${feliratkozo.id}`
                            if (html && (html + '').length > 0) {
                                html = html
                                .replace('${__LEIRATKOZONEV__}', feliratkozo.feliratkozoNev)
                                .replace('${__LEIRATKOZOLINK__}', leirakozoLink)

                                console.log('html: ', html)

                                transporter.sendMail({
                                    from: process.env.REACT_APP_noreplyemail,
                                    to: feliratkozo.feliratkozoEmail,
                                    subject: azonosito,
                                    html: html
                                }, (error) => {
                                    if (error) {
                                        log(`/api/hirlevel/send?secret=${secret}&id=${id}`, error)
                                        return { err: error }
                                    } else {
                                        return { err: null }
                                    }
                                });
                            }
                        })
                    } else {
                        return { err: 'Nincs feliratkozó!' }
                    }

                } else {
                    log(`/api/hirlevel/send?secret=${secret}&id=${id}`, err)
                    return { err }
                }
            });
        } else {
            log(`/api/hirlevel/send?secret=${secret}&id=undefined}`, 'Id megadása kötelező')
            return { err: 'Id megadása kötelező' }
        }
    }
});

// HIRLEVEL END

export default router;

/* export default router; */

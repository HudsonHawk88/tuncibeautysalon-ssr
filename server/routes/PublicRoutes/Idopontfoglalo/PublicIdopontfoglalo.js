import express from "express";
import nodemailer from 'nodemailer';
const router = express.Router();
import {
  UseQuery,
  getNumberFromBoolean,
  pool,
  mailUrl,
  log,
  isTableExists
} from "../../../common/QueryHelpers.js";
const transporter = nodemailer.createTransport(mailUrl);
import moment from "moment";
import { Microservices } from "../../../../shared/MicroServices.js";
const idopontok = pool;

// IDOPONTOK START

/* function dateRangeOverlaps(startDateA, endDateA, startDateB, endDateB) {

    if ((endDateA < startDateB) || (startDateA > endDateB)) {
        return null
    }

    var obj = {};
    obj.startDate = startDateA <= startDateB ? startDateB : startDateA;
    obj.endDate = endDateA <= endDateB ? endDateA : endDateB;

    return obj;
} */

router.get("/", async (req, res) => {
  const nap = req.query.nap ? req.query.nap : moment(moment.now()).format('YYYY-MM-DD');
  const isExists = await isTableExists('idopontok');

  if (isExists && nap) {
    const sql = `SELECT kezdete, vege FROM idopontok INNER JOIN(SELECT id as aa, DAYNAME(idopontok.kezdete) as dayname FROM idopontok)st2 ON idopontok.id = st2.aa WHERE date(kezdete) = '${nap}' ORDER BY kezdete;`;
    const idopontok = await UseQuery(sql);
    if (idopontok) {
      res.status(200).send(idopontok);
    } else {
      log('GET /api/idopontok', `Hiba történt az időpontok lekérdezésénél! - Nincsenek idopontok!\n SQL: ${sql}`);
      res.status(500).send({ err: 'Hiba történt az időpontok lekérdezésénél!', msg: 'Hiba történt az időpontok lekérdezésénél!' });
    }
  } else if (!nap) {
    log('GET /api/idopontok', `Nincs nap megadva! Nap megadása kötelező!`);
    res.status(500).send({ err: 'Nincs nap megadva! Nap megadása kötelező!', msg: 'Nincs nap megadva! Nap megadása kötelező!' });
  } else if (!isExists) {
    log('GET /api/idopontok', `Nincs ilyen tábla "idopontok"!`);
    res.status(500).send({ err: 'Nincs ilyen tábla "idopontok"!', msg: 'Nincs ilyen tábla "idopontok"!' });
  }
})

router.post("/", async (req, res) => {
  let foglalasObj = req.body;
  foglalasObj.ugyfelelfogad = getNumberFromBoolean(foglalasObj.ugyfelelfogad);
  const lang = req.headers.lang;

  let idotartam = 0;
  const totalQuery = await UseQuery(`SELECT idotartam, magyarszolgrovidnev as magyarszolg, szolgrovidnev as nemetszolg FROM szolgaltatasok WHERE id IN(${foglalasObj.szolgaltatasok})`);
  if (totalQuery && totalQuery.length > 0) {
    totalQuery.forEach((sz) => {
      idotartam += sz.idotartam;
    })
  }

  foglalasObj.vege = moment(foglalasObj.kezdete).add(idotartam, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  const uresjarat = idotartam + foglalasObj.szolgaltatasok.length > 1 ? 15 : 10;
  const totalVege = moment(foglalasObj.vege).add(uresjarat, 'minutes').format('YYYY-MM-DD HH:mm:ss');

  const isSzabadQsl = `SELECT * FROM idopontok WHERE((vege > '${foglalasObj.kezdete}') AND (kezdete < '${totalVege}'));`

  const overLappedAppointments = await UseQuery(isSzabadQsl, '/api/idopontok POST');

  const isSzabad = overLappedAppointments.length === 0;

  if (isSzabad) {
    const createSql = `CREATE TABLE IF NOT EXISTS tuncibeautysalon.idopontok (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, kezdete TIMESTAMP NOT NULL, vege TIMESTAMP NOT NULL, ugyfelnev text NOT NULL, ugyfelemail text NOT NULL, ugyfeltelefon VARCHAR(15) NOT NULL, szolgtipusok json NOT NULL, ugyfelelfogad tinyint(1) NOT NULL, elfogadido TIMESTAMP NOT NULL, nyelv text NOT NULL);`;
  
    idopontok.query(createSql, async (err) => {
      if (!err) {
        
        const insertSql = `INSERT INTO idopontok (kezdete, vege, ugyfelnev, ugyfelemail, ugyfeltelefon, ugyfelelfogad, elfogadido, szolgtipusok, nyelv) VALUES ('${foglalasObj.kezdete}', date_add('${foglalasObj.kezdete}', interval ${(idotartam + (foglalasObj.szolgaltatasok.length > 1 ? 15 : 10))} minute), '${foglalasObj.ugyfelnev}', '${foglalasObj.ugyfelemail}', '${foglalasObj.ugyfeltelefon}', '${foglalasObj.ugyfelelfogad}', NOW(), '${JSON.stringify(foglalasObj.szolgaltatasok)}', '${lang}');`;  
        let szolgok = '';
        if (totalQuery && totalQuery.length > 0) {
          totalQuery.forEach((sz) => {
            szolgok += `<li>${lang === 'hu' ? sz.magyarszolg : sz.nemetszolg}</li>`;
          })
        }



        
        
        idopontok.query(insertSql, (e, r) => {
          if (!e) {
              const kezdete = moment(foglalasObj.kezdete).format('YYYYMMDDTHHmmSS');
              const vege = moment(foglalasObj.vege).format('YYYYMMDDTHHmmSS');
              const addToGoogleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${foglalasObj.ugyfelnev + ' időpontja (ID: ' + r.insertId + ')'}&dates=${kezdete}/${vege}&ctz=Europe/Budapest&sf=true&output=xml`;
              const ugyfeluzenetmagyar = `<b>Kedves ${foglalasObj.ugyfelnev}!</b><br><br>
              A lefoglalt időpont adatai: <br>
              <ul><li>Név: ${foglalasObj.ugyfelnev}</li>
              <li>Telefonszám: ${foglalasObj.ugyfeltelefon}</li>
              <li>Szolgáltatás(ok): 
              <ul>
              ${szolgok}
              </ul>
              <li>Időpont: ${moment(foglalasObj.kezdete).format('YYYY-MM-DD HH:mm') + ' - ' + moment(moment(foglalasObj.kezdete).add(idotartam, 'minutes')).format('HH:mm')}</li></ul><br>
              Lemondani az alábbi linken tudja: <br>
              <a href='${process.env.REACT_APP_mainUrl + `/terminstreichung?terminId=${r.insertId}`}' target='_blank'>${process.env.REACT_APP_mainUrl + `/terminstreichung?terminId=${r.insertId}`}</a><br>
              <strong>Amennyiben nem érkezik meg a foglalt időpontra és legalább 2 nappal előbb nem törli az időpontot, úgy a következő alkalommal felszámolásra kerül az elmulasztott kezelés is!</strong><br> 
              Tisztelettel:<br>
              Tünci Beauty Salon<br>`;
              const ugyfeluzenetnemet = `<b>Liebe ${foglalasObj.ugyfelnev},</b><br><br>
              Angaben zum gebuchten Termin: <br>
              <ul>
              <li>Dienstleistungen: 
              <ul>
              ${szolgok}
              </ul>
              </li>
              <li>Name: ${foglalasObj.ugyfelnev}</li>
              <li>Telefonnummer: ${foglalasObj.ugyfeltelefon}</li>
              <li>Termin: ${moment(foglalasObj.kezdete).format('YYYY-MM-DD HH:mm') + ' - ' + moment(moment(foglalasObj.kezdete).add(idotartam, 'minutes')).format('HH:mm')}</li></ul><br>
              Sie können über den folgenden Link kündigen:<br>
              <a href='${process.env.REACT_APP_mainUrl + `/terminstreichung?terminId=${r.insertId}`}' target='_blank'>${process.env.REACT_APP_mainUrl + `/terminstreichung?terminId=${r.insertId}`}</a><br>
              <strong>Sollten Sie nicht zum gebuchten Zeitpunkt erscheinen und den Termin nicht mindestens 2 Tage vorher absagen, wird die versäumte Behandlung auch beim nächsten Mal in Rechnung gestellt!</strong><br><br>
              Aufrichtig:<br>
              Tünci Beauty Salon<br>`;
              const tulajuzenet = `<b>Kedves Tünci!</b><br><br>
              Új foglalás érkezett: <br>
              <ul>
              <li>Szolgáltatás(ok): 
              <ul>
              ${szolgok}
              </ul>
              <li>Név: ${foglalasObj.ugyfelnev}</li>
              <li>Telefonszám: ${foglalasObj.ugyfeltelefon}.</li>
              <li>Időpont: <a href="${addToGoogleCalendarUrl}">${moment(foglalasObj.kezdete).format('YYYY-MM-DD HH:mm') + ' - ' + moment(moment(foglalasObj.kezdete).add(idotartam, 'minutes')).format('HH:mm')}</a></li></ul><br>
              Tisztelettel:<br>
              Tünci Beauty Salon<br>`;
              transporter.sendMail({
                  from: process.env.REACT_APP_noreplyemail, // sender address
                  to: `${process.env.foEmail}`, // list of receivers
                  subject: `Új foglalás érkezett`, // Subject line
                  html: tulajuzenet // html body
              }, (error) => {
                  if (!error) {
                      const targy = lang === 'hu' ? `Új időpontfoglalás a Tünci Beauty Salon-ba` : `Neue Terminbuchung im Tünci Beauty Salon`;
                      transporter.sendMail({
                          from: process.env.REACT_APP_noreplyemail, // sender address
                          to: `${foglalasObj.ugyfelemail}`, // list of receivers
                          subject: targy,
                          html: lang === 'hu' ? ugyfeluzenetmagyar : ugyfeluzenetnemet // html body
                          
                      }, async (errrrrr) => {
                          if (!errrrrr) {
                            if (foglalasObj.hirlevelFeliratkozas) {
                              const ressss = await Microservices.fetchApi(`${process.env.REACT_APP_mainUrl}/api/feliratkozas`, {
                                method: 'POST',
                                mode: "cors",
                                cache: "no-cache",
                                headers: {
                                  "Content-Type": "application/json",
                                  "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                                  "belsoleg": "true"
                                },
                                body: JSON.stringify({ 
                                  feliratkozoNyelv: foglalasObj.feliratkozoNyelv,
                                  feliratkozoNev: foglalasObj.ugyfelnev,
                                  feliratkozoEmail: foglalasObj.ugyfelemail,
                                  feliratkozasMod: 'Időpontfoglaló'
                                })
                              });
                              if (!ressss.err) {
                                log('/api/feliratkozas', res.err)
                              }
                            }
                            
                          } else {
                            log('POST /api/idopontok tulajmail', errrrrr)
                          }
                      })
                  } else {
                      log('POST /api/idopontok tulajmail', error)
                  }
              })
            res.status(200).send({
              msg:
                lang === "hu"
                  ? "Időpont sikeresen hozzáadva! E-mail-ben értesítjük a továbbiakról!"
                  : "Datum erfolgreich hinzugefügt! Über weitere Informationen informieren wir Sie per E-Mail!",
              err: null
            });
          } else {
              // res.status(500).send({ err: e, msg: JSON.stringify(e) })
              res.status(500).send({ err: e, msg: lang === 'hu' ? 'Hiba az időpont hozzáadaásakor' : 'Fehler beim Hinzufügen des Datums' })
          }
        })
             
      } else {
        res.status(500).send({
          err: err,
          msg:
            lang === "hu"
              ? "Hiba történt az adatbázis létrehozásakor! Értesítse a weboldal rendszergazdáját!"
              : "Beim Hinzufügen des Dienstes ist ein Fehler aufgetreten! Benachrichtigen Sie den Website-Administrator!",
        });
      }
    })
  } else {
    res.status(409).send({ err: { ok: 'OVERLAP' }, msg: lang === 'hu' ? 'A fogalásakor a rendszerbe került egy másik foglalás is. Kérjük válasszon másik időpontot!' : 'Zum Zeitpunkt der Buchung wurde dem System eine weitere Reservierung hinzugefügt. Bitte wählen Sie einen anderen Termin!' })
  }
  
})

router.delete("/", async (req, res) => {
  const id = req.headers.id;
  const lang = req.headers.lang;

  if (id) {
      const selSql = `SELECT * from idopontok WHERE id = '${id}';`;
      const selIdopont = await UseQuery(selSql, `DELETE /api/idopontok id=${id}`);

      if (selIdopont) {
          const idopont = selIdopont[0];
          if (idopont) {

            const nev = idopont.ugyfelnev;
            const tel = idopont.ugyfeltelefon;
            const email = idopont.ugyfelemail;
            const ido = moment(idopont.kezdete).format('YYYY-MM-DD HH:mm') + ' - ' + moment(idopont.vege).format('HH:mm');
            const id = idopont.id;

            if (idopont && nev && tel && email && ido && id) {
              const ugyfeluzenetmagyar = `<b>Kedves ${nev}!</b><br><br>
              A foglalását sikeresen törölte!<br>
              <ul><li>Név: ${nev}</li>
              <li>Telefonszám: ${tel}</li>
              <li>Időpont: ${ido}</li></ul><br>
              Tisztelettel:<br>
              Tünci Beauty Salon<br>`;
              const ugyfeluzenetnemet = `<b>Liebe ${nev},</b><br><br>
              Sie haben Ihre Reservierung erfolgreich storniert!<br>
              <ul><li>Name: ${nev}</li>
              <li>Telefonnummer: ${tel}</li>
              <li>Termin: ${ido}</li></ul><br>
              Aufrichtig:<br>
              Tünci Beauty Salon<br>`;
              const tulajuzenet = `<b>Kedves Tünci!</b><br><br>
              A(z) #${id} foglalás törölve lett<br>
              <ul><li>Név: ${nev}</li>
              <li>Telefonszám: ${tel}</li>
              <li>Időpont: ${ido}</li></ul><br><br>
              Tisztelettel:<br>
              Tünci Beauty Salon<br>`;

            const deleteSql = `DELETE FROM idopontok WHERE id = '${id}';`;

            idopontok.query(deleteSql, (errrr) => {
                if (!errrr) {
                    transporter.sendMail({
                        from: process.env.REACT_APP_noreplyemail, // sender address
                        to: `${process.env.foEmail}`, // list of receivers
                        subject: `A(z) #${id} foglalás törölve lett`,
                        html: tulajuzenet // html body
                    }, (tulerr) => {
                        if (!tulerr) {
                            transporter.sendMail({
                                from: process.env.REACT_APP_noreplyemail, // sender address
                                to: email, // list of receivers
                                subject:  lang === 'hu' ? `A(z) #${id} foglalás törölve lett` : `Die #${id} Buchung wurde storniert`,
                                html: lang === 'hu' ? ugyfeluzenetmagyar : ugyfeluzenetnemet // html body
                            }, (ugyferr) => {
                                if (ugyferr) {
                                    log('DEL /api/idopontok ugyfelemaill', ugyferr)
                                }
                            })
                        } else {
                            log('DEL /api/idopontok tulajmail', tulerr)
                        }
                    });

                    res.status(200).send({ err: null, msg: lang === 'hu' ? 'Foglalt időpont sikeresen törölve!' : 'Gebuchter Termin erfolgreich storniert!' })
                } else {
                    res.status(500).send({ err: errrr, msg: lang === 'hu' ? 'Foglalás törlése sikertelen!' : 'Stornierung der Reservierung fehlgeschlagen!' })
                }
            })
          } else {
            res.status(500).send({ err: lang === 'hu' ? 'Nincs ilyen időpont' : 'Ein solches Datum gibt es nicht' })
          }

          }
         
          

          
      }
  } else {
      res.status(400).send({ err: lang === 'hu' ? 'Nincs id!' : 'Kein Ausweis!' })
  }
})

router.get("/szabadIdopontok", async (req, res) => {
  const id = req.headers.id;
  const isExists = await isTableExists('idopontok');
  if (id) {
    const sql = `SELECT * FROM idopontok WHERE id='${id}';`;
    idopontok.query(sql, (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(500).send({ err: err });
      }
    });
  } else {
    const nap = req.query.nap;
    const szolgaltatasok = JSON.parse("[" + req.query.szolgaltatasok + "]");

    if (nap) {
      if (isExists) {
        const sql = `SELECT * FROM idopontok INNER JOIN(SELECT id as aa, DAYNAME(idopontok.kezdete) as dayname FROM idopontok)st2 ON idopontok.id = st2.aa WHERE date(kezdete) = '${nap}' ORDER BY kezdete;`;
        idopontok.query(sql, async (err, result) => {
          if (!err) {
            const getnyitavtartasSql = `SELECT nyitvatartas FROM kapcsolatok;`;
            const getszolgaltatasSql = `SELECT (SUM(idotartam) + ${szolgaltatasok.length > 1 ? 15 : 10}) as total FROM szolgaltatasok WHERE id IN(${szolgaltatasok});`;
            const nyitva = await UseQuery(
              getnyitavtartasSql,
              "GET /api/idopontok"
            );
            const szolg = await UseQuery(
              getszolgaltatasSql,
              "GET /api/szolgaltatas"
            );
            const szabadIdopontok = [];
            if (nyitva && szolg) {
             
              let nyitvatartas = nyitva[0].nyitvatartas;
              nyitvatartas = typeof nyitvatartas === 'string' ? JSON.parse(nyitvatartas) : nyitvatartas;
              let total = parseInt(szolg[0].total, 10);
  
              const dayname = moment(nap).format("dddd");
              const capitalized = "is" + dayname;
              if (nyitvatartas[capitalized]) {
                const kezdo = nyitvatartas[(dayname + "").toLowerCase()].tol;
                const zaro = nyitvatartas[(dayname + "").toLowerCase()].ig;
                const uzletnyit = moment(
                  moment(nap).format("YYYY-MM-DD") + " " + kezdo
                ).format("YYYY-MM-DD HH:mm");
                const uzletzar = moment(
                  moment(nap).format("YYYY-MM-DD") + " " + zaro
                ).format("YYYY-MM-DD HH:mm");
                // HA VAN IDOPONT MÁR
                if (result.length > 0) {
                  // HA CSAK EGY IDŐPONT VAN MÉG
                  if (result.length === 1) {
                    const start = moment(
                      moment(nap).format("YYYY-MM-DD") + " " + kezdo
                    ).format("YYYY-MM-DD HH:mm");
                    const beforediff = moment(
                      moment(result[0].kezdete).format("YYYY-MM-DD HH:mm")
                    ).diff(start, "minutes");
                    const afterDiff = moment(uzletzar).diff(
                      moment(result[0].vege).format("YYYY-MM-DD HH:mm"),
                      "minutes"
                    );
  
                    if (beforediff >= total) {
                      const end = moment(result[0].kezdete).format(
                        "YYYY-MM-DD HH:mm"
                      );
                      let loop = start;
                      if (
                        moment(loop)
                          .add(total, "minutes")
                          .format("YYYY-MM-DD HH:mm") <= end
                      ) {
                        const formatted = moment(loop).format("HH:mm");
                        szabadIdopontok.push(formatted);
                      }
                      while (beforediff >= total && loop <= end) {
                        let newDate = loop;
                        loop = newDate;
                        loop = moment(
                          moment(newDate).add(total, "minutes")
                        ).format("YYYY-MM-DD HH:mm");
                        if (
                          moment(
                            moment(loop)
                              .add(total, "minutes")
                              .format("YYYY-MM-DD HH:mm")
                          ).isSameOrBefore(end)
                        ) {
                          const formatted = moment(loop).format("HH:mm");
                          szabadIdopontok.push(formatted);
                        }
                      }
                    }
                    if (afterDiff >= total) {
                      const start = moment(result[0].vege).format(
                        "YYYY-MM-DD HH:mm"
                      );
                      let loop = start;
                      if (
                        moment(
                          moment(loop).add(total).format("YYYY-MM-DD HH:mm")
                        ).isSameOrBefore(uzletzar)
                      ) {
                        const formatted = moment(loop).add(total).format("HH:mm");
                        szabadIdopontok.push(formatted);
                      }
                      while (afterDiff >= total && loop <= uzletzar) {
                        let newDate = loop;
                        loop = newDate;
                        loop = moment(
                          moment(newDate).add(total, "minutes")
                        ).format("YYYY-MM-DD HH:mm");
                        if (
                          moment(
                            moment(loop)
                              .add(total, "minutes")
                              .format("YYYY-MM-DD HH:mm")
                          ).isSameOrBefore(uzletzar)
                        ) {
                          const formatted = moment(loop).format("HH:mm");
                          szabadIdopontok.push(formatted);
                        }
                      }
                    }
                  } else {
                    // HA MÁR EGYNÉL TÖBB IDŐPONT VAN
                    result.forEach((idopont, idx) => {
                      const start = moment(idopont.kezdete).format(
                        "YYYY-MM-DD HH:mm"
                      );
                      const end = moment(idopont.vege).format("YYYY-MM-DD HH:mm");
                      const afterIndex = result[idx + 1] ? idx + 1 : null;
                      // ELSŐ IDOPONT
                      if (idx === 0) {
                         // ELSŐ IDŐPONT ÉS NYITÁS KÖZÖTTI
                        const differ = moment(start).diff(uzletnyit, "minutes");
  
                        if (differ >= total) {
                          let loop = uzletnyit;
                          if (
                            moment(
                              moment(loop).add(total).format("YYYY-MM-DD HH:mm")
                            ).isSameOrBefore(start)
                          ) {
                            const formatted = moment(loop)
                              .add(total)
                              .format("HH:mm");
                            szabadIdopontok.push(formatted);
                          }
                          while (differ >= total && loop <= start) {
                            let newDate = loop;
                            loop = newDate;
                            loop = moment(
                              moment(newDate).add(total, "minutes")
                            ).format("YYYY-MM-DD HH:mm");
                            if (
                              moment(
                                moment(loop)
                                  .add(total, "minutes")
                                  .format("YYYY-MM-DD HH:mm")
                              ).isSameOrBefore(start)
                            ) {
                              const formatted = moment(loop).format("HH:mm");
                              szabadIdopontok.push(formatted);
                            }
                          }
                        }
                        // UTOLSÓ IDOŐPONT
                      } else {
                        // 2. IDŐPONTTÓL ZÁRÁSIG
  
                        // HA NEM AZ UTOLSÓ IDŐPONT
                        if (afterIndex) {
  
                          // ELSŐ IDŐPONT ÉS A 2. IDŐPONT KÖZÖTTI
  
                          if (idx === 1) {
                            const elsoend = moment(result[idx-1].vege).format(
                              "YYYY-MM-DD HH:mm"
                            );
                            const masodikstart = moment(idopont.kezdete).format(
                              "YYYY-MM-DD HH:mm"
                            );
    
                            const differ2 = moment(masodikstart).diff(elsoend, "minutes");
                            if (differ2 >= total) {
                              let firstBetweenSecondLoop = elsoend;
                              if (
                                moment(
                                  moment(firstBetweenSecondLoop).add(total).format("YYYY-MM-DD HH:mm")
                                ).isSameOrBefore(masodikstart)
                              ) {
                                const formatted = moment(firstBetweenSecondLoop)
                                  .add(total)
                                  .format("HH:mm");
                                szabadIdopontok.push(formatted);
                              }
                              while (differ2 >= total && firstBetweenSecondLoop <= masodikstart) {
                                let newDate = firstBetweenSecondLoop;
                                firstBetweenSecondLoop = newDate;
                                firstBetweenSecondLoop = moment(
                                  moment(newDate).add(total, "minutes")
                                ).format("YYYY-MM-DD HH:mm");
                                if (
                                  moment(
                                    moment(firstBetweenSecondLoop)
                                      .add(total, "minutes")
                                      .format("YYYY-MM-DD HH:mm")
                                  ).isSameOrBefore(masodikstart)
                                ) {
                                  const formatted = moment(firstBetweenSecondLoop).format("HH:mm");
                                  szabadIdopontok.push(formatted);
                                }
                              }
                            }
                          } else {
                            const kovstart = moment(
                              result[afterIndex].kezdete
                            ).format("YYYY-MM-DD HH:mm");
                            let loop = end;
                            const newDiff = moment(
                              moment(kovstart).format("YYYY-MM-DD HH:mm")
                            ).diff(loop, "minutes");
    
                            if (
                              moment(
                                moment(loop)
                                  .add(total, "minutes")
                                  .format("YYYY-MM-DD HH:mm")
                              ).isSameOrBefore(kovstart)
                            ) {
                              const formatted = moment(loop).format("HH:mm");
                              szabadIdopontok.push(formatted);
                            }
    
                            while (
                              newDiff >= total &&
                              loop <= kovstart &&
                              moment(loop).isSameOrBefore(uzletzar)
                            ) {
                              let newDate = loop;
                              loop = moment(
                                moment(newDate).add(total, "minutes")
                              ).format("YYYY-MM-DD HH:mm");
                              if (
                                moment(
                                  moment(loop)
                                    .add(total, "minutes")
                                    .format("YYYY-MM-DD HH:mm")
                                ).isSameOrBefore(kovstart)
                              ) {
                                const formatted = moment(loop).format("HH:mm");
                                szabadIdopontok.push(formatted);
                              }
                            }
                          }
                          
                          
                        } else {
                          // UTOLSÓ IDŐPONT KEZDETÉTŐL UTOLSÓ ELŐTTI VÉGÉIG
  
                          // ELSŐ IDŐPONT ÉS A 2. IDŐPONT KÖZÖTTI
                          
                          const elsoend = moment(result[idx-1].vege).format(
                            "YYYY-MM-DD HH:mm"
                          );
                          const masodikstart = moment(idopont.kezdete).format(
                            "YYYY-MM-DD HH:mm"
                          );
  
                          const differ2 = moment(masodikstart).diff(elsoend, "minutes");
                          if (differ2 >= total) {
                            let firstBetweenSecondLoop = elsoend;
                            if (
                              moment(
                                moment(firstBetweenSecondLoop).add(total).format("YYYY-MM-DD HH:mm")
                              ).isSameOrBefore(masodikstart)
                            ) {
                              const formatted = moment(firstBetweenSecondLoop)
                                .add(total)
                                .format("HH:mm");
                              szabadIdopontok.push(formatted);
                            }
                            while (differ2 >= total && firstBetweenSecondLoop <= masodikstart) {
                              let newDate = firstBetweenSecondLoop;
                              firstBetweenSecondLoop = newDate;
                              firstBetweenSecondLoop = moment(
                                moment(newDate).add(total, "minutes")
                              ).format("YYYY-MM-DD HH:mm");
                              if (
                                moment(
                                  moment(firstBetweenSecondLoop)
                                    .add(total, "minutes")
                                    .format("YYYY-MM-DD HH:mm")
                                ).isSameOrBefore(masodikstart)
                              ) {
                                const formatted = moment(firstBetweenSecondLoop).format("HH:mm");
                                szabadIdopontok.push(formatted);
                              }
                            }
                          }
  
                          // TODO:
  
                          // UTOLSÓ IDŐPONTTÓL ZÁRÁSIG
                          if (end <= uzletzar) {
                            let loop = end;
                            let nDiff = moment(uzletzar).diff(loop, "minutes");
                            if (
                              moment(
                                moment(loop).add(total, "minutes")
                              ).isSameOrBefore(uzletzar)
                            ) {
                              szabadIdopontok.push(moment(loop).format("HH:mm"));
                            }
  
                            while (
                              nDiff >= total &&
                              moment(
                                moment(loop).format("YYYY-MM-DD HH:mm")
                              ).isSameOrBefore(
                                moment(uzletzar).format("YYYY-MM-DD HH:mm")
                              )
                            ) {
                              let newDate = loop;
                              loop = moment(
                                moment(newDate).add(total, "minutes")
                              ).format("YYYY-MM-DD HH:mm");
                              if (
                                loop <= uzletzar &&
                                moment(
                                  moment(
                                    moment(loop).add(total, "minutes")
                                  ).format("YYYY-MM-DD HH:mm")
                                ).isSameOrBefore(uzletzar)
                              ) {
                                const formatted = moment(loop).format("HH:mm");
                                szabadIdopontok.push(formatted);
                              }
                            }
                          }
                        }
                      }
                    });
                  }
                } else {
                  const h = parseInt(zaro.split(":")[0], 10);
                  const m = parseInt(zaro.split(":")[1], 10);
                  const start = moment(
                    moment(nap).format("YYYY-MM-DD") + " " + kezdo
                  ).format("YYYY-MM-DD HH:mm");
                  const end = moment(new Date(nap).setHours(h, m, 0)).format(
                    "YYYY-MM-DD HH:mm"
                  );
                  let loop = start;
                  szabadIdopontok.push(moment(start).format("HH:mm"));
  
                  while (
                    moment(moment(loop).add(total, "minutes")).format(
                      "YYYY-MM-DD HH:mm"
                    ) <= end
                  ) {
                    let newDate = moment(loop)
                      .add(total, "minutes")
                      .format("YYYY-MM-DD HH:mm");
                    loop = newDate;
                    if (
                      moment(moment(newDate).add(total, "minutes")).format(
                        "YYYY-MM-DD HH:mm"
                      ) <= end
                    ) {
                      const formatted = moment(loop).format("HH:mm");
                      szabadIdopontok.push(formatted);
                    }
                  }
                }
              }
            }
  
          /*   const event = {
              'summary': 'Google I/O 2015',
              'location': '800 Howard St., San Francisco, CA 94103',
              'description': 'A chance to hear more about Google\'s developer products.',
              'start': {
                'dateTime': '2023-12-23T09:00:00-07:00',
                'timeZone': 'Europe/Budapest',
              },
              'end': {
                'dateTime': '2023-12-23T17:00:00-07:00',
                'timeZone': 'Europe/Budapest',
              },
              'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=2'
              ],
              'attendees': [
                {'email': 'lpage@example.com'},
                {'email': 'sbrin@example.com'},
              ],
              'reminders': {
                'useDefault': false,
                'overrides': [
                  {'method': 'email', 'minutes': 24 * 60},
                  {'method': 'popup', 'minutes': 10},
                ],
              },
            }; */
  /* 
            addEvent(event); */
            /* const evs = await listEvents();
            console.log(evs); */
  
            res.status(200).send(szabadIdopontok);
          } else {
            res.status(500).send({ err: err });
          }
        });
      } else {
        const getnyitavtartasSql = `SELECT nyitvatartas FROM kapcsolatok;`;
          const getszolgaltatasSql = `SELECT (SUM(idotartam) + ${szolgaltatasok.length > 1 ? 15 : 10}) as total FROM szolgaltatasok WHERE id IN(${szolgaltatasok});`;
          const nyitva = await UseQuery(
            getnyitavtartasSql,
            "GET /api/idopontok"
          );
          const szolg = await UseQuery(
            getszolgaltatasSql,
            "GET /api/szolgaltatas"
          );
          const szabadIdopontok = [];
          if (nyitva && szolg) {
           
            let nyitvatartas = nyitva[0].nyitvatartas;
            nyitvatartas = typeof nyitvatartas === 'string' ? JSON.parse(nyitvatartas) : nyitvatartas;
            let total = parseInt(szolg[0].total, 10);

            const dayname = moment(nap).format("dddd");
            const capitalized = "is" + dayname;
            if (nyitvatartas[capitalized]) {
              const kezdo = nyitvatartas[(dayname + "").toLowerCase()].tol;
              const zaro = nyitvatartas[(dayname + "").toLowerCase()].ig;
              const h = parseInt(zaro.split(":")[0], 10);
              const m = parseInt(zaro.split(":")[1], 10);
              const start = moment(
                moment(nap).format("YYYY-MM-DD") + " " + kezdo
              ).format("YYYY-MM-DD HH:mm");
              const end = moment(new Date(nap).setHours(h, m, 0)).format(
                "YYYY-MM-DD HH:mm"
              );
              let loop = start;
              szabadIdopontok.push(moment(start).format("HH:mm"));
      
              while (
                moment(moment(loop).add(total, "minutes")).format(
                  "YYYY-MM-DD HH:mm"
                ) <= end
              ) {
                let newDate = moment(loop)
                  .add(total, "minutes")
                  .format("YYYY-MM-DD HH:mm");
                loop = newDate;
                if (
                  moment(moment(newDate).add(total, "minutes")).format(
                    "YYYY-MM-DD HH:mm"
                  ) <= end
                ) {
                  const formatted = moment(loop).format("HH:mm");
                  szabadIdopontok.push(formatted);
                }
              }

              res.status(200).send(szabadIdopontok)
            }
          }
      }
    } else {
      const sql = `SELECT * FROM idopontok;`;
      idopontok.query(sql, (err, result) => {
        if (!err) {
          res.status(200).send(result);
        } else {
          res.status(500).send({ err: err });
        }
      });
    }
  }
});

// IDOPONTOK END

export default router;

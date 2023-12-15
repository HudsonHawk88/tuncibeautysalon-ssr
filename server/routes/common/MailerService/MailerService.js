import nodemailer from 'nodemailer';
import express from 'express';
import { mailUrl } from '../../../common/QueryHelpers';
const transporter = nodemailer.createTransport(mailUrl);
const router = express.Router();

// MAIL START

router.post('/', (req, res) => {
    const emailObj = JSON.parse(JSON.stringify(req.body));

    transporter.sendMail(
        {
            from: `${emailObj.nev} <${emailObj.email}>`, // sender address
            to: process.env.foEmail, // list of receivers
            subject: `${emailObj.statusz + ' ingatlan'}`, // Subject line
            html: `<b>Kedves Berki Mónika!</b><br><br>
            Az én nevem: ${emailObj.nev}.<br>
            Telefonszámom: ${emailObj.telefon}.<br><br>
            ${emailObj.statusz} ingatlanom van! Kérem vegye fel velem a kapcsolatot!<br><br>
            Tisztelettel:<br>
            ${emailObj.nev}<br>` // html body
        },
        (err) => {
            if (!err) {
                res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
            } else {
                res.status(500).send({ err: err, msg: 'Email küldése sikertelen!' });
            }
        }
    );
});

router.post('/ingatlanerd', (req, res) => {
    const emailObj = req.body;

    const message = {
        from: `${emailObj.nev} <${emailObj.email}>`, // sender address
        to: `${emailObj.toEmail}`, // list of receivers
        subject: `Érdeklődés a ${emailObj.refId} referenciaszámú ingatlanról`, // Subject line
        html: `<b>Kedves ${emailObj.feladoNev}!</b><br><br>
        Az én nevem: ${emailObj.nev}.<br>
        Telefonszámom: ${emailObj.telefon}.<br><br>
        Az alábbi kérdésem lenne az ingatlannal kapcsolatban:<br><br>
        ${emailObj.uzenet}<br><br>
        Tisztelettel:<br>${emailObj.nev}<br>` // html body
    };
    console.log(message);
    transporter.sendMail(message, (err, info) => {
        if (!err) {
            res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
        } else {
            res.status(500).send({ error: err, info: info, err: 'Email küldése sikertelen!' });
        }
    });
});

router.post('/jobApply', (req, res) => {
    const emailObj = JSON.parse(JSON.stringify(req.body));
    if (emailObj.oneletrajz) {
        transporter.sendMail(
            {
                from: `${emailObj.nev} <${emailObj.email}>`, // sender address
                to: process.env.foEmail, // list of receivers
                subject: `Jelentkezés állásra`, // Subject line
                attachments: [{ filename: emailObj.oneletrajz.filename, content: emailObj.oneletrajz.data.split('base64,')[1], encoding: 'base64' }],
                html: `<b>Kedves ${process.env.foNev}!</b><br><br>
                Az én nevem: ${emailObj.nev}.<br>
                Telefonszámom: ${emailObj.telefon}.<br><br>
                Ezúton jelentkeznék az Ön által meghirdetett állásra. Önéletrajzomat csatoltam.<br><br>
                Tisztelettel:<br>
                ${emailObj.nev}<br>` // html body
            },
            (err) => {
                if (!err) {
                    res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
                } else {
                    res.status(500).send({ error: err, err: 'Email küldése sikertelen!' });
                }
            }
        );
    } else {
        transporter.sendMail(
            {
                from: `${emailObj.nev} <${emailObj.email}>`, // sender address
                to: process.env.foEmail, // list of receivers
                subject: `Jelentkezés állásra`, // Subject line
                html: `<b>Kedves ${process.env.foNev}!</b><br><br>
                Az én nevem: ${emailObj.nev}.<br>
                Telefonszámom: ${emailObj.telefon}.<br><br>
                Ezúton jelentkeznék az Ön által meghirdetett állásra. Önéletrajzomat nem csatoltam.<br><br>
                Tisztelettel:<br>
                ${emailObj.nev}<br>` // html body
            },
            (err) => {
                if (!err) {
                    res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
                } else {
                    res.status(500).send({ error: err, err: 'Email küldése sikertelen!' });
                }
            }
        );
    }
});

router.post('/sendfromcontact', (req, res) => {
    const emailObj = JSON.parse(JSON.stringify(req.body));
    transporter.sendMail(
        {
            from: `${emailObj.nev} <${emailObj.email}>`, // sender address
            to: process.env.foEmail, // list of receivers
            subject: `Érdeklődés`, // Subject line
            html: `<b>Kedves ${process.env.foNev}!</b><br><br>
            Az én nevem: ${emailObj.nev}.<br>
            Telefonszámom: ${emailObj.telefon}.<br><br>
            A megkeresésem oka: ${emailObj.ok}:<br><br>
            ${emailObj.uzenet}<br><br>
            Tisztelettel:<br>
            ${emailObj.nev}<br>` // html body
        },
        (err) => {
            if (!err) {
                res.status(200).send({ msg: 'E-mail sikeresen elküldve!' });
            } else {
                res.status(500).send({ error: err, err: 'Email küldése sikertelen!' });
            }
        }
    );
});

// MAIL END

export default router;

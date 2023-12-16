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


// MAIL END

export default router;

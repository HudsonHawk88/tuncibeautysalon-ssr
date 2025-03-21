/* eslint-disable no-eval */
// DEPENDENCIES
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import cookieParser from 'cookie-parser';
import publicIdopontfoglaloServices from './routes/PublicRoutes/Idopontfoglalo/PublicIdopontfoglalo.js';
import adminIdopontfoglaloServices from './routes/AdminRoutes/AdminIdopontok/AdminIdopontokServices.js';
import adminSzabadnapokServices from './routes/AdminRoutes/AdminSzabadnapokServices/AdminSzabadnapokServices.js';
import publicSzabadnapokServices from './routes/PublicRoutes/Szabadnapok/PublicSzabadnapokServices.js';
import adminAuthService from './routes/AdminRoutes/AdminAuthServices/AdminAuthServices.js';
import adminusersServices from './routes/AdminRoutes/AdminUsersServices/AdminUsersServices.js';
import adminrolesServices from './routes/AdminRoutes/AdminRoles/AdminRoles.js';
import adminBioServices from './routes/AdminRoutes/AdminBioServices/AdminBioServices.js';
import publicBioServices from './routes/PublicRoutes/Bio/PublicBioServices.js';
import adminSzolgaltatasokServices from './routes/AdminRoutes/AdminSzolgaltatasok/AdminSzolgaltatasokServices.js';
import publicSzolgaltatasokServices from './routes/PublicRoutes/Szolgaltatasok/PublicSzolgaltatasok.js';
import adminSzolgaltatasKategoriaServices from './routes/AdminRoutes/AdminSzolgaltatasKategoriakServices/AdminSzolgaltatasKategoriakServices.js';
import publicSzolgaltatasKategoriaServices from './routes/PublicRoutes/SzolgaltatasKategoriak/PublicSzolgaltatasKategoriak.js';
import adminGalleryServices from './routes/AdminRoutes/AdminGalleryServices/AdminGalleryServices.js';
import publicGaleriaServices from './routes/PublicRoutes/Galeria/PublicGaleriaServices.js';
import adminKapcsolatokServices from './routes/AdminRoutes/AdminKapcsolatServices/AdminkapcsolatServices.js';
import publicKapcsolatokServices from './routes/PublicRoutes/Kapcsolatok/PublicKapcsolatok.js';
import adminGdpr from './routes/AdminRoutes/AdminGDPR/AdminGDPRServices.js';
import publicGdpr from './routes/PublicRoutes/GDPR/publicGDPRServices.js';
import adminHirlevelService from './routes/AdminRoutes/AdminHirlevelServices/AdminHirlevelServices.js';
import adminFeliratkozasServices from './routes/AdminRoutes/AdminFeliratkozasServices/AdminFeliratkozasServices.js';
import publicFeliratkozasServices from './routes/PublicRoutes/Feliratkozas/PublicFeliratkozasServices.js';
import orszagokService from './routes/common/OrszagokService/OrszagokService.js';
import telepulesekService from './routes/common/TelepulesekService/TelepulesekService.js';
import mailerService from './routes/common/MailerService/MailerService.js';
import OptionServices from './routes/common/OptionsService/OptionsServices.js';
import RecaptchaServices from './routes/common/Recaptcha/RecaptchaService.js';
import serverRender from './common/serverRender.js';

// VARIABLES

import routes from './routes.json';

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const app = express();
const host = process.env.HOST ? process.env.HOST : '127.0.0.1';
const port = process.env.PORT ? process.env.PORT : 3000;
const server = http.createServer(app);

app.use(
    express.json({
        limit: '150mb'
    })
);
app.use(cookieParser());
app.use(routes, (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ['http://192.168.11.167:3000', 'http://localhost:3000', 'http://192.168.1.76:5500', 'http://inftechsol.hu:5500', 'http://inftechsol.hu:8080']);
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    return next();
});

app.options('*', cors());
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const actionIndex = (req, res, next) => {
    serverRender()(req, res, next);
};

//in a general route, you check all incoming traffic for your preferred crawlers through the user-agent
app.use(function (req, res, next) {
    var ua = req.headers['user-agent'];
    if (/^(facebookexternalhit|twitterbot)/gi.test(ua)) {
        actionIndex(req, res, next);
    } else {
        next();
    }
});
/* app.get('/public/static', (req, res, next) => {}); */
app.get('/admin', actionIndex);
app.get('/', actionIndex);
app.use(express.static('build/public'));

app.use(['/api/admin'], adminAuthService);
// ADMINROLES
app.use(['/api/admin/roles'], adminrolesServices);
// ADMINUSERS
app.use(['/api/admin/users'], adminusersServices);
// ADMINBIO
app.use(['/api/admin/bio'], adminBioServices);
// PUBLICBIO
app.use(['/api/bio'], publicBioServices);
// ADMINSZOLGALTATASOK
app.use(['/api/admin/szolgaltatasok'], adminSzolgaltatasokServices);
// PUBLICSZOLGALTATASOK
app.use(['/api/szolgaltatasok'], publicSzolgaltatasokServices);
// ADMINSZOLGALTATASKATEGORIA
app.use(['/api/admin/szolgaltataskategoria'], adminSzolgaltatasKategoriaServices);
// PUBLICSZOLGALTATASKATEGORIA
app.use(['/api/szolgaltataskategoria'], publicSzolgaltatasKategoriaServices);
// ADMINGALERIA
app.use(['/api/admin/galeria'], adminGalleryServices);
// PUBLICGALERIA
app.use(['/api/galeria'], publicGaleriaServices);
// ADMINKAPCSOLATOK
app.use(['/api/admin/kapcsolat'], adminKapcsolatokServices);
// PUBLICKAPCSOLATOK
app.use(['/api/kapcsolat'], publicKapcsolatokServices);
// GDPR
app.use(['/api/admin/adatkezeles'], adminGdpr);
app.use(['/api/adatkezeles'], publicGdpr);
// ORSZAGOK
app.use(['/api/orszagok'], orszagokService);
// TELEPULESEK
app.use(['/api/telepulesek'], telepulesekService);
// MAIL
app.use(['/api/contactmail'], mailerService);
// OPTIONS
app.use(['/api/options'], OptionServices);
// RECAPTCHA
app.use(['/api/recaptcha'], RecaptchaServices);
// IDOPONTOK
app.use(['/api/idopontok'], publicIdopontfoglaloServices)
app.use(['/api/admin/idopontok'], adminIdopontfoglaloServices)
// SZABADNAPOK
app.use(['/api/szabadnapok'], publicSzabadnapokServices)
app.use(['/api/admin/szabadnapok'], adminSzabadnapokServices)
// HIRLEVEL
// app.use(['/api/hirlevel'], publicSzabadnapokServices)
app.use(['/api/admin/hirlevel'], adminHirlevelService)
// FELIRATKOZAS
app.use(['/api/feliratkozas'], publicFeliratkozasServices)
app.use(['/api/admin/feliratkozas'], adminFeliratkozasServices)

app.get('*', actionIndex);

server.listen(port, host);

console.log(`Server running at https://${host}:${port}/`);

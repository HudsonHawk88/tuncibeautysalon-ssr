import Login from '../src/views/Pages/Login/Login.js';
import Fooldal from '../src/views/Public/Fooldal/Fooldal.js';
import Idopontfoglalo from '../src/views/Public/Idopontfoglalo/Idopontfoglalo.js';
import Szolgaltatas from '../src/views/Public/Szolgaltatasok/Szolgaltatas.js'
import Preisliste from '../src/views/Public/Szolgaltatasok/Preisliste.js';
import Kapcsolat from '../src/views/Public/Kapcsolat/Kapcsolat.js';
import SikeresFoglalas from '../src/views/Public/Idopontfoglalo/SikeresFoglalas.js';
import FoglalasTorles from '../src/views/Public/Idopontfoglalo/FoglalasTorles.js';
import Adatkezeles from '../src/views/Public/GDPR/Adatkezeles.js';
import Galeria from '../src/views/Public/Galeria/Galeria.js'

const PublicRoutes = [
    { path: '/', element: Fooldal },
    { path: '/login', element: Login },
    { path: '/service/:id', element: Szolgaltatas },
    { path: '/preisliste', element: Preisliste },
    { path: '/terminbuchen', element: Idopontfoglalo },
    { path: '/terminstreichung', element: FoglalasTorles },
    { path: '/erfolgreich', element: SikeresFoglalas },
    { path: '/datenverarbeitung', element: Adatkezeles },
    { path: '/galerie', element: Galeria },
    { path: '/kontakt', element: Kapcsolat }
/*     { path: '/kosmetik', element: Ingatlan },
    { path: '/manikure', element: Ingatlanok },
    { path: '/falschewimpern', element: Adatkezeles },
    { path: '/makeup', element: Rolunk },
    { path: '/gallery', element: Ertekesito },
    { path: '/kontakt', element: Ertekesito }, */
];

export default PublicRoutes;

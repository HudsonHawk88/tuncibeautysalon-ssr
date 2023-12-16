import Login from '../src/views/Pages/Login/Login';
import Fooldal from '../src/views/Public/Fooldal/Fooldal';
import Idopontfoglalo from '../src/views/Public/Idopontfoglalo/Idopontfoglalo';
import Szolgaltatasok from '../src/views/Public/Szolgaltatasok/Szolgaltatasok';
import Kapcsolat from '../src/views/Public/Kapcsolat/Kapcsolat';
import SikeresFoglalas from '../src/views/Public/Idopontfoglalo/SikeresFoglalas';
import FoglalasTorles from '../src/views/Public/Idopontfoglalo/FoglalasTorles';

const PublicRoutes = [
    { path: '/', element: Fooldal },
    { path: '/login', element: Login },
    { path: '/dienstleistungen', element: Szolgaltatasok },
    { path: '/terminbuchen', element: Idopontfoglalo },
    { path: '/terminstreichung', element: FoglalasTorles },
    { path: '/erfolgreich', element: SikeresFoglalas },
    { path: '/kontakt', element: Kapcsolat }
/*     { path: '/kosmetik', element: Ingatlan },
    { path: '/manikure', element: Ingatlanok },
    { path: '/falschewimpern', element: Adatkezeles },
    { path: '/makeup', element: Rolunk },
    { path: '/gallery', element: Ertekesito },
    { path: '/kontakt', element: Ertekesito }, */
];

export default PublicRoutes;

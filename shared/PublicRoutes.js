import Login from '../src/views/Pages/Login/Login';
import Fooldal from '../src/views/Public/Fooldal/Fooldal';
import Idopontfoglalo from '../src/views/Public/Idopontfoglalo/Idopontfoglalo';
import Szolgaltatasok from '../src/views/Public/Szolgaltatasok/Szolgaltatasok';
import Kapcsolat from '../src/views/Public/Kapcsolat/Kapcsolat';

const PublicRoutes = [
    { path: '/', element: Fooldal },
    { path: '/login', element: Login },
    { path: '/dienstleistungen', element: Szolgaltatasok },
    { path: '/terminbuchen', element: Idopontfoglalo },
    { path: '/kontakt', element: Kapcsolat }
/*     { path: '/kosmetik', element: Ingatlan },
    { path: '/manikure', element: Ingatlanok },
    { path: '/falschewimpern', element: Adatkezeles },
    { path: '/makeup', element: Rolunk },
    { path: '/gallery', element: Ertekesito },
    { path: '/kontakt', element: Ertekesito }, */
];

export default PublicRoutes;

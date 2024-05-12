import Fooldal from '../src/views/Admin/Fooldal/Fooldal.js';
import Jogosultsagok from '../src/views/Admin/Jogosultsagok/Jogosultsagok.js';
import AdminUsers from '../src/views/Admin/Adminusers/AdminUsers.js';
import AdminBio from '../src/views/Admin/Bio/AdminBio.js';
import AdminIdopontok from '../src/views/Admin/Idopontok/Idopontok.js'
import Szabadnapok from '../src/views/Admin/Szabadnapok/Szabadnapok.js'
import SzolgaltatasKategoriak from '../src/views/Admin/SzolgaltatasKategoriak/SzolgaltatasKategoriak.js';
import Szolgaltatasok from '../src/views/Admin/Szolgaltatasok/Szolgaltatasok.js';
import Gdpr from '../src/views/Admin/GDPR/Gdpr.js';
import Kapcsolat from '../src/views/Admin/Kapcsolat/Kapcsolat.js';
import Galeria from '../src/views/Admin/Galeria/Galeria.js'

const AdminRoutes = [
    { path: '/admin', element: Fooldal },
    { path: '/admin/felhasznalok', element: AdminUsers },
    { path: '/admin/jogosultsagok', element: Jogosultsagok },
    { path: '/admin/bio', element: AdminBio },
    { path: '/admin/idopontok', element: AdminIdopontok },
    { path: '/admin/szabadnapok', element: Szabadnapok },
    { path: '/admin/szolgaltataskategoriak', element: SzolgaltatasKategoriak },
    { path: '/admin/szolgaltatasok', element: Szolgaltatasok },
    { path: '/admin/kapcsolat', element: Kapcsolat },
    { path: '/admin/adatkezeles', element: Gdpr },
    { path: '/admin/galeria', element: Galeria },
];

export default AdminRoutes;

import Fooldal from '../src/views/Admin/Fooldal/Fooldal';
import Jogosultsagok from '../src/views/Admin/Jogosultsagok/Jogosultsagok';
import AdminUsers from '../src/views/Admin/Adminusers/AdminUsers';
import SzolgaltatasKategoriak from '../src/views/Admin/SzolgaltatasKategoriak/SzolgaltatasKategoriak';
import Szolgaltatasok from '../src/views/Admin/Szolgaltatasok/Szolgaltatasok';
import Gdpr from '../src/views/Admin/GDPR/Gdpr';
import Kapcsolat from '../src/views/Admin/Kapcsolat/Kapcsolat';

const AdminRoutes = [
    { path: '/admin', element: Fooldal },
    { path: '/admin/felhasznalok', element: AdminUsers },
    { path: '/admin/jogosultsagok', element: Jogosultsagok },
    { path: '/admin/szolgaltataskategoriak', element: SzolgaltatasKategoriak },
    { path: '/admin/szolgaltatasok', element: Szolgaltatasok },
    { path: '/admin/kapcsolat', element: Kapcsolat },
    { path: '/admin/adatkezeles', element: Gdpr },
];

export default AdminRoutes;

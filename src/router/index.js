import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path){

    return () => import(`../components/${path}.vue`);

}

const routes = [
    
    {
        path: '/',
        meta: { title: 'Atma Jogja Rental'},
        component: importComponent('DashboardLayout'),
        children: [
            //dashboard
            {
            path: '/',
            name: 'Home',
            meta: { title: 'Home', layout: "default" },
            component: importComponent('HomeView'),
            },
            //Login
            {
                path: '/login',
                name: 'Login',
                meta: { title: 'Login' },
                component: importComponent('Guest/LoginView'),
            },

            //Register
            {
                path: '/register',
                name: 'Register',
                meta: { title: 'Register' },
                component: importComponent('Guest/RegisterView'),
            },

            //Profile
            {
                path: '/profile',
                name: 'Profile',
                meta: { title: 'Profile' },
                component: importComponent('ProfileView'),
            },

            //Mitra
            {
                path: '/mitras',
                name: 'Mitra',
                meta: { title: 'Mitra Mobil' },
                component: importComponent('Employee/MitraView'),
            },

            //Pegawai
            {
                path: '/employees',
                name: 'Employees List',
                meta: { title: 'List Pegawai' },
                component: importComponent('Employee/EmployeeView'),
            },

            //Shift
            {
                path: '/shifts',
                name: 'Shift',
                meta: { title: 'Shift Pegawai' },
                component: importComponent('Employee/ShiftView'),
            },

            //Promo
            {
                path: '/promos',
                name: 'Promo',
                meta: { title: 'List Promo' },
                component: importComponent('Employee/PromoView'),
            },
            
            //Driver
            {
                path: '/drivers',
                name: 'Drivers List',
                meta: { title: 'List Driver' },
                component: importComponent('Employee/DriverView'),
            },

            //Customer
            {
                path: '/customers',
                name: 'Customers List',
                meta: { title: 'List Customer' },
                component: importComponent('Employee/CustomerView'),
            },

            //Cars
            {
                path: '/cars',
                name: 'Cars List',
                meta: { title: 'List Mobil' },
                component: importComponent('Employee/CarsListView'),
            },

            //Reservations
            {
                path: '/transactions',
                name: 'Transactions',
                meta: { title: 'List Tranasaksi' },
                component: importComponent('Employee/TransactionListView'),
            },

            //DetailShift
            {
                path: '/schedule',
                name: 'Schedule',
                meta: { title: 'Jadwal Pegawai' },
                component: importComponent('Employee/DetailShiftView'),
            },

            //Catalog
            {
                path: '/catalog',
                name: 'Catalog',
                meta: { title: 'Catalog Mobil' },
                component: importComponent('Customer/CatalogView'),
            },

            //History
            {
                path: '/history',
                name: 'History',
                meta: { title: 'Riwayat' },
                component: importComponent('Customer/HistoryView'),
            },
        ],
    },
    {
      path: '*',
      redirect: '/'
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to,from,next) => {
    document.title = to.meta.title;

    if(to.name == "Cars List" && localStorage.getItem("auth") == null ||
        to.name == "Customers List" && localStorage.getItem("auth") == null ||
        to.name == "Schedule" && localStorage.getItem("auth") == null ||
        to.name == "Drivers List" && localStorage.getItem("auth") == null ||
        to.name == "Employees List" && localStorage.getItem("auth") == null ||
        to.name == "Mitra" && localStorage.getItem("auth") == null ||
        to.name == "Promo" && localStorage.getItem("auth") == null ||
        to.name == "Shift" && localStorage.getItem("auth") == null ||
        to.name == "Transactions" && localStorage.getItem("auth") == null ||
        to.name == "Catalog" && localStorage.getItem("auth") == null ||
        to.name == "History" && localStorage.getItem("auth") == null ||
        to.name == "Profile" && localStorage.getItem("auth") == null)
        {
            next({name: "Home"});
        }

    if(to.name == "Customer List" && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Customer Services' ||
        to.name == "Transactions" && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Customer Services')
        {
            next({name: "Home"});
        }

    if(to.name == "Employees List" && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Admin' ||
        to.name == "Cars List" && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Admin'||
        to.name == "Mitra" && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Admin' ||
        to.name == 'Drivers List' && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Admin')
        {
            next({name: "Home"});
        }
    
    if(to.name == "Shift" && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Manager'  ||
        to.name == "Schedule" && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Manager' ||
        to.name == "Promo" && localStorage.getItem("auth") != 'employee' && localStorage.getItem("role") != 'Manager')
        {
            next({name: "Home"});
        }
    
    if(to.name == "Catalog" && localStorage.getItem("auth") != 'customer' ||
        to.name == "History" && localStorage.getItem("auth") != 'customer')
        {
            next({name: "Home"});
        }
    
    if(to.name == "Login" && localStorage.getItem("auth") != null  ||
        to.name == "Register" && localStorage.getItem("auth") != null)
        {
            next({name: "Home"});
        }

    next();
});

export default router
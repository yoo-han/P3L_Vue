<template>
	<div class="dashboard">
		<v-toolbar class="fixed-bar px-10" light>
			<v-toolbar-title id="nav">
				<router-link :to="{ path: '/' }" tag="span" style="cursor: pointer">
				{{ appTitle }}
				</router-link>
				<v-app-bar-nav-icon>
				<router-link :to="{ path: '/' }">
					<v-img src="./logoajr.png" align-center center height="50px" width="50px"/>
				</router-link>
				</v-app-bar-nav-icon>
			</v-toolbar-title>
		<v-spacer></v-spacer>
		<div v-if="auth == 'customer'">
			<v-toolbar-items class="hidden-sm-and-down">  
					<v-btn plain :ripple="false" v-for="item in menuItemsCustomer" :key="item.icon" :to="item.path" id="nav">
					<v-icon left dark>{{ item.icon }}</v-icon>
					{{ item.title }}
					</v-btn>
					<v-btn plain :ripple="false" id="nav" color="red darken-4" @click="logout">
					<v-icon left center dark large>mdi-logout-variant</v-icon>
					</v-btn>
			</v-toolbar-items>
			<v-menu>
				<template v-slot:activator="{ on, attrs }">
					<v-app-bar-nav-icon icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
						<v-icon>mdi-menu</v-icon>
					</v-app-bar-nav-icon>
				</template>
				<v-list>
					<v-list-item v-for="item in menuItemsCustomer" :key="item.icon" :to="item.path" id="nav">
						<v-list-item-content>
						<v-icon center>{{ item.icon }}</v-icon>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item @click="logout" id="nav">
						<v-list-item-content>
							<v-icon color="red darken-4">mdi-logout-variant</v-icon>
							<v-list-item-title>Keluar</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
		<div v-else-if="auth == 'employee' && role == 'Manager'">
			<v-toolbar-items class="hidden-sm-and-down">  
					<v-btn plain :ripple="false" v-for="item in menuItemsEmployeeManager" :key="item.icon" :to="item.path" id="nav">
					<v-icon left dark>{{ item.icon }}</v-icon>
					{{ item.title }}
					</v-btn>
					<v-btn plain :ripple="false" id="nav" color="red darken-4" @click="logout">
					<v-icon left center dark large>mdi-logout-variant</v-icon>
					</v-btn>
			</v-toolbar-items>
			<v-menu>
				<template v-slot:activator="{ on, attrs }">
					<v-app-bar-nav-icon icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
						<v-icon>mdi-menu</v-icon>
					</v-app-bar-nav-icon>
				</template>
				<v-list>
					<v-list-item v-for="item in menuItemsEmployeeManager" :key="item.icon" :to="item.path" id="nav">
						<v-list-item-content>
						<v-icon center>{{ item.icon }}</v-icon>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item @click="logout" id="nav">
						<v-list-item-content>
							<v-icon color="red darken-4">mdi-logout-variant</v-icon>
							<v-list-item-title>Keluar</v-list-item-title>
						</v-list-item-content>
					</v-list-item>   
				</v-list>
			</v-menu>
		</div>
		<div v-else-if="auth == 'employee' && role == 'Admin'">
			<v-toolbar-items class="hidden-sm-and-down">  
					<v-btn plain :ripple="false" v-for="item in menuItemsEmployeeAdmin" :key="item.icon" :to="item.path" id="nav">
					<v-icon left dark>{{ item.icon }}</v-icon>
					{{ item.title }}
					</v-btn>
					<v-btn plain :ripple="false" id="nav" color="red darken-4" @click="logout">
					<v-icon left center dark large>mdi-logout-variant</v-icon>
					</v-btn>
			</v-toolbar-items>
			<v-menu>
				<template v-slot:activator="{ on, attrs }">
					<v-app-bar-nav-icon icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
						<v-icon>mdi-menu</v-icon>
					</v-app-bar-nav-icon>
				</template>
				<v-list>
					<v-list-item v-for="item in menuItemsEmployeeAdmin" :key="item.icon" :to="item.path" id="nav">
						<v-list-item-content>
						<v-icon center>{{ item.icon }}</v-icon>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item> 
					<v-list-item @click="logout" id="nav">
						<v-list-item-content>
							<v-icon color="red darken-4">mdi-logout-variant</v-icon>
							<v-list-item-title>Keluar</v-list-item-title>
						</v-list-item-content>
					</v-list-item>  
				</v-list>
			</v-menu>
		</div>
		<div v-else-if="auth == 'employee' && role == 'Customer Service'">
			<v-toolbar-items class="hidden-sm-and-down">  
					<v-btn plain :ripple="false" v-for="item in menuItemsEmployeeCS" :key="item.icon" :to="item.path" id="nav">
					<v-icon left dark>{{ item.icon }}</v-icon>
					{{ item.title }}
					</v-btn>
					<v-btn plain :ripple="false" id="nav" color="red darken-4" @click="logout">
					<v-icon left center dark large>mdi-logout-variant</v-icon>
					</v-btn>
			</v-toolbar-items>
			<v-menu>
				<template v-slot:activator="{ on, attrs }">
					<v-app-bar-nav-icon icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
						<v-icon>mdi-menu</v-icon>
					</v-app-bar-nav-icon>
				</template>
				<v-list>
					<v-list-item v-for="item in menuItemsEmployeeCS" :key="item.icon" :to="item.path" id="nav">
						<v-list-item-content>
						<v-icon center>{{ item.icon }}</v-icon>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item @click="logout" id="nav">
						<v-list-item-content>
							<v-icon color="red darken-4">mdi-logout-variant</v-icon>
							<v-list-item-title>Keluar</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
		<div v-else>
			<v-toolbar-items class="hidden-sm-and-down">  
					<v-btn plain :ripple="false" v-for="item in menuItemsGuest" :key="item.icon" :to="item.path" id="nav">
					<v-icon left dark>{{ item.icon }}</v-icon>
					{{ item.title }}
					</v-btn>
			</v-toolbar-items>
			<v-menu>
				<template v-slot:activator="{ on, attrs }">
					<v-app-bar-nav-icon icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
						<v-icon>mdi-menu</v-icon>
					</v-app-bar-nav-icon>
				</template>
				<v-list>
					<v-list-item v-for="item in menuItemsGuest" :key="item.icon" :to="item.path" id="nav">
						<v-list-item-content>
						<v-icon center>{{ item.icon }}</v-icon>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>   
				</v-list>
			</v-menu>
		</div>
		</v-toolbar>
		<div class="fullheight">
		<router-view></router-view>
		</div>
	</div>
</template>


<style scoped>
	.fullheight {
		min-height: 100vh !important;
	}
	.router {
		text-decoration: none;
		color: black;
	}
	.fixed-bar {
	position: sticky;
	position: -webkit-sticky; /* for Safari */
	top: 0;
	z-index: 2;
	}

	#nav {
	font-weight: bold;
	color: #251e3e;
	}

	#nav:hover,
	nav.router-link-active,
	nav.router-link-exact-active{
	color: #851e3e;
	}
</style>

<script>
export default {
	name: "Home",
	data() {
		return {
			appTitle: 'AtmaJogjaRental',
			menuItemsGuest: [
				{ title: "Home", path: "/", icon: 'mdi-home'},
				{ title: "Login", path: "/login", icon: 'mdi-account-key'},
				{ title: "Register", path: "/register", icon: 'mdi-account-plus'},
			],
			menuItemsCustomer: [
				{ title: "Home", path: "/", icon: 'mdi-home'},
				{ title: "Catalog", path: "/catalog", icon: 'mdi-car'},
				{ title: "History", path: "/history", icon: 'mdi-history'},
				{ title: "Profile", path: "/profile", icon: 'mdi-account'},
			],
			menuItemsEmployeeManager: [
				{ title: "Home", path: "/", icon: 'mdi-home'},
				{ title: "Promo", path: "/promos", icon: 'mdi-ticket-percent'},
				{ title: "Shift", path: "/shifts", icon: 'mdi-timetable'},
				{ title: "Schedule", path: "/schedule", icon: 'mdi-calendar-clock'},
				{ title: "Profile", path: "/profile", icon: 'mdi-account'},
			],
			menuItemsEmployeeAdmin: [
				{ title: "Home", path: "/", icon: 'mdi-home'},
				{ title: "Car", path: "/cars", icon: 'mdi-car'},
				{ title: "Employee", path: "/employees", icon: 'mdi-account-multiple'},
				{ title: "Driver", path: "/drivers", icon: 'mdi-account-multiple-outline'},
				{ title: "Mitra", path: "/mitras", icon: 'mdi-book-open-variant'},
				{ title: "Profile", path: "/profile", icon: 'mdi-account'},
			],
			menuItemsEmployeeCS: [
				{ title: "Home", path: "/", icon: 'mdi-home'},
				{ title: "Customer", path: "/customers", icon: 'mdi-account-multiple'},
				{ title: "Transaction", path: "/transactions", icon: 'mdi-car'},
				{ title: "Profile", path: "/profile", icon: 'mdi-account'},
			],
			auth:null,
			role:null,
		};
	},
	methods: {
		menuItems() {
			return this.menu;
		},
		
		logout(){
			localStorage.clear();
			location.href="/login";
		},
	},
	mounted(){
		if(localStorage.getItem('auth') != null){
			this.auth = localStorage.getItem('auth');
			if(localStorage.getItem('auth') == "employee"){
				this.role = localStorage.getItem('role');
			}
		}else{
			this.auth = '';
			this.role = '';
		}
    }
};
</script>

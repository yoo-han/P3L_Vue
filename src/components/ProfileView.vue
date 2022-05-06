<template>
    <v-main class="mb-10 pb-10 page">
        <v-row>
            <v-col cols="1" style="background:#251e3e" />
            <v-col cols="10">
                <div v-if="auth == 'customer'">
                <v-card class="mx-auto" height="300" width="max" tile>
                    <v-img height="100%" src="https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg">
                    </v-img>
                </v-card>
                <v-row>
                    <v-col cols=5 align="end" style="margin-top: -80px">
                        <v-avatar size="200" color="grey" outlined>
                            <v-icon size="170" color="white">mdi-account</v-icon>
                        </v-avatar>
                        <p class="newText" style="font-size:13pt; margin-top:80px">
                            <v-icon>mdi-email</v-icon>{{user.email_customer}}
                        </p>
                        <p class="newText" style="font-size:13pt; margin-top:-10px">
                            <v-icon>mdi-phone</v-icon>{{user.no_telp_customer}}
                        </p>
                        <v-btn rounded class="white--text" style="background-color:#251e3e" @click="editPasswordHandler"
                            :class=" { 'white--text' : valid, disabled: !valid }">Ubah Password</v-btn>
                    </v-col>
                    <v-col cols=7 align="start" justify="start" class="px-10">
                        <p class="newText" style="font-size:20pt; font-weight: bold">Welcome,</p>
                        <p class="newText" style="font-size:35pt; font-weight: bold; margin-top:-20px">
                            {{user.nama_customer}}<v-icon class="ms-3" color="green" alt="Verified">
                                mdi-checkbox-marked-circle</v-icon>
                        </p>
                        <p class="newText" style="font-size:20pt; font-weight: bold; margin-top:90px">Profile User
                            <v-btn small rounded style="background-color:#251e3e" @click="editProfileHandler">
                                <v-icon color="white">mdi-pencil</v-icon>
                            </v-btn>
                        </p>
                        <p>Nama</p>
                        <v-text-field placeholder="Nama" style="margin-top:-10px" v-model="user.nama_customer"
                            :rules="inputRules" disabled readonly></v-text-field>
                        <p>Email</p>
                        <v-text-field placeholder="Email" style="margin-top:-10px" v-model="user.email_customer"
                            :rules="inputRules" disabled readonly></v-text-field>
                        <p>Jenis Kelamin</p>
                        <v-text-field placeholder="Jenis Kelamin" style="margin-top:-10px"
                            v-model="user.jenis_kelamin_customer" :rules="inputRules" disabled readonly></v-text-field>
                        <p>Alamat</p>
                        <v-text-field placeholder="Alamat" style="margin-top:-10px" v-model="user.alamat_customer"
                            :rules="inputRules" disabled readonly></v-text-field>
                        <p>No. Telepon</p>
                        <v-text-field placeholder="No. Telepon" style="margin-top:-10px" v-model="user.no_telp_customer"
                            :rules="inputRules" disabled readonly></v-text-field>
                        <p>Tanggal Lahir</p>
                        <v-text-field type="date" style="margin-top:-10px" v-model="user.tanggal_lahir_customer"
                            :rules="inputRules" disabled readonly></v-text-field>
                    </v-col>
                </v-row>
                </div>
                <div v-if="auth == 'employee'">
                <v-card class="mx-auto" height="300" width="max" tile>
                    <v-img height="100%" src="https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg">
                    </v-img>
                </v-card>
                <v-row>
                    <v-col cols=5 align="end" style="margin-top: -80px">
                        <v-avatar size="200" color="grey" outlined>
                            <v-img height="100%" :src="$baseURL+'storage/'+user.foto_pegawai"></v-img>
                        </v-avatar>
                        <p class="newText" style="font-size:13pt; margin-top:80px">
                            <v-icon>mdi-email</v-icon>{{user.email_pegawai}}
                        </p>
                        <p class="newText" style="font-size:13pt; margin-top:-10px">
                            <v-icon>mdi-phone</v-icon>{{user.no_telp_pegawai}}
                        </p>
                        <v-btn rounded class="white--text" style="background-color:#251e3e" @click="editPasswordHandler"
                            :class=" { 'white--text' : valid, disabled: !valid }">Ubah Password</v-btn>
                    </v-col>
                    <v-col cols=7 align="start" justify="start" class="px-10">
                        <p class="newText" style="font-size:20pt; font-weight: bold">Welcome,</p>
                        <p class="newText" style="font-size:35pt; font-weight: bold; margin-top:-20px">
                            {{user.nama_pegawai}}<v-icon class="ms-3" color="green" alt="Verified">
                                mdi-checkbox-marked-circle</v-icon>
                        </p>
                        <p class="newText" style="font-size:20pt; font-weight: bold; margin-top:90px">Profile User
                            <v-btn small rounded style="background-color:#251e3e" @click="editProfileHandler">
                                <v-icon color="white">mdi-pencil</v-icon>
                            </v-btn>
                        </p>
                        <p>Nama</p>
                        <v-text-field placeholder="Nama" style="margin-top:-10px" v-model="user.nama_pegawai"
                            :rules="inputRules" disabled readonly></v-text-field>
                        <p>Email</p>
                        <v-text-field placeholder="Email" style="margin-top:-10px" v-model="user.email_pegawai"
                            :rules="inputRules" disabled readonly></v-text-field>
                        <p>Jenis Kelamin</p>
                        <v-text-field placeholder="Jenis Kelamin" style="margin-top:-10px"
                            v-model="user.jenis_kelamin_pegawai" :rules="inputRules" disabled readonly></v-text-field>
                        <p>Alamat</p>
                        <v-text-field placeholder="Alamat" style="margin-top:-10px" v-model="user.alamat_pegawai"
                            :rules="inputRules" disabled readonly></v-text-field>
                        <p>No. Telepon</p>
                        <v-text-field placeholder="No. Telepon" style="margin-top:-10px" v-model="user.no_telp_pegawai"
                            :rules="inputRules" disabled readonly></v-text-field>
                        <p>Tanggal Lahir</p>
                        <v-text-field type="date" style="margin-top:-10px" v-model="user.tanggal_lahir_pegawai"
                            :rules="inputRules" disabled readonly></v-text-field>
                    </v-col>
                </v-row>
                </div>
            </v-col>
            <v-col cols="1" style="background:#251e3e" />
        </v-row>

        <v-dialog v-model="dialogPassword" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Ubah Password</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field type="password" placeholder="Current Password" style="margin-top:-10px"
                        v-model="formPassword.current_password" :rules="inputRules"></v-text-field>
                    <v-text-field type="password" placeholder="New Password" style="margin-top:-10px"
                        v-model="formPassword.new_password" :rules="inputRules"></v-text-field>
                    <v-text-field type="password" placeholder="Repeat Password" style="margin-top:-10px"
                        v-model="formPassword.repeat_password" :rules="inputRules"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-4" text @click="cancelPassword"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="updatePassword"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogData" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Ubah Profile</span>
                </v-card-title>
                <v-card-text>
                    <div v-if="auth == 'customer'">
                    <v-text-field placeholder="Nama" label="Nama" style="margin-top:-10px"
                        v-model="formDataCustomer.nama_customer" :rules="inputRules"></v-text-field>
                    <v-text-field type="email" placeholder="Email" label="Email" style="margin-top:-10px"
                        v-model="formDataCustomer.email_customer" :rules="inputRules"></v-text-field>
                    <v-text-field placeholder="Alamat" label="Alamat" style="margin-top:-10px"
                        v-model="formDataCustomer.alamat_customer" :rules="inputRules"></v-text-field>
                    <v-text-field type="date" placeholder="Tanggal Lahir" label="Tanggal Lahir" style="margin-top:-10px"
                        v-model="formDataCustomer.tanggal_lahir_customer" :rules="inputRules"></v-text-field>
                    <v-select :items="jenisKelamin" v-model="formDataCustomer.jenis_kelamin_customer" label="Jenis Kelamin"
                        item-value="value" item-text="text" append-icon="mdi-gender-male-female" :rules="inputRules"
                        required></v-select>
                    <v-text-field placeholder="Nomor Telepon" label="Nomor Telepon" style="margin-top:-10px"
                        v-model="formDataCustomer.no_telp_customer" :rules="inputRules"></v-text-field>
                    </div>
                    <div v-if="auth == 'employee'">
                        <v-text-field placeholder="Nama" label="Nama" style="margin-top:-10px"
                        v-model="formDataPegawai.nama_pegawai" :rules="inputRules"></v-text-field>
                    <v-text-field type="email" placeholder="Email" label="Email" style="margin-top:-10px"
                        v-model="formDataPegawai.email_pegawai" :rules="inputRules"></v-text-field>
                    <v-text-field placeholder="Alamat" label="Alamat" style="margin-top:-10px"
                        v-model="formDataPegawai.alamat_pegawai" :rules="inputRules"></v-text-field>
                    <v-text-field type="date" placeholder="Tanggal Lahir" label="Tanggal Lahir" style="margin-top:-10px"
                        v-model="formDataPegawai.tanggal_lahir_pegawai" :rules="inputRules"></v-text-field>
                    <v-select :items="jenisKelamin" v-model="formDataPegawai.jenis_kelamin_pegawai" label="Jenis Kelamin"
                        item-value="value" item-text="text" append-icon="mdi-gender-male-female" :rules="inputRules"
                        required></v-select>
                    <v-text-field placeholder="Nomor Telepon" label="Nomor Telepon" style="margin-top:-10px"
                        v-model="formDataPegawai.no_telp_pegawai" :rules="inputRules"></v-text-field>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-4" text @click="cancelProfile"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="updateProfile"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom> {{ error_message }}</v-snackbar>
    </v-main>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Gothic+A1&family=Roboto&display=swap');

    .white--text {
        font-family: 'Roboto', sans-serif;
    }

    .newText {
        font-family: 'Roboto', sans-serif;
        color: #251e3e;
    }

    .v-text-field {
        width: 600px;
    }

    .page {
        margin-top: 0px;
        align-items: start;
        justify-content: center;
        height: 100vh;
    }
</style>

<script>
    export default {
        data() {
            return {
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                disabled: 0,
                valid: false,
                user: [],
                editId: '',
                dialogPassword: false,
                formPassword: {
                    current_password: '',
                    new_password: '',
                    repeat_password: '',
                },
                dialogData: false,
                formDataCustomer: {
                    nama_customer: '',
                    alamat_customer: '',
                    tanggal_lahir_customer: '',
                    jenis_kelamin_customer: '',
                    email_customer: '',
                    no_telp_customer: '',
                },
                formDataPegawai: {
                    nama_pegawai: '',
                    alamat_pegawai: '',
                    tanggal_lahir_pegawai: '',
                    jenis_kelamin_pegawai: '',
                    email_pegawai: '',
                    no_telp_pegawai: '',
                },
                inputRules: [
                    (v) => !!v || 'Masukkan data yang sesuai!',
                ],
                jenisKelamin: [{
                        value: "Laki-Laki",
                        text: "Laki-Laki"
                    },
                    {
                        value: "Perempuan",
                        text: "Perempuan"
                    },
                ],
                auth:'',
                role:''
            }

        },
        methods: {
            readData() {
                if(localStorage.getItem('auth') == 'customer'){
                    var url = this.$api + '/customer/' + localStorage.getItem('id_customer');
                    this.$http.get(url).then(response => {
                        this.user = response.data.data;
                    })
                }
                else {
                    var url = this.$api + '/pegawai/' + localStorage.getItem('id_employee');
                    this.$http.get(url).then(response => {
                        this.user = response.data.data;
                    })
                }
            },

            editPasswordHandler() {
                this.dialogPassword = true;
            },

            updatePassword() {
                let newData = {
                    current_password: this.formPassword.current_password,
                    new_password: this.formPassword.new_password,
                    repeat_password: this.formPassword.repeat_password,
                };

                if(this.auth == 'customer')
                var url = this.$api + '/ubahpassword/' + localStorage.getItem("id_customer");
                else
                var url = this.$api + '/ubahpasswordpegawai/' + localStorage.getItem("id_employee");
                this.load = true;
                this.$http.post(url, newData).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.cancelPassword();
                    this.readData();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            cancelPassword() {
                this.formPassword = {
                    current_password: null,
                    new_password: null,
                    repeat_password: null,
                };
                this.dialogPassword = false;
            },

            editProfileHandler() {
                if(this.auth == 'customer'){
                    this.formDataCustomer = {
                        nama_customer: this.user.nama_customer,
                        alamat_customer: this.user.alamat_customer,
                        tanggal_lahir_customer: this.user.tanggal_lahir_customer,
                        jenis_kelamin_customer: this.user.jenis_kelamin_customer,
                        email_customer: this.user.email_customer,
                        no_telp_customer: this.user.no_telp_customer
                    };
                }
                else {
                    this.formDataPegawai = {
                        nama_pegawai: this.user.nama_pegawai,
                        alamat_pegawai: this.user.alamat_pegawai,
                        tanggal_lahir_pegawai: this.user.tanggal_lahir_pegawai,
                        jenis_kelamin_pegawai: this.user.jenis_kelamin_pegawai,
                        email_pegawai: this.user.email_pegawai,
                        no_telp_pegawai: this.user.no_telp_pegawai
                    };
                }
                
                this.dialogData = true;
            },

            updateProfile() {
                if(this.auth == 'customer'){
                    var newData = {
                    nama_customer: this.formDataCustomer.nama_customer,
                    alamat_customer: this.formDataCustomer.alamat_customer,
                    tanggal_lahir_customer: this.formDataCustomer.tanggal_lahir_customer,
                    jenis_kelamin_customer: this.formDataCustomer.jenis_kelamin_customer,
                    email_customer: this.formDataCustomer.email_customer,
                    no_telp_customer: this.formDataCustomer.no_telp_customer,
                    };
                    var url = this.$api + '/customer/' + localStorage.getItem("id_customer");
                }
                else{
                    var newData = {
                    nama_pegawai: this.formDataPegawai.nama_pegawai,
                    alamat_pegawai: this.formDataPegawai.alamat_pegawai,
                    tanggal_lahir_pegawai: this.formDataPegawai.tanggal_lahir_pegawai,
                    jenis_kelamin_pegawai: this.formDataPegawai.jenis_kelamin_pegawai,
                    email_pegawai: this.formDataPegawai.email_pegawai,
                    no_telp_pegawai: this.formDataPegawai.no_telp_pegawai,
                    };
                    var url = this.$api + '/pegawai/' + localStorage.getItem("id_employee");
                }
                this.load = true;
                this.$http.post(url, newData).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.cancelProfile();
                    this.readData();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            cancelProfile() {
                this.formDataCustomer= {
                    nama_customer: '',
                    alamat_customer: '',
                    tanggal_lahir_customer: '',
                    jenis_kelamin_customer: '',
                    email_customer: '',
                    no_telp_customer: '',
                };
                this.formDataPegawai= {
                    nama_pegawai: '',
                    alamat_pegawai: '',
                    tanggal_lahir_pegawai: '',
                    jenis_kelamin_pegawai: '',
                    email_pegawai: '',
                    no_telp_pegawai: '',
                };
                this.dialogData = false;
            }
        },
        mounted() {
            this.readData();
            this.auth = localStorage.getItem('auth');
            if(localStorage.getItem('auth') == "employee")
				this.role = localStorage.getItem('role');
        }
    }
</script>
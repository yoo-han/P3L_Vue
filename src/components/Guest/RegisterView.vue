<template>
    <v-main class="register">
    <span class="bg"></span>
        <v-container fill-height>
            <v-layout>
                <v-flex xs12 sm12 md12 text-xs-center style="display:flex; justify-content:center">
                    <v-card max-width="auto" height="auto">
                        <v-card-title class="pt-10" style="justify-content:center">
                            <p class="subTitle">DAFTAR</p>
                        </v-card-title>
                        <v-card-text class="pt-8">
                            <v-row>
                            <v-col>
                                <v-img src="./login_register.jpg" width="700">
                                </v-img>
                            </v-col>
                            <v-col style="display:flex; align-items:center">
                                <v-card-text class="pt-4">
                                    <div class="px-9" justify-center align-center>
                                        <v-text-field label="Nama" v-model="form.nama_customer" :rules="inputRules" required></v-text-field>
                                        <v-text-field label="E-mail" v-model="form.email_customer" :rules="inputRules" required></v-text-field>
                                        <v-text-field label="Alamat" v-model="form.alamat_customer" :rules="inputRules" required></v-text-field>
                                        <v-text-field label="Tanggal Lahir" v-model="form.tanggal_lahir_customer" type="date" :rules="inputRules" required></v-text-field>
                                        <v-select :items="jenisKelamin" v-model="form.jenis_kelamin_customer" label="Jenis Kelamin" item-value="value" item-text="text" append-icon="mdi-gender-male-female" :rules="inputRules" required></v-select>
                                        <v-text-field label="Nomor Telepon" v-model="form.no_telp_customer" :rules="inputRules" required></v-text-field>
                                        <v-file-input prepend-icon="mdi-camera" label="Upload KTP" id="fileKTP" ref="fileGambarKTP" :rules="inputRules" required></v-file-input>
                                        <center>
                                        <v-card-actions class="justify-center">
                                            <div class="flex text-xs-center">
                                                <v-btn class="white--text" style="background-color:#251e3e" @click="submit" :class=" { 'white--text' : valid, disabled: !valid }">Daftar</v-btn>
                                            </div>
                                        </v-card-actions>
                                        <div class="flex text-xs-center">
                                            <v-layout justify-center>
                                                <p style="color:darkblue;" class="mt-3 mx-4">Sudah punya akun?</p>
                                                <v-btn small text outlined href="/login" style="margin-top:10px !important"><span style="font-weight:bold">Masuk</span></v-btn>
                                            </v-layout>
                                        </div>
                                        </center>
                                    </div>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        </v-card-text>
                    </v-card>
                    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom> {{ error_message }}</v-snackbar>
                </v-flex>
            </v-layout>
        </v-container>
    </v-main>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Gothic+A1&family=Roboto&display=swap');
    .white--text{
        font-family: 'Roboto', sans-serif;
    }

    .subTitle{
        font-family: 'Roboto', sans-serif;
        font-size: 30pt;
        font-weight: bold;
        color: #251e3e;
    }

    @media screen and (min-width:1600px) {
        .register{
            margin-top: -64px;
            align-items: center;
            display: flex;
            height: 100vh;
        }

        html {
        overflow: hidden;
    }

        ::-webkit-scrollbar {
            width: 0px;
            background: transparent; /* make scrollbar transparent */
        }
    }

    .bg {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: url( 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg') no-repeat center center;
    background-size: cover;
    background-color: whitesmoke;
    transform: scale(1);
  }
</style>

<script>
    export default {
        name: "Register",
        data() {
            return {
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                valid: false,
                inputRules: [
                    (v) => !!v || 'Masukkan data yang sesuai!',
                ],
                customer: new FormData, 
                customers: [],
                form: {
                    id_customer: '',
                    nama_customer: '',
                    alamat_customer: '',
                    tanggal_lahir_customer: '',
                    jenis_kelamin_customer: '',
                    email_customer: '',
                    password_customer: '',
                    no_telp_customer: '',
                    ktp_customer: '',
                },
                items:[],
                jenisKelamin:[
                    {value:"Laki-Laki", text:"Laki-Laki"},
                    {value:"Perempuan", text:"Perempuan"},
                ],
            };
        },
        methods: {
            submit() {
                this.customer.append('nama_customer', this.form.nama_customer);
                this.customer.append('email_customer', this.form.email_customer);
                this.customer.append('alamat_customer', this.form.alamat_customer);
                this.customer.append('tanggal_lahir_customer', this.form.tanggal_lahir_customer);
                this.customer.append('jenis_kelamin_customer', this.form.jenis_kelamin_customer);
                this.customer.append('no_telp_customer', this.form.no_telp_customer);
                var inputKTP = document.getElementById('fileKTP'),
                    dataFileKTP = inputKTP.files[0];
                this.customer.append('ktp_customer', dataFileKTP);

                var url = this.$api + '/customer'
                this.load = true;

                this.$http.post(url, this.customer).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.resetForm();
                    setTimeout(function(){location.href="/login"},100);
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            
            resetForm() {
                this.form = {
                    id_customer: '',
                    nama_customer: '',
                    alamat_customer: '',
                    tanggal_lahir_customer: '',
                    jenis_kelamin_customer: '',
                    email_customer: '',
                    password_customer: '',
                    no_telp_customer: '',
                    ktp_customer: '',
                };
                this.$refs.fileGambarKTP.reset();
            },
        },
    };
</script>
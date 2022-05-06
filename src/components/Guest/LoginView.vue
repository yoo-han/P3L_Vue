<template>
    <v-main class="login">
    <span class="bg"></span>
        <v-container fill-height>
            <v-layout>
                <v-flex xs12 sm12 md12 text-xs-center style="display:flex; justify-content:center; align-items:center">
                    <v-card max-width="auto" height="auto">
                        <v-card-title class="pt-10" style="justify-content:center">
                            <p class="subTitle">MASUK</p>
                        </v-card-title>
                        <v-card-text class="pt-8">
                            <v-row>
                            <v-col>
                                <v-img src="./login_register.jpg" width="700" style="display:flex; align-items:center; justify-content:center">
                                </v-img>
                            </v-col>
                            <v-col style="display:flex; align-items:center">
                                <v-card-text class="pt-4">
                                    <div class="px-9" >
                                    <v-text-field label="E-mail" v-model="form.email" :rules="inputRules" required></v-text-field>
                                    <v-text-field label="Password" v-model="form.password" type="password" :rules="inputRules" required></v-text-field>
                                    <center>
                                        <v-card-actions class="justify-center">
                                            <div class="flex text-xs-center">
                                                <v-btn class="white--text" style="background-color:#251e3e" @click="submit" :class=" { 'white--text' : valid, disabled: !valid }">Masuk</v-btn>
                                            </div>
                                        </v-card-actions>
                                        <div class="flex text-xs-center">
                                            <v-layout justify-center>
                                                <p style="color:darkblue;" class="mt-3 mx-4">Belum punya akun?</p>
                                                <v-btn small text outlined href="/login" style="margin-top:10px !important"><span style="font-weight:bold">Daftar</span></v-btn>
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
        .login{
            margin-top: -64px;
            align-items: center;
            display: flex;
            height: 100vh;
        }

        html {
        overflow: hidden;
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
        name: "Login",
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
                form:{
                    email: '',
                    password: '',
                }
            };
        },
        methods: {
            submit() {
                //cek validasi data yang terkirim
                this.load = true;
                this.$http.post(this.$api + '/login', {
                    email: this.form.email,
                    password: this.form.password
                }).then(response => {
                    if(response.data.data.id_customer != null){
                        localStorage.setItem('auth',"customer");
                        localStorage.setItem('id_customer',response.data.data.id_customer);
                        localStorage.setItem('email_customer',response.data.data.email_customer);
                    }else if(response.data.data.id_pegawai != null){
                        localStorage.setItem('auth',"employee");
                        localStorage.setItem('id_employee',response.data.data.id_pegawai);
                        localStorage.setItem('email_employee',response.data.data.email_pegawai);
                        localStorage.setItem('role',response.data.data.jabatan_pegawai);
                    }else{
                        this.error_message = "Akun Tidak Diperkenankan Masuk";
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                        return false;
                    }
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    location.href="/"
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                })
            },
            resetForm() {
                this.form = {
                    email: null,
                    password: null,
                }
            },
        },
    };
</script>